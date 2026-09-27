"use client";

import { AnimatePresence, motion } from "motion/react";
import { QueuedItem } from "@/app/actions/queue";
import QueueItemCard from "./queue-item";

interface VideoQueueProps {
  queue: QueuedItem[];
  activeVideoId: string | null;
  onPlay: (item: QueuedItem) => void;
  onVote: (id: string, type: 1 | -1) => void;
  onRemove: (id: string) => void;
}

export default function VideoQueue({
  queue,
  activeVideoId,
  onPlay,
  onVote,
  onRemove,
}: VideoQueueProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Queue Section Header (Minimal, No Icon) */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
            Video Queue
          </h3>
          <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] font-mono text-neutral-400">
            {queue.length}/5
          </span>
        </div>
      </div>

      {/* Queue Items List */}
      {queue.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-800/80 p-6 text-center text-neutral-500 bg-neutral-900/20">
          <p className="text-xs font-medium text-neutral-400">Queue is empty</p>
          <p className="text-[11px] text-neutral-500 mt-1">
            Add YouTube links above to queue & vote.
          </p>
        </div>
      ) : (
        <motion.div layout className="flex flex-col gap-2">
          <AnimatePresence mode="popLayout">
            {queue.map((item, index) => (
              <QueueItemCard
                key={item.id}
                item={item}
                rank={index + 1}
                isPlaying={activeVideoId === item.videoId}
                onPlay={onPlay}
                onVote={onVote}
                onRemove={onRemove}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
