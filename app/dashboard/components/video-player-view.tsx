"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { YouTubeMetadata } from "@/lib/youtube";

interface VideoPlayerViewProps {
  activeVideoId: string | null;
  activeMetadata: YouTubeMetadata | null;
  nextVideoTitle?: string | null;
  onEnded?: () => void;
  onSkipNext?: () => void;
}

export default function VideoPlayerView({
  activeVideoId,
  activeMetadata,
  nextVideoTitle,
  onEnded,
  onSkipNext,
}: VideoPlayerViewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen for YouTube player state changes via postMessage
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!event.data) return;

      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        // info: 0 is YT.PlayerState.ENDED
        if (data?.event === "onStateChange" && data?.info === 0) {
          onEnded?.();
        }
      } catch {
        // Ignore non-JSON postMessages
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onEnded]);

  const handleIframeLoad = () => {
    // Notify YouTube iframe to emit state change postMessages
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "listening" }),
        "*"
      );
    }
  };

  return (
    <div className="flex flex-col gap-3.5 w-full">
      <div className="overflow-hidden rounded-2xl border border-neutral-800/90 bg-neutral-900/60 shadow-2xl shadow-black/60">
        {activeVideoId ? (
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
          <div className="flex aspect-video w-full flex-col items-center justify-center p-8 text-center text-neutral-500">
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
            <p className="text-sm font-medium text-neutral-300">No active video</p>
            <p className="text-xs text-neutral-500 mt-1">
              Add a video to the queue or click any queued video to start streaming
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
