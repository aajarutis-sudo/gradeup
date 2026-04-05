"use client";

import { useState, useTransition } from "react";
import Button from "@/components/ui/Button";
import SimpleMarkdown from "@/components/ui/SimpleMarkdown";

type NotesResult = {
  title: string;
  overview: string;
  keyPoints: string[];
  subtopicNotes: Array<{
    subtopic: string;
    notes: string[];
  }>;
  examLinks: string[];
  quickCheck: string[];
};

export default function AILessonNotesClient({
  subjectName,
  examBoard,
  topicTitle,
  summary,
  subtopics,
}: {
  subjectName: string;
  examBoard?: string | null;
  topicTitle: string;
  summary?: string | null;
  subtopics: string[];
}) {
  const [notes, setNotes] = useState<NotesResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const generateNotes = () => {
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/ai/generate-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subjectName,
          topic: topicTitle,
          examBoard,
          summary,
          subtopics,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        result?: NotesResult;
      };

      if (!response.ok || !payload.result) {
        setError(payload.error ?? "Could not generate lesson notes right now.");
        return;
      }

      setNotes(payload.result);
    });
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-[28px] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent)]">AI Notes</p>
            <h1 className="mt-2 text-3xl font-semibold">{topicTitle}</h1>
            <p className="mt-2 text-muted">
              Turn this topic into spec-aligned revision notes you can read before quizzes, flashcards, or exam practice.
            </p>
          </div>
          <Button onClick={generateNotes} disabled={isPending}>
            {isPending ? "Generating..." : notes ? "Refresh notes" : "Generate notes"}
          </Button>
        </div>
      </div>

      {error ? <div className="rounded-[24px] border border-[var(--danger)]/30 bg-[var(--background)] p-4 text-sm text-[var(--danger)]">{error}</div> : null}

      {notes ? (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] bg-[var(--background)] p-6">
              <h2 className="text-2xl font-bold">{notes.title}</h2>
              <SimpleMarkdown className="mt-4" content={notes.overview} />
            </div>

            <div className="rounded-[28px] bg-[var(--background)] p-6">
              <h3 className="text-lg font-bold">Key points</h3>
              <div className="mt-4 grid gap-3">
                {notes.keyPoints.map((point, index) => (
                  <div key={`${point}-${index}`} className="rounded-[20px] bg-[var(--surface-strong)] p-4 text-sm text-muted">
                    <span className="font-semibold text-[var(--foreground)]">{index + 1}. </span>
                    {point}
                  </div>
                ))}
              </div>
            </div>

            {notes.subtopicNotes.length ? (
              <div className="rounded-[28px] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold">Subtopic breakdown</h3>
                <div className="mt-4 space-y-4">
                  {notes.subtopicNotes.map((item, index) => (
                    <div key={`${item.subtopic}-${index}`} className="rounded-[20px] bg-[var(--surface-strong)] p-4">
                      <p className="font-semibold">{item.subtopic}</p>
                      <div className="mt-3 space-y-2">
                        {item.notes.map((note, noteIndex) => (
                          <SimpleMarkdown
                            key={`${note}-${noteIndex}`}
                            content={note}
                            className="text-sm text-muted"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] bg-[var(--background)] p-6">
              <h3 className="text-lg font-bold">Exam links</h3>
              <div className="mt-4 space-y-3">
                {notes.examLinks.map((point, index) => (
                  <div key={`${point}-${index}`} className="rounded-[20px] bg-[var(--surface-strong)] p-4 text-sm text-muted">
                    <SimpleMarkdown content={point} />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] bg-[var(--background)] p-6">
              <h3 className="text-lg font-bold">Quick check</h3>
              <div className="mt-4 space-y-3">
                {notes.quickCheck.map((point, index) => (
                  <div key={`${point}-${index}`} className="rounded-[20px] bg-[var(--surface-strong)] p-4 text-sm text-muted">
                    <SimpleMarkdown content={point} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-[28px] bg-[var(--background)] p-6 text-sm text-muted">
          Generate notes when you want a clean AI lesson summary that matches the topic, subtopics, and exam board already stored in GradeUp.
        </div>
      )}
    </div>
  );
}
