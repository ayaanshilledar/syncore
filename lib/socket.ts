import { io, Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export function getClientSocket(): Socket {
  if (!socketInstance) {
    const wsUrl =
      process.env.NEXT_PUBLIC_WS_URL ||
      (typeof window !== "undefined"
        ? `${window.location.protocol === "https:" ? "https:" : "http:"}//${window.location.hostname}:3001`
        : "http://localhost:3001");

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
