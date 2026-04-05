import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ paperId: string }> },
) {
  const { paperId } = await params;
  const paper = await prisma.pastPaper.findUnique({
    where: { id: paperId },
    include: {
      subject: {
        select: {
          id: true,
          slug: true,
          name: true,
          title: true,
        },
      },
      examBoard: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!paper) {
    return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: paper.id,
    title: paper.title ?? `${paper.subject.name ?? paper.subject.title} ${paper.paperNumber}`,
    year: paper.year,
    paperNumber: paper.paperNumber,
    tier: paper.tier,
    examBoard: paper.examBoard.name,
    overview: paper.overview,
    durationMinutes: paper.durationMinutes,
    questionFocus: paper.questionFocus,
    subject: paper.subject,
    paper: {
      url: paper.fileUrl,
      label: paper.paperCode ?? paper.paperNumber,
    },
    markScheme: paper.markSchemeUrl
      ? {
          url: paper.markSchemeUrl,
          label: `${paper.paperCode ?? paper.paperNumber} mark scheme`,
        }
      : null,
  });
}
