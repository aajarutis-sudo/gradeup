import { getViewer } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || "",
});

interface SubmitAnswerBody {
    timedQuestionId: string;
    userAnswer: string;
    timeSpent: number; // in seconds
}

export async function POST(request: NextRequest) {
    try {
        const viewer = await getViewer();
        if (!viewer) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = (await request.json()) as SubmitAnswerBody;
        const { timedQuestionId, userAnswer, timeSpent } = body;

        if (!timedQuestionId || !userAnswer) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Get the question
        const question = await (prisma.timedQuestion as any).findUnique({
            where: { id: timedQuestionId },
            include: {
                subject: { select: { name: true } },
            },
        });

        if (!question) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            );
        }

        const allocatedTime = question.marks * 60; // 1 minute per mark
        const timingFeedback =
            timeSpent > allocatedTime
                ? `⏱️ You took ${Math.ceil((timeSpent - allocatedTime) / 60)} extra minute(s) - try to work faster next time!`
                : `✓ You completed in ${Math.floor(timeSpent / 60)}:${String(timeSpent % 60).padStart(2, "0")} (allocated: ${question.marks} min)`;

        // Create marking prompt
        const markingPrompt = `You are an experienced GCSE examiner. Mark this student's exam answer.

Subject: ${question.subject.name}
Question: ${question.questionText}
Total Marks: ${question.marks}

${question.sampleAnswer ? `Expected Answer/Model Answer:\n${question.sampleAnswer}\n` : ""}

${question.markingCriteria
                ? `Marking Guide:\n${question.markingCriteria}\n`
                : ""
            }

Student's Answer:
${userAnswer}

Please provide:
1. Score out of ${question.marks} marks
2. Why this score was awarded
3. Areas to improve (specific, actionable)
4. Your confidence level (0-1)

Format as JSON with fields: score, reasoning, improvements (array), confidence`;

        // Call Claude for marking
        const message = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1024,
            messages: [
                {
                    role: "user",
                    content: markingPrompt,
                },
            ],
        });

        let markingResult = {
            score: 0,
            reasoning: "Unable to mark",
            improvements: [] as string[],
            confidence: 0,
        };

        const responseText =
            message.content[0].type === "text" ? message.content[0].text : "";

        try {
            // Extract JSON from response
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                markingResult = {
                    score: Math.min(
                        Math.max(parsed.score || 0, 0),
                        question.marks
                    ),
                    reasoning: parsed.reasoning || "Marked by AI examiner",
                    improvements: Array.isArray(parsed.improvements)
                        ? parsed.improvements
                        : [],
                    confidence: Math.min(Math.max(parsed.confidence || 0, 0), 1),
                };
            }
        } catch {
            markingResult.reasoning = responseText.substring(0, 500);
        }

        // Save attempt
        const attempt = await (prisma.timedAttempt as any).create({
            data: {
                userId: viewer.id,
                timedQuestionId,
                userAnswer,
                timeSpent,
                allocatedTime,
                markedScore: markingResult.score,
                aiMarkingComment: markingResult.reasoning,
                areasToImprove: JSON.stringify(markingResult.improvements),
                confidence: markingResult.confidence,
                markedAt: new Date(),
            },
        });

        // Calculate grade (GCSE 1-9 scale)
        const percentage = (markingResult.score / question.marks) * 100;
        const GRADE_BOUNDARIES = [
            { grade: 9, min: 80 },
            { grade: 8, min: 70 },
            { grade: 7, min: 60 },
            { grade: 6, min: 50 },
            { grade: 5, min: 40 },
            { grade: 4, min: 30 },
            { grade: 3, min: 20 },
            { grade: 2, min: 10 },
            { grade: 1, min: 0 },
        ];

        const grade = GRADE_BOUNDARIES.find((b) => percentage >= b.min)?.grade || 1;

        return NextResponse.json(
            {
                success: true,
                marking: {
                    score: markingResult.score,
                    outOf: question.marks,
                    percentage: Math.round(percentage),
                    grade,
                    reasoning: markingResult.reasoning,
                    improvements: markingResult.improvements,
                    confidence: markingResult.confidence,
                    timingFeedback,
                    timeSpent,
                    allocatedTime,
                },
                attemptId: attempt.id,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error marking timed answer:", error);
        return NextResponse.json(
            { error: "Failed to mark answer" },
            { status: 500 }
        );
    }
}
