"use client";

import { useMemo, useState, useTransition } from "react";
import Button from "@/components/ui/Button";

type SubjectOption = {
  slug: string;
  name: string;
  predictedGrade: number;
  weakTopics: string[];
  strongTopics: string[];
};

type GeneratedPlan = {
  days: Array<{
    day: string;
    tasks: Array<{
      type: "flashcards" | "quiz" | "revision";
      topic: string;
      duration: number;
    }>;
  }>;
};

export default function RevisionTimetableGenerator({
  subjects,
  xp,
  level,
  streak,
}: {
  subjects: SubjectOption[];
  xp: number;
  level: number;
  streak: number;
}) {
  const [selectedSlug, setSelectedSlug] = useState(subjects[0]?.slug ?? "");
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedSubject = useMemo(
    () => subjects.find((subject) => subject.slug === selectedSlug) ?? subjects[0],
    [selectedSlug, subjects]
  );

  const generatePlan = () => {
    if (!selectedSubject) return;

    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/ai/revision-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubject.name,
          grade: selectedSubject.predictedGrade,
          weakTopics: selectedSubject.weakTopics,
          strongTopics: selectedSubject.strongTopics,
          xp,
          level,
          streak,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        result?: GeneratedPlan;
      };

      if (!response.ok || !payload.result) {
        setError(payload.error ?? "Could not generate a timetable right now.");
        return;
      }

      setPlan(payload.result);
    });
  };

  if (!subjects.length) {
    return (
      <div className="rounded-[24px] bg-[var(--background)] p-5 text-sm text-muted">
        Finish a diagnostic quiz first and your AI timetable generator will have enough data to personalise your week.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <label className="flex-1 space-y-2">
          <span className="text-sm font-semibold text-muted">Choose a subject</span>
          <select
            value={selectedSlug}
            onChange={(event) => setSelectedSlug(event.target.value)}
            className="w-full rounded-[20px] border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none"
          >
            {subjects.map((subject) => (
              <option key={subject.slug} value={subject.slug}>
                {subject.name}
              </option>
            ))}
          </select>
        </label>
        <Button onClick={generatePlan} disabled={isPending}>
          {isPending ? "Generating..." : "Generate timetable"}
        </Button>
      </div>

      <div className="rounded-[24px] bg-[var(--background)] p-5 text-sm text-muted">
        Sessions are designed to stay realistic: mostly 20-35 minutes per block, with a 10-15 minute break after each focused study burst.
      </div>

      {error ? <div className="rounded-[24px] border border-[var(--danger)]/30 bg-[var(--background)] p-4 text-sm text-[var(--danger)]">{error}</div> : null}

      {plan ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {plan.days.map((day) => (
            <div key={day.day} className="rounded-[24px] bg-[var(--background)] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{day.day}</p>
              <div className="mt-4 space-y-3">
                {day.tasks.map((task, index) => (
                  <div key={`${day.day}-${task.topic}-${index}`} className="rounded-[18px] bg-[var(--surface-strong)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold capitalize">{task.type}</p>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{task.duration} min</span>
                    </div>
                    <p className="mt-2 text-sm text-muted">{task.topic}</p>
                    <p className="mt-3 text-xs text-muted">Break after this block: {task.duration >= 30 ? 15 : 10} min</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
