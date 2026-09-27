"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchYouTubeMetadata } from "@/lib/youtube";

export interface HistoryItem {
  id: string;
  videoId: string;
  url: string;
  title: string | null;
  author: string | null;
  thumbnailUrl: string | null;
  createdAt: Date;
}

export async function recordVideoHistory(videoId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;
  const metadata = await fetchYouTubeMetadata(videoId);

  const existing = await prisma.videoHistory.findFirst({
    where: {
      userId,
      videoId,
    },
  });

  if (existing) {
    await prisma.videoHistory.update({
      where: { id: existing.id },
      data: {
        title: metadata.title,
        author: metadata.author,
        thumbnailUrl: metadata.thumbnailUrl,
        createdAt: new Date(),
      },
    });
  } else {
    await prisma.videoHistory.create({
      data: {
        userId,
        videoId,
        url: metadata.url,
        title: metadata.title,
        author: metadata.author,
        thumbnailUrl: metadata.thumbnailUrl,
      },
    });
  }

  const updatedHistory = await prisma.videoHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return {
    success: true,
    metadata,
    history: updatedHistory,
  };
}

export async function getVideoHistory(): Promise<HistoryItem[]> {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  return prisma.videoHistory.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function deleteHistoryItem(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  await prisma.videoHistory.deleteMany({
    where: {
      id,
      userId: session.user.id,
    },
  });

  const updatedHistory = await prisma.videoHistory.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return { success: true, history: updatedHistory };
}
