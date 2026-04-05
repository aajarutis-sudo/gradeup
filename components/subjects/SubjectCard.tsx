import Link from "next/link";
import ProgressBar from "@/components/ui/ProgressBar";

export default function SubjectCard({
  slug,
  name,
  description,
  color,
  examBoard,
  topicCount,
  completion,
}: {
  slug: string;
  name: string;
  description: string;
  color?: string | null;
  examBoard?: string | null;
  topicCount: number;
  completion: number;
}) {
  return (
    <Link
      href={`/subjects/${slug}`}
      className="glass-panel animate-fade-up group rounded-[30px] p-5 transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div
        className="mb-5 h-20 rounded-[22px]"
        style={{
          background: color
            ? `linear-gradient(135deg, ${color}, rgba(255,255,255,0.18))`
            : "linear-gradient(135deg, var(--accent), rgba(255,255,255,0.16))",
        }}
      />
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">{name}</h2>
            {examBoard ? <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">{examBoard}</p> : null}
            <p className="mt-1 text-sm text-muted">{description}</p>
          </div>
          <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold">
            {topicCount} topics
          </span>
        </div>
        <ProgressBar value={completion} label="Overall completion" />
        <div className="flex justify-end pt-1 text-sm">
          <span className="rounded-full bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] px-4 py-2 font-semibold text-[var(--primary)] transition group-hover:bg-[color-mix(in_srgb,var(--primary)_18%,transparent)]">
            Start revising →
          </span>
        </div>
      </div>
    </Link>
  );
}
