"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

type DiagnosticQuestion = {
  id: string;
  prompt: string;
  marks: number;
  difficulty: number;
  examBoard: string;
  year: number;
  sampleAnswer: string;
};

export default function DiagnosticQuizClient({
  subjectSlug,
  subjectName,
  quizNumber,
  totalSubjects,
  nextSubjectSlug,
  questions,
}: {
  subjectSlug: string;
  subjectName: string;
  quizNumber: number;
  totalSubjects: number;
  nextSubjectSlug?: string;
  questions: DiagnosticQuestion[];
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const ready = questions.every((question) => answers[question.id]?.trim());
  const answeredCount = questions.filter((question) => answers[question.id]?.trim().length).length;

  const submit = () => {
    if (!ready) return;
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/onboarding/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectSlug,
          answers: questions.map((question) => ({
            questionId: question.id,
            selected: answers[question.id],
          })),
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error ?? "We could not save this quiz yet. Try again in a moment.");
        return;
      }

      const destination = nextSubjectSlug
        ? `/onboarding/quiz?subject=${nextSubjectSlug}`
        : `/onboarding/results?subject=${subjectSlug}`;

      router.push(destination);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="surface-card rounded-[30px] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">Quiz {quizNumber} of {totalSubjects}</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{subjectName}</h1>
            <p className="mt-2 text-muted">Answer these questions honestly. We'll use them to shape your first revision plan.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[var(--background)] px-4 py-2">
            <div className="h-2 w-24 rounded-full bg-[var(--border)]">
              <div
                className="h-full rounded-full bg-[var(--primary)] transition-all"
                style={{ width: `${(quizNumber / totalSubjects) * 100}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-muted">{quizNumber}/{totalSubjects}</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted">
          <span>Total marks: {questions.reduce((sum, q) => sum + q.marks, 0)}</span>
          <span>Answers completed: {answeredCount}/{questions.length}</span>
        </div>
      </div>

      {questions.map((question, index) => (
        <div key={question.id} className="surface-card rounded-[30px] p-6 transition-all">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                Question {index + 1} • {question.marks} marks • {question.examBoard} {question.year}
              </p>
              <h2 className="mt-2 text-lg font-bold">{question.prompt}</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[var(--background)] px-3 py-1">
              <span className="text-xs font-semibold text-muted">Marks: {question.marks}</span>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            {(() => {
              const answerValue = answers[question.id] ?? "";
              const recommendedLength = Math.max(40, question.marks * 35);

              return (
                <>
            <textarea
              value={answerValue}
              onChange={(e) =>
                setAnswers((current) => ({
                  ...current,
                  [question.id]: e.target.value,
                }))
              }
              placeholder="Write your answer here..."
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              rows={Math.ceil(question.marks / 2)}
            />
            <p className="text-xs text-muted">
              {answerValue.length} characters written • aim for roughly {recommendedLength}+ for a fuller answer
            </p>
                </>
              );
            })()}
          </div>
        </div>
      ))}

      {error ? (
        <div className="rounded-[24px] border border-[var(--danger)]/30 bg-[var(--background)] p-4 text-sm text-[var(--danger)]">
          {error}
        </div>
      ) : null}

      <div className="flex justify-end">
        <Button
          onClick={submit}
          disabled={!ready || isPending}
        >
          {isPending ? "Calculating..." : nextSubjectSlug ? `Next: ${nextSubjectSlug.replace(/-/g, " ")}` : "See my results"}
        </Button>
      </div>
    </div>
  );
}
