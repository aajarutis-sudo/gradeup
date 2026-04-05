"use client";

import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function Header() {
  const { userId } = useAuth();

  return (
    <header className="glass-panel sticky top-4 z-30 rounded-[28px] px-5 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-6">
          <Logo />
          <div className="hidden lg:block">
            <p className="text-sm font-semibold">Keep your next revision step visible</p>
            <p className="mt-1 text-sm text-muted">Use the sidebar to move between subjects, schedule, streaks, and AI tools.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href={userId ? "/subjects" : "/sign-in?redirect_url=/subjects"}
            className="rounded-full bg-[var(--background-elevated)] px-4 py-2 text-sm font-semibold text-[var(--foreground)]"
          >
            Subjects
          </Link>
          {userId ? (
            <UserButton />
          ) : (
            <Link href="/sign-in?redirect_url=/onboarding" className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
