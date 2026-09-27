"use client";

import { useState, FormEvent, useTransition, useMemo, useEffect, useCallback } from "react";
import { extractYouTubeId, YouTubeMetadata } from "@/lib/youtube";
import {
  recordVideoHistory,
  deleteHistoryItem,
  HistoryItem,
} from "@/app/actions/history";
import {
  addToQueue,
  voteVideo,
  removeQueuedVideo,
  getQueue,
  QueuedItem,
} from "@/app/actions/queue";
import { createRoom, getRoomByCode, getRoomQueue } from "@/app/actions/room";
import { getSolidColor } from "@/lib/colors";
import { useRoomSocket } from "@/lib/hooks/use-room-socket";
import { useMultiplayerCursors } from "@/lib/hooks/use-multiplayer-cursors";
import DashboardHeader from "./components/dashboard-header";
import { UserProfile } from "./components/profile-dropdown";
import VideoInputForm from "./components/video-input-form";
import VideoPlayerView from "./components/video-player-view";
import VideoQueue from "./components/video-queue";
import LiveCursors from "./components/live-cursors";
import RoomInviteModal from "./components/room-invite-modal";
import RoomModal from "./components/room-modal";

interface DashboardViewProps {
  user: UserProfile;
  initialHistory?: HistoryItem[];
  initialQueue?: QueuedItem[];
  initialRoomCode?: string | null;
  initialRoomName?: string | null;
}

