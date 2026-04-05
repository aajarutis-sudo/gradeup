import { buildPredictedGradePrompt } from "@/lib/ai-prompts";
import { runAIRoute } from "@/lib/ai-route";

type PredictGradeBody = {
  subject?: string;
  questions?: unknown;
  answers?: unknown;
};

export async function POST(request: Request) {
  return runAIRoute<PredictGradeBody>({
    request,
    type: "predict-grade",
    buildPrompt: (body) => {
      if (!body.subject || !body.questions || !body.answers) {
        throw new Error("Missing subject, questions, or answers.");
      }

      return buildPredictedGradePrompt({
        subject: body.subject,
        questions: body.questions,
        answers: body.answers,
      });
    },
  });
}
