/**
 * SM-2 Spaced Repetition Algorithm Implementation
 * Based on: https://en.wikipedia.org/wiki/Spaced_repetition#SM-2
 */

export interface SM2CardState {
    interval: number; // Days until next review
    easeFactor: number; // 1.3 to 2.5
    repetitions: number; // Number of successful full reviews
    quality?: number; // Quality of response 0-5
    nextReviewAt: Date;
    lastReviewAt?: Date;
}

export interface ReviewResult {
    quality: number; // 0-5 score from user
    // 0: complete blackout, correct by chance
    // 1: incorrect response, but upon seeing the correct answer it was easy to remember
    // 2: incorrect response, but upon seeing it, it seemed easy to remember
    // 3: correct response after some hesitation
    // 4: correct response after a bit of thought
    // 5: perfect response
}

/**
 * Calculate next review parameters based on SM-2 algorithm
 */
export const calculateSM2NextReview = (
    current: SM2CardState,
    quality: number
): SM2CardState => {
    let { interval, easeFactor, repetitions } = current;

    // Ensure quality is 0-5
    quality = Math.max(0, Math.min(5, quality));

    if (quality < 3) {
        // Incorrect or poor quality response
        repetitions = 0;
        interval = 1;
    } else {
        // Correct response
        if (repetitions === 0) {
            interval = 1;
        } else if (repetitions === 1) {
            interval = 3;
        } else {
            interval = Math.round(interval * easeFactor);
        }
        repetitions += 1;
    }

    // Update ease factor
    easeFactor = Math.max(
        1.3,
        easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
    );

    // Calculate next review date
    const nextReviewAt = new Date();
    nextReviewAt.setDate(nextReviewAt.getDate() + interval);

    return {
        interval,
        easeFactor,
        repetitions,
        quality,
        nextReviewAt,
        lastReviewAt: new Date(),
    };
};

/**
 * Get cards due for review
 */
export const getCardsDueForReview = (cards: SM2CardState[]): SM2CardState[] => {
    const now = new Date();
    return cards.filter((card) => card.nextReviewAt <= now);
};

/**
 * Calculate learning statistics
 */
export interface LearningStats {
    totalCards: number;
    cardsToReview: number;
    newCards: number;
    mastery: number; // 0-100
    averageEaseFactor: number;
    averageRepetitions: number;
}

export const calculateLearningStats = (cards: SM2CardState[]): LearningStats => {
    const now = new Date();
    const cardsToReview = getCardsDueForReview(cards).length;
    const newCards = cards.filter((c) => c.repetitions === 0).length;
    const masteredCards = cards.filter((c) => c.repetitions >= 5).length;

    const averageEaseFactor =
        cards.length > 0
            ? cards.reduce((sum, c) => sum + c.easeFactor, 0) / cards.length
            : 2.5;

    const averageRepetitions =
        cards.length > 0
            ? cards.reduce((sum, c) => sum + c.repetitions, 0) / cards.length
            : 0;

    return {
        totalCards: cards.length,
        cardsToReview,
        newCards,
        mastery:
            cards.length > 0 ? (masteredCards / cards.length) * 100 : 0,
        averageEaseFactor,
        averageRepetitions,
    };
};

/**
 * Get recommended review time based on optimal spacing
 */
export const getOptimalNextReview = (lastReview: Date, interval: number): Date => {
    const nextReview = new Date(lastReview);
    nextReview.setDate(nextReview.getDate() + interval);
    return nextReview;
};

/**
 * Calculate total review statistics
 */
export interface ReviewStats {
    reviewsCompleted: number;
    reviewsCorrect: number;
    reviewsIncorrect: number;
    successRate: number; // 0-100
    averageQuality: number; // 0-5
}

export const calculateReviewStats = (
    reviews: ReviewResult[]
): ReviewStats => {
    if (reviews.length === 0) {
        return {
            reviewsCompleted: 0,
            reviewsCorrect: 0,
            reviewsIncorrect: 0,
            successRate: 0,
            averageQuality: 0,
        };
    }

    const reviewsCorrect = reviews.filter((r) => r.quality >= 3).length;
    const reviewsIncorrect = reviews.length - reviewsCorrect;
    const averageQuality =
        reviews.reduce((sum, r) => sum + r.quality, 0) / reviews.length;

    return {
        reviewsCompleted: reviews.length,
        reviewsCorrect,
        reviewsIncorrect,
        successRate: (reviewsCorrect / reviews.length) * 100,
        averageQuality,
    };
};
