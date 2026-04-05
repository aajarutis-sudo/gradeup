export default function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-[var(--accent-soft)]/70 ${className}`}
    />
  );
}
