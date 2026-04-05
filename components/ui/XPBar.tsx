import ProgressBar from "@/components/ui/ProgressBar";
import { calculateXpForLevel } from "@/lib/rpgSystem";

export default function XPBar({
  xp,
  level,
}: {
  xp: number;
  level: number;
}) {
  const previousThreshold = level <= 1 ? 0 : Array.from({ length: level - 1 }, (_, index) => calculateXpForLevel(index + 1)).reduce((sum, value) => sum + value, 0);
  const nextThreshold = calculateXpForLevel(level);
  const progress = Math.max(0, xp - previousThreshold);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">XP progress</span>
        <span className="text-muted">Level {level}</span>
      </div>
      <ProgressBar value={Math.min(100, Math.round((progress / nextThreshold) * 100))} />
      <p className="text-sm text-muted">
        {progress}/{nextThreshold} XP to the next level.
      </p>
    </div>
  );
}
