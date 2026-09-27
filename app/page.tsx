import { auth } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-neutral-100 selection:bg-neutral-800 font-normal">
      {/* Header */}
      <header className="flex h-16 w-full items-center justify-between border-b border-neutral-800/60 px-6 sm:px-12 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <Image
            src="/Logo.png"
            alt="Syncore Logo"
            width={26}
            height={26}
            className="h-6.5 w-6.5 object-contain"
          />
          <span className="text-base font-medium tracking-tight text-neutral-100">Syncore</span>
        </div>

        <nav>
          {session?.user ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-white px-4 py-1.5 text-xs font-medium text-neutral-950 transition-all hover:bg-neutral-200 shadow-sm"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-white px-4 py-1.5 text-xs font-medium text-neutral-950 transition-all hover:bg-neutral-200 shadow-sm"
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

        {/* Product Preview Image */}
        <div className="mt-10 sm:mt-14 w-full max-w-7xl px-2 sm:px-4">
          <div className="relative aspect-[16/9] sm:aspect-[16/8.5] w-full rounded-2xl border border-neutral-800/80 bg-neutral-900/40 shadow-2xl shadow-black/80 overflow-hidden">
            <Image
              src="/image.png"
              alt="Syncore Preview"
              fill
              priority
              className="object-cover object-top"
            />
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
