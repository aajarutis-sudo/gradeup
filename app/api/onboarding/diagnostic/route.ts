import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getViewer } from "@/lib/auth";
import { saveDiagnosticResult } from "@/lib/onboarding";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const viewer = await getViewer();
    if (!viewer) {
      return NextResponse.json({ error: "Unable to load user" }, { status: 500 });
    }

    const body = await req.json();
    const {
      subjectSlug,
      answers,
    } = body as {
      subjectSlug?: string;
      answers?: Array<{ questionId: string; selected: string }>;
    };

    if (!subjectSlug || !answers?.length) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const subject = await prisma.subject.findUnique({
      where: { slug: subjectSlug },
    });

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    await saveDiagnosticResult({
      userId: viewer.id,
      subjectSlug,
      answers,
    });

    return NextResponse.json({ ok: true, subjectSlug });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save diagnostic result.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
