import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardView from "./dashboard-view";
import { getVideoHistory } from "@/app/actions/history";
import { getQueue } from "@/app/actions/queue";
import { getRoomByCode, getRoomQueue } from "@/app/actions/room";

interface DashboardPageProps {
  searchParams?: Promise<{
    room?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const roomCode = resolvedSearchParams?.room;

  let roomName: string | null = null;
  let roomHostId: string | null = null;
  let roomHostName: string | null = null;
  let initialQueue = await getQueue();

  if (roomCode) {
    const roomRes = await getRoomByCode(roomCode);
    if (roomRes.room) {
      roomName = roomRes.room.name;
      roomHostId = roomRes.room.hostId;
      roomHostName = roomRes.room.hostName;
      initialQueue = await getRoomQueue(roomCode);
    }
  }

  const initialHistory = await getVideoHistory();

  return (
    <DashboardView
      user={user}
      initialHistory={initialHistory}
      initialQueue={initialQueue}
      initialRoomCode={roomCode || null}
      initialRoomName={roomName}
      initialRoomHostId={roomHostId}
      initialRoomHostName={roomHostName}
    />
  );
}

