import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ board: string }> },
) {
  const { board } = await params;

  // Get the exam board record
  const examBoard = await prisma.examBoard.findUnique({
    where: { slug: board.toLowerCase() },
  });

  if (!examBoard) {
    return NextResponse.json({ error: "Exam board not found" }, { status: 404 });
  }

  // Get all subjects that have papers for this exam board
  const subjects = await prisma.subject.findMany({
    distinct: ["id"],
    where: {
      pastPapers: {
        some: {
          examBoardId: examBoard.id,
        },
      },
    },
    orderBy: [{ title: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      title: true,
      createdAt: true,
    },
  });

  return NextResponse.json(subjects);
}
