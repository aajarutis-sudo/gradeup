const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function StreakHeatmap({
  dateKeys,
}: {
  dateKeys: string[];
}) {
  const recentDays = Array.from({ length: 21 }, (_, index) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - (20 - index));
    const key = date.toISOString().slice(0, 10);
    return {
      key,
      day: weekdayNames[(date.getUTCDay() + 6) % 7],
      active: dateKeys.includes(key),
    };
  });

  return (
    <div className="grid grid-cols-7 gap-3">
      {recentDays.map((day) => (
        <div key={day.key} className="space-y-2 text-center">
          <p className="text-xs font-medium text-muted">{day.day}</p>
          <div
            className="h-12 rounded-2xl border"
            style={{
              background: day.active ? "var(--accent)" : "var(--surface-strong)",
              borderColor: "var(--border)",
              opacity: day.active ? 1 : 0.7,
            }}
            title={day.key}
          />
        </div>
      ))}
    </div>
  );
}
