import { buildDiagnosticPrompt } from "@/lib/ai-prompts";
import { runAIRoute } from "@/lib/ai-route";
import { buildSubjectGuardrails, hasSubjectMismatch } from "@/lib/subject-guardrails";

type DiagnosticBody = {
  subject?: string;
  examBoard?: string | null;
  summary?: string | null;
  subtopics?: string[];
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
        examBoard: body.examBoard ?? null,
        summary: body.summary ?? null,
        subtopics: Array.isArray(body.subtopics) ? body.subtopics : [],
        guardrails: buildSubjectGuardrails({
          subject: body.subject,
          examBoard: body.examBoard ?? null,
          summary: body.summary ?? null,
          subtopics: Array.isArray(body.subtopics) ? body.subtopics : [],
        }),
      });
    },
    transformResult: (body, result) => {
      const questions =
        result && typeof result === "object" && Array.isArray((result as { questions?: unknown[] }).questions)
          ? ((result as { questions: Array<{ question?: string; options?: string[]; correctIndex?: number; topic?: string }> }).questions ?? [])
          : [];

      const filtered = questions.filter((item) => {
        const text = [item.topic ?? "", item.question ?? "", ...(Array.isArray(item.options) ? item.options : [])].join(" ");
        return !hasSubjectMismatch({ subject: body.subject ?? "", text });
      });

      return { questions: filtered };
    },
  });
}
