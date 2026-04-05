import { buildFlashcardsPrompt } from "@/lib/ai-prompts";
import { runAIRoute } from "@/lib/ai-route";

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
  });
}
