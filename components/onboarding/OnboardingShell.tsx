import Link from "next/link";
import type { ReactNode } from "react";

const steps = [
  { href: "/onboarding", label: "Welcome", step: 0 },
  { href: "/onboarding/subjects", label: "Choose subject", step: 1 },
  { href: "/onboarding/quiz", label: "Diagnostic quiz", step: 2 },
  { href: "/onboarding/results", label: "Results", step: 3 },
];

export default function OnboardingShell({
  currentStep,
  children,
}: {
  currentStep: number;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="surface-card animate-fade-up rounded-[30px] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--primary)]">Onboarding</p>
        <h2 className="mt-3 text-2xl font-bold">Build your revision path</h2>
        <p className="mt-2 text-sm text-muted">
          Move through each step once, then your dashboard takes over.
        </p>

        <div className="mt-6 space-y-3">
          {steps.map((item, index) => {
            const active = index === currentStep;
            const completed = index < currentStep;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`block rounded-[22px] px-4 py-4 transition ${
                  active
                    ? "bg-[var(--primary)] text-white"
                    : completed
                      ? "bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--foreground)]"
                      : "bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--background-elevated)]"
                }`}
              >
                <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${active ? "text-white/85" : "text-muted"}`}>
                  Step {item.step + 1}
                </p>
                <p className="mt-1 font-semibold">{item.label}</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 rounded-[22px] bg-[var(--background)] p-4 text-sm text-muted">
          Finish onboarding on the results step, then jump straight into your dashboard, timetable, and AI Coach.
        </div>
      </aside>

      <div className="min-w-0 space-y-6">{children}</div>
    </div>
  );
}
