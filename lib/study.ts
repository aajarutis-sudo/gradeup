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
  const today = new Date();
  const todayIndex = (today.getDay() + 6) % 7;

  return topics
    .sort((a, b) => {
      const progressA = a.progress?.[0]?.completed ?? 0;
      const progressB = b.progress?.[0]?.completed ?? 0;
      return progressA - progressB || a.orderIndex - b.orderIndex;
    })
    .slice(0, 14)
    .map((topic, index) => {
      const dayIndex = index % weekdayLabels.length;
      const offset = (dayIndex - todayIndex + 7) % 7;
      const calendarDate = new Date(today);
      calendarDate.setDate(today.getDate() + offset + (index >= weekdayLabels.length ? 7 : 0));

      return {
        dayIndex,
        dayLabel: weekdayLabels[dayIndex],
        isToday: dayIndex === todayIndex && index < weekdayLabels.length,
        dateLabel: calendarDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        topic,
        focusMinutes: Math.min(35, Math.max(20, topic.estimatedMins - 5 + ((index % 3) * 5))),
        breakMinutes: index % 2 === 0 ? 10 : 15,
        sessionLabel: index % 3 === 0 ? "Recovery + recall" : index % 3 === 1 ? "Core practice" : "Mixed review",
      };
    });
}
