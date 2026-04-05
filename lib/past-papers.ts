import type { ExamBoardValue } from "@/lib/curriculum";

export type PaperTier = "FOUNDATION" | "HIGHER" | "NONE";

export const PRACTICE_MODE_OPTIONS = [
  { value: "timed", label: "Timed mode", description: "Work with a countdown and exam pressure." },
  { value: "untimed", label: "Untimed mode", description: "Revise at a steady pace without the clock." },
  { value: "question", label: "Question-by-question", description: "Move through one question at a time." },
  { value: "full", label: "Full-paper mode", description: "Open the whole paper in one workspace." },
] as const;

export type PracticeMode = (typeof PRACTICE_MODE_OPTIONS)[number]["value"];

export const PAPER_NUMBER_OPTIONS = [1, 2, 3] as const;

export const PAPER_TIER_OPTIONS: Array<{ value: PaperTier; label: string }> = [
  { value: "NONE", label: "All tiers" },
  { value: "FOUNDATION", label: "Foundation" },
  { value: "HIGHER", label: "Higher" },
];

export function parsePaperNumber(value?: string): number | undefined {
  if (value === "1" || value === "2" || value === "3") {
    return Number(value);
  }

  return undefined;
}

export function parsePaperTier(value?: string): PaperTier | undefined {
  if (value === "FOUNDATION" || value === "HIGHER" || value === "NONE") {
    return value;
  }

  return undefined;
}

export function parsePracticeMode(value?: string): PracticeMode {
  if (value === "timed" || value === "untimed" || value === "question" || value === "full") {
    return value;
  }

  return "untimed";
}

export function shouldShowTier(subjectName: string) {
  return /math|science|biology|chemistry|physics/i.test(subjectName);
}

export function getBoardLabel(board?: ExamBoardValue | string | null) {
  return board ?? "GCSE";
}

export function getTierLabel(tier: PaperTier) {
  if (tier === "FOUNDATION") {
    return "Foundation";
  }

  if (tier === "HIGHER") {
    return "Higher";
  }

  return "All tiers";
}

export function getPracticeDurationMinutes(mode: PracticeMode, defaultDuration?: number | null) {
  if (mode === "question") {
    return 25;
  }

  if (mode === "timed") {
    return defaultDuration ?? 75;
  }

  if (mode === "full") {
    return defaultDuration ?? 90;
  }

  return defaultDuration ?? 45;
}
