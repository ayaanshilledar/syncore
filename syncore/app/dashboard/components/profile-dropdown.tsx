"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { HistoryItem } from "@/app/actions/history";

export interface UserProfile {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface ProfileDropdownProps {
  user: UserProfile;
  history?: HistoryItem[];
  activeVideoId?: string | null;
  onSelectHistory?: (item: HistoryItem) => void;
  onDeleteHistory?: (id: string, e: React.MouseEvent) => void;
}

export default function ProfileDropdown({
  user,
  history = [],
  activeVideoId = null,
  onSelectHistory,
  onDeleteHistory,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"menu" | "history">("menu");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setView("menu");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenToggle = () => {
    setIsOpen((prev) => {
      if (prev) {
        setView("menu");
      }
      return !prev;
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleOpenToggle}
        className="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 p-1 pr-2.5 transition hover:border-neutral-700 hover:bg-neutral-800/80 cursor-pointer"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || "User Avatar"}
            width={28}
            height={28}
            className="h-7 w-7 rounded-full border border-neutral-700 object-cover"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800 text-xs font-semibold text-neutral-200">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
        )}
        <span className="hidden text-xs font-medium text-neutral-300 sm:inline-block max-w-[120px] truncate">
          {user.name || user.email}
        </span>
        <svg
          className={`h-3.5 w-3.5 text-neutral-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-neutral-800 bg-neutral-900/95 p-2.5 shadow-2xl backdrop-blur-md z-50">
          {view === "menu" ? (
            <>
              {/* User Info Header */}
              <div className="flex items-center gap-3 border-b border-neutral-800 px-2 pb-2.5 mb-1.5">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full border border-neutral-700 object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 text-xs font-semibold text-neutral-200">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-neutral-200">
                    {user.name || "User"}
                  </p>
                  <p className="truncate text-[11px] text-neutral-400">
                    {user.email || ""}
                  </p>
                </div>
              </div>

              {/* Menu Actions */}
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => setView("history")}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Watch History</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {history.length > 0 && (
                      <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] font-mono text-neutral-300 border border-neutral-700">
                        {history.length}
                      </span>
                    )}
                    <svg
                      className="h-3.5 w-3.5 text-neutral-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                >
                  <svg
                    className="h-4 w-4 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            /* History Subview */
            <div>
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2 px-1">
                <button
                  type="button"
                  onClick={() => setView("menu")}
                  className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-100 transition cursor-pointer"
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span>Back</span>
                </button>
                <span className="text-[11px] font-mono text-neutral-400">
                  {history.length} {history.length === 1 ? "video" : "videos"}
                </span>
              </div>

              {history.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-500">
                  No watch history yet
                </div>
              ) : (
                <div className="flex max-h-72 flex-col gap-1.5 overflow-y-auto pr-1">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelectHistory?.(item);
                        setIsOpen(false);
                        setView("menu");
                      }}
                      className={`group flex items-center justify-between gap-2.5 rounded-lg p-1.5 transition cursor-pointer ${
                        activeVideoId === item.videoId
                          ? "bg-neutral-800 border border-neutral-700"
                          : "hover:bg-neutral-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {item.thumbnailUrl ? (
                          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-neutral-950">
                            <Image
                              src={item.thumbnailUrl}
                              alt={item.title || "Video"}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded bg-neutral-800 text-neutral-500">
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

                      {onDeleteHistory && (
                        <button
                          type="button"
                          onClick={(e) => onDeleteHistory(item.id, e)}
                          title="Remove"
                          className="shrink-0 text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-1 cursor-pointer"
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
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
