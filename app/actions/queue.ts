"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractYouTubeId, fetchYouTubeMetadata } from "@/lib/youtube";

export interface QueuedItem {
  id: string;
  videoId: string;
  url: string;
  title: string;
  author: string | null;
  thumbnailUrl: string | null;
  userId: string;
  userName?: string | null;
  userImage?: string | null;
  roomId?: string | null;
  score: number;
  createdAt: Date;
  userVote: number | null;
}

async function getRoomIdFromCode(roomCode?: string): Promise<string | null> {
  if (!roomCode) return null;
  const room = await prisma.room.findUnique({
    where: { code: roomCode },
    select: { id: true },
  });
  return room ? room.id : null;
}

export async function getQueue(roomCode?: string): Promise<QueuedItem[]> {
  const session = await auth();
  const userId = session?.user?.id;
  const roomId = await getRoomIdFromCode(roomCode);

  const queuedVideos = await prisma.queuedVideo.findMany({
    where: roomId ? { roomId } : { roomId: null },
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
}

export async function addToQueue(url: string, roomCode?: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Please log in to add videos to the queue." };
  }

  const videoId = extractYouTubeId(url);
  if (!videoId) {
    return { error: "Please enter a valid YouTube video or Shorts link." };
  }

  const roomId = await getRoomIdFromCode(roomCode);

  const count = await prisma.queuedVideo.count({
    where: roomId ? { roomId } : { roomId: null },
  });

  if (count >= 5) {
    return { error: "Queue is full (maximum 5 videos allowed)." };
  }

  const existing = await prisma.queuedVideo.findFirst({
    where: {
      videoId,
      ...(roomId ? { roomId } : { roomId: null }),
    },
  });

  if (existing) {
    return { error: "This video is already in the queue." };
  }

  const metadata = await fetchYouTubeMetadata(videoId);
  const userId = session.user.id;

  await prisma.queuedVideo.create({
    data: {
      videoId,
      url: metadata.url,
      title: metadata.title,
      author: metadata.author,
      thumbnailUrl: metadata.thumbnailUrl,
      userId,
      roomId,
      score: 0,
    },
  });

  const updatedQueue = await getQueue(roomCode);
  return { success: true, queue: updatedQueue };
}

export async function voteVideo(queuedVideoId: string, targetVote: 1 | -1, roomCode?: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Please log in to vote." };
  }

  const userId = session.user.id;

  await prisma.$transaction(async (tx) => {
    const existingVote = await tx.vote.findUnique({
      where: {
        userId_queuedVideoId: {
          userId,
          queuedVideoId,
        },
      },
    });

    if (existingVote) {
      if (existingVote.type === targetVote) {
        // Toggle off vote
        await tx.vote.delete({
          where: { id: existingVote.id },
        });
        await tx.queuedVideo.update({
          where: { id: queuedVideoId },
          data: { score: { decrement: targetVote } },
        });
      } else {
        // Flip vote (from +1 to -1 or -1 to +1)
        await tx.vote.update({
          where: { id: existingVote.id },
          data: { type: targetVote },
        });
        await tx.queuedVideo.update({
          where: { id: queuedVideoId },
          data: { score: { increment: targetVote * 2 } },
        });
      }
    } else {
      // New vote
      await tx.vote.create({
        data: {
          userId,
          queuedVideoId,
          type: targetVote,
        },
      });
      await tx.queuedVideo.update({
        where: { id: queuedVideoId },
        data: { score: { increment: targetVote } },
      });
    }
  });

  const updatedQueue = await getQueue(roomCode);
  return { success: true, queue: updatedQueue };
}

export async function removeQueuedVideo(queuedVideoId: string, roomCode?: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  await prisma.queuedVideo.delete({
    where: { id: queuedVideoId },
  });

  const updatedQueue = await getQueue(roomCode);
  return { success: true, queue: updatedQueue };
}
