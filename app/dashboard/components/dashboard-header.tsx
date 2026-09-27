"use client";

import Image from "next/image";
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
  onOpenTour?: () => void;
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
  onOpenTour,
}: DashboardHeaderProps) {
  return (
    <header className="flex h-16 w-full items-center justify-between px-6 sm:px-12">
      <div className="flex items-center gap-2.5">
        <Image
          src="/Logo.png"
          alt="Syncore Logo"
          width={28}
          height={28}
          className="h-7 w-7 object-contain"
        />
        <span className="text-lg font-medium tracking-tight">Syncore</span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div id="tour-room-btn">
          <ActiveRoomBadge
            roomCode={roomCode}
            participantCount={participantCount}
            isConnected={isSocketConnected}
            onOpenInvite={onOpenInvite}
            onOpenRoomModal={onOpenRoomModal}
            onLeaveRoom={onLeaveRoom}
          />
        </div>

        <div id="tour-profile-btn">
          <ProfileDropdown
            user={user}
            history={history}
            activeVideoId={activeVideoId}
            onSelectHistory={onSelectHistory}
            onDeleteHistory={onDeleteHistory}
            onOpenTour={onOpenTour}
          />
        </div>
      </div>
    </header>
  );
}
