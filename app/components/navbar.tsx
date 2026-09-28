"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (isHome) {
        const sections = ["faq", "features"];
        const scrollPosition = window.scrollY + 200;

        for (const sectionId of sections) {
          const el = document.getElementById(sectionId);
          if (el && scrollPosition >= el.offsetTop) {
            setActiveSection(sectionId);
            return;
          }
        }
        setActiveSection("");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const navLinks = [
    { label: "About", href: "/about", active: pathname === "/about" },
    { label: "Features", href: isHome ? "#features" : "/#features", active: activeSection === "features" },
    { label: "FAQ", href: isHome ? "#faq" : "/#faq", active: activeSection === "faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-500 ease-out ${
        isScrolled ? "py-3 sm:py-4 px-4" : "py-4 sm:py-6 px-4 sm:px-12"
      }`}
    >
      <nav
        className={`pointer-events-auto flex items-center justify-between transition-all duration-500 ease-out ${
          isScrolled
            ? "w-full max-w-xl rounded-full bg-neutral-900/70 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] px-3.5 sm:px-5 py-2"
            : "w-full max-w-7xl bg-transparent border border-transparent px-2 sm:px-4 py-1"
        }`}
      >
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <Image
            src="/Logo.png"
            alt="Syncore Logo"
            width={24}
            height={24}
            className="h-6 w-6 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-sm font-medium tracking-tight text-neutral-100">
            Syncore
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-1.5">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`relative px-2.5 sm:px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
                link.active
                  ? "text-white"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {link.active && (
                <motion.span
                  layoutId="active-nav-pill"
                  className="absolute inset-0 rounded-full bg-white/10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-white px-3.5 sm:px-4 py-1.5 text-xs font-medium text-neutral-950 transition-all hover:bg-neutral-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] shadow-sm"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="group relative inline-flex items-center justify-center rounded-full bg-white px-3.5 sm:px-4 py-1.5 text-xs font-medium text-neutral-950 transition-all hover:bg-neutral-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] shadow-sm"
            >
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
