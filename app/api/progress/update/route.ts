import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getViewer } from "@/lib/auth";
import { addXP, logDailyStudy, syncLevelBadges } from "@/lib/gamification";

export async function POST(req: Request) {
  const viewer = await getViewer();
  if (!viewer) {
    return NextResponse.json({ error: "User sync failed" }, { status: 500 });
  }

  const body = await req.json();
  const { topicSlug, completed, score, activity } = body as {
    topicSlug?: string;
    completed?: number;
    score?: number;
    activity?: string;
  };

  if (!topicSlug) {
    return NextResponse.json({ error: "Missing topic slug" }, { status: 400 });
  }

  const topic = await prisma.topic.findUnique({ where: { slug: topicSlug } });
  if (!topic) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }

  const safeCompletion = Math.max(0, Math.min(100, completed ?? 0));
  const safeScore = Math.max(0, Math.min(100, score ?? 0));

  const progress = await prisma.userProgress.upsert({
    where: {
      userId_topicId: {
        userId: viewer.id,
        topicId: topic.id,
      },
    },
    update: {
      completed: safeCompletion,
      score: safeScore,
      lastActivity: activity ?? "study",
      lastStudiedAt: new Date(),
    },
    create: {
      userId: viewer.id,
      topicId: topic.id,
      completed: safeCompletion,
      score: safeScore,
      lastActivity: activity ?? "study",
      lastStudiedAt: new Date(),
    },
  });

  const xp = await addXP(viewer.id, safeCompletion >= 100 ? 50 : 10);
  await logDailyStudy(viewer.id, activity ?? "study");
  await syncLevelBadges(viewer.id, xp.level);

  return NextResponse.json({ ok: true, progress });
}
