"use client";

import { useState } from "react";
import { Participant } from "@/lib/hooks/use-room-socket";

interface RoomInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomCode: string;
  roomName?: string | null;
  participants: Participant[];
}

export default function RoomInviteModal({
  isOpen,
  onClose,
  roomCode,
  roomName,
  participants,
}: RoomInviteModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/room/${roomCode}`
      : `http://localhost:3000/room/${roomCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const digits = roomCode.split("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
          <div>
            <h3 className="text-sm font-semibold text-neutral-100">
              {roomName || "Room Invite"}
            </h3>
            <p className="text-xs text-neutral-400">Share PIN or link to invite</p>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-neutral-400 hover:text-neutral-200 px-2 py-1 rounded transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 4-Digit PIN Display */}
        <div className="my-5 flex flex-col items-center justify-center">
          <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 mb-2">
            4-Digit PIN
          </span>
          <div className="flex gap-2">
            {digits.map((digit, idx) => (
              <div
                key={idx}
                className="flex h-12 w-11 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-950 font-mono text-xl font-bold text-white shadow-inner"
              >
                {digit}
              </div>
            ))}
          </div>
        </div>

        {/* Shareable Link Input & Copy Button */}
        <div className="mb-4 flex flex-col gap-1.5">
          <label className="text-xs text-neutral-400">Invite Link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={inviteUrl}
              className="flex-1 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-300 select-all outline-none font-mono"
            />
            <button
              onClick={handleCopy}
              className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-neutral-100 text-neutral-950 hover:bg-white"
              }`}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Live Active Participants */}
        <div className="border-t border-neutral-800/80 pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-neutral-400">
              Online Members ({participants.length})
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
            {participants.map((p) => (
              <div
                key={p.socketId}
                className="flex items-center gap-1.5 rounded-md border border-neutral-800 bg-neutral-950 px-2 py-1 text-xs text-neutral-300"
              >
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <span className="max-w-[120px] truncate">{p.name}</span>
              </div>
            ))}
            {participants.length === 0 && (
              <p className="text-xs text-neutral-500 italic">Waiting for others to join...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
