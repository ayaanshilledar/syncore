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
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-12 lg:w-[40%] xl:w-[36%] lg:flex-initial min-h-screen lg:h-screen overflow-y-auto">
        {/* Top: Brand & Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-medium tracking-tight text-neutral-100 hover:text-white transition"
          >
            <Image
              src="/Logo.png"
              alt="Syncore Logo"
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
            <span>Syncore</span>
          </Link>
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 rounded-full border border-neutral-800/80 bg-neutral-900/60 px-3.5 py-1.5 text-xs font-medium text-neutral-300 backdrop-blur-md transition-all hover:border-neutral-700 hover:bg-neutral-800/70 hover:text-white active:scale-[0.98] shadow-sm"
          >
            <svg
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Center: Sign in content */}
        <div className="mx-auto w-full max-w-xs py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-100">
              Sign In
            </h1>
          </div>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-full bg-white py-2.5 px-4 text-xs font-medium text-neutral-950 transition-all hover:bg-neutral-200 shadow-sm cursor-pointer active:scale-[0.99]"
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
          <p className="mt-6 text-center text-[11px] font-light text-neutral-500 leading-relaxed">
            By signing in, you agree to our Terms of Service &amp; Privacy Policy.
          </p>
        </div>

        {/* Bottom Spacer */}
        <div aria-hidden="true" />
      </div>

      {/* Right Column: Visual Image with Padding & Rounded Corners (Desktop) */}
      <div className="hidden lg:flex lg:w-[60%] xl:w-[64%] p-3 sm:p-4 lg:p-4 h-screen">
        <div className="relative h-full w-full rounded-2xl sm:rounded-3xl border border-neutral-800/80 overflow-hidden bg-neutral-900/40 shadow-2xl">
          <Image
            src="/footer.jpg"
            alt="Syncore Landscape Backdrop"
            fill
            priority
            className="object-cover object-center rounded-2xl sm:rounded-3xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/20" />

          {/* Bottom Blended Watermark Typography & Logo */}
          <div className="absolute inset-x-0 bottom-0 z-10 w-full flex items-center justify-center gap-3 sm:gap-4 overflow-hidden pb-4 select-none pointer-events-none mix-blend-overlay -mb-3 lg:-mb-5">
            <Image
              src="/Logo.png"
              alt="Syncore Logo"
              width={64}
              height={64}
              className="h-[6vw] w-[6vw] max-h-16 max-w-16 object-contain opacity-25"
            />
            <span className="text-[12vw] lg:text-[7vw] font-bold tracking-tighter text-white/20 leading-none">
              Syncore
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
