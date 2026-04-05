import type { ReactNode } from "react";

export default function PageTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h1 className={`text-4xl font-extrabold tracking-tight sm:text-5xl ${className}`}>{children}</h1>;
}
