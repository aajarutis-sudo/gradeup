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
        const { subjectId, examBoardSlug } = body;

        if (!subjectId) {
            return NextResponse.json({ error: "Subject ID required" }, { status: 400 });
        }

        // Verify subject exists
        const subject = await prisma.subject.findUnique({
            where: { id: subjectId }
        });

        if (!subject) {
            return NextResponse.json({ error: "Subject not found" }, { status: 404 });
        }

        // Create or update user subject selection
        const userSubject = await prisma.userSubject.upsert({
            where: {
                userId_subjectId: {
                    userId: viewer.id,
                    subjectId
                }
            },
            update: {
                examBoardSlug: examBoardSlug || null,
                examBoardId: null
            },
            create: {
                userId: viewer.id,
                subjectId,
                examBoardSlug: examBoardSlug || null
            }
        });

        return NextResponse.json({
            success: true,
            userSubject
        });

    } catch (error) {
        console.error("Error saving subject selection:", error);
        return NextResponse.json(
            { error: "Failed to save subject selection" },
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

        // Get all user's selected subjects with their exam boards
        const userSubjects = await prisma.userSubject.findMany({
            where: { userId: viewer.id },
            include: {
                subject: {
                    include: {
                        questions: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            userSubjects
        });

    } catch (error) {
        console.error("Error fetching user subjects:", error);
        return NextResponse.json(
            { error: "Failed to fetch user subjects" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const viewer = await getViewer();
        if (!viewer) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { subjectId } = body;

        if (!subjectId) {
            return NextResponse.json({ error: "Subject ID required" }, { status: 400 });
        }

        await prisma.userSubject.delete({
            where: {
                userId_subjectId: {
                    userId: viewer.id,
                    subjectId
                }
            }
        });

        return NextResponse.json({
            success: true,
            message: "Subject removed"
        });

    } catch (error) {
        console.error("Error removing subject:", error);
        return NextResponse.json(
            { error: "Failed to remove subject" },
            { status: 500 }
        );
    }
}
