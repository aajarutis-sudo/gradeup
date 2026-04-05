import type { PromptBundle } from "@/lib/ai-prompts";

export type AIRequestType =
  | "diagnostic"
  | "predict-grade"
  | "revision-plan"
  | "lesson-notes"
  | "flashcards"
  | "quiz"
  | "next-step"
  | "explain";

type AIRequest = {
  type: AIRequestType;
  prompt: PromptBundle;
  userId: string;
};

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ProviderChatResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
};

function getGroqConfig() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY.");
  }

  return {
    apiKey,
    model: process.env.GROQ_MODEL ?? "openai/gpt-oss-20b",
    chatModel: process.env.GROQ_CHAT_MODEL ?? process.env.GROQ_MODEL ?? "openai/gpt-oss-20b",
    baseUrl: process.env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1",
  };
}

export async function callAI(payload: AIRequest) {
  const { apiKey, model, baseUrl } = getGroqConfig();

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: payload.prompt.schemaName,
          strict: true,
          schema: payload.prompt.schema,
        },
      },
      messages: [
        {
          role: "system",
          content: payload.prompt.systemPrompt,
        },
        {
          role: "user",
          content: payload.prompt.userPrompt,
        },
      ],
    }),
  });

  const raw = (await response.json()) as ProviderChatResponse;

  if (!response.ok) {
    throw new Error(raw.error?.message ?? "Groq request failed.");
  }

  const content = raw.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Groq returned no message content.");
  }

  return {
    ok: true,
    model,
    type: payload.type,
    data: JSON.parse(content),
  };
}

export async function callChatAI(payload: {
  userId: string;
  messages: ChatMessage[];
  systemPrompt?: string;
}) {
  const { apiKey, chatModel, baseUrl } = getGroqConfig();

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: chatModel,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            payload.systemPrompt ??
            "You are GradeUp Coach, a calm and supportive GCSE study assistant. Give clear, student-friendly help, keep answers focused on revision, and avoid unnecessary jargon.",
        },
        ...payload.messages,
      ],
    }),
  });

  const raw = (await response.json()) as ProviderChatResponse;

  if (!response.ok) {
    throw new Error(raw.error?.message ?? "Groq chat request failed.");
  }

  const content = raw.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Groq returned no chat content.");
  }

  return {
    ok: true,
    model: chatModel,
    message: content,
  };
}
