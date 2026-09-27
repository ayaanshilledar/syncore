import { auth } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/app/components/footer";

export default async function AboutPage() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-neutral-100 selection:bg-neutral-800 font-normal scroll-smooth">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-12 w-full items-center justify-between px-4 sm:px-12 bg-neutral-950/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition">
          <Image
            src="/Logo.png"
            alt="Syncore Logo"
            width={24}
            height={24}
            className="h-6 w-6 object-contain"
          />
          <span className="text-base font-medium tracking-tight text-neutral-100">
            Syncore
          </span>
        </Link>

        {/* Center Navigation Links */}
        <nav className="flex items-center gap-5 sm:gap-8 text-xs font-medium text-neutral-400">
          <Link
            href="/about"
            className="text-neutral-100 font-semibold transition-colors"
          >
            About
          </Link>
          <Link
            href="/#features"
            className="hover:text-neutral-100 transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#faq"
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

      {/* Main Content - Compact, Readable Editorial Typography */}
      <main className="flex-1 px-5 sm:px-8 py-12 sm:py-16 max-w-xl mx-auto w-full text-left">
        {/* Header Intro */}
        <div className="mb-8">
          <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block mb-1.5">
            Behind the project
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-100">
            Why I Built Syncore
          </h1>
          <p className="text-xs sm:text-sm font-light text-neutral-400 mt-2 leading-relaxed">
            The story, the journey, and why this project is special to me.
          </p>
        </div>

        {/* Paragraph Sections */}
        <article className="space-y-5 text-xs sm:text-[13px] font-light text-neutral-300 leading-relaxed">
          <p>
            Syncore started as a project I built while learning web development from the internet. I was mostly building things to learn, experiment, and understand how the web actually worked. It was one of those projects that started small and slowly became something I cared about.
          </p>

          <p>
            Funny enough, Syncore was also the project that helped me get into the startup I work at today. That made it a little more special to me. Even after moving on to other projects, I always had this feeling that I wanted to come back and finish it properly.
          </p>

          <p>
            So I eventually came back to it with everything I had learned since the first version. I redesigned it, rebuilt the real-time layer, worked on the WebSocket system, and added the features I had always wanted it to have.
          </p>

          <p>
            The idea is still simple. Get your friends into one room, play something together, and let everyone be part of it. No counting down &ldquo;3, 2, 1&rdquo;, no asking who&apos;s five seconds behind, and no unnecessary setup.
          </p>

          <p>
            It&apos;s probably not the biggest project I&apos;ve built, but it means a lot to me. It started as something I made while learning, became part of my journey into a startup, and now it&apos;s finally something I can look back at and feel proud of.
          </p>
        </article>
      </main>

      {/* Footer */}
      <Footer sessionUser={!!session?.user} />
    </div>
  );
}
