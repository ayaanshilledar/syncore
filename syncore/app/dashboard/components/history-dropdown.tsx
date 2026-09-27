"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { HistoryItem } from "@/app/actions/history";

interface HistoryDropdownProps {
  history: HistoryItem[];
  activeVideoId: string | null;
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export default function HistoryDropdown({
  history,
  activeVideoId,
  onSelect,
  onDelete,
}: HistoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        title="Watch History"
        aria-label="Watch History"
        className={`relative flex h-9 w-9 items-center justify-center rounded-lg border transition cursor-pointer ${
          isOpen
            ? "border-neutral-600 bg-neutral-800 text-neutral-100"
            : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
        }`}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {history.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-neutral-950">
            {history.length > 9 ? "9+" : history.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-neutral-800 bg-neutral-900/95 p-3 shadow-2xl backdrop-blur-md z-50">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5 mb-2 px-1">
            <div className="flex items-center gap-2">
              <svg
                className="h-3.5 w-3.5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs font-semibold text-neutral-200">
                Watch History
              </span>
            </div>
            <span className="text-[11px] text-neutral-500">
              {history.length} {history.length === 1 ? "video" : "videos"}
            </span>
          </div>

          {history.length === 0 ? (
            <div className="py-6 text-center text-xs text-neutral-500">
              No watch history yet
            </div>
          ) : (
            <div className="flex max-h-80 flex-col gap-1.5 overflow-y-auto pr-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    setIsOpen(false);
                  }}
                  className={`group flex items-center justify-between gap-3 rounded-lg p-2 transition cursor-pointer ${
                    activeVideoId === item.videoId
                      ? "bg-neutral-800/80 border border-emerald-500/40"
                      : "hover:bg-neutral-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {item.thumbnailUrl ? (
                      <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded bg-neutral-950">
                        <Image
                          src={item.thumbnailUrl}
                          alt={item.title || "Video"}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-11 w-16 shrink-0 items-center justify-center rounded bg-neutral-800 text-neutral-500">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                        </svg>
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-neutral-200 group-hover:text-white">
                        {item.title || "Untitled Video"}
                      </p>
                      {item.author && (
                        <p className="truncate text-[10px] text-neutral-400">
                          {item.author}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => onDelete(item.id, e)}
                    title="Remove"
                    className="shrink-0 text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-1"
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
                        strokeWidth={1.5}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
