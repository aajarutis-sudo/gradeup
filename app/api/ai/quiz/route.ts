import { buildQuizPrompt } from "@/lib/ai-prompts";
import { runAIRoute } from "@/lib/ai-route";
import { buildSubjectGuardrails, hasSubjectMismatch } from "@/lib/subject-guardrails";
import { getViewer } from "@/lib/auth";
import { getUserPlan, hasPlanFeature } from "@/lib/access";

type QuizBody = {
  topic?: string;
  subject?: string;
  level?: number;
  examBoard?: string | null;
  summary?: string | null;
  subtopics?: string[];
};

export async function POST(request: Request) {
  const viewer = await getViewer();

  if (!viewer) {
    throw new Error("Unable to load user.");
  }

  if (!hasPlanFeature(getUserPlan(viewer), "ai-practice")) {
    return Response.json({ error: "AI practice questions are available on GradeUp Plus." }, { status: 403 });
  }

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
        examBoard: body.examBoard ?? null,
        summary: body.summary ?? null,
        subtopics: Array.isArray(body.subtopics) ? body.subtopics : [],
        guardrails: buildSubjectGuardrails({
          subject: body.subject,
          topic: body.topic,
          examBoard: body.examBoard ?? null,
          summary: body.summary ?? null,
          subtopics: Array.isArray(body.subtopics) ? body.subtopics : [],
        }),
      });
    },
    transformResult: (body, result) => {
      const questions =
        result && typeof result === "object" && Array.isArray((result as { questions?: unknown[] }).questions)
          ? ((result as { questions: Array<{ question?: string; options?: string[]; correctIndex?: number }> }).questions ?? [])
          : [];

      const filtered = questions.filter((item) => {
        const text = [item.question ?? "", ...(Array.isArray(item.options) ? item.options : [])].join(" ");
        return !hasSubjectMismatch({ subject: body.subject ?? "", text });
      });

      if (filtered.length >= 3) {
        return { questions: filtered };
      }

      const fallbackTopics = (Array.isArray(body.subtopics) && body.subtopics.length ? body.subtopics : [body.topic ?? "this topic"]).slice(0, 5);
      return {
        questions: fallbackTopics.map((subtopic, index) => ({
          question: `Which statement best matches ${subtopic} in ${body.subject}?`,
          options: [
            `${subtopic} is a core idea in ${body.subject}.`,
            `${subtopic} belongs to an unrelated GCSE subject.`,
            `${subtopic} never appears in revision for ${body.subject}.`,
            `${subtopic} should be ignored in exam preparation.`,
          ],
          correctIndex: 0,
        })),
      };
    },
  });
}
