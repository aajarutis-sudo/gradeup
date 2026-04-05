import { getViewer } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const viewer = await getViewer();
        if (!viewer) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const {
            questionText,
            marks,
            subjectId,
            sampleAnswer,
            markingCriteria,
            examBoard,
            year,
            paperNumber,
        } = body;

        if (!questionText || !marks || !subjectId) {
            return NextResponse.json(
                { error: "Missing required fields: questionText, marks, subjectId" },
                { status: 400 }
            );
        }

        // Verify subject exists
        const subject = await (prisma.subject as any).findUnique({
            where: { id: subjectId },
        });

        if (!subject) {
            return NextResponse.json(
                { error: "Subject not found" },
                { status: 404 }
            );
        }

        // Create timed question
        const timedQuestion = await (prisma.timedQuestion as any).create({
            data: {
                createdBy: viewer.id,
                subjectId,
                questionText,
                marks,
                sampleAnswer: sampleAnswer || "",
                markingCriteria: markingCriteria ? JSON.stringify(markingCriteria) : null,
                examBoard: examBoard || null,
                year: year || null,
                paperNumber: paperNumber || null,
                timePerMark: 1, // 1 minute per mark
            },
            include: {
                subject: {
                    select: { id: true, name: true, slug: true },
                },
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Question uploaded successfully",
                question: timedQuestion,
                allocatedTime: marks * 60, // seconds
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error uploading timed question:", error);
        return NextResponse.json(
            { error: "Failed to upload question" },
            { status: 500 }
        );
    }
}

// GET - List user's uploaded questions for a subject
export async function GET(request: NextRequest) {
    try {
        const viewer = await getViewer();
        if (!viewer) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const subjectId = searchParams.get("subjectId");

        const where: any = {
            createdBy: viewer.id,
        };

        if (subjectId) {
            where.subjectId = subjectId;
        }

        const questions = await (prisma.timedQuestion as any).findMany({
            where,
            include: {
                subject: {
                    select: { id: true, name: true, slug: true },
                },
                _count: {
                    select: { timedAttempts: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(
            {
                success: true,
                questions: questions.map((q: any) => ({
                    ...q,
                    allocatedTime: q.marks * 60,
                    attemptCount: q._count.timedAttempts,
                })),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching timed questions:", error);
        return NextResponse.json(
            { error: "Failed to fetch questions" },
            { status: 500 }
        );
    }
}
