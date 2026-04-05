import ProgressBar from "@/components/ui/ProgressBar";

export default function XPBar({
  xp,
  level,
  currentXP,
  xpForNextLevel,
}: {
  xp: number;
  level: number;
  currentXP?: number;
  xpForNextLevel?: number;
}) {
  const progress = currentXP ?? xp;
  const nextThreshold = xpForNextLevel ?? 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">XP progress</span>
        <span className="text-muted">Level {level}</span>
      </div>
      <ProgressBar value={Math.min(100, Math.round((progress / nextThreshold) * 100))} />
      <p className="text-sm text-muted">
        {progress}/{nextThreshold} XP toward Level {level + 1}.
      </p>
    </div>
  );
}
