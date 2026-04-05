import { getViewer } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const viewer = await getViewer();
        if (!viewer) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Mark user as onboarded
        const updatedUser = await prisma.user.update({
            where: { id: viewer.id },
            data: { onboardedAt: new Date() }
        });

        return NextResponse.json({
            success: true,
            user: updatedUser
        });

    } catch (error) {
        console.error("Error marking user as onboarded:", error);
        return NextResponse.json(
            { error: "Failed to mark user as onboarded" },
            { status: 500 }
        );
    }
}
