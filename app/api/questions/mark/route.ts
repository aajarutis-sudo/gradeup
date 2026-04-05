import { getViewer } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || ""
});

export async function POST(request: NextRequest) {
    try {
        const viewer = await getViewer();
        if (!viewer) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { questionId, userAnswer } = body;

        if (!questionId || !userAnswer) {
            return NextResponse.json(
                { error: "Question ID and answer required" },
                { status: 400 }
            );
        }

        // Get the question
        const question = await (prisma.question as any).findUnique({
            where: { id: questionId }
        });

        if (!question) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            );
        }

        // Parse marking criteria
        let markingCriteria;
        try {
            markingCriteria = JSON.parse(question.markingCriteria);
        } catch {
            markingCriteria = {};
        }

        // Create prompt for AI marker
        const markingPrompt = `You are an experienced GCSE examiner. Mark the following student answer based on the criteria provided.

Question: ${question.questionText}
Total Marks: ${question.marks}

Sample Answer/Model Answer:
${question.sampleAnswer}

Marking Criteria:
${JSON.stringify(markingCriteria, null, 2)}

Student's Answer:
${userAnswer}

Please:
1. Award a score out of ${question.marks} marks
2. Explain why this mark was awarded
3. Provide specific feedback for improvement
4. Rate your confidence in this marking (0-1)

Format your response as JSON with fields: score, comment, feedback, confidence`;

        // Call Claude API for marking
        const message = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1024,
            messages: [
                {
                    role: "user",
                    content: markingPrompt
                }
            ]
        });

        // Parse the response
        const responseText = message.content[0].type === "text" ? message.content[0].text : "";

        let markingResult;
        try {
            // Extract JSON from response
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                markingResult = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("No JSON found in response");
            }
        } catch (parseError) {
            console.error("Failed to parse AI response:", responseText);
            markingResult = {
                score: Math.floor(question.marks / 2),
                comment: "Unable to parse marking",
                feedback: responseText,
                confidence: 0.5
            };
        }

        // Store the answer and marking
        const answerRecord = await (prisma.questionAnswer as any).upsert({
            where: {
                userId_questionId: {
                    userId: viewer.id,
                    questionId
                }
            },
            update: {
                userAnswer,
                markedScore: markingResult.score,
                aiMarkingComment: markingResult.comment,
                confidence: markingResult.confidence,
                markedAt: new Date()
            },
            create: {
                userId: viewer.id,
                questionId,
                userAnswer,
                markedScore: markingResult.score,
                aiMarkingComment: markingResult.comment,
                confidence: markingResult.confidence,
                markedAt: new Date()
            }
        });

        return NextResponse.json({
            success: true,
            marking: {
                score: markingResult.score,
                maxScore: question.marks,
                comment: markingResult.comment,
                feedback: markingResult.feedback,
                confidence: markingResult.confidence
            },
            answerRecord
        });

    } catch (error) {
        console.error("Error marking answer:", error);
        return NextResponse.json(
            { error: "Failed to mark answer" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const viewer = await getViewer();
        if (!viewer) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const questionId = searchParams.get("questionId");

        if (!questionId) {
            return NextResponse.json(
                { error: "Question ID required" },
                { status: 400 }
            );
        }

        // Get marking for this question
        const answer = await (prisma.questionAnswer as any).findUnique({
            where: {
                userId_questionId: {
                    userId: viewer.id,
                    questionId
                }
            }
        });

        if (!answer) {
            return NextResponse.json(
                { error: "No answer found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            answer
        });

    } catch (error) {
        console.error("Error fetching marking:", error);
        return NextResponse.json(
            { error: "Failed to fetch marking" },
            { status: 500 }
        );
    }
}
