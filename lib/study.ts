import type { Topic, UserProgress } from "@prisma/client";

export function calculateTopicCompletion(progress?: UserProgress | null) {
  return progress?.completed ?? 0;
}

export function getProgressLabel(value: number) {
  if (value >= 100) return "Completed";
  if (value >= 60) return "In rhythm";
  if (value > 0) return "Started";
  return "Not started";
}

export function buildWeeklySchedule(
  topics: Array<
    Topic & {
      subject: { name: string | null; title?: string; slug?: string; color: string | null };
      progress?: UserProgress[];
    }
  >
) {
  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return topics
    .sort((a, b) => {
      const progressA = a.progress?.[0]?.completed ?? 0;
      const progressB = b.progress?.[0]?.completed ?? 0;
      return progressA - progressB || a.orderIndex - b.orderIndex;
    })
    .slice(0, 14)
    .map((topic, index) => ({
      dayIndex: index % weekdayLabels.length,
      dayLabel: weekdayLabels[index % weekdayLabels.length],
      topic,
      focusMinutes: Math.min(35, Math.max(20, topic.estimatedMins - 5 + ((index % 3) * 5))),
      breakMinutes: index % 2 === 0 ? 10 : 15,
      sessionLabel: index % 3 === 0 ? "Recovery + recall" : index % 3 === 1 ? "Core practice" : "Mixed review",
    }));
}
