import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { callAI } from "@/lib/ai";
import { buildLessonNotesPrompt, type LessonNotesResult } from "@/lib/ai-prompts";
import { buildSubjectGuardrails, hasSubjectMismatch } from "@/lib/subject-guardrails";
import { getViewer } from "@/lib/auth";
import { getUserPlan, hasPlanFeature } from "@/lib/access";

type NotesBody = {
  subject?: string;
  topic?: string;
  examBoard?: string | null;
  summary?: string | null;
  subtopics?: string[];
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[`"'.,:;!?()\-–—]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueStrings(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values.map((item) => item.trim()).filter(Boolean)) {
    const key = normalizeText(value);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }

  return result;
}

function normalizeNotes(body: NotesBody, notes: Partial<LessonNotesResult>): LessonNotesResult {
  const safeSubtopics = Array.isArray(body.subtopics) ? body.subtopics.filter(Boolean) : [];
  const keyPoints = uniqueStrings(
    Array.isArray(notes.keyPoints) && notes.keyPoints.length
      ? notes.keyPoints.filter(Boolean)
      : [
          body.summary ?? `${body.topic} is an important GCSE topic.`,
          `Revise ${body.topic} through short retrieval and application practice.`,
          `Use precise terminology for ${body.subject}.`,
          "Link each idea to how it could appear in an exam question.",
        ]
  );

  const subtopicNotesRaw =
    Array.isArray(notes.subtopicNotes) && notes.subtopicNotes.length
      ? notes.subtopicNotes.map((item) => ({
          subtopic: item.subtopic || "Key subtopic",
          notes:
            Array.isArray(item.notes) && item.notes.length
              ? uniqueStrings(item.notes.filter(Boolean))
              : ["Revise the main idea, then practise applying it."],
        }))
      : safeSubtopics.map((subtopic) => ({
          subtopic,
          notes: [
            `Know the core idea behind ${subtopic}.`,
            `Practise how ${subtopic} could be tested in a GCSE question.`,
          ],
        }));

  const subtopicNotes = subtopicNotesRaw.filter(
    (item) =>
      item.subtopic.trim() &&
      item.notes.length > 0 &&
      !item.notes.every((note) => keyPoints.some((point) => normalizeText(point) === normalizeText(note)))
  );

  return {
    title: notes.title?.trim() || String(body.topic ?? "Revision notes"),
    overview:
      notes.overview?.trim() ||
      `${body.topic} sits inside ${body.subject}. Start with the central idea, then break it into smaller parts so the revision feels manageable and exam-ready.`,
    keyPoints,
    subtopicNotes,
    examLinks: uniqueStrings(
      Array.isArray(notes.examLinks) && notes.examLinks.length
        ? notes.examLinks.filter(Boolean)
        : [
            "Expect short knowledge checks and longer explanation questions.",
            "Use direct evidence, method, or worked steps rather than vague statements.",
            "Keep each paragraph or answer linked tightly to the wording of the question.",
          ]
    ),
    quickCheck: uniqueStrings(
      Array.isArray(notes.quickCheck) && notes.quickCheck.length
        ? notes.quickCheck.filter(Boolean)
        : [
            `What are the three most important things to remember about ${body.topic}?`,
            `What common mistake could a student make in ${body.topic}?`,
            `How could ${body.topic} appear in a GCSE exam question?`,
          ]
    ),
  };
}

function collectNotesText(notes: LessonNotesResult) {
  return [
    notes.title,
    notes.overview,
    ...notes.keyPoints,
    ...notes.examLinks,
    ...notes.quickCheck,
    ...notes.subtopicNotes.flatMap((item) => [item.subtopic, ...item.notes]),
  ].join(" ");
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const viewer = await getViewer();
  if (!viewer) {
    return NextResponse.json({ error: "Unable to load user." }, { status: 500 });
  }

  if (!hasPlanFeature(getUserPlan(viewer), "ai-notes")) {
    return NextResponse.json({ error: "AI notes are available on GradeUp Plus." }, { status: 403 });
  }

  const body = (await request.json()) as NotesBody;

  if (!body.subject || !body.topic) {
    return NextResponse.json({ error: "Missing subject or topic." }, { status: 400 });
  }

  try {
    const prompt = buildLessonNotesPrompt({
      subject: body.subject,
      topic: body.topic,
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

    const aiResult = await callAI({
      type: "lesson-notes",
      prompt,
      userId: viewer.id,
    });

    const normalized = normalizeNotes(body, aiResult.data as Partial<LessonNotesResult>);

    if (hasSubjectMismatch({ subject: body.subject, text: collectNotesText(normalized) })) {
      const safeFallback = normalizeNotes(body, {});
      return NextResponse.json({ ok: true, result: safeFallback, model: `${aiResult.model} (guardrailed fallback)` });
    }

    return NextResponse.json({ ok: true, result: normalized, model: aiResult.model });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI request failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
