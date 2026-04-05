import prisma from "@/lib/prisma";
import { updateStreak, getStreakBonus, BADGES as RPG_BADGES, calculateActivityXP, checkLevelUp } from "@/lib/rpgSystem";
import { getDateKey, getStreakLength } from "@/lib/auth";

// Re-export BADGES from rpgSystem
export const BADGES = RPG_BADGES;

/**
 * Convert percentage score to GCSE grade
 */
export function scoreToGrade(correctAnswers: number, totalQuestions: number = 8): string {
    const percentage = (correctAnswers / totalQuestions) * 100;

    if (percentage >= 90) return 'A*';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    if (percentage >= 40) return 'E';
    if (percentage >= 30) return 'F';
    return 'G';
}

/**
 * Calculate level from total XP
 */
export function levelFromXP(totalXP: number): number {
    let level = 1;
    let xpNeeded = 0;

    while (xpNeeded + Math.floor(100 * Math.pow(1.5, level - 1)) <= totalXP) {
        xpNeeded += Math.floor(100 * Math.pow(1.5, level - 1));
        level++;
    }

    return level;
}

/**
 * Add XP to a user and handle level ups
 */
export async function addXP(userId: string, xpAmount: number) {
    const rp = await prisma.revisionRPGProfile.upsert({
        where: { userId },
        update: {
            totalXP: { increment: xpAmount },
            currentXP: { increment: xpAmount },
        },
        create: {
            userId,
            level: 1,
            totalXP: xpAmount,
            currentXP: xpAmount,
            xpForNextLevel: 100,
            coins: 0,
            gems: 0,
            avatarClass: 'Scholar',
            currentStreak: 1,
            longestStreak: 1,
        },
    });

    // Check for level up
    const levelUpCheck = checkLevelUp(rp.totalXP, rp.currentXP + xpAmount, rp.level);

    if (levelUpCheck.leveledUp) {
        const updatedRP = await prisma.revisionRPGProfile.update({
            where: { userId },
            data: {
                level: levelUpCheck.newLevel,
                currentXP: levelUpCheck.newCurrentXP,
                xpForNextLevel: levelUpCheck.xpForNextLevel,
            },
        });
        return updatedRP;
    }

    return rp;
}

/**
 * Award a badge to a user
 */
export async function awardBadge(userId: string, badgeKey: keyof typeof BADGES) {
    const badgeInfo = BADGES[badgeKey];

    try {
        const existingBadge = await prisma.revisionBadge.findFirst({
            where: {
                userId,
                badgeName: badgeInfo.name,
            },
        });

        if (!existingBadge) {
            await prisma.revisionBadge.create({
                data: {
                    userId,
                    badgeName: badgeInfo.name,
                    badgeIcon: badgeInfo.icon,
                    description: badgeInfo.description,
                    rarity: badgeInfo.rarity,
                },
            });
        }
    } catch (error) {
        console.error(`Failed to award badge ${badgeKey}:`, error);
    }
}

/**
 * Check and sync level-based badges
 */
export async function syncLevelBadges(userId: string, level: number) {
    const levelBadges = ['LEVEL_10', 'LEVEL_50'] as const;

    for (const badgeKey of levelBadges) {
        const badge = BADGES[badgeKey];
        if (badge.condition && badge.condition(level)) {
            await awardBadge(userId, badgeKey);
        }
    }
}

/**
 * Log daily study session
 */
export async function logDailyStudy(userId: string, activityType: string = 'study-session') {
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    try {
        await prisma.userStreak.upsert({
            where: {
                userId_dateKey: {
                    userId,
                    dateKey,
                },
            },
            update: { activity: activityType },
            create: {
                userId,
                dateKey,
                activity: activityType,
            },
        });
    } catch (error) {
        console.error(`Failed to log daily study:`, error);
    }
}
