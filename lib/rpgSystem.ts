// RPG Gamification System
// Manages levels, XP progression, badges, streaks, and avatar system

export interface RPGStats {
    level: number;
    totalXP: number;
    currentXP: number;
    xpForNextLevel: number;
    coins: number;
    gems: number;
    currentStreak: number;
    longestStreak: number;
}

export interface BadgeUnlocked {
    name: string;
    icon: string;
    description: string;
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
    unlockedAt: Date;
}

export interface AvatarClass {
    name: string;
    description: string;
    baseHealth: number;
    baseDamage: number;
    color: string;
}

export const AVATAR_CLASSES: Record<string, AvatarClass> = {
    Scholar: {
        name: 'Scholar',
        description: 'Balanced learner. +10% XP gain',
        baseHealth: 100,
        baseDamage: 50,
        color: '#4F46E5', // Indigo
    },
    Mage: {
        name: 'Mage',
        description: 'Intellectual focus. +15% AI feature usage',
        baseHealth: 80,
        baseDamage: 75,
        color: '#7C3AED', // Violet
    },
    Warrior: {
        name: 'Warrior',
        description: 'Discipline master. +20% streak bonus',
        baseHealth: 120,
        baseDamage: 40,
        color: '#DC2626', // Red
    },
    Explorer: {
        name: 'Explorer',
        description: 'Curious learner. +25% topic unlock speed',
        baseHealth: 90,
        baseDamage: 55,
        color: '#EA580C', // Orange
    },
    Guardian: {
        name: 'Guardian',
        description: 'Community helper. +30% help other students effect',
        baseHealth: 110,
        baseDamage: 45,
        color: '#0891B2', // Cyan
    },
};

export const BADGES = {
    // Study Consistency
    CONSISTENCY_KING: {
        name: 'Consistency King',
        icon: '👑',
        description: 'Maintain a 7-day streak',
        rarity: 'RARE',
        condition: (streak: number) => streak >= 7,
    },
    UNSTOPPABLE: {
        name: 'Unstoppable',
        icon: '🔥',
        description: 'Maintain a 30-day streak',
        rarity: 'EPIC',
        condition: (streak: number) => streak >= 30,
    },
    LEGENDARY_GRIND: {
        name: 'Legendary Grind',
        icon: '⚡',
        description: 'Maintain a 100-day streak',
        rarity: 'LEGENDARY',
        condition: (streak: number) => streak >= 100,
    },
    // Learning Mastery
    FLASHCARD_MASTER: {
        name: 'Flashcard Master',
        icon: '🎯',
        description: 'Master 50 flashcards using spaced repetition',
        rarity: 'RARE',
        condition: (data: any) => data.masteredFlashcards >= 50,
    },
    WEAKNESS_SLAYER: {
        name: 'Weakness Slayer',
        icon: '⚔️',
        description: 'Improve predicted mark loss from high to passing',
        rarity: 'EPIC',
        condition: (data: any) => data.weaknessesImproved >= 5,
    },
    // XP & Level
    LEVEL_10: {
        name: 'Level 10 Reached',
        icon: '📈',
        description: 'Reach level 10',
        rarity: 'COMMON',
        condition: (level: number) => level >= 10,
    },
    LEVEL_50: {
        name: 'Level 50 Reached',
        icon: '🎊',
        description: 'Reach level 50',
        rarity: 'EPIC',
        condition: (level: number) => level >= 50,
    },
    // Paper Practice
    PAPER_PIONEER: {
        name: 'Paper Pioneer',
        icon: '📄',
        description: 'Complete 10 past papers',
        rarity: 'RARE',
        condition: (data: any) => data.papersCompleted >= 10,
    },
    FIRST_QUIZ: {
        name: 'First Quiz',
        icon: '📝',
        description: 'Complete your first quiz',
        rarity: 'COMMON',
        condition: (data: any) => data.quizzesCompleted >= 1,
    },
    SUBJECT_COMPLETE: {
        name: 'Subject Complete',
        icon: '🎓',
        description: 'Complete every topic in one subject',
        rarity: 'EPIC',
        condition: (data: any) => data.subjectsCompleted >= 1,
    },
    // Perfect Scores
    PERFECT_QUIZ: {
        name: 'Perfect Quiz',
        icon: '💯',
        description: 'Score 100% on a quiz',
        rarity: 'RARE',
        condition: (data: any) => data.perfectQuizzes >= 1,
    },
};

/**
 * Calculate XP required for next level
 * Formula: 100 * (1.5 ^ (level - 1))
 * Level 1: 100 XP
 * Level 2: 150 XP
 * Level 3: 225 XP
 * etc.
 */
export function calculateXpForLevel(level: number): number {
    return Math.floor(100 * Math.pow(1.5, level - 1));
}

/**
 * Check if user should level up and return new level/XP state
 */
