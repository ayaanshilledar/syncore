"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { QueuedItem } from "@/app/actions/queue";
import { play } from "cuelume";

interface QueueItemProps {
  item: QueuedItem;
  rank: number;
  isPlaying: boolean;
  onPlay: (item: QueuedItem) => void;
  onVote: (id: string, type: 1 | -1) => void;
  onRemove: (id: string) => void;
}

export default function QueueItemCard({
  item,
  rank,
  onPlay,
  onVote,
  onRemove,
}: QueueItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="group relative flex items-center justify-between gap-2.5 rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-2 hover:border-neutral-700 hover:bg-neutral-900/90 transition"
    >
      {/* Rank + Thumbnail + Details */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-neutral-800 text-[10px] font-mono font-medium text-neutral-400">
          {rank}
        </span>

        {/* Thumbnail */}
        <div
          onClick={() => {
            play("select");
            onPlay(item);
          }}
          className="relative h-10 w-16 shrink-0 cursor-pointer overflow-hidden rounded-md bg-neutral-950 group-hover:ring-1 group-hover:ring-neutral-600 transition"
        >
          {item.thumbnailUrl ? (
            <Image
              src={item.thumbnailUrl}
              alt={item.title}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-[10px] text-neutral-500">
              Video
            </div>
          )}
        </div>

        {/* Info */}
        <div
          className="min-w-0 flex-1 cursor-pointer overflow-hidden flex flex-col justify-center"
          onClick={() => {
            play("select");
            onPlay(item);
          }}
        >
          <h4
            className="truncate text-xs font-medium text-neutral-200 group-hover:text-white"
            title={item.title}
          >
            {item.title}
          </h4>
          <div className="flex items-center gap-1.5 text-[11px] mt-0.5 overflow-hidden">
            {item.userName ? (
              <span className="truncate text-neutral-400">
                by{" "}
                <span className="text-neutral-200 font-medium">
                  {item.userName}
                </span>
                {item.author && (
                  <span className="text-neutral-500 ml-1.5">
                    • {item.author}
                  </span>
                )}
              </span>
            ) : (
              item.author && (
                <span className="truncate text-neutral-400">{item.author}</span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Voting Controls */}
      <div className="flex items-center gap-1 shrink-0">
        <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-950/80 p-0.5">
          {/* Upvote Button */}
          <button
            type="button"
            onClick={() => {
              play("tap");
              onVote(item.id, 1);
            }}
            title="Upvote"
            className={`flex h-6 w-6 items-center justify-center rounded transition cursor-pointer ${
              item.userVote === 1
                ? "bg-neutral-800 text-white font-bold"
                : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
            }`}
          >
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>

          {/* Score */}
          <span
            className={`min-w-5 text-center text-xs font-semibold ${
              item.score > 0
                ? "text-neutral-100"
                : item.score < 0
                ? "text-red-400"
                : "text-neutral-400"
            }`}
          >
            {item.score > 0 ? `+${item.score}` : item.score}
          </span>

          {/* Downvote Button */}
          <button
            type="button"
            onClick={() => {
              play("tap");
              onVote(item.id, -1);
            }}
            title="Downvote"
            className={`flex h-6 w-6 items-center justify-center rounded transition cursor-pointer ${
              item.userVote === -1
                ? "bg-neutral-800 text-red-400 font-bold"
                : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
            }`}
          >
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => {
            play("tap");
            onRemove(item.id);
          }}
          title="Remove from queue"
          className="flex h-6 w-6 items-center justify-center rounded text-neutral-500 hover:bg-neutral-800 hover:text-red-400 transition cursor-pointer"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
