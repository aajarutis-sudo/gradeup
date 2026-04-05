"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview", hint: "Your main hub" },
  { href: "/subjects", label: "Subjects", hint: "Browse every GCSE course" },
  { href: "/chat", label: "AI Coach", hint: "Premium AI study help" },
  { href: "/continue", label: "Resume", hint: "Jump back in quickly" },
  { href: "/schedule", label: "Schedule", hint: "Planned weekly sessions" },
  { href: "/streak", label: "Streaks & XP", hint: "Track momentum" },
  { href: "/plans", label: "Plans", hint: "Free vs Plus access" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="surface-card hidden w-72 rounded-[28px] p-4 xl:block">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">GradeUp</p>
        <h2 className="mt-2 text-xl font-bold">Your revision hub</h2>
        <p className="mt-2 text-sm text-muted">Everything you need to revise without the clutter.</p>
      </div>
      <div className="space-y-3">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-3xl px-4 py-3 transition ${
                active
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[color-mix(in_srgb,var(--background)_84%,var(--accent)_16%)] text-[var(--foreground)] hover:bg-[color-mix(in_srgb,var(--background)_70%,var(--accent)_30%)]"
              }`}
            >
              <p className="font-semibold">{link.label}</p>
              <p className={`mt-1 text-sm ${active ? "text-white/85" : "text-muted"}`}>{link.hint}</p>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
