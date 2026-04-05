import { buildExplanationPrompt } from "@/lib/ai-prompts";
import { runAIRoute } from "@/lib/ai-route";

type ExplainBody = {
  questions?: unknown;
  answers?: unknown;
};

export async function POST(request: Request) {
  return runAIRoute<ExplainBody>({
    request,
    type: "explain",
    buildPrompt: (body) => {
      if (!body.questions || !body.answers) {
        throw new Error("Missing questions or answers.");
      }

      return buildExplanationPrompt({
        questions: body.questions,
        answers: body.answers,
      });
    },
  });
}
