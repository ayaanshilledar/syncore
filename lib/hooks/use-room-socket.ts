"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getClientSocket } from "@/lib/socket";
import { QueuedItem } from "@/app/actions/queue";

export interface Participant {
  socketId: string;
  userId: string;
  name: string;
  image?: string | null;
  color: string;
}

export interface PlaybackSyncPayload {
  videoId: string;
  title?: string;
  author?: string | null;
  thumbnailUrl?: string | null;
  action?: string;
}

interface UseRoomSocketProps {
  roomCode: string | null;
  user: {
    id: string;
    name: string;
    image?: string | null;
    color: string;
  } | null;
  onQueueUpdated?: (newQueue: QueuedItem[]) => void;
  onPlaybackSynced?: (data: PlaybackSyncPayload) => void;
}

export function useRoomSocket({
  roomCode,
  user,
  onQueueUpdated,
  onPlaybackSynced,
}: UseRoomSocketProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const callbacksRef = useRef({ onQueueUpdated, onPlaybackSynced });

  useEffect(() => {
    callbacksRef.current = { onQueueUpdated, onPlaybackSynced };
  }, [onQueueUpdated, onPlaybackSynced]);

  useEffect(() => {
    if (!roomCode || !user) {
      setParticipants([]);
      setIsConnected(false);
      return;
    }

    const socket = getClientSocket();

    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => {
      console.log(`[Room Socket] Connected successfully (Socket ID: ${socket.id}). Joining room: ${roomCode}`);
      setIsConnected(true);
      socket.emit("room:join", {
        roomCode,
        user,
      });
    };

    const handleConnectError = (err: Error) => {
      console.error(`[Room Socket] Connection error: ${err.message}`, err);
      setIsConnected(false);
    };

    const handleDisconnect = (reason: string) => {
      console.warn(`[Room Socket] Disconnected from WebSocket server. Reason: ${reason}`);
      setIsConnected(false);
    };

    const handleSocketError = (err: unknown) => {
      console.error("[Room Socket] General socket error:", err);
    };

    const handleReconnectAttempt = (attempt: number) => {
      console.log(`[Room Socket] Reconnecting attempt #${attempt}...`);
    };

    const handleReconnectFailed = () => {
      console.error("[Room Socket] Failed to reconnect to WebSocket server after max attempts.");
    };

    const handleUsersUpdate = (users: Participant[]) => {
      setParticipants(users);
    };

    const handleQueueUpdated = (data: { queue: QueuedItem[]; action?: string }) => {
      try {
        if (data?.queue && callbacksRef.current.onQueueUpdated) {
          callbacksRef.current.onQueueUpdated(data.queue);
        }
      } catch (err) {
        console.error("[Room Socket] Error in handleQueueUpdated callback:", err);
      }
    };

    const handlePlaybackSynced = (data: PlaybackSyncPayload) => {
      try {
        if (callbacksRef.current.onPlaybackSynced) {
          callbacksRef.current.onPlaybackSynced(data);
        }
      } catch (err) {
        console.error("[Room Socket] Error in handlePlaybackSynced callback:", err);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);
    socket.on("error", handleSocketError);
    socket.io.on("reconnect_attempt", handleReconnectAttempt);
    socket.io.on("reconnect_failed", handleReconnectFailed);
    socket.on("room:users_update", handleUsersUpdate);
    socket.on("queue:updated", handleQueueUpdated);
    socket.on("playback:synced", handlePlaybackSynced);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      try {
        socket.emit("room:leave", { roomCode });
      } catch (err) {
        console.error("[Room Socket] Error emitting room:leave:", err);
      }
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("disconnect", handleDisconnect);
      socket.off("error", handleSocketError);
      socket.io.off("reconnect_attempt", handleReconnectAttempt);
      socket.io.off("reconnect_failed", handleReconnectFailed);
      socket.off("room:users_update", handleUsersUpdate);
      socket.off("queue:updated", handleQueueUpdated);
      socket.off("playback:synced", handlePlaybackSynced);
    };
  }, [roomCode, user?.id, user?.name, user?.color]);

  const broadcastQueueUpdate = useCallback(
    (queue: QueuedItem[], action?: string) => {
      if (!roomCode) return;
      try {
        const socket = getClientSocket();
        if (socket.connected) {
          socket.emit("queue:sync", {
            roomCode,
            queue,
            action,
          });
        } else {
          console.warn("[Room Socket] Cannot broadcast queue update: Socket is not connected.");
        }
      } catch (err) {
        console.error("[Room Socket] Failed to broadcast queue update:", err);
      }
    },
    [roomCode]
  );

  const broadcastPlayback = useCallback(
    (payload: PlaybackSyncPayload) => {
      if (!roomCode) return;
      try {
        const socket = getClientSocket();
        if (socket.connected) {
          socket.emit("playback:sync", {
            roomCode,
            ...payload,
          });
        } else {
          console.warn("[Room Socket] Cannot broadcast playback: Socket is not connected.");
        }
      } catch (err) {
        console.error("[Room Socket] Failed to broadcast playback:", err);
      }
    },
    [roomCode]
  );

  return {
    isConnected,
    participants,
    broadcastQueueUpdate,
    broadcastPlayback,
  };
}

