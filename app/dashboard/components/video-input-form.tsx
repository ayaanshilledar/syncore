"use client";

import { FormEvent } from "react";
import { motion } from "motion/react";

interface VideoInputFormProps {
  inputUrl: string;
  error?: string | null;
  isPending: boolean;
  queueCount: number;
  onUrlChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function VideoInputForm({
  inputUrl,
  isPending,
  queueCount,
  onUrlChange,
  onSubmit,
}: VideoInputFormProps) {
  return (
    <motion.div layout id="tour-video-input" className="w-full">
      <form onSubmit={onSubmit} className="flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="Paste YouTube link (e.g., https://www.youtube.com/watch?v=...)"
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 pl-10 pr-4 py-3 text-sm text-neutral-100 placeholder-neutral-500 shadow-inner backdrop-blur-sm transition duration-200 focus:border-neutral-600 focus:bg-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-600"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Add Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isPending || queueCount >= 5 || !inputUrl.trim()}
            title={queueCount >= 5 ? "Queue is full (max 5)" : "Add video to queue"}
            className="flex items-center justify-center rounded-xl bg-neutral-100 px-4 py-3 text-xs font-semibold text-neutral-950 shadow-lg shadow-white/5 transition hover:bg-white disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            {isPending ? (
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-neutral-950 border-t-transparent" />
            ) : (
              <span>Add</span>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
