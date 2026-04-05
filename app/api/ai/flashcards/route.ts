import { buildFlashcardsPrompt } from "@/lib/ai-prompts";
import { runAIRoute } from "@/lib/ai-route";
import { hasSubjectMismatch } from "@/lib/subject-guardrails";

type FlashcardsBody = {
  topic?: string;
  subject?: string;
};

export async function POST(request: Request) {
  return runAIRoute<FlashcardsBody>({
    request,
    type: "flashcards",
    buildPrompt: (body) => {
      if (!body.topic || !body.subject) {
        throw new Error("Missing topic or subject.");
      }

      return buildFlashcardsPrompt({
        topic: body.topic,
        subject: body.subject,
      });
    },
    transformResult: (body, result) => {
      const flashcards =
        result && typeof result === "object" && Array.isArray((result as { flashcards?: unknown[] }).flashcards)
          ? ((result as { flashcards: Array<{ front?: string; back?: string }> }).flashcards ?? [])
          : [];

      return {
        flashcards: flashcards.filter((item) => {
          const text = [item.front ?? "", item.back ?? ""].join(" ");
          return !hasSubjectMismatch({ subject: body.subject ?? "", text });
        }),
      };
    },
  });
}
