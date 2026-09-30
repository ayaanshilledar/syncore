"use client";

import { useState, useRef, FormEvent } from "react";
import { getRoomByCode } from "@/app/actions/room";
import { play } from "cuelume";

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

  const handleClose = () => {
    play("close");
    onClose();
  };

  const handleDigitChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "");
    if (!clean && value !== "") return;

    play("tap");
    const newDigits = [...digits];
    newDigits[index] = clean.slice(-1);
    setDigits(newDigits);
    setError(null);

    if (clean && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);
    if (!pasted) return;

    play("tap");
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
      play("error");
      setError("Please enter all 4 digits.");
      return;
    }

    setJoinLoading(true);
    setError(null);

    const res = await getRoomByCode(fullCode);
    setJoinLoading(false);

    if (res.error) {
      play("error");
      setError(res.error);
    } else {
      play("success");
      onJoinSuccess(fullCode);
      onClose();
    }
  };

  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await onCreateRoom(roomName);
      play("success");
      onClose();
    } catch {
      play("error");
      setError("Failed to create room. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-150"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[420px] rounded-3xl border border-neutral-800/70 bg-neutral-900/95 p-7 sm:p-8 shadow-2xl backdrop-blur-xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header without separator border */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-neutral-100">
              Room
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Create or join a stream session
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

        {/* Tab Switcher without outer border */}
        <div className="mt-6 grid grid-cols-2 gap-1.5 rounded-xl bg-neutral-950/90 p-1.5">
          <button
            type="button"
            onClick={() => {
              play("select");
              setActiveTab("create");
              setError(null);
            }}
            className={`rounded-lg py-2 text-xs font-medium transition-all cursor-pointer ${
              activeTab === "create"
                ? "bg-neutral-800 text-white shadow-sm"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Create
          </button>

          <button
            type="button"
            onClick={() => {
              play("select");
              setActiveTab("join");
              setError(null);
            }}
            className={`rounded-lg py-2 text-xs font-medium transition-all cursor-pointer ${
              activeTab === "join"
                ? "bg-neutral-800 text-white shadow-sm"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Join
          </button>
        </div>

        {/* Tab 1: Create View */}
        {activeTab === "create" && (
          <form onSubmit={handleCreateSubmit} className="mt-6 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-neutral-300">
                Room Name <span className="text-neutral-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="My Room"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full rounded-xl border border-neutral-800/80 bg-neutral-950/80 px-4 py-3 text-xs text-neutral-100 placeholder:text-neutral-600 outline-none focus:border-neutral-600 transition-colors"
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-rose-400 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isCreatingRoom}
              className="mt-2 w-full rounded-xl bg-white py-3 text-xs font-semibold text-neutral-950 transition hover:bg-neutral-200 shadow-sm disabled:opacity-50 cursor-pointer active:scale-[0.99]"
            >
              {isCreatingRoom ? "Creating..." : "Create Room"}
            </button>
          </form>
        )}

        {/* Tab 2: Join View */}
        {activeTab === "join" && (
          <form onSubmit={handleJoinSubmit} className="mt-6 flex flex-col items-center">
            <label className="text-xs font-medium text-neutral-300 mb-3 self-start">
              Enter 4-Digit Room PIN
            </label>
            <div className="grid grid-cols-4 gap-3 w-full my-2">
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
                  className="h-14 w-full min-w-0 rounded-xl border border-neutral-800/80 bg-neutral-950/80 text-center font-mono text-2xl font-semibold text-white outline-none focus:border-neutral-500 transition-colors"
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            {error && (
              <p className="my-2 text-xs font-medium text-rose-400 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={joinLoading || digits.join("").length !== 4}
              className="mt-6 w-full rounded-xl bg-white py-3 text-xs font-semibold text-neutral-950 transition hover:bg-neutral-200 shadow-sm disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-[0.99]"
            >
              {joinLoading ? "Verifying..." : "Join Room"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
