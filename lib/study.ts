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
  const today = new Date();

  return topics
    .sort((a, b) => {
      const progressA = a.progress?.[0]?.completed ?? 0;
      const progressB = b.progress?.[0]?.completed ?? 0;
      return progressA - progressB || a.orderIndex - b.orderIndex;
    })
    .slice(0, 14)
    .map((topic, index) => {
      const calendarDate = new Date(today);
      calendarDate.setDate(today.getDate() + index);
      const dayIndex = (calendarDate.getDay() + 6) % 7;
      const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

      return {
        dayIndex,
        dayLabel: weekdayLabels[dayIndex],
        isToday: index === 0,
        dateLabel: calendarDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        topic,
        focusMinutes: Math.min(35, Math.max(20, topic.estimatedMins - 5 + ((index % 3) * 5))),
        breakMinutes: index % 2 === 0 ? 10 : 15,
        sessionLabel: index % 3 === 0 ? "Recovery + recall" : index % 3 === 1 ? "Core practice" : "Mixed review",
      };
    });
}
