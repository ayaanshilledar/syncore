import { createServer } from "http";
import { Server, Socket } from "socket.io";

const PORT = parseInt(process.env.PORT || process.env.WS_PORT || "3001", 10);

const httpServer = createServer((req, res) => {
  // CORS headers for health check and polling
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === "/health" || req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", service: "syncore-ws-server", timestamp: new Date().toISOString() }));
    return;
  }
  res.writeHead(404);
  res.end();
});

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  pingInterval: 10000,
  pingTimeout: 5000,
});

export interface Participant {
  socketId: string;
  userId: string;
  name: string;
  image?: string | null;
  color: string;
  x?: number;
  y?: number;
  lastActive: number;
}

export interface PlaybackState {
  videoId: string;
  title?: string;
  author?: string | null;
  thumbnailUrl?: string | null;
  action?: string;
}

// Map of roomCode -> Map of socketId -> Participant
const roomParticipants = new Map<string, Map<string, Participant>>();

// Map of roomCode -> currently active playback
const roomCurrentPlayback = new Map<string, PlaybackState>();

function getRoomParticipantsList(roomCode: string): Participant[] {
  const members = roomParticipants.get(roomCode);
  if (!members) return [];
  return Array.from(members.values());
}

io.on("connection", (socket: Socket) => {
  let currentRoomCode: string | null = null;
  let currentUser: Participant | null = null;

  socket.on(
    "room:join",
    ({
      roomCode,
      user,
    }: {
      roomCode: string;
      user: { id: string; name: string; image?: string | null; color: string };
    }) => {
      if (!roomCode || !user) return;

      currentRoomCode = roomCode;
      socket.join(roomCode);

      if (!roomParticipants.has(roomCode)) {
        roomParticipants.set(roomCode, new Map());
      }

      currentUser = {
        socketId: socket.id,
        userId: user.id,
        name: user.name || "Anonymous",
        image: user.image || null,
        color: user.color,
        lastActive: Date.now(),
      };

      roomParticipants.get(roomCode)!.set(socket.id, currentUser);

      // Broadcast updated member presence list to everyone in room
      io.to(roomCode).emit("room:users_update", getRoomParticipantsList(roomCode));

      // Send current playback state to newly joined user
      const currentPlayback = roomCurrentPlayback.get(roomCode);
      if (currentPlayback) {
        socket.emit("playback:synced", currentPlayback);
      }
    }
  );

  socket.on(
    "cursor:move",
    ({ roomCode, x, y }: { roomCode: string; x: number; y: number }) => {
      if (!roomCode || !currentUser) return;

      currentUser.x = x;
      currentUser.y = y;
      currentUser.lastActive = Date.now();

      socket.to(roomCode).emit("cursor:update", {
        userId: currentUser.userId,
        socketId: socket.id,
        name: currentUser.name,
        color: currentUser.color,
        x,
        y,
      });
    }
  );

  socket.on("cursor:leave", ({ roomCode }: { roomCode: string }) => {
    if (!roomCode || !currentUser) return;
    socket.to(roomCode).emit("cursor:remove", {
      userId: currentUser.userId,
      socketId: socket.id,
    });
  });

  socket.on(
    "queue:sync",
    ({
      roomCode,
      queue,
      action,
    }: {
      roomCode: string;
      queue: unknown[];
      action?: string;
    }) => {
      if (!roomCode) return;
      socket.to(roomCode).emit("queue:updated", { queue, action });
    }
  );

  socket.on(
    "playback:sync",
    ({
      roomCode,
      videoId,
      title,
      author,
      thumbnailUrl,
      action = "load",
    }: {
      roomCode: string;
      videoId: string;
      title?: string;
      author?: string | null;
      thumbnailUrl?: string | null;
      action?: "load" | "play" | "pause" | "advance";
    }) => {
      if (!roomCode || !videoId) return;

      const state: PlaybackState = {
        videoId,
        title,
        author,
        thumbnailUrl,
        action,
      };

      roomCurrentPlayback.set(roomCode, state);
      socket.to(roomCode).emit("playback:synced", state);
    }
  );

  socket.on("room:leave", ({ roomCode }: { roomCode: string }) => {
    if (roomCode && roomParticipants.has(roomCode)) {
      roomParticipants.get(roomCode)!.delete(socket.id);
      if (roomParticipants.get(roomCode)!.size === 0) {
        roomParticipants.delete(roomCode);
        roomCurrentPlayback.delete(roomCode);
      } else {
        io.to(roomCode).emit(
          "room:users_update",
          getRoomParticipantsList(roomCode)
        );
      }
      if (currentUser) {
        socket.to(roomCode).emit("cursor:remove", {
          userId: currentUser.userId,
          socketId: socket.id,
        });
      }
    }
    socket.leave(roomCode);
    currentRoomCode = null;
    currentUser = null;
  });

  socket.on("disconnect", () => {
    if (currentRoomCode && roomParticipants.has(currentRoomCode)) {
      const room = roomParticipants.get(currentRoomCode)!;
      room.delete(socket.id);

      if (room.size === 0) {
        roomParticipants.delete(currentRoomCode);
        roomCurrentPlayback.delete(currentRoomCode);
      } else {
        io.to(currentRoomCode).emit(
          "room:users_update",
          getRoomParticipantsList(currentRoomCode)
        );
      }

      if (currentUser) {
        socket.to(currentRoomCode).emit("cursor:remove", {
          userId: currentUser.userId,
          socketId: socket.id,
        });
      }
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`[Syncore WebSocket] Server running on http://localhost:${PORT}`);
});
