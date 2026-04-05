export default function MetricCard({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <div className="glass-panel animate-fade-up rounded-[28px] p-5">
      <p className="text-sm uppercase tracking-[0.22em] text-muted">{label}</p>
      <p className="mt-4 text-4xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-muted">{caption}</p>
    </div>
  );
}
