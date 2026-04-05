import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { calculateXpForLevel } from "@/lib/rpgSystem";

export async function getViewer() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  let clerkUser = null;

  try {
    clerkUser = await currentUser();
  } catch {
    clerkUser = null;
  }

  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? null;
  const name =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    clerkUser?.username ||
    email ||
    "Student";

  const viewer = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { email, name },
    create: { clerkId: userId, email, name },
    include: {
      rpgProfile: true,
      badges: true,
    },
  });

  if (!viewer.rpgProfile) {
    await prisma.revisionRPGProfile.create({
      data: {
        userId: viewer.id,
        level: 1,
        totalXP: 0,
        currentXP: 0,
        xpForNextLevel: calculateXpForLevel(1),
        coins: 0,
        gems: 0,
        avatarClass: "Student",
        currentStreak: 0,
        longestStreak: 0,
      },
    });
  }

  return prisma.user.findUnique({
    where: { id: viewer.id },
    include: {
      rpgProfile: true,
      badges: true,
    },
  });
}

export function getDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function getStreakLength(dateKeys: string[]) {
  const seen = new Set(dateKeys);
  let streak = 0;
  const current = new Date();

  while (true) {
    const probe = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate() - streak));
    const key = probe.toISOString().slice(0, 10);
    if (!seen.has(key)) {
      break;
    }
    streak += 1;
  }

  return streak;
}

export function requireOnboardingRedirect(onboardedAt: Date | null | undefined) {
  return !onboardedAt;
}
