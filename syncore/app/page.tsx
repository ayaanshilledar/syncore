import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-neutral-100 selection:bg-neutral-800 font-normal">
      {/* Header */}
      <header className="flex h-16 w-full items-center justify-between border-b border-neutral-800/80 px-6 sm:px-12">
        <div className="flex items-center">
          <span className="text-lg font-normal tracking-tight">Syncore</span>
        </div>

        <nav>
          {session?.user ? (
            <Link
              href="/dashboard"
              className="rounded-full border border-neutral-700/80 bg-neutral-900 px-4 py-1.5 text-xs font-normal text-neutral-200 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-neutral-700/80 bg-neutral-900 px-4 py-1.5 text-xs font-normal text-neutral-200 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              Sign In
            </Link>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center sm:px-12">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/80 px-3.5 py-1 text-[11px] font-light text-neutral-400">
            <span>Collaborative YouTube streaming in real time</span>
          </div>

          <h1 className="text-4xl font-light tracking-tight sm:text-6xl text-neutral-100 leading-tight">
            Stream together. <br />
            <span className="font-normal text-neutral-300">Vote on what plays next.</span>
          </h1>

          <p className="text-base sm:text-lg font-light text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Create 4-digit rooms, invite friends with a single click, vote on the video queue, and experience live synchronized playback with multiplayer cursors.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-neutral-100 px-6 py-2.5 text-xs font-normal text-neutral-950 transition hover:bg-white"
              >
                Open Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-neutral-100 px-6 py-2.5 text-xs font-normal text-neutral-950 transition hover:bg-white"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Minimal Features Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-12 text-left max-w-2xl mx-auto">
            <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/30 p-4">
              <h4 className="text-xs font-medium text-neutral-200 mb-1">4-Digit PIN Rooms</h4>
              <p className="text-[11px] font-light text-neutral-500 leading-relaxed">
                Generate simple 4-digit codes or 1-click links to invite anyone instantly.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/30 p-4">
              <h4 className="text-xs font-medium text-neutral-200 mb-1">Live Queue & Voting</h4>
              <p className="text-[11px] font-light text-neutral-500 leading-relaxed">
                Add YouTube videos and upvote or downvote tracks to decide the stream order.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/30 p-4">
              <h4 className="text-xs font-medium text-neutral-200 mb-1">Multiplayer Cursors</h4>
              <p className="text-[11px] font-light text-neutral-500 leading-relaxed">
                See each other’s live pointer movements and presence as you watch together.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 px-6 py-4 text-center text-xs font-light text-neutral-500 sm:px-12">
        &copy; {new Date().getFullYear()} Syncore. All rights reserved.
      </footer>
    </div>
  );
}
