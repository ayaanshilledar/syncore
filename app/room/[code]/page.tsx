import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getVideoHistory } from "@/app/actions/history";
import { getRoomByCode, getRoomQueue } from "@/app/actions/room";
import DashboardView from "@/app/dashboard/dashboard-view";

interface RoomPageProps {
  params: Promise<{
    code: string;
  }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { code } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/login?callbackUrl=/room/${code}`);
  }

  const roomRes = await getRoomByCode(code);
  if (roomRes.error || !roomRes.room) {
    notFound();
  }

  const [history, queue] = await Promise.all([
    getVideoHistory(),
    getRoomQueue(code),
  ]);

  return (
    <DashboardView
      user={session.user}
      initialHistory={history}
      initialQueue={queue}
      initialRoomCode={code}
      initialRoomName={roomRes.room.name}
    />
  );
}
