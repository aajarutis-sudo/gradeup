import type { ReactNode } from "react";

export default function SubTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`max-w-2xl text-base leading-7 text-muted sm:text-lg ${className}`}>{children}</p>;
}
