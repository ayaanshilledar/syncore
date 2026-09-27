import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen w-full bg-neutral-950 text-neutral-100 selection:bg-neutral-800 font-normal">
      {/* Left Column: Clean Authentication Form */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-12 lg:w-1/2 lg:flex-initial">
        {/* Top: Logo & Back Link */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-base font-medium tracking-tight text-neutral-100 hover:text-white transition">
            Syncore
          </Link>
          <Link
            href="/"
            className="text-xs text-neutral-400 hover:text-neutral-200 transition"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Center: Sign in content */}
        <div className="mx-auto w-full max-w-sm py-12">
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-light tracking-tight sm:text-3xl text-neutral-100">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm font-light text-neutral-400 leading-relaxed">
              Sign in to collaborate, join 4-digit live rooms, and stream together.
            </p>
          </div>

          <div className="space-y-4">
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/dashboard" });
              }}
            >
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-full bg-white px-5 py-3 text-xs font-medium text-neutral-950 transition hover:bg-neutral-200 shadow-sm cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-[11px] font-light text-neutral-500 leading-relaxed">
            By continuing, you agree to Syncore&apos;s Terms of Service and Privacy Policy.
          </p>
        </div>

        {/* Bottom: Minimal Footer */}
        <div className="text-xs font-light text-neutral-600">
          &copy; {new Date().getFullYear()} Syncore
        </div>
      </div>

      {/* Right Column: Visual Product Preview (Desktop) */}
      <div className="hidden lg:flex lg:flex-1 relative bg-neutral-900/40 border-l border-neutral-800/80 p-12 items-center justify-center overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-xl">
          <div className="relative aspect-[16/10] w-full rounded-2xl border border-neutral-800/80 bg-neutral-950/80 shadow-2xl shadow-black/80 overflow-hidden">
            <Image
              src="/image.png"
              alt="Syncore Preview"
              fill
              priority
              className="object-cover object-top"
            />
          </div>

          <div className="mt-6 flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-light text-neutral-400">Live Collaboration Space</span>
            </div>
            <span className="text-xs font-mono text-neutral-500">Syncore v0.1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
