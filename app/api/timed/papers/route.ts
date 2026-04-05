import { getViewer } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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

        // Get user's exam board choice for this subject
        const userSubject = await (prisma.userSubject as any).findUnique({
            where: {
                userId_subjectId: {
                    userId: viewer.id,
                    subjectId: subjectId,
                },
            },
        });

        if (!userSubject) {
            return NextResponse.json(
                { error: "Subject not selected by user" },
                { status: 404 }
            );
        }

        // Get past papers for this subject and exam board
        const papers = await (prisma.pastPaper as any).findMany({
            where: {
                subjectId: subjectId,
                examBoard: userSubject.examBoardSlug || undefined,
            },
            include: {
                subject: { select: { id: true, name: true, slug: true } },
            },
            orderBy: { year: "desc" },
        });

        // Also get questions for this subject (for when papers don't have extracted questions)
        const questions = await (prisma.question as any).findMany({
            where: { subjectId: subjectId },
            select: {
                id: true,
                questionText: true,
                marks: true,
                difficulty: true,
                year: true,
                examBoard: true,
            },
            orderBy: [{ year: "desc" }, { difficulty: "asc" }],
        });

        return NextResponse.json(
            {
                success: true,
                userExamBoard: userSubject.examBoardSlug,
                papers: papers.map((p: any) => ({
                    id: p.id,
                    year: p.year,
                    paperNumber: p.paperNumber,
                    tier: p.tier,
                    series: p.series,
                    examBoard: p.examBoard,
                })),
                practiceQuestions: questions.slice(0, 10), // Show first 10 questions as practice
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching papers:", error);
        return NextResponse.json(
            { error: "Failed to fetch papers" },
            { status: 500 }
        );
    }
}
