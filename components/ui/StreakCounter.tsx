export default function StreakCounter({
  streak,
}: {
  streak: number;
}) {
  return (
    <div className="surface-card rounded-3xl px-4 py-3">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">Streak</p>
      <p className="mt-1 text-2xl font-extrabold text-[var(--warning)]">{streak} day{streak === 1 ? "" : "s"}</p>
    </div>
  );
}
