export default function ProgressBar({
  value,
  label,
}: {
  value: number;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div className="space-y-2">
      {label ? (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">{label}</span>
          <span className="font-semibold">{pct}%</span>
        </div>
      ) : null}
      <div className="h-3 w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--accent)_25%,transparent)]">
        <div
          style={{ width: `${pct}%` }}
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--primary),var(--secondary),var(--accent))] transition-all duration-500"
        />
      </div>
    </div>
  );
}
