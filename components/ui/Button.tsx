"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
};

const variantClasses = {
  primary: "bg-[var(--primary)] text-white hover:bg-[var(--secondary)]",
  secondary: "bg-[color-mix(in_srgb,var(--accent)_30%,transparent)] text-[var(--primary)] hover:bg-[color-mix(in_srgb,var(--accent)_45%,transparent)]",
  ghost: "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--background-elevated)]",
};

export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
