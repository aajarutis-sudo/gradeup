import ProgressBar from "@/components/ui/ProgressBar";

export default function XPBar({
  xp,
  level,
}: {
  xp: number;
  level: number;
}) {
  const progress = xp % 500;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">XP progress</span>
        <span className="text-muted">Level {level}</span>
      </div>
      <ProgressBar value={Math.round((progress / 500) * 100)} />
      <p className="text-sm text-muted">{progress}/500 XP to the next level.</p>
    </div>
  );
}
