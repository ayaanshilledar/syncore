import Link from "next/link";
import Image from "next/image";

interface FooterProps {
  sessionUser?: boolean;
}

export default function Footer({ sessionUser }: FooterProps) {
  return (
    <footer className="relative w-full overflow-hidden bg-neutral-950 pt-20 pb-0 sm:pt-28">
      {/* Background Image with Top and Bottom Blend */}
      <div className="absolute inset-0 z-0 opacity-45 pointer-events-none">
        <Image
          src="/footer.jpg"
          alt="Footer Backdrop"
          fill
          className="object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent" />
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 sm:pb-20">
        {/* Left Column: Brand, Tagline, Bio, CTA */}
        <div className="lg:col-span-6 flex flex-col items-start gap-4 text-left">
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

          <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-neutral-100">
            Your synchronized stream space
          </h3>

          <p className="max-w-md text-xs sm:text-sm leading-relaxed text-neutral-400 font-light">
            Syncore brings real-time music queues, synchronized video playback,
            live room voting, and personal watch histories into one seamless shared space.
          </p>

          <div className="pt-2">
            <Link
              href={sessionUser ? "/dashboard" : "/login"}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-medium text-neutral-950 transition-all hover:bg-neutral-200 shadow-md"
            >
              {sessionUser ? "Open Dashboard" : "Get Started Free"}
            </Link>
          </div>

          <p className="pt-3 text-xs font-light text-neutral-500">
            &copy; {new Date().getFullYear()} Syncore. All rights reserved.
          </p>
        </div>

        {/* Right Navigation Links Columns */}
        <div className="lg:col-span-6 grid grid-cols-3 gap-6 sm:gap-8 text-left">
          {/* Column 1: Menu */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-200">
              Menu
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-neutral-400 font-light">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href={sessionUser ? "/dashboard" : "/login"}
                  className="hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Product */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-200">
              Product
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-neutral-400 font-light">
              <li>
                <span className="text-neutral-400">Live Queues</span>
              </li>
              <li>
                <span className="text-neutral-400">Instant Rooms</span>
              </li>
              <li>
                <span className="text-neutral-400">Room Voting</span>
              </li>
              <li>
                <span className="text-neutral-400">Watch History</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Community */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-200">
              Connect
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-neutral-400 font-light">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Discord
                </a>
              </li>
              <li>
                <span className="text-neutral-400">Privacy</span>
              </li>
              <li>
                <span className="text-neutral-400">Terms</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Giant Typography Watermark across the bottom */}
      <div className="relative z-10 w-full overflow-hidden select-none pointer-events-none flex justify-center items-end leading-none">
        <span className="text-[18vw] sm:text-[16vw] font-semibold tracking-tighter text-white/12 -mb-[4vw] sm:-mb-[3vw]">
          Syncore
        </span>
      </div>
    </footer>
  );
}
