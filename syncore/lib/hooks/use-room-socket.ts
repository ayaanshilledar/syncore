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
      setIsConnected(true);
      socket.emit("room:join", {
        roomCode,
        user,
      });
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleUsersUpdate = (users: Participant[]) => {
      setParticipants(users);
    };

    const handleQueueUpdated = (data: { queue: QueuedItem[]; action?: string }) => {
      if (data?.queue && callbacksRef.current.onQueueUpdated) {
        callbacksRef.current.onQueueUpdated(data.queue);
      }
    };

    const handlePlaybackSynced = (data: PlaybackSyncPayload) => {
      if (callbacksRef.current.onPlaybackSynced) {
        callbacksRef.current.onPlaybackSynced(data);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("room:users_update", handleUsersUpdate);
    socket.on("queue:updated", handleQueueUpdated);
    socket.on("playback:synced", handlePlaybackSynced);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.emit("room:leave", { roomCode });
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("room:users_update", handleUsersUpdate);
      socket.off("queue:updated", handleQueueUpdated);
      socket.off("playback:synced", handlePlaybackSynced);
    };
  }, [roomCode, user?.id, user?.name, user?.color]);

  const broadcastQueueUpdate = useCallback(
    (queue: QueuedItem[], action?: string) => {
      if (!roomCode) return;
      const socket = getClientSocket();
      if (socket.connected) {
        socket.emit("queue:sync", {
          roomCode,
          queue,
          action,
        });
      }
    },
    [roomCode]
  );

  const broadcastPlayback = useCallback(
    (payload: PlaybackSyncPayload) => {
      if (!roomCode) return;
      const socket = getClientSocket();
      if (socket.connected) {
        socket.emit("playback:sync", {
          roomCode,
          ...payload,
        });
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
