import { createServer } from "http";
import { Server, Socket } from "socket.io";

const PORT = parseInt(process.env.WS_PORT || "3001", 10);

const httpServer = createServer((req, res) => {
  // Simple health check endpoint
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }));
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


const roomParticipants = new Map<string, Map<string, Participant>>();

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
    }
  );

  socket.on(
    "cursor:move",
    ({ roomCode, x, y }: { roomCode: string; x: number; y: number }) => {
      if (!roomCode || !currentUser) return;

      currentUser.x = x;
      currentUser.y = y;
      currentUser.lastActive = Date.now();

      // Relay cursor position to other users in the room
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
      // Broadcast updated queue to all other room members
      socket.to(roomCode).emit("queue:updated", { queue, action });
    }
  );

  socket.on(
    "playback:sync",
    ({
      roomCode,
      videoId,
      action,
    }: {
      roomCode: string;
      videoId: string;
      action: "load" | "play" | "pause" | "advance";
    }) => {
      if (!roomCode) return;
      socket.to(roomCode).emit("playback:synced", { videoId, action });
    }
  );

  socket.on("room:leave", ({ roomCode }: { roomCode: string }) => {
    if (roomCode && roomParticipants.has(roomCode)) {
      roomParticipants.get(roomCode)!.delete(socket.id);
      if (roomParticipants.get(roomCode)!.size === 0) {
        roomParticipants.delete(roomCode);
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
