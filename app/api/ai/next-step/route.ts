import { buildNextStepPrompt } from "@/lib/ai-prompts";
import { runAIRoute } from "@/lib/ai-route";

type NextStepBody = {
  subject?: string;
  weakTopics?: string[];
  strongTopics?: string[];
  progress?: unknown;
  xp?: number;
  level?: number;
  streak?: number;
};

export async function POST(request: Request) {
  return runAIRoute<NextStepBody>({
    request,
    type: "next-step",
    buildPrompt: (body) => {
      if (!body.subject || !Array.isArray(body.weakTopics) || !Array.isArray(body.strongTopics)) {
        throw new Error("Missing subject, weakTopics, or strongTopics.");
      }

      return buildNextStepPrompt({
        subject: body.subject,
        weakTopics: body.weakTopics,
        strongTopics: body.strongTopics,
        progress: body.progress ?? {},
        xp: body.xp ?? 0,
        level: body.level ?? 1,
        streak: body.streak ?? 0,
      });
    },
  });
}
