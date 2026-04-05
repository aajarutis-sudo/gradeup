import type { ReactNode } from "react";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[var(--hero-gradient)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="grid flex-1 gap-8 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <section className="hidden space-y-6 rounded-[36px] border border-[var(--border)] bg-[var(--background-elevated)] p-10 shadow-[var(--shadow)] lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--primary)]">
              GradeUp
            </p>
            <h1 className="text-5xl font-extrabold tracking-tight">
              Smarter GCSE revision starts with one calm first step.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-muted">
              Sign in to unlock personalised diagnostics, predicted grades, adaptive quizzes,
              and a dashboard that shows exactly what to revise next.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Diagnostic quiz built around your starting point",
                "Predicted grade snapshots",
                "Focus topic recommendations",
                "XP, levels, badges, and streaks",
              ].map((item) => (
                <div key={item} className="rounded-3xl bg-[var(--background)] p-4 text-sm font-medium">
                  {item}
                </div>
              ))}
            </div>
          </section>
          <section className="mx-auto flex w-full max-w-md items-center justify-center">
            <div className="w-full">{children}</div>
          </section>
        </div>
      </div>
    </main>
  );
}
