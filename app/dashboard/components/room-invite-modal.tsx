"use client";

import { useState } from "react";
import { Participant } from "@/lib/hooks/use-room-socket";
import { play } from "cuelume";

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

  const handleClose = () => {
    play("close");
    onClose();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      play("success");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const digits = roomCode.split("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-150"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[420px] rounded-3xl border border-neutral-800/70 bg-neutral-900/95 p-7 sm:p-8 shadow-2xl backdrop-blur-xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-neutral-100">
              {roomName || "Room Invite"}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Share 4-digit code or link to invite friends
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-neutral-500 hover:text-neutral-300 p-1.5 rounded-lg transition-colors cursor-pointer"
            title="Close"
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
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 4-Digit PIN Display */}
        <div className="my-6 flex flex-col items-center justify-center">
          <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 mb-3">
            Room Code
          </span>
          <div className="flex gap-2.5">
            {digits.map((digit, idx) => (
              <div
                key={idx}
                className="flex h-14 w-12 items-center justify-center rounded-xl border border-neutral-800/80 bg-neutral-950/80 font-mono text-2xl font-bold text-white shadow-inner"
              >
                {digit}
              </div>
            ))}
          </div>
        </div>

        {/* Shareable Link Input & Copy Button */}
        <div className="mb-6 flex flex-col gap-2">
          <label className="text-xs font-medium text-neutral-300">Invite Link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={inviteUrl}
              className="flex-1 rounded-xl border border-neutral-800/80 bg-neutral-950/80 px-4 py-3 text-xs text-neutral-200 select-all outline-none font-mono"
            />
            <button
              onClick={handleCopy}
              className={`rounded-xl px-4 py-3 text-xs font-semibold transition-all cursor-pointer ${
                copied
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "bg-white text-neutral-950 hover:bg-neutral-200 shadow-sm active:scale-95"
              }`}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Live Active Participants */}
        <div className="pt-2">
          <span className="text-xs font-medium text-neutral-400 block mb-2.5">
            Online Members ({participants.length})
          </span>

          <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
            {participants.map((p) => (
              <div
                key={p.socketId}
                className="flex items-center gap-2 rounded-lg bg-neutral-950/80 border border-neutral-800/60 px-2.5 py-1.5 text-xs text-neutral-200"
              >
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <span className="max-w-[120px] truncate">{p.name}</span>
              </div>
            ))}
            {participants.length === 0 && (
              <p className="text-xs text-neutral-500 italic">Waiting for friends to join...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
