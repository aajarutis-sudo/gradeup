import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parseExamBoard } from "@/lib/curriculum";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const board = parseExamBoard(searchParams.get("board") ?? undefined);
  const subjectSlug = searchParams.get("subject") ?? undefined;
  const yearValue = searchParams.get("year");
  const paperNumber = searchParams.get("paperNumber") ?? undefined;
  const tier = searchParams.get("tier") ?? undefined;
  const year = yearValue ? Number(yearValue) : undefined;

  const papers = await prisma.pastPaper.findMany({
    where: {
      examBoard: board
        ? {
            slug: board.toLowerCase(),
          }
        : undefined,
      year: Number.isFinite(year) ? year : undefined,
      paperNumber: paperNumber ? { contains: paperNumber } : undefined,
      tier: tier === "NONE" ? undefined : tier,
      subject: subjectSlug
        ? {
          slug: subjectSlug,
        }
        : undefined,
    },
    include: {
      subject: {
        select: {
          id: true,
          slug: true,
          name: true,
          title: true,
          examBoard: true,
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
    orderBy: [{ year: "desc" }, { paperNumber: "asc" }, { tier: "asc" }],
  });

  return NextResponse.json(
    papers.map((paper) => ({
      id: paper.id,
      title: paper.title ?? `${paper.subject.name ?? paper.subject.title} ${paper.paperNumber}`,
      year: paper.year,
      paperNumber: paper.paperNumber,
      tier: paper.tier,
      examBoard: paper.examBoard.name,
      subject: paper.subject,
      overview: paper.overview ?? `${paper.subject.name ?? paper.subject.title} ${paper.paperNumber} from ${paper.year}.`,
      durationMinutes: paper.durationMinutes,
      questionFocus: paper.questionFocus,
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
    })),
  );
}
