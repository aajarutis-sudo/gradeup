import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import {
    predictWeaknesses,
    calculateExamRiskScore,
    categorizeProgress,
} from '@/lib/weaknessPredictor'

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        })

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            )
        }

        const topics = await prisma.topic.findMany({
            include: { subject: true },
        })

        const topicPerformances = await Promise.all(
            topics.map(async (topic) => {
                const quizAttempts = await prisma.quizAttempt.findMany({
                    where: {
                        userId: user.id,
                        topicId: topic.id,
                    },
                })

                let quizAccuracy = 50
                if (quizAttempts.length > 0) {
                    const accuracies = quizAttempts.map((a) =>
                        (a.correctAnswers / a.totalQuestions) * 100
                    )

                    quizAccuracy =
                        accuracies.reduce((sum: number, a: number) => sum + a, 0) /
                        accuracies.length
                }

                const spacedReps = await prisma.spacedRepetitionCard.findMany({
                    where: {
                        userId: user.id,
                        flashcard: {
                            topicId: topic.id,
                        },
                    },
                })

                let flashcardAccuracy = 50
                if (spacedReps.length > 0) {
                    const qualities = spacedReps.map((c) => {
                        if (c.quality === null) return 0
                        return (c.quality / 5) * 100
                    })

                    flashcardAccuracy =
                        qualities.reduce((sum: number, q: number) => sum + q, 0) /
                        qualities.length
                }

                const timeSpent = quizAttempts.length * 5 + spacedReps.length * 2

                const recentAttempts = quizAttempts.slice(-5).map((a) => ({
                    score: (a.correctAnswers / a.totalQuestions) * 100,
                    maxScore: 100,
                    timestamp: a.createdAt,
                }))

                return {
                    topicId: topic.id,
                    topicName: topic.title,
                    quizAccuracy,
                    flashcardAccuracy,
                    timeSpent,
                    practiceAttempts: quizAttempts.length,
                    recentAttempts,
                }
            })
        )

        const predictions = predictWeaknesses(topicPerformances)

        predictions.sort((a, b) => b.riskScore - a.riskScore)

        const examRiskScore = calculateExamRiskScore(predictions)
        const progressCategory = categorizeProgress(predictions)

        for (const prediction of predictions.slice(0, 3)) {
            await prisma.weaknessPrediction.upsert({
                where: {
                    userId_topicId: {
                        userId: user.id,
                        topicId: prediction.topicId,
                    },
                },
                update: {
                    riskScore: prediction.riskScore,
                    confidenceScore: prediction.confidence,
                    predictedMarkLoss: prediction.predictedMarkLoss,
                    recommendedActions: JSON.stringify(prediction.recommendations),
                    targetBy: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
                create: {
                    userId: user.id,
                    topicId: prediction.topicId,
                    riskScore: prediction.riskScore,
                    confidenceScore: prediction.confidence,
                    predictedMarkLoss: prediction.predictedMarkLoss,
                    recommendedActions: JSON.stringify(prediction.recommendations),
                    targetBy: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            })
        }

        return NextResponse.json(
            {
                success: true,
                data: {
                    predictions,
                    overall: {
                        examRiskScore,
                        progressCategory,
                        topicsAnalyzed: predictions.length,
                        topicsWithHighRisk: predictions.filter((p) => p.riskScore > 70)
                            .length,
                        estimatedPassProbability: 100 - examRiskScore,
                    },
                },
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error analyzing weaknesses:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to analyze weaknesses' },
            { status: 500 }
        )
    }
}
