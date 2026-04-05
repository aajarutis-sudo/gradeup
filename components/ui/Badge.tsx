import type { ReactNode } from "react";

export default function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  const toneClass =
    tone === "success"
      ? "bg-[color-mix(in_srgb,var(--success)_16%,transparent)] text-[var(--success)]"
      : tone === "warning"
        ? "bg-[color-mix(in_srgb,var(--warning)_18%,transparent)] text-[var(--warning)]"
        : tone === "danger"
          ? "bg-[color-mix(in_srgb,var(--danger)_18%,transparent)] text-[var(--danger)]"
          : "bg-[color-mix(in_srgb,var(--accent)_22%,transparent)] text-[var(--primary)]";

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneClass}`}>{children}</span>;
}
