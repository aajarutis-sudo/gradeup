import { NextResponse } from "next/server";
import { getViewer } from "@/lib/auth";
import { logDailyStudy } from "@/lib/gamification";

export async function POST(req: Request) {
  const viewer = await getViewer();
  if (!viewer) {
    return NextResponse.json({ error: "User sync failed" }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const activity = typeof body.activity === "string" ? body.activity : "study";

  const streak = await logDailyStudy(viewer.id, activity);

  return NextResponse.json({ ok: true, streak });
}
