import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getViewer } from "@/lib/auth";
import { addXP, awardBadge, logDailyStudy, syncLevelBadges } from "@/lib/gamification";

export async function POST(req: Request) {
  const viewer = await getViewer();
  if (!viewer) {
    return NextResponse.json({ error: "User sync failed" }, { status: 500 });
  }

  const body = await req.json();
  const { topicSlug, score, totalQuestions, answers } = body as {
    topicSlug?: string;
    score?: number;
    totalQuestions?: number;
    answers?: Array<{ questionId: string; selected: string }>;
  };

  if (!topicSlug || !totalQuestions || !Array.isArray(answers)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const topic = await prisma.topic.findUnique({
    where: { slug: topicSlug },
    include: { questions: true, subject: { include: { topics: true } } },
  });

  if (!topic) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }

  const correctAnswers = answers.reduce((total, answer) => {
    const question = topic.questions.find((item) => item.id === answer.questionId);
    return total + (question?.correctAnswer === answer.selected ? 1 : 0);
  }, 0);

  const computedScore =
    typeof score === "number" ? score : Math.round((correctAnswers / totalQuestions) * 100);

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: viewer.id,
      topicId: topic.id,
      score: computedScore,
      totalQuestions,
      correctAnswers,
      answers: {
        create: answers.map((answer) => {
          const question = topic.questions.find((item) => item.id === answer.questionId);
          return {
            questionId: answer.questionId,
            selected: answer.selected,
            isCorrect: question?.correctAnswer === answer.selected,
          };
        }),
      },
    },
  });

  await prisma.userProgress.upsert({
    where: {
      userId_topicId: {
        userId: viewer.id,
        topicId: topic.id,
      },
    },
    update: {
      completed: Math.max(computedScore, 25),
      score: computedScore,
      lastActivity: "quiz",
      lastStudiedAt: new Date(),
    },
    create: {
      userId: viewer.id,
      topicId: topic.id,
      completed: Math.max(computedScore, 25),
      score: computedScore,
      lastActivity: "quiz",
      lastStudiedAt: new Date(),
    },
  });

  const updatedXP = await addXP(viewer.id, totalQuestions * 10);
  await logDailyStudy(viewer.id, "quiz");
  await awardBadge(viewer.id, "FIRST_QUIZ");
  await syncLevelBadges(viewer.id, updatedXP.level);

  const completedTopics = await prisma.userProgress.count({
    where: {
      userId: viewer.id,
      topic: {
        subjectId: topic.subjectId,
      },
      completed: {
        gte: 100,
      },
    },
  });

  if (computedScore >= 100) {
    await addXP(viewer.id, 50);
  }

  if (completedTopics >= topic.subject.topics.length) {
    await addXP(viewer.id, 100);
    await awardBadge(viewer.id, "SUBJECT_COMPLETE");
  }

  return NextResponse.json({ ok: true, attempt });
}
