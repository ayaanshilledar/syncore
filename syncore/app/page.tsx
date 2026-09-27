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
      <main className="flex flex-1 flex-col items-center justify-start px-6 pt-12 sm:pt-16 pb-16 text-center sm:px-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-light tracking-tight sm:text-6xl text-neutral-100 leading-tight">
            Stream together. <br />
            <span className="font-normal text-neutral-300">Vote on what plays next.</span>
          </h1>
        </div>

        {/* Big Minimal Image Placeholder */}
        <div className="mt-10 sm:mt-14 w-full max-w-5xl">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl border border-neutral-800/80 bg-neutral-900/30 shadow-2xl shadow-black/60 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
            <div className="relative flex flex-col items-center justify-center text-neutral-500">
              <span className="text-xs font-light tracking-widest uppercase text-neutral-500">
                Product Image Placeholder
              </span>
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
