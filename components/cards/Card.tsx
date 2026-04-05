import type { ReactNode } from "react";

export default function Card({
  title,
  children,
  subtitle,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  subtitle?: string;
  className?: string;
}) {
  return (
    <section className={`surface-card rounded-[28px] p-6 animate-fade-up ${className}`}>
      {title ? (
        <div className="mb-4 space-y-1">
          <h3 className="text-xl font-bold tracking-tight">{title}</h3>
          {subtitle ? <p className="text-sm text-muted">{subtitle}</p> : null}
        </div>
      ) : null}
      <div>{children}</div>
    </section>
  );
}
