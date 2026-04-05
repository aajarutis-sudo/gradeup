"use client";

import { useMemo, useState, useTransition } from "react";
import Button from "@/components/ui/Button";

type PracticeQuestion = {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
};

type PracticeFeedback = {
  question: string;
  correctAnswer: string;
  studentAnswer: string;
  explanation: string;
};

export default function AIPracticeQuestionsClient({
  topicSlug,
  topicTitle,
  subjectName,
  level,
  examBoard,
  summary,
  subtopics,
}: {
  topicSlug: string;
  topicTitle: string;
  subjectName: string;
  level: number;
  examBoard?: string | null;
  summary?: string | null;
  subtopics: string[];
}) {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [feedback, setFeedback] = useState<PracticeFeedback[]>([]);
  const [isPending, startTransition] = useTransition();

  const score = useMemo(() => {
    return questions.reduce((total, question, index) => {
      return total + (answers[index] === question.correctIndex ? 1 : 0);
    }, 0);
  }, [answers, questions]);

  const allAnswered = questions.length > 0 && questions.every((_, index) => typeof answers[index] === "number");

  const generateQuestions = () => {
    setError(null);
    setSubmitted(false);
    setSaved(false);
    setFeedback([]);
    setAnswers({});

    startTransition(async () => {
      const response = await fetch("/api/ai/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicTitle,
          subject: subjectName,
          level,
          examBoard,
          summary,
          subtopics,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        result?: { questions?: PracticeQuestion[] };
      };

      if (!response.ok || !payload.result?.questions) {
        setError(payload.error ?? "Could not generate practice questions right now.");
        return;
      }

      setQuestions(payload.result.questions);
    });
  };

  const submitPractice = () => {
    if (!allAnswered) return;
    setSubmitted(true);

    startTransition(async () => {
      const completion = Math.max(25, Math.round((score / Math.max(1, questions.length)) * 100));

      const response = await fetch("/api/progress/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicSlug,
          completed: completion,
          score: Math.round((score / Math.max(1, questions.length)) * 100),
          activity: "ai-practice",
        }),
      });

      if (response.ok) {
        setSaved(true);
      }

      const explainResponse = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions: questions.map((question) => ({
            question: question.question,
            correctAnswer: question.options[question.correctIndex],
          })),
          answers: questions.map((question, index) => ({
            question: question.question,
            studentAnswer: typeof answers[index] === "number" ? question.options[answers[index]] : "",
          })),
        }),
      });

      if (explainResponse.ok) {
        const explainPayload = (await explainResponse.json()) as {
          result?: { feedback?: PracticeFeedback[] };
        };

        if (explainPayload.result?.feedback) {
          setFeedback(explainPayload.result.feedback);
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-[28px] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent)]">AI Practice</p>
            <h1 className="mt-2 text-3xl font-semibold">{topicTitle}</h1>
            <p className="mt-2 text-muted">
              Fresh GCSE-style practice questions for quick retrieval, confidence building, and spaced revision.
            </p>
          </div>
          <Button onClick={generateQuestions} disabled={isPending}>
            {isPending && questions.length === 0 ? "Generating..." : questions.length ? "Regenerate set" : "Generate questions"}
          </Button>
        </div>
      </div>

      {error ? <div className="rounded-[24px] border border-[var(--danger)]/30 bg-[var(--background)] p-4 text-sm text-[var(--danger)]">{error}</div> : null}

      {questions.length ? (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={`${question.question}-${index}`} className="glass-panel rounded-[28px] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Practice question {index + 1}</p>
              <h2 className="mt-2 text-xl font-semibold">{question.question}</h2>
              <div className="mt-4 grid gap-3">
                {question.options.map((option, optionIndex) => {
                  const active = answers[index] === optionIndex;
                  const revealCorrect = submitted && optionIndex === question.correctIndex;
                  const revealWrong = submitted && active && optionIndex !== question.correctIndex;

                  return (
                    <button
                      key={`${option}-${optionIndex}`}
                      type="button"
                      onClick={() => setAnswers((current) => ({ ...current, [index]: optionIndex }))}
                      disabled={submitted}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        revealCorrect
                          ? "border-transparent bg-[var(--success)] text-white"
                          : revealWrong
                            ? "border-transparent bg-[var(--danger)] text-white"
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
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] bg-[var(--background)] p-6 text-sm text-muted">
          Generate a set when you want a quick round of extra practice without leaving the topic.
        </div>
      )}

      <div className="glass-panel rounded-[28px] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold">
              {submitted ? `You got ${score}/${questions.length} correct` : "Finish the set in one focused burst"}
            </p>
            <p className="text-sm text-muted">
              {saved
                ? "Your topic progress, XP, and streak have been updated."
                : "Short AI sets work best when you treat them like a quick checkpoint, not a long study session."}
            </p>
          </div>
          <Button onClick={submitPractice} disabled={!allAnswered || submitted || isPending || !questions.length}>
            {isPending && submitted ? "Saving..." : submitted ? "Completed" : "Submit practice"}
          </Button>
        </div>
      </div>

      {submitted && feedback.length ? (
        <div className="space-y-4">
          {feedback.map((item, index) => (
            <div key={`${item.question}-${index}`} className="rounded-[28px] bg-[var(--background)] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">AI feedback</p>
              <h3 className="mt-2 text-lg font-bold">{item.question}</h3>
              <p className="mt-3 text-sm text-muted">
                <span className="font-semibold text-[var(--foreground)]">Correct answer:</span> {item.correctAnswer}
              </p>
              <p className="mt-1 text-sm text-muted">
                <span className="font-semibold text-[var(--foreground)]">Your answer:</span> {item.studentAnswer || "No answer"}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">{item.explanation}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
