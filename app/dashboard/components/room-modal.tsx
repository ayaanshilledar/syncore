"use client";

import { useState, useRef, FormEvent } from "react";
import { getRoomByCode } from "@/app/actions/room";

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (roomName?: string) => Promise<void>;
  onJoinSuccess: (code: string) => void;
  isCreatingRoom?: boolean;
}

export default function RoomModal({
  isOpen,
  onClose,
  onCreateRoom,
  onJoinSuccess,
  isCreatingRoom = false,
}: RoomModalProps) {
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [roomName, setRoomName] = useState("");
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [joinLoading, setJoinLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "");
    if (!clean && value !== "") return;

    const newDigits = [...digits];
    newDigits[index] = clean.slice(-1);
    setDigits(newDigits);
    setError(null);

    if (clean && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;

    const newDigits = ["", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);
    const nextFocus = Math.min(pasted.length, 3);
    inputRefs.current[nextFocus]?.focus();
  };

  const handleJoinSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const fullCode = digits.join("");
    if (fullCode.length !== 4) {
      setError("Please enter all 4 digits.");
      return;
    }

    setJoinLoading(true);
    setError(null);

    const res = await getRoomByCode(fullCode);
    setJoinLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      onJoinSuccess(fullCode);
      onClose();
    }
  };

  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await onCreateRoom(roomName);
      onClose();
    } catch {
      setError("Failed to create room. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Minimal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
          <div>
            <h3 className="text-sm font-semibold text-neutral-100">Room</h3>
            <p className="text-xs text-neutral-400">Create or join a session</p>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-neutral-400 hover:text-neutral-200 px-2 py-1 rounded transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Minimal Tab Switcher */}
        <div className="mt-4 grid grid-cols-2 gap-1 rounded-lg bg-neutral-950 p-1 border border-neutral-800/60">
          <button
            type="button"
            onClick={() => {
              setActiveTab("create");
              setError(null);
            }}
            className={`rounded-md py-1.5 text-xs font-medium transition-all ${
              activeTab === "create"
                ? "bg-neutral-800 text-white"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Create
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("join");
              setError(null);
            }}
            className={`rounded-md py-1.5 text-xs font-medium transition-all ${
              activeTab === "join"
                ? "bg-neutral-800 text-white"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Join
          </button>
        </div>

        {/* Tab 1: Create View */}
        {activeTab === "create" && (
          <form onSubmit={handleCreateSubmit} className="mt-4 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-400">Room Name (Optional)</label>
              <input
                type="text"
                placeholder="My Room"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-neutral-600 transition-colors"
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-rose-400 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isCreatingRoom}
              className="mt-2 w-full rounded-lg bg-neutral-100 py-2.5 text-xs font-medium text-neutral-950 transition-colors hover:bg-white disabled:opacity-50"
            >
              {isCreatingRoom ? "Creating..." : "Create Room"}
            </button>
          </form>
        )}

        {/* Tab 2: Join View */}
        {activeTab === "join" && (
          <form onSubmit={handleJoinSubmit} className="mt-4 flex flex-col items-center">
            <div className="flex gap-2 my-2">
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  className="h-12 w-11 rounded-lg border border-neutral-700 bg-neutral-950 text-center font-mono text-xl font-bold text-white outline-none focus:border-neutral-500 transition-colors"
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            {error && (
              <p className="my-2 text-xs font-medium text-rose-400 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={joinLoading || digits.join("").length !== 4}
              className="mt-2 w-full rounded-lg bg-neutral-100 py-2.5 text-xs font-medium text-neutral-950 transition-colors hover:bg-white disabled:opacity-50 disabled:pointer-events-none"
            >
              {joinLoading ? "Verifying..." : "Join Room"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
