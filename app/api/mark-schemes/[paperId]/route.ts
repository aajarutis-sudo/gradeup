import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ paperId: string }> },
) {
  const { paperId } = await params;
  const paper = await prisma.pastPaper.findUnique({
    where: { id: paperId },
  });

  if (!paper) {
    return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  }

  if (!paper.markSchemeUrl) {
    return NextResponse.json({ error: "Mark scheme not found" }, { status: 404 });
  }

  return NextResponse.json({ url: paper.markSchemeUrl });
}