export default function DashboardView({
  user,
  initialHistory = [],
  initialQueue = [],
  initialRoomCode = null,
  initialRoomName = null,
}: DashboardViewProps) {
  const [roomCode, setRoomCode] = useState<string | null>(initialRoomCode);
  const [roomName, setRoomName] = useState<string | null>(initialRoomName);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  const [inputUrl, setInputUrl] = useState("");
  const [queue, setQueue] = useState<QueuedItem[]>(initialQueue);
  const [history, setHistory] = useState<HistoryItem[]>(initialHistory);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(
    initialQueue.length > 0 ? initialQueue[0].videoId : null
  );
  const [activeMetadata, setActiveMetadata] = useState<YouTubeMetadata | null>(
    initialQueue.length > 0
      ? {
          videoId: initialQueue[0].videoId,
          url: initialQueue[0].url,
          title: initialQueue[0].title,
          author: initialQueue[0].author,
          thumbnailUrl:
            initialQueue[0].thumbnailUrl ||
            `https://i.ytimg.com/vi/${initialQueue[0].videoId}/hqdefault.jpg`,
        }
      : null
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Solid user color from curated palette (deterministic per user)
  const userSolidColor = useMemo(
    () => getSolidColor(user.id || user.email || "user"),
    [user.id, user.email]
  );

  const currentUserPayload = useMemo(
    () => ({
      id: user.id || "guest",
      name: user.name || "Anonymous",
      image: user.image || null,
      color: userSolidColor,
    }),
    [user.id, user.name, user.image, userSolidColor]
  );

  // Sync incoming real-time queue updates from room peers
  const handleQueueUpdatedFromSocket = useCallback((newQueue: QueuedItem[]) => {
    setQueue(newQueue);
  }, []);

  // Sync incoming playback events from room host
  const handlePlaybackSyncedFromSocket = useCallback(
    (data: { videoId: string; action: string }) => {
      if (data.videoId && data.videoId !== activeVideoId) {
        setActiveVideoId(data.videoId);
        setActiveMetadata({
          videoId: data.videoId,
          url: `https://www.youtube.com/watch?v=${data.videoId}`,
          title: "Synchronized Video",
          author: null,
          thumbnailUrl: `https://i.ytimg.com/vi/${data.videoId}/hqdefault.jpg`,
        });
      }
    },
    [activeVideoId]
  );

  // Real-time Room WebSocket connection
  const {
    isConnected: isSocketConnected,
    participants,
    broadcastQueueUpdate,
    broadcastPlayback,
  } = useRoomSocket({
    roomCode,
    user: currentUserPayload,
    onQueueUpdated: handleQueueUpdatedFromSocket,
    onPlaybackSynced: handlePlaybackSyncedFromSocket,
  });

  // Live Multiplayer Cursors (relayed in real-time)
  const remoteCursors = useMultiplayerCursors({
    roomCode,
    currentUser: currentUserPayload,
    enabled: !!roomCode,
  });

  // Fetch initial room queue if initialRoomCode was provided on page load
  useEffect(() => {
    if (initialRoomCode) {
      getRoomQueue(initialRoomCode).then((q) => {
        if (q && q.length > 0) {
          setQueue(q);
          if (!activeVideoId) {
            loadVideo(q[0].videoId, q[0].title, q[0].author, q[0].thumbnailUrl, false);
          }
        }
      });
    }
  }, [initialRoomCode]);

  const loadVideo = (
    videoId: string,
    title?: string,
    author?: string | null,
    thumbnail?: string | null,
    shouldBroadcast = true
  ) => {
    setActiveVideoId(videoId);
    setError(null);

    if (title) {
      setActiveMetadata({
        videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        title,
        author: author || null,
        thumbnailUrl: thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      });
    }

    if (shouldBroadcast && roomCode) {
      broadcastPlayback(videoId, "load");
    }

    startTransition(async () => {
      const res = await recordVideoHistory(videoId);
      if (res?.success) {
        if (res.metadata) setActiveMetadata(res.metadata);
        if (res.history) setHistory(res.history);
      }
    });
  };

  const handleAddToQueue = () => {
    setError(null);
    const videoId = extractYouTubeId(inputUrl);
    if (!videoId) {
      setError("Please enter a valid YouTube video or Shorts link.");
      return;
    }

    if (queue.length >= 5) {
      setError("Queue is full (maximum 5 videos allowed).");
      return;
    }

    startTransition(async () => {
      const res = await addToQueue(inputUrl, roomCode || undefined);
      if (res.error) {
        setError(res.error);
      } else if (res.queue) {
        setQueue(res.queue);
        setInputUrl("");
        if (roomCode) {
          broadcastQueueUpdate(res.queue, "add");
        }

        // If nothing was playing, play this newly added video
        if (!activeVideoId && res.queue.length > 0) {
          const first = res.queue[0];
          loadVideo(first.videoId, first.title, first.author, first.thumbnailUrl);
        }
      }
    });
  };

  // When current video finishes naturally or is skipped:
  const handleAdvanceQueue = () => {
    const currentQueueItem = queue.find((item) => item.videoId === activeVideoId);

    if (currentQueueItem) {
      const remainingQueue = queue.filter((item) => item.id !== currentQueueItem.id);
      setQueue(remainingQueue);

      startTransition(async () => {
        const res = await removeQueuedVideo(currentQueueItem.id, roomCode || undefined);
        if (res?.queue && roomCode) {
          broadcastQueueUpdate(res.queue, "advance");
        }
      });

      if (remainingQueue.length > 0) {
        const nextVideo = remainingQueue[0];
        loadVideo(nextVideo.videoId, nextVideo.title, nextVideo.author, nextVideo.thumbnailUrl);
      } else {
        setActiveVideoId(null);
        setActiveMetadata(null);
      }
    } else if (queue.length > 0) {
      const nextVideo = queue[0];
      loadVideo(nextVideo.videoId, nextVideo.title, nextVideo.author, nextVideo.thumbnailUrl);
    }
  };

  const handleVote = (id: string, targetVote: 1 | -1) => {
    // Optimistic UI update
    let updatedQueue: QueuedItem[] = [];
    setQueue((prevQueue) => {
      const updated = prevQueue.map((item) => {
        if (item.id !== id) return item;

        let delta = 0;
        let newVote: number | null = targetVote;

        if (item.userVote === targetVote) {
          delta = -targetVote;
          newVote = null;
        } else if (item.userVote !== null) {
          delta = targetVote * 2;
        } else {
          delta = targetVote;
        }

        return {
          ...item,
          score: item.score + delta,
          userVote: newVote,
        };
      });

      updatedQueue = updated.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
      return updatedQueue;
    });

    startTransition(async () => {
      const res = await voteVideo(id, targetVote, roomCode || undefined);
      if (res?.queue) {
        setQueue(res.queue);
        if (roomCode) {
          broadcastQueueUpdate(res.queue, "vote");
        }
      }
    });
  };

  const handleRemoveFromQueue = (id: string) => {
    const isRemovingCurrentlyPlaying = queue.find((i) => i.id === id)?.videoId === activeVideoId;
    const remaining = queue.filter((item) => item.id !== id);
    setQueue(remaining);

    if (isRemovingCurrentlyPlaying) {
      if (remaining.length > 0) {
        const next = remaining[0];
        loadVideo(next.videoId, next.title, next.author, next.thumbnailUrl);
      } else {
        setActiveVideoId(null);
        setActiveMetadata(null);
      }
    }

    startTransition(async () => {
      const res = await removeQueuedVideo(id, roomCode || undefined);
      if (res?.queue) {
        setQueue(res.queue);
        if (roomCode) {
          broadcastQueueUpdate(res.queue, "remove");
        }
      }
    });
  };

  const handlePlayFromQueue = (item: QueuedItem) => {
    loadVideo(item.videoId, item.title, item.author, item.thumbnailUrl);
  };

  const handleSelectHistory = (item: HistoryItem) => {
    loadVideo(
      item.videoId,
      item.title || "YouTube Video",
      item.author,
      item.thumbnailUrl
    );
  };

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(async () => {
      const res = await deleteHistoryItem(id);
      if (res?.history) setHistory(res.history);
    });
  };

  // Room Creation Handler
  const handleCreateRoom = async (customName?: string) => {
    setIsCreatingRoom(true);
    setError(null);

    const res = await createRoom(customName);
    setIsCreatingRoom(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    if (res.room) {
      setRoomCode(res.room.code);
      setRoomName(res.room.name);
      setIsInviteOpen(true);

      // Fetch fresh queue for newly created room
      const roomQ = await getRoomQueue(res.room.code);
      setQueue(roomQ);

      // Update URL without full refresh
      window.history.pushState({}, "", `/room/${res.room.code}`);
    }
  };

  // Room Join Success Handler
  const handleJoinSuccess = async (code: string) => {
    setRoomCode(code);
    const details = await getRoomByCode(code);
    if (details.room) {
      setRoomName(details.room.name);
    }
    const roomQ = await getRoomQueue(code);
    setQueue(roomQ);
    if (roomQ.length > 0 && !activeVideoId) {
      loadVideo(roomQ[0].videoId, roomQ[0].title, roomQ[0].author, roomQ[0].thumbnailUrl, false);
    }
    window.history.pushState({}, "", `/room/${code}`);
  };

  // Leave Room Handler
  const handleLeaveRoom = async () => {
    setRoomCode(null);
    setRoomName(null);
    const personalQueue = await getQueue();
    setQueue(personalQueue);
    window.history.pushState({}, "", "/dashboard");
  };

  const nextQueuedVideo = queue.find((item) => item.videoId !== activeVideoId);

  return (
    <div className="relative flex min-h-screen flex-col bg-neutral-950 text-neutral-100 selection:bg-neutral-800">
      {/* Live Solid Figma-style Multiplayer Cursors */}
      <LiveCursors cursors={remoteCursors} />

      <DashboardHeader
        user={user}
        history={history}
        activeVideoId={activeVideoId}
        roomCode={roomCode}
        participantCount={participants.length}
        isSocketConnected={isSocketConnected}
        onSelectHistory={handleSelectHistory}
        onDeleteHistory={handleDeleteHistory}
        onOpenInvite={() => setIsInviteOpen(true)}
        onOpenRoomModal={() => setIsRoomModalOpen(true)}
        onLeaveRoom={handleLeaveRoom}
      />

      <main className="flex flex-1 flex-col px-6 py-6 sm:px-10">
        <div className="mx-auto w-full max-w-7xl flex flex-col gap-6">
          {/* Top Search / Input Section */}
          <VideoInputForm
            inputUrl={inputUrl}
            error={error}
            isPending={isPending}
            queueCount={queue.length}
            onUrlChange={(val) => {
              setInputUrl(val);
              if (error) setError(null);
            }}
            onSubmit={(e) => {
              e.preventDefault();
              handleAddToQueue();
            }}
          />

          {/* Main 2-Column Section: Video Player on Left, Queue on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Active Video Player */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
              <VideoPlayerView
                activeVideoId={activeVideoId}
                activeMetadata={activeMetadata}
                nextVideoTitle={nextQueuedVideo?.title}
                onEnded={handleAdvanceQueue}
                onSkipNext={queue.length > 1 ? handleAdvanceQueue : undefined}
              />
            </div>

            {/* Right: Video Queue */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-4">
              <VideoQueue
                queue={queue}
                activeVideoId={activeVideoId}
                onPlay={handlePlayFromQueue}
                onVote={handleVote}
                onRemove={handleRemoveFromQueue}
              />
            </div>
          </div>
        </div>
      </main>

      {/* 4-Digit Room Modals */}
      {roomCode && (
        <RoomInviteModal
          isOpen={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
          roomCode={roomCode}
          roomName={roomName}
          participants={participants}
        />
      )}

      <RoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        onCreateRoom={handleCreateRoom}
        onJoinSuccess={handleJoinSuccess}
        isCreatingRoom={isCreatingRoom}
      />
    </div>
  );
}
