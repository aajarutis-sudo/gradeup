"use client";

import { useState, useTransition } from "react";
import Button from "@/components/ui/Button";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const starterPrompts = [
  "Explain active transport simply.",
  "Test me on Romeo and Juliet themes.",
  "Help me revise trigonometry in 20 minutes.",
];

export default function ChatbotClient() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "I’m GradeUp Coach. Ask me for GCSE explanations, revision help, quick quizzes, essay planning, or a calm next step.",
    },
  ]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const sendMessage = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.filter((message) => message.role === "user" || message.role === "assistant"),
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        result?: { message: string };
      };

      if (!response.ok || !payload.result) {
        setError(payload.error ?? "Could not get a reply right now.");
        setMessages(nextMessages);
        return;
      }

      setMessages([...nextMessages, { role: "assistant", content: payload.result.message }]);
    });
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-[28px] p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent)]">AI Chat</p>
        <h1 className="mt-2 text-3xl font-semibold">GradeUp Coach</h1>
        <p className="mt-2 text-muted">
          Ask for explanations, mini revision plans, essay help, or quick GCSE questions without leaving the app.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {starterPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => sendMessage(prompt)}
            disabled={isPending}
            className="rounded-full bg-[var(--background)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:-translate-y-0.5"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`rounded-[28px] p-5 ${
              message.role === "assistant"
                ? "glass-panel"
                : "bg-[var(--primary)] text-white"
            }`}
          >
            <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${message.role === "assistant" ? "text-[var(--accent)]" : "text-white/80"}`}>
              {message.role === "assistant" ? "GradeUp Coach" : "You"}
            </p>
            <p className={`mt-3 whitespace-pre-wrap text-sm leading-7 ${message.role === "assistant" ? "text-muted" : "text-white"}`}>
              {message.content}
            </p>
          </div>
        ))}
      </div>

      {error ? <div className="rounded-[24px] border border-[var(--danger)]/30 bg-[var(--background)] p-4 text-sm text-[var(--danger)]">{error}</div> : null}

      <div className="glass-panel rounded-[28px] p-5">
        <div className="flex flex-col gap-4">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={4}
            placeholder="Ask anything GCSE-related..."
            className="w-full rounded-[22px] border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none"
          />
          <div className="flex justify-end">
            <Button onClick={() => sendMessage(input)} disabled={isPending || !input.trim()}>
              {isPending ? "Thinking..." : "Send message"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
