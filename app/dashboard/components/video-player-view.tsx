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
      <div className="overflow-hidden rounded-2xl bg-neutral-900/50 shadow-2xl shadow-black/50">
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
          <div className="flex aspect-video w-full flex-col items-center justify-center p-8 text-center">
            <p className="text-xs font-medium text-neutral-300">
              No video playing
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">
              Paste a YouTube URL above to start streaming
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
