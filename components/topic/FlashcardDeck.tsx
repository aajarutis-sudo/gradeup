"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

type Flashcard = {
  id: string;
  question: string;
  answer: string;
};

export default function FlashcardDeck({
  topicTitle,
  topicSlug,
  cards,
}: {
  topicTitle: string;
  topicSlug: string;
  cards: Flashcard[];
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    void fetch("/api/streak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activity: `flashcards:${topicSlug}` }),
    });
  }, [topicSlug]);

  const currentCard = cards[index];

  if (!currentCard) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-[28px] p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent)]">Flashcards</p>
        <h1 className="mt-2 text-3xl font-semibold">{topicTitle}</h1>
        <p className="mt-2 text-muted">
          Flip the card, speak the answer out loud, then move to the next one.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setRevealed((current) => !current)}
        className="glass-panel min-h-80 w-full rounded-[34px] p-8 text-left transition hover:-translate-y-1"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
          Card {index + 1} of {cards.length}
        </p>
        <div className="mt-8 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            {revealed ? "Answer" : "Prompt"}
          </p>
          <p className="text-3xl font-semibold leading-tight">
            {revealed ? currentCard.answer : currentCard.question}
          </p>
        </div>
      </button>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={() => {
            setRevealed(false);
            setIndex((current) => (current === 0 ? cards.length - 1 : current - 1));
          }}
          className="!bg-[var(--surface-strong)] !text-[var(--foreground)]"
        >
          Previous
        </Button>
        <Button type="button" onClick={() => setRevealed((current) => !current)}>
          {revealed ? "Hide answer" : "Reveal answer"}
        </Button>
        <Button
          type="button"
          onClick={() => {
            setRevealed(false);
            setIndex((current) => (current + 1) % cards.length);
          }}
        >
          Next card
        </Button>
      </div>
    </div>
  );
}
