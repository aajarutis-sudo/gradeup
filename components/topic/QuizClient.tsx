"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import Button from "@/components/ui/Button";

type QuizQuestion = {
  id: string;
  prompt: string;
  correctAnswer: string;
  explanation: string | null;
  options: string[];
};

export default function QuizClient({
  topicSlug,
  topicTitle,
  questions,
}: {
  topicSlug: string;
  topicTitle: string;
  questions: QuizQuestion[];
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const score = useMemo(() => {
    return questions.reduce((total, question) => {
      return total + (answers[question.id] === question.correctAnswer ? 1 : 0);
    }, 0);
  }, [answers, questions]);

  const allAnswered = questions.every((question) => Boolean(answers[question.id]));
  const incorrectCount = questions.length - score;
  const scorePercent = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const nextStepLabel =
    scorePercent >= 80
      ? "Strong run. Lock it in with a second pass or move into practice questions."
      : scorePercent >= 50
        ? "Solid start. Flashcards and one more quiz pass should tighten the weaker gaps."
        : "Use the flashcards first, then come back for another quiz attempt while the topic is still fresh.";

  const submitQuiz = () => {
    if (!allAnswered) return;
    setSubmitted(true);

    startTransition(async () => {
      const payload = {
        topicSlug,
        score,
        totalQuestions: questions.length,
        answers: questions.map((question) => ({
          questionId: question.id,
          selected: answers[question.id],
        })),
      };

      const response = await fetch("/api/quiz/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSaved(true);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-[28px] p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent)]">Quiz Mode</p>
        <h1 className="mt-2 text-3xl font-semibold">{topicTitle}</h1>
        <p className="mt-2 text-muted">
          Answer every question, then submit to update your progress and streak.
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => {
          const selected = answers[question.id];
          const isCorrect = submitted && selected === question.correctAnswer;

          return (
            <div key={question.id} className="glass-panel rounded-[28px] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                Question {index + 1}
              </p>
              <h2 className="mt-2 text-xl font-semibold">{question.prompt}</h2>
              <div className="mt-4 grid gap-3">
                {question.options.map((option) => {
                  const active = selected === option;
                  const revealCorrect = submitted && option === question.correctAnswer;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setAnswers((current) => ({ ...current, [question.id]: option }))
                      }
                      disabled={submitted}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        revealCorrect
                          ? "border-transparent bg-[var(--success)] text-white"
                          : active
                            ? "border-transparent bg-[var(--accent)] text-white"
                            : "border-[var(--border)] bg-[var(--surface-strong)]"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {submitted ? (
                <p className={`mt-4 text-sm ${isCorrect ? "text-[var(--success)]" : "text-muted"}`}>
                  {isCorrect ? "Correct." : `Answer: ${question.correctAnswer}.`}{" "}
                  {question.explanation ?? ""}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="glass-panel rounded-[28px] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold">
              {submitted ? `You scored ${score}/${questions.length}` : "Ready to submit?"}
            </p>
            <p className="text-sm text-muted">
              {saved
                ? "Your score has been saved and your study streak has been logged."
                : "Your best next move is finishing this set in one focused burst."}
            </p>
          </div>
          <Button onClick={submitQuiz} disabled={!allAnswered || submitted || isPending}>
            {isPending ? "Saving..." : submitted ? "Completed" : "Submit Quiz"}
          </Button>
        </div>

        {submitted ? (
          <div className="mt-5 space-y-4 rounded-[24px] bg-[var(--background)] p-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[20px] bg-[var(--surface-strong)] p-4">
                <p className="text-sm text-muted">Score</p>
                <p className="mt-2 text-2xl font-bold">{scorePercent}%</p>
              </div>
              <div className="rounded-[20px] bg-[var(--surface-strong)] p-4">
                <p className="text-sm text-muted">Correct</p>
                <p className="mt-2 text-2xl font-bold">{score}</p>
              </div>
              <div className="rounded-[20px] bg-[var(--surface-strong)] p-4">
                <p className="text-sm text-muted">To review</p>
                <p className="mt-2 text-2xl font-bold">{incorrectCount}</p>
              </div>
            </div>
            <div className="rounded-[20px] bg-[var(--surface-strong)] p-4">
              <p className="text-sm font-semibold">What to do next</p>
              <p className="mt-2 text-sm text-muted">{nextStepLabel}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/topics/${topicSlug}/flashcards`}
                className="inline-flex rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white"
              >
                Review flashcards
              </Link>
              <Link
                href={`/topics/${topicSlug}/practice`}
                className="inline-flex rounded-full bg-[var(--surface-strong)] px-4 py-2 text-sm font-semibold"
              >
                Practice questions
              </Link>
              <Link
                href={`/topics/${topicSlug}`}
                className="inline-flex rounded-full bg-[var(--surface-strong)] px-4 py-2 text-sm font-semibold"
              >
                Back to topic
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
