import { buildRevisionPlanPrompt } from "@/lib/ai-prompts";
import { runAIRoute } from "@/lib/ai-route";

type RevisionPlanBody = {
  subject?: string;
  grade?: number;
  weakTopics?: string[];
  strongTopics?: string[];
  xp?: number;
  level?: number;
  streak?: number;
};

export async function POST(request: Request) {
  return runAIRoute<RevisionPlanBody>({
    request,
    type: "revision-plan",
    buildPrompt: (body) => {
      if (
        !body.subject ||
        typeof body.grade !== "number" ||
        !Array.isArray(body.weakTopics) ||
        !Array.isArray(body.strongTopics)
      ) {
        throw new Error("Missing subject, grade, weakTopics, or strongTopics.");
      }

      return buildRevisionPlanPrompt({
        subject: body.subject,
        grade: body.grade,
        weakTopics: body.weakTopics,
        strongTopics: body.strongTopics,
        xp: body.xp ?? 0,
        level: body.level ?? 1,
        streak: body.streak ?? 0,
      });
    },
  });
}
