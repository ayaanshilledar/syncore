"use client";

import HistoryDropdown from "./history-dropdown";
import ProfileDropdown, { UserProfile } from "./profile-dropdown";
import ActiveRoomBadge from "./active-room-badge";
import { HistoryItem } from "@/app/actions/history";

interface DashboardHeaderProps {
  user: UserProfile;
  history: HistoryItem[];
  activeVideoId: string | null;
  roomCode: string | null;
  participantCount: number;
  isSocketConnected: boolean;
  onSelectHistory: (item: HistoryItem) => void;
  onDeleteHistory: (id: string, e: React.MouseEvent) => void;
  onOpenInvite: () => void;
  onOpenRoomModal: () => void;
  onLeaveRoom: () => void;
}

export default function DashboardHeader({
  user,
  history,
  activeVideoId,
  roomCode,
  participantCount,
  isSocketConnected,
  onSelectHistory,
  onDeleteHistory,
  onOpenInvite,
  onOpenRoomModal,
  onLeaveRoom,
}: DashboardHeaderProps) {
  return (
    <header className="flex h-16 w-full items-center justify-between px-6 sm:px-12">
      <div className="flex items-center">
        <span className="text-lg font-medium tracking-tight">Syncore</span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <ActiveRoomBadge
          roomCode={roomCode}
          participantCount={participantCount}
          isConnected={isSocketConnected}
          onOpenInvite={onOpenInvite}
          onOpenRoomModal={onOpenRoomModal}
          onLeaveRoom={onLeaveRoom}
        />

        <HistoryDropdown
          history={history}
          activeVideoId={activeVideoId}
          onSelect={onSelectHistory}
          onDelete={onDeleteHistory}
        />

        <ProfileDropdown user={user} />
      </div>
    </header>
  );
}
