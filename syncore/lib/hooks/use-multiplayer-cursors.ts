"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getClientSocket } from "@/lib/socket";

export interface RemoteCursor {
  userId: string;
  socketId: string;
  name: string;
  color: string;
  x: number; 
  y: number; 
  lastUpdated: number;
}

interface UseMultiplayerCursorsProps {
  roomCode: string | null;
  currentUser: {
    id: string;
    name: string;
    color: string;
  } | null;
  enabled?: boolean;
}

export function useMultiplayerCursors({
  roomCode,
  currentUser,
  enabled = true,
}: UseMultiplayerCursorsProps) {
  const [remoteCursors, setRemoteCursors] = useState<Map<string, RemoteCursor>>(
    new Map()
  );
  const lastEmitRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Handle incoming cursor updates
  useEffect(() => {
    if (!roomCode || !enabled) {
      setRemoteCursors(new Map());
      return;
    }

    const socket = getClientSocket();

    const handleCursorUpdate = (data: {
      userId: string;
      socketId: string;
      name: string;
      color: string;
      x: number;
      y: number;
    }) => {
      // Ignore current user's own cursor if returned
      if (currentUser && data.userId === currentUser.id) return;

      setRemoteCursors((prev) => {
        const next = new Map(prev);
        next.set(data.socketId, {
          userId: data.userId,
          socketId: data.socketId,
          name: data.name,
          color: data.color,
          x: data.x,
          y: data.y,
          lastUpdated: Date.now(),
        });
        return next;
      });
    };

    const handleCursorRemove = (data: { socketId: string }) => {
      setRemoteCursors((prev) => {
        if (!prev.has(data.socketId)) return prev;
        const next = new Map(prev);
        next.delete(data.socketId);
        return next;
      });
    };

    socket.on("cursor:update", handleCursorUpdate);
    socket.on("cursor:remove", handleCursorRemove);

    return () => {
      socket.off("cursor:update", handleCursorUpdate);
      socket.off("cursor:remove", handleCursorRemove);
    };
  }, [roomCode, currentUser, enabled]);

  // Track and send local cursor movements (relative percentage coordinates)
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!roomCode || !currentUser || !enabled) return;

      const now = performance.now();
      // Throttle to ~30ms (approx 33fps)
      if (now - lastEmitRef.current < 30) return;
      lastEmitRef.current = now;

      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;

      const socket = getClientSocket();
      if (socket.connected) {
        socket.emit("cursor:move", {
          roomCode,
          x,
          y,
        });
      }
    },
    [roomCode, currentUser, enabled]
  );

  const handleMouseLeave = useCallback(() => {
    if (!roomCode || !currentUser || !enabled) return;
    const socket = getClientSocket();
    if (socket.connected) {
      socket.emit("cursor:leave", { roomCode });
    }
  }, [roomCode, currentUser, enabled]);

  useEffect(() => {
    if (!roomCode || !enabled) return;

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [roomCode, enabled, handleMouseMove, handleMouseLeave]);

  // Periodic cleanup for idle/dead cursors (>20 seconds)
  useEffect(() => {
    if (!roomCode || !enabled) return;

    const interval = setInterval(() => {
      const threshold = Date.now() - 20000;
      setRemoteCursors((prev) => {
        let changed = false;
        const next = new Map(prev);
        for (const [key, cursor] of next.entries()) {
          if (cursor.lastUpdated < threshold) {
            next.delete(key);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [roomCode, enabled]);

  return Array.from(remoteCursors.values());
}
