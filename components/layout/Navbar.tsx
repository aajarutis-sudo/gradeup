"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useAuth } from "@clerk/nextjs";
import Container from "@/components/ui/Container";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import CommandPalette from "@/components/CommandPalette";

const items = [
  { href: "/subjects", label: "Subjects" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/plans", label: "Plans" },
  { href: "/schedule", label: "Schedule" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_88%,transparent)] backdrop-blur-xl">
      <Container className="flex items-center justify-between py-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-2 md:flex">
            {items.map((item) => {
              const href =
                userId || item.href === "/plans"
                  ? item.href
                  : `/sign-in?redirect_url=${encodeURIComponent(item.href)}`;

              return (
                <Link
                  key={item.href}
                  href={href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${pathname.startsWith(item.href)
                    ? "bg-[var(--primary)] text-white"
                    : "text-muted hover:bg-[var(--background-elevated)] hover:text-[var(--foreground)]"
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <CommandPalette />
          <ThemeToggle />
          {userId ? (
            <UserButton />
          ) : (
            <Link href="/sign-in?redirect_url=/onboarding" className="inline-flex rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white">
              Get Started
            </Link>
          )}
        </div>
      </Container>
    </header>
  );
}
