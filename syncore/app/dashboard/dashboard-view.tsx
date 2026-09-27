"use client";

import { useState, useRef, useEffect, FormEvent, useTransition } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { extractYouTubeId, YouTubeMetadata } from "@/lib/youtube";
import {
  recordVideoHistory,
  deleteHistoryItem,
  HistoryItem,
} from "@/app/actions/history";

interface UserProfile {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface DashboardViewProps {
  user: UserProfile;
  initialHistory?: HistoryItem[];
}

export default function DashboardView({
  user,
  initialHistory = [],
}: DashboardViewProps) {
  const [inputUrl, setInputUrl] = useState("");
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [activeMetadata, setActiveMetadata] = useState<YouTubeMetadata | null>(
    null
  );
  const [history, setHistory] = useState<HistoryItem[]>(initialHistory);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const historyDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        historyDropdownRef.current &&
        !historyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsHistoryOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadVideo = (videoId: string) => {
    setActiveVideoId(videoId);
    setError(null);

    startTransition(async () => {
      const res = await recordVideoHistory(videoId);
      if (res && res.success) {
        if (res.metadata) {
          setActiveMetadata(res.metadata);
        }
        if (res.history) {
          setHistory(res.history);
        }
      }
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const videoId = extractYouTubeId(inputUrl);

    if (!videoId) {
      setError("Please enter a valid YouTube video or Shorts link.");
      return;
    }

    loadVideo(videoId);
  };

  const handleSelectFromHistory = (item: HistoryItem) => {
    setInputUrl(item.url);
    setActiveVideoId(item.videoId);
    setActiveMetadata({
      videoId: item.videoId,
      url: item.url,
      title: item.title || "YouTube Video",
      author: item.author,
      thumbnailUrl:
        item.thumbnailUrl ||
        `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`,
    });
    setIsHistoryOpen(false);

    startTransition(async () => {
      const res = await recordVideoHistory(item.videoId);
      if (res?.history) {
        setHistory(res.history);
      }
    });
  };

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(async () => {
      const res = await deleteHistoryItem(id);
      if (res?.history) {
        setHistory(res.history);
      }
    });
  };

  const handleClear = () => {
    setInputUrl("");
    setActiveVideoId(null);
    setActiveMetadata(null);
    setError(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-neutral-100 selection:bg-neutral-800">
      {/* Header */}
      <header className="flex h-16 w-full items-center justify-between border-b border-neutral-800/80 px-6 sm:px-12">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="text-lg font-semibold tracking-tight">Syncore</span>
          <span className="rounded bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400 font-mono">
            Dashboard
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Minimal History Icon & Dropdown */}
          <div className="relative" ref={historyDropdownRef}>
            <button
              type="button"
              onClick={() => setIsHistoryOpen((prev) => !prev)}
              title="Watch History"
              aria-label="Watch History"
              className={`relative flex h-9 w-9 items-center justify-center rounded-lg border transition cursor-pointer ${
                isHistoryOpen
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

            {/* Dropdown Menu */}
            {isHistoryOpen && (
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
                        onClick={() => handleSelectFromHistory(item)}
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
                          onClick={(e) => handleDeleteHistory(item.id, e)}
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

          {/* Minimal Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
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
                  isProfileOpen ? "rotate-180" : ""
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

            {/* Profile Dropdown Popover */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-neutral-800 bg-neutral-900/95 p-2 shadow-2xl backdrop-blur-md z-50">
                {/* User Summary */}
                <div className="flex items-center gap-3 border-b border-neutral-800 px-2.5 py-2.5 mb-1.5">
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
                    <p className="truncate text-xs font-semibold text-neutral-200">
                      {user.name || "User"}
                    </p>
                    <p className="truncate text-[11px] text-neutral-400">
                      {user.email || ""}
                    </p>
                  </div>
                </div>

                {/* Dummy Profile Option */}
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white cursor-pointer"
                  >
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile
                  </button>

                  {/* Sign Out Option */}
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
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-6 py-10 sm:px-12">
        <div className="mx-auto max-w-4xl flex flex-col gap-6">
          <div>
            <h1 className="text-xl font-semibold text-neutral-100">Video Player</h1>
            <p className="text-sm text-neutral-400">
              Enter any YouTube video or Shorts link to play it here.
            </p>
          </div>

          {/* Input & Action Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Paste YouTube link (e.g., https://www.youtube.com/watch?v=...)"
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 transition focus:border-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isPending && !activeVideoId}
                className="rounded-lg bg-neutral-100 px-5 py-2.5 text-sm font-medium text-neutral-950 transition hover:bg-neutral-200 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                Play Video
              </button>
              {activeVideoId && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm font-medium text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-200 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {error && <p className="text-sm text-red-400">{error}</p>}

          {/* Video Player */}
          <div className="flex flex-col gap-3">
            <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50">
              {activeVideoId ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1`}
                    title={activeMetadata?.title || "YouTube video player"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full flex-col items-center justify-center p-6 text-center text-neutral-500">
                  <svg
                    className="mb-3 h-12 w-12 text-neutral-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm font-medium text-neutral-400">
                    No video selected
                  </p>
                  <p className="text-xs text-neutral-500">
                    Paste a YouTube link above to start streaming
                  </p>
                </div>
              )}
            </div>

            {/* Video Metadata Banner */}
            {activeVideoId && activeMetadata && (
              <div className="flex flex-col gap-1 rounded-lg border border-neutral-800/80 bg-neutral-900/60 p-4">
                <h2 className="text-base font-medium text-neutral-100">
                  {activeMetadata.title}
                </h2>
                {activeMetadata.author && (
                  <p className="text-xs text-neutral-400">
                    Channel: <span className="text-neutral-200">{activeMetadata.author}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
