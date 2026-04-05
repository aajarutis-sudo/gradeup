import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/learning/spaced-repetition/due
 * Get all flashcards and questions due for review
 */
export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Get user's Clerk ID mapping
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        })

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            )
        }

        const now = new Date()

        // Get all cards due for review
        const dueCards = await prisma.spacedRepetitionCard.findMany({
            where: {
                userId: user.id,
                nextReviewAt: {
                    lte: now,
                },
            },
            include: {
                flashcard: {
                    include: {
                        topic: true,
                    },
                },
            },
        })

        // Statistics
        const totalCards = await prisma.spacedRepetitionCard.count({
            where: { userId: user.id },
        })

        const masteredCards = await prisma.spacedRepetitionCard.count({
            where: {
                userId: user.id,
                repetitions: {
                    gte: 5,
                },
            },
        })

        const learningCards = await prisma.spacedRepetitionCard.count({
            where: {
                userId: user.id,
                repetitions: {
                    gte: 1,
                    lt: 5,
                },
            },
        })

        const newCards = await prisma.spacedRepetitionCard.count({
            where: {
                userId: user.id,
                repetitions: 0,
            },
        })

        return NextResponse.json(
            {
                success: true,
                data: {
                    dueCards: dueCards.map((card) => ({
                        id: card.id,
                        type: 'flashcard',
                        item: card.flashcard,
                        topic: card.flashcard?.topic,
                        easeFactor: card.easeFactor,
                        repetitions: card.repetitions,
                        interval: card.interval,
                        nextReviewAt: card.nextReviewAt,
                    })),
                    stats: {
                        totalCards,
                        dueForReview: dueCards.length,
                        masteredCards,
                        learningCards,
                        newCards,
                        masteryPercentage:
                            totalCards > 0 ? (masteredCards / totalCards) * 100 : 0,
                    },
                },
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error fetching due cards:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch due cards' },
            { status: 500 }
        )
    }
}
