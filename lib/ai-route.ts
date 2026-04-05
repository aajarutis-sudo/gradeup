import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import type { AIRequestType } from "@/lib/ai";
import { callAI } from "@/lib/ai";
import type { PromptBundle } from "@/lib/ai-prompts";

export async function runAIRoute<TBody>(options: {
  request: Request;
  type: AIRequestType;
  buildPrompt: (body: TBody) => PromptBundle;
  transformResult?: (body: TBody, result: unknown) => unknown;
}) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = (await options.request.json()) as TBody;

  try {
    const prompt = options.buildPrompt(body);
    const aiResult = await callAI({ type: options.type, prompt, userId });
    const result = options.transformResult ? options.transformResult(body, aiResult.data) : aiResult.data;
    return NextResponse.json({ ok: true, result, model: aiResult.model });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI request failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
