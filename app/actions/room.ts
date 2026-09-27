"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QueuedItem } from "./queue";

function generateRandom4DigitCode(): string {
  // Generates 4-digit code from 1000 to 9999
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export interface RoomDetails {
  id: string;
  code: string;
  name: string | null;
  hostId: string;
  hostName: string | null;
  createdAt: Date;
}

export async function createRoom(roomName?: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Please log in to create a room." };
    }

    const hostId = session.user.id;

    // Try generating a unique 4-digit code (up to 10 attempts)
    let code = generateRandom4DigitCode();
    let attempts = 0;

    while (attempts < 10) {
      const existing = await prisma.room.findUnique({
        where: { code },
      });
      if (!existing) break;
      code = generateRandom4DigitCode();
      attempts++;
    }

    const room = await prisma.room.create({
      data: {
        code,
        name: roomName?.trim() || `${session.user.name || "Host"}'s Room`,
        hostId,
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      success: true,
      room: {
        id: room.id,
        code: room.code,
        name: room.name,
        hostId: room.hostId,
        hostName: room.host.name,
        createdAt: room.createdAt,
      },
    };
  } catch (err: unknown) {
    console.error("[Room Action] Error in createRoom:", err);
    return {
      error:
        err instanceof Error ? err.message : "Failed to create room. Please try again.",
    };
  }
}

export async function getRoomByCode(code: string) {
  try {
    if (!code || code.length !== 4) {
      return { error: "Invalid 4-digit room code." };
    }

    const room = await prisma.room.findUnique({
      where: { code },
      include: {
        host: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!room) {
      return { error: `Room #${code} not found.` };
    }

    return {
      success: true,
      room: {
        id: room.id,
        code: room.code,
        name: room.name,
        hostId: room.hostId,
        hostName: room.host.name,
        createdAt: room.createdAt,
      },
    };
  } catch (err: unknown) {
    console.error("[Room Action] Error in getRoomByCode:", err);
    return {
      error:
        err instanceof Error ? err.message : "Failed to retrieve room details.",
    };
  }
}

export async function getRoomQueue(roomCode: string): Promise<QueuedItem[]> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const room = await prisma.room.findUnique({
      where: { code: roomCode },
      select: { id: true },
    });

    if (!room) return [];

    const queuedVideos = await prisma.queuedVideo.findMany({
      where: { roomId: room.id },
      orderBy: [{ score: "desc" }, { createdAt: "asc" }],
      include: {
        votes: userId ? { where: { userId } } : false,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return queuedVideos.map((video) => ({
      id: video.id,
      videoId: video.videoId,
      url: video.url,
      title: video.title,
      author: video.author,
      thumbnailUrl: video.thumbnailUrl,
      userId: video.userId,
      userName: video.user?.name || "Anonymous",
      userImage: video.user?.image || null,
      roomId: video.roomId,
      score: video.score,
      createdAt: video.createdAt,
      userVote: video.votes?.[0]?.type ?? null,
    }));
  } catch (err) {
    console.error("[Room Action] Error in getRoomQueue:", err);
    return [];
  }
}

