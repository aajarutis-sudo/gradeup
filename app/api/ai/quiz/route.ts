import { buildQuizPrompt } from "@/lib/ai-prompts";
import { runAIRoute } from "@/lib/ai-route";

type QuizBody = {
  topic?: string;
  subject?: string;
  level?: number;
};

export async function POST(request: Request) {
  return runAIRoute<QuizBody>({
    request,
    type: "quiz",
    buildPrompt: (body) => {
      if (!body.topic || !body.subject) {
        throw new Error("Missing topic or subject.");
      }

      return buildQuizPrompt({
        topic: body.topic,
        subject: body.subject,
        level: body.level ?? 1,
      });
    },
  });
}
