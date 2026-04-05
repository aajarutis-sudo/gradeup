import Link from "next/link";

export default function FeatureLockCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="surface-card rounded-[30px] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">Plus feature</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{description}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[24px] bg-[var(--background)] p-4">
          <p className="font-semibold">Free still includes</p>
          <p className="mt-2 text-sm text-muted">Subjects, quizzes, flashcards, revision timetable, and past paper browsing.</p>
        </div>
        <div className="rounded-[24px] bg-[var(--background)] p-4">
          <p className="font-semibold">Plus unlocks</p>
          <p className="mt-2 text-sm text-muted">AI Coach, AI notes, AI practice questions, and deeper personalised help.</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/plans" className="inline-flex rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white">
          View plans
        </Link>
        <Link href="/subjects" className="inline-flex rounded-full bg-[var(--background)] px-6 py-3 text-sm font-semibold">
          Back to subjects
        </Link>
      </div>
    </div>
  );
}
