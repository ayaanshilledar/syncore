import { auth } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";

import FaqSection from "@/app/components/faq-section";
import Footer from "@/app/components/footer";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-neutral-100 selection:bg-neutral-800 font-normal scroll-smooth">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-neutral-800/60 px-6 sm:px-12 bg-neutral-950/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <Image
            src="/Logo.png"
            alt="Syncore Logo"
            width={26}
            height={26}
            className="h-6.5 w-6.5 object-contain"
          />
          <span className="text-base font-medium tracking-tight text-neutral-100">
            Syncore
          </span>
        </div>

        {/* Center Navigation Links */}
        <nav className="flex items-center gap-6 sm:gap-8 text-xs font-medium text-neutral-400">
          <Link
            href="#features"
            className="hover:text-neutral-100 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#faq"
            className="hover:text-neutral-100 transition-colors"
          >
            FAQ
          </Link>
        </nav>

        <div>
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
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-start px-6 pt-12 sm:pt-16 pb-20 text-center sm:px-12">
        <div className="max-w-5xl">
          <h1 className="text-3xl font-light tracking-tight sm:text-5xl md:text-6xl text-neutral-100 leading-tight">
            <span>No more fighting over the <span className="font-semibold text-white">aux</span>.</span>
            <br />
            <span className="text-neutral-300 font-light">
              Let the room <span className="font-semibold text-white">vote</span>.
            </span>
          </h1>
        </div>

        {/* Hero Product Preview */}
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

        {/* Feature Showcase Section */}
        <section id="features" className="mt-28 sm:mt-36 w-full max-w-6xl px-2 sm:px-4 flex flex-col gap-24 sm:gap-32 scroll-mt-24">
          {/* Section Headline */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-neutral-100">
              Everything you need to stream and sync together.
            </h2>
          </div>

          {/* Feature 1: Queue & Voting (Text Left, Image Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center text-left">
            <div className="flex flex-col gap-3">
              <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-neutral-100">
                Queue music and vote on what plays next.
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-neutral-400">
                Paste any YouTube or stream link directly into the queue. Everyone in the room votes on their favorite tracks in real time, and top-voted videos automatically play next.
              </p>
            </div>

            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden">
              <Image
                src="/feature/quue_music.png"
                alt="Queue and Vote Feature"
                fill
                className="object-contain object-center"
              />
            </div>
          </div>

          {/* Feature 2: Create Room (Image Left, Text Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center text-left">
            <div className="order-2 lg:order-1 relative aspect-[16/10] w-full rounded-2xl overflow-hidden">
              <Image
                src="/feature/create_room.png"
                alt="Create Room Feature"
                fill
                className="object-contain object-center"
              />
            </div>

            <div className="order-1 lg:order-2 flex flex-col gap-3">
              <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-neutral-100">
                Create instant rooms with 4-digit codes.
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-neutral-400">
                Spin up open or private watch party rooms in seconds. Share your 4-digit code or direct link to collaborate with friends with sub-second synchronization and live multiplayer cursors.
              </p>
            </div>
          </div>

          {/* Feature 3: Watch History (Text Left, Image Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center text-left">
            <div className="flex flex-col gap-3">
              <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-neutral-100">
                Your personal watch history and stream space.
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-neutral-400">
                Syncore automatically organizes your watch history and queue contributions. Access previously played tracks, replay favorites, and manage your account seamlessly.
              </p>
            </div>

            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden">
              <Image
                src="/feature/user_history.png"
                alt="Watch History Feature"
                fill
                className="object-contain object-center"
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer sessionUser={!!session?.user} />
    </div>
  );
}
