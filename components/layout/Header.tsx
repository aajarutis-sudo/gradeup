"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useAuth } from "@clerk/nextjs";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/subjects", label: "Subjects" },
  { href: "/chat", label: "AI Coach" },
  { href: "/onboarding", label: "Onboarding" },
  { href: "/schedule", label: "Schedule" },
  { href: "/streak", label: "Streak" },
  { href: "/plans", label: "Plans" },
];

export default function Header() {
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <header className="glass-panel sticky top-4 z-30 rounded-[28px] px-5 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden flex-wrap gap-2 lg:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--background-elevated)] text-muted hover:text-[var(--foreground)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
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
