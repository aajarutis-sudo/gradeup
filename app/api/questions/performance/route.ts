import { getViewer } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GCSE Grade boundaries (1-9 scale)
const GRADE_BOUNDARIES = [
    { grade: 9, min: 80 },
    { grade: 8, min: 70 },
    { grade: 7, min: 60 },
    { grade: 6, min: 50 },
    { grade: 5, min: 40 },
    { grade: 4, min: 30 },
    { grade: 3, min: 20 },
    { grade: 2, min: 10 },
    { grade: 1, min: 0 }
];

export function calculateGrade(percentage: number): number {
    for (const boundary of GRADE_BOUNDARIES) {
        if (percentage >= boundary.min) {
            return boundary.grade;
        }
    }
    return 1;
}

export async function GET(request: NextRequest) {
    try {
        const viewer = await getViewer();
        if (!viewer) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const subjectId = searchParams.get("subjectId");

        if (!subjectId) {
            return NextResponse.json(
                { error: "Subject ID required" },
                { status: 400 }
            );
        }

        // Get all questions for this subject that the user has answered
        const answers = await (prisma.questionAnswer as any).findMany({
            where: {
                userId: viewer.id,
                question: {
                    subjectId
                }
            },
            include: {
                question: true
            }
        });

        if (answers.length === 0) {
            return NextResponse.json({
                success: true,
                performance: {
                    totalQuestions: 0,
                    attemptedQuestions: 0,
                    totalMarksEarned: 0,
                    totalMarksPossible: 0,
                    percentage: 0,
                    grade: 0,
                    feedback: "No answers recorded yet"
                }
            });
        }

        // Calculate performance metrics
        const attemptedQuestions = answers.filter((a: any) => a.markedScore !== null).length;
        const totalMarksEarned = answers.reduce((sum: number, a: any) => sum + (a.markedScore || 0), 0);
        const totalMarksPossible = answers.reduce((sum: number, a: any) => sum + a.question.marks, 0);
        const percentage = totalMarksPossible > 0 ? (totalMarksEarned / totalMarksPossible) * 100 : 0;
        const predictedGrade = calculateGrade(percentage);

        // Generate feedback
        let feedback = "";
        if (percentage >= 80) {
            feedback = "Excellent work! You're well-prepared for this subject.";
        } else if (percentage >= 60) {
            feedback = "Good progress! Keep practicing to improve further.";
        } else if (percentage >= 40) {
            feedback = "You're making progress. Focus on areas where you're losing marks.";
        } else {
            feedback = "Continue practicing. Identify weak topics and focus on them.";
        }

        // Get subject count
        const totalQuestions = await (prisma.question as any).count({
            where: { subjectId }
        });

        return NextResponse.json({
            success: true,
            performance: {
                totalQuestions,
                attemptedQuestions,
                totalMarksEarned,
                totalMarksPossible,
                percentage: Math.round(percentage),
                grade: predictedGrade,
                feedback,
                answers: answers.map((a: any) => ({
                    questionId: a.questionId,
                    marks: a.markedScore,
                    maxMarks: a.question.marks,
                    confidence: a.confidence
                }))
            }
        });

    } catch (error) {
        console.error("Error calculating performance:", error);
        return NextResponse.json(
            { error: "Failed to calculate performance" },
            { status: 500 }
        );
    }
}
