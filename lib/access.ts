export type GradeUpPlan = "free" | "plus";
export type PlanFeature =
  | "dashboard"
  | "subjects"
  | "quizzes"
  | "flashcards"
  | "timetables"
  | "past-papers"
  | "onboarding"
  | "ai-chat"
  | "ai-notes"
  | "ai-practice"
  | "advanced-ai-feedback";

export const PLAN_FEATURES: Record<GradeUpPlan, PlanFeature[]> = {
  free: [
    "dashboard",
    "subjects",
    "quizzes",
    "flashcards",
    "timetables",
    "past-papers",
    "onboarding",
  ],
  plus: [
    "dashboard",
    "subjects",
    "quizzes",
    "flashcards",
    "timetables",
    "past-papers",
    "onboarding",
    "ai-chat",
    "ai-notes",
    "ai-practice",
    "advanced-ai-feedback",
  ],
} as const;

function parseList(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function getUserPlan(viewer?: { email?: string | null; clerkId?: string | null } | null): GradeUpPlan {
  if (!viewer) {
    return "free";
  }

  const plusEmails = parseList(process.env.GRADEUP_PLUS_EMAILS);
  const plusClerkIds = parseList(process.env.GRADEUP_PLUS_CLERK_IDS);

  if (viewer.email && plusEmails.includes(viewer.email.toLowerCase())) {
    return "plus";
  }

  if (viewer.clerkId && plusClerkIds.includes(viewer.clerkId.toLowerCase())) {
    return "plus";
  }

  return "free";
}

export function hasPlanFeature(plan: GradeUpPlan, feature: PlanFeature) {
  return PLAN_FEATURES[plan].includes(feature);
}

export function getPlanLabel(plan: GradeUpPlan) {
  return plan === "plus" ? "GradeUp Plus" : "GradeUp Free";
}
