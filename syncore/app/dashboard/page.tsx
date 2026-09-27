import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardView from "./dashboard-view";
import { getVideoHistory } from "@/app/actions/history";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const initialHistory = await getVideoHistory();

  return <DashboardView user={user} initialHistory={initialHistory} />;
}
