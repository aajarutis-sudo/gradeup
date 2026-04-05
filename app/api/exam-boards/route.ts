import { NextResponse } from "next/server";
import { EXAM_BOARD_OPTIONS } from "@/lib/curriculum";

export async function GET() {
  const boards = EXAM_BOARD_OPTIONS.filter((option) => option.value !== "all").map((option) => ({
    id: option.value,
    name: option.label,
  }));

  return NextResponse.json(boards);
}
