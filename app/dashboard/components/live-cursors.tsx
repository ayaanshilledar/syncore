"use client";

import { RemoteCursor } from "@/lib/hooks/use-multiplayer-cursors";

interface LiveCursorsProps {
  cursors: RemoteCursor[];
}

export default function LiveCursors({ cursors }: LiveCursorsProps) {
  if (!cursors || cursors.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {cursors.map((peer) => {
        return (
          <div
            key={peer.socketId}
            style={{
              left: `${peer.x}%`,
              top: `${peer.y}%`,
              transitionProperty: "left, top",
              transitionDuration: "80ms",
              transitionTimingFunction: "cubic-bezier(0.2, 0, 0.2, 1)",
            }}
            className="pointer-events-none absolute select-none will-change-[left,top]"
          >
            {/* Solid Figma-style SVG pointer arrow */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              style={{ display: "block" }}
            >
              <path
                d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
                fill={peer.color}
                stroke="#000000"
                strokeWidth="1.25"
                strokeLinejoin="round"
              />
            </svg>

            {/* Solid Color User Pill Tag */}
            <div
              style={{ backgroundColor: peer.color }}
              className="ml-3.5 -mt-1 inline-flex items-center gap-1 rounded-md px-2 py-0.5 shadow-lg"
            >
              <span className="text-[11px] font-bold tracking-tight text-white drop-shadow-sm whitespace-nowrap">
                {peer.name || "Anonymous"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
