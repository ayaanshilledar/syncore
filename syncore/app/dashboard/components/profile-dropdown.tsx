"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";

export interface UserProfile {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface ProfileDropdownProps {
  user: UserProfile;
}

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 p-1 pr-2.5 transition hover:border-neutral-700 hover:bg-neutral-800/80 cursor-pointer"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || "User Avatar"}
            width={28}
            height={28}
            className="h-7 w-7 rounded-full border border-neutral-700 object-cover"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800 text-xs font-semibold text-neutral-200">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
        )}
        <span className="hidden text-xs font-medium text-neutral-300 sm:inline-block max-w-[120px] truncate">
          {user.name || user.email}
        </span>
        <svg
          className={`h-3.5 w-3.5 text-neutral-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-neutral-800 bg-neutral-900/95 p-2 shadow-2xl backdrop-blur-md z-50">
          <div className="flex items-center gap-3 border-b border-neutral-800 px-2.5 py-2.5 mb-1.5">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full border border-neutral-700 object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 text-xs font-semibold text-neutral-200">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-neutral-200">
                {user.name || "User"}
              </p>
              <p className="truncate text-[11px] text-neutral-400">
                {user.email || ""}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white cursor-pointer"
            >
              <svg
                className="h-4 w-4 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile
            </button>

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
            >
              <svg
                className="h-4 w-4 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
