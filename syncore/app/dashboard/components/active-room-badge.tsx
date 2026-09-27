"use client";

interface ActiveRoomBadgeProps {
  roomCode: string | null;
  participantCount: number;
  isConnected: boolean;
  onOpenInvite: () => void;
  onOpenRoomModal: () => void;
  onLeaveRoom: () => void;
}

export default function ActiveRoomBadge({
  roomCode,
  participantCount,
  isConnected,
  onOpenInvite,
  onOpenRoomModal,
  onLeaveRoom,
}: ActiveRoomBadgeProps) {
  if (!roomCode) {
    return (
      <button
        onClick={onOpenRoomModal}
        className="rounded-full border border-neutral-800 bg-neutral-900/90 px-3.5 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-700 transition-all shadow-sm"
      >
        Create / Join Room
      </button>
    );
  }

  return (
    <div className="inline-flex items-center rounded-full border border-neutral-800/90 bg-neutral-900/90 text-xs shadow-sm overflow-hidden backdrop-blur-sm">
      {/* Room Status & Code (Clickable) */}
      <button
        type="button"
        onClick={onOpenInvite}
        className="flex items-center gap-2 pl-3.5 pr-2.5 py-1.5 hover:bg-neutral-800/60 transition-colors text-left"
        title="View Room & PIN"
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
          }`}
        />
        <span className="font-mono font-medium text-neutral-200">
          #{roomCode}
        </span>
        <span className="text-neutral-500">•</span>
        <span className="text-[11px] text-neutral-400">
          {participantCount} {participantCount === 1 ? "online" : "online"}
        </span>
      </button>

      <span className="h-3.5 w-px bg-neutral-800 shrink-0" />

      {/* Invite Action */}
      <button
        type="button"
        onClick={onOpenInvite}
        className="px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition-colors"
      >
        Invite
      </button>

      <span className="h-3.5 w-px bg-neutral-800 shrink-0" />

      {/* Leave Action */}
      <button
        type="button"
        onClick={onLeaveRoom}
        className="px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-rose-400 hover:bg-neutral-800/60 transition-colors"
      >
        Leave
      </button>
    </div>
  );
}
