import { io, Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export function getClientSocket(): Socket {
  if (!socketInstance) {
    const wsUrl =
      process.env.WS_URL ||
      (typeof window !== "undefined"
        ? `${window.location.protocol === "https:" ? "https:" : "http:"}//${window.location.hostname}:3001`
        : "http://localhost:3001");

    console.log("[Syncore Socket.io] Initializing client connection to:", wsUrl);

    socketInstance = io(wsUrl, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
    });
  }

  return socketInstance;
}

