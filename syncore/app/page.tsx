import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-neutral-100 selection:bg-neutral-800">

      <header className="flex h-16 w-full items-center justify-between border-b border-neutral-800/80 px-6 sm:px-12">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="text-lg font-semibold tracking-tight">Syncore</span>
        </div>

        <nav>
          {session?.user ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-200"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-200"
            >
              Sign In
            </Link>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center sm:px-12">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl text-neutral-100">
            Welcome to <span className="text-neutral-400">Syncore</span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed">
            A minimalist and streamlined platform for your modern workflow. Securely authenticate and access your workspace with ease.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-neutral-100 px-6 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200"
              >
                Open Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-neutral-100 px-6 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 px-6 py-4 text-center text-xs text-neutral-500 sm:px-12">
        &copy; {new Date().getFullYear()} Syncore. All rights reserved.
      </footer>
    </div>
  );
}
