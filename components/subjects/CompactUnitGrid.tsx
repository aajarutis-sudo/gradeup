import Link from "next/link";

type CompactUnit = {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
  subtopics: Array<{
    id: string;
    title: string;
  }>;
  lessonTitle?: string | null;
};

function buildDots(count: number) {
  const total = Math.max(6, Math.min(20, count * 2));
  return Array.from({ length: total }, (_, index) => index);
}

export default function CompactUnitGrid({
  units,
  examBoard,
}: {
  units: CompactUnit[];
  examBoard?: string | null;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">
            {examBoard ?? "GCSE"} course map
          </p>
          <h2 className="mt-2 text-2xl font-bold">Units at a glance</h2>
          <p className="mt-2 text-sm text-muted">
            Open any unit for full notes, quizzes, flashcards, and subtopic revision without the page turning into one massive list.
          </p>
        </div>
        <div className="rounded-full bg-[var(--background)] px-4 py-2 text-sm font-semibold">
          {units.length} units
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {units.map((unit, index) => {
          const dots = buildDots(unit.subtopics.length);

          return (
            <Link
              key={unit.id}
              href={`/topics/${unit.slug}`}
              className="group relative overflow-hidden rounded-[28px] bg-[var(--background)] p-5 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">
                    Unit {index + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-bold leading-6">{unit.title}</h3>
                </div>
                <div className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold">
                  {unit.subtopics.length}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-5 gap-2">
                {dots.map((dot) => {
                  const active = dot < unit.subtopics.length;
                  return (
                    <span
                      key={`${unit.id}-${dot}`}
                      className={`h-6 rounded-[10px] transition ${
                        active
                          ? "border border-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] group-hover:bg-[color-mix(in_srgb,var(--primary)_22%,transparent)]"
                          : "bg-[var(--background-elevated)]"
                      }`}
                    />
                  );
                })}
              </div>

              <div className="mt-5 rounded-[22px] bg-[var(--background-elevated)] p-4">
                <p className="text-sm font-semibold">{unit.lessonTitle ?? `Lesson notes for ${unit.title}`}</p>
                <p className="mt-2 line-clamp-3 text-sm text-muted">
                  {unit.summary ?? "Board-specific revision notes and practice live inside this unit."}
                </p>
              </div>

              {unit.subtopics.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {unit.subtopics.slice(0, 2).map((subtopic) => (
                    <span key={subtopic.id} className="rounded-full bg-[var(--surface-strong)] px-3 py-1 text-xs text-muted">
                      {subtopic.title}
                    </span>
                  ))}
                  {unit.subtopics.length > 2 ? (
                    <span className="rounded-full bg-[var(--surface-strong)] px-3 py-1 text-xs text-muted">
                      +{unit.subtopics.length - 2} more
                    </span>
                  ) : null}
                </div>
              ) : null}

              <div className="pointer-events-none absolute inset-x-5 bottom-5 translate-y-6 rounded-[22px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_92%,transparent)] p-4 opacity-0 shadow-2xl transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-sm font-semibold">{unit.title}</p>
                <p className="mt-2 text-sm text-muted">
                  {unit.summary ?? "Open this unit for notes, flashcards, quiz practice, and full topic navigation."}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                  <span>Open unit</span>
                  <span aria-hidden="true">→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
