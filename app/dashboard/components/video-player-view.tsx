"use client";

import { useEffect, useRef } from "react";
import { YouTubeMetadata } from "@/lib/youtube";

interface VideoPlayerViewProps {
  activeVideoId: string | null;
  activeMetadata: YouTubeMetadata | null;
  nextVideoTitle?: string | null;
  onEnded?: () => void;
  onSkipNext?: () => void;
  isHost?: boolean;
  isInRoom?: boolean;
  isListeningLocally?: boolean;
  onToggleListenLocally?: () => void;
  roomHostName?: string | null;
}

export default function VideoPlayerView({
  activeVideoId,
  activeMetadata,
  nextVideoTitle,
  onEnded,
  onSkipNext,
  isHost = true,
  isInRoom = false,
  isListeningLocally = false,
  onToggleListenLocally,
  roomHostName,
}: VideoPlayerViewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!event.data) return;

      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (data?.event === "onStateChange" && data?.info === 0) {
          onEnded?.();
        }
      } catch {
        // Ignore non-JSON messages
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onEnded]);

  const handleIframeLoad = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "listening" }),
        "*"
      );
    }
  };

  const shouldRenderPlayer = !isInRoom || isHost || isListeningLocally;

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Header Mode Bar */}
      {isInRoom && (
        <div className="flex items-center justify-between px-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="rounded border border-neutral-800 bg-neutral-900/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400">
              {isHost
                ? "Host Speaker"
                : isListeningLocally
                ? "Local Audio"
                : "Controller Mode"}
            </span>
            <span className="text-[11px] text-neutral-500">
              {isHost
                ? "Streaming audio to room"
                : isListeningLocally
                ? "Playing on this device"
                : `Streaming on ${roomHostName || "Host"}'s speaker`}
            </span>
          </div>

          {!isHost && onToggleListenLocally && (
            <button
              type="button"
              onClick={onToggleListenLocally}
              className="rounded border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-[11px] font-medium text-neutral-300 transition-colors hover:border-neutral-700 hover:text-white"
            >
              {isListeningLocally ? "Switch to Controller" : "Listen on this Device"}
            </button>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/50 shadow-2xl shadow-black/50">
        {!activeVideoId ? (
          <div className="flex aspect-video w-full flex-col items-center justify-center p-8 text-center">
            <p className="text-xs font-medium tracking-wide uppercase text-neutral-400">
              No track playing
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">
              Paste a YouTube URL above to queue
            </p>
          </div>
        ) : shouldRenderPlayer ? (
          <div className="aspect-video w-full">
            <iframe
              ref={iframeRef}
              key={activeVideoId}
              src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&enablejsapi=1`}
              title={activeMetadata?.title || "YouTube video player"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={handleIframeLoad}
              className="h-full w-full border-0"
            />
          </div>
        ) : (
          /* Guest Controller Card (No duplicate audio) */
          <div className="flex aspect-video w-full flex-col justify-between p-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                Now Playing
              </span>
              {nextVideoTitle && (
                <span className="text-[11px] text-neutral-500 truncate max-w-[200px]">
                  Next: {nextVideoTitle}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 my-auto">
              {activeMetadata?.thumbnailUrl && (
                <img
                  src={activeMetadata.thumbnailUrl}
                  alt={activeMetadata.title || "Now Playing"}
                  className="h-20 w-32 rounded-lg object-cover border border-neutral-800 flex-shrink-0"
                />
              )}
              <div className="flex flex-col min-w-0">
                <h3 className="text-sm font-medium text-neutral-100 truncate">
                  {activeMetadata?.title || "Active Track"}
                </h3>
                {activeMetadata?.author && (
                  <p className="text-xs text-neutral-400 mt-0.5 truncate">
                    {activeMetadata.author}
                  </p>
                )}
                <p className="text-[11px] text-neutral-500 mt-2">
                  Audio is playing on the main room speaker. Use the queue to vote or add tracks.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-neutral-800/80 pt-3 text-[11px] text-neutral-500">
              <span>Host: {roomHostName || "Room Host"}</span>
              {onToggleListenLocally && (
                <button
                  type="button"
                  onClick={onToggleListenLocally}
                  className="text-neutral-400 hover:text-white underline underline-offset-4"
                >
                  Want to hear on your headphones? Click here
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

