import { NextResponse } from "next/server";
import { getViewer } from "@/lib/auth";
import { getUserPlan, hasPlanFeature } from "@/lib/access";
import { callChatAI } from "@/lib/ai";

type ChatBody = {
  messages?: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
};

export async function POST(request: Request) {
  const viewer = await getViewer();
  if (!viewer) {
    return NextResponse.json({ error: "User sync failed" }, { status: 500 });
  }

  if (!hasPlanFeature(getUserPlan(viewer), "ai-chat")) {
    return NextResponse.json({ error: "AI Coach is available on GradeUp Plus." }, { status: 403 });
  }

  const body = (await request.json()) as ChatBody;
  const messages = Array.isArray(body.messages)
    ? body.messages.filter(
        (message) =>
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string" &&
          message.content.trim().length > 0
      )
    : [];

  if (!messages.length) {
    return NextResponse.json({ error: "Missing chat messages." }, { status: 400 });
  }

  try {
    const result = await callChatAI({
      userId: String(viewer.id),
      messages,
      systemPrompt:
        "You are GradeUp Coach, a friendly GCSE revision chatbot. Give concise, supportive study help, explain ideas clearly, suggest next steps when helpful, and keep answers student-focused.",
    });

    return NextResponse.json({ ok: true, result: { message: result.message }, model: result.model });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Groq chat request failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
