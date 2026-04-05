import { buildDiagnosticPrompt } from "@/lib/ai-prompts";
import { runAIRoute } from "@/lib/ai-route";

type DiagnosticBody = {
  subject?: string;
};

export async function POST(request: Request) {
  return runAIRoute<DiagnosticBody>({
    request,
    type: "diagnostic",
    buildPrompt: (body) => {
      if (!body.subject) {
        throw new Error("Missing subject.");
      }

      return buildDiagnosticPrompt({
        subject: body.subject,
      });
    },
  });
}