export function checkLevelUp(currentxp: number, currentXP: number, level: number) {
    let newLevel = level;
    let newCurrentXP = currentXP;
    let leveledUp = false;

    while (newCurrentXP >= calculateXpForLevel(newLevel)) {
        newCurrentXP -= calculateXpForLevel(newLevel);
        newLevel++;
        leveledUp = true;
    }

    return {
        leveledUp,
        newLevel,
        newCurrentXP,
        xpForNextLevel: calculateXpForLevel(newLevel),
    };
}

/**
 * Calculate streak status based on last study date
 */
export function updateStreak(
    lastStudyDate: Date | null,
    currentStreak: number,
    longestStreak: number
): { currentStreak: number; longestStreak: number; streakMaintained: boolean } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!lastStudyDate) {
        return {
            currentStreak: 1,
            longestStreak: Math.max(1, longestStreak),
            streakMaintained: true,
        };
    }

    const lastDate = new Date(lastStudyDate);
    lastDate.setHours(0, 0, 0, 0);

    const daysDifference = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDifference === 0) {
        // Studied today already
        return {
            currentStreak,
            longestStreak,
            streakMaintained: true,
        };
    } else if (daysDifference === 1) {
        // Studied yesterday, continue streak
        const newStreak = currentStreak + 1;
        return {
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, longestStreak),
            streakMaintained: true,
        };
    } else {
        // Missed a day, reset streak
        return {
            currentStreak: 1,
            longestStreak,
            streakMaintained: false,
        };
    }
}

/**
 * Calculate XP reward based on activity
 */
export function calculateActivityXP(activityType: string, quality: number = 3): number {
    const baseXP: Record<string, number> = {
        quiz_complete: 50,
        flashcard_review: 10,
        paper_practice: 100,
        topic_master: 200,
        weakness_improvement: 150,
        study_session: 75,
    };

    let xpReward = baseXP[activityType] || 25;

    // Quality multiplier (for flashcard reviews, quality is 0-5)
    if (quality >= 3) {
        xpReward = Math.floor(xpReward * (1 + (quality - 3) * 0.2)); // +20% per quality point above 3
    } else {
        xpReward = Math.floor(xpReward * 0.7); // -30% for poor responses
    }

    return xpReward;
}

/**
 * Calculate coin reward
 */
export function calculateCoinReward(activityType: string): number {
    const coins: Record<string, number> = {
        quiz_complete: 10,
        flashcard_master: 5,
        paper_complete: 20,
        streak_bonus: 50,
        daily_login: 5,
    };

    return coins[activityType] || 0;
}

/**
 * Calculate streak bonus multiplier
 */
export function getStreakBonus(streak: number): { multiplier: number; coinsBonus: number } {
    if (streak < 7) {
        return { multiplier: 1.0, coinsBonus: 0 };
    } else if (streak < 14) {
        return { multiplier: 1.25, coinsBonus: 10 };
    } else if (streak < 30) {
        return { multiplier: 1.5, coinsBonus: 25 };
    } else if (streak < 100) {
        return { multiplier: 2.0, coinsBonus: 50 };
    } else {
        return { multiplier: 3.0, coinsBonus: 100 };
    }
}

/**
 * Get avatar stats based on class selection
 */
export function getAvatarStats(className: string = 'Scholar') {
    const avatarClass = AVATAR_CLASSES[className] || AVATAR_CLASSES.Scholar;
    return {
        className: avatarClass.name,
        baseHealth: avatarClass.baseHealth,
        baseDamage: avatarClass.baseDamage,
        color: avatarClass.color,
        description: avatarClass.description,
    };
}

/**
 * Check which badges should be unlocked based on current stats
 */
export function checkBadgesUnlocked(
    level: number,
    streak: number,
    stats: any
): Array<{ badgeName: string; badgeIcon: string; description: string; rarity: string }> {
    const unlockedBadges: Array<{
        badgeName: string;
        badgeIcon: string;
        description: string;
        rarity: string;
    }> = [];

    Object.entries(BADGES).forEach(([key, badge]: any) => {
        let shouldUnlock = false;

        if (badge.condition) {
            if (typeof badge.condition(streak) === 'boolean' && key.includes('CONSISTENCY')) {
                shouldUnlock = badge.condition(streak);
            } else if (typeof badge.condition(level) === 'boolean' && key.includes('LEVEL')) {
                shouldUnlock = badge.condition(level);
            } else if (typeof badge.condition(stats) === 'boolean') {
                shouldUnlock = badge.condition(stats);
            }
        }

        if (shouldUnlock) {
            unlockedBadges.push({
                badgeName: badge.name,
                badgeIcon: badge.icon,
                description: badge.description,
                rarity: badge.rarity,
            });
        }
    });

    return unlockedBadges;
}
