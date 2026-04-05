const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function StreakHeatmap({
  dateKeys,
  days = 56,
}: {
  dateKeys: string[];
  days?: number;
}) {
  const recentDays = Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - ((days - 1) - index));
    const key = date.toISOString().slice(0, 10);
    const todayKey = new Date().toISOString().slice(0, 10);
    return {
      key,
      day: weekdayNames[(date.getUTCDay() + 6) % 7],
      active: dateKeys.includes(key),
      isToday: key === todayKey,
    };
  });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-3">
        {weekdayNames.map((day) => (
          <p key={day} className="text-center text-xs font-medium text-muted">
            {day}
          </p>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-3">
        {recentDays.map((day) => (
          <div
            key={day.key}
            className={`h-12 rounded-2xl border ${day.isToday ? "ring-2 ring-[var(--primary)]" : ""}`}
            style={{
              background: day.active
                ? "var(--accent)"
                : day.isToday
                  ? "color-mix(in srgb, var(--accent) 22%, var(--surface-strong))"
                  : "var(--surface-strong)",
              borderColor: day.isToday ? "var(--primary)" : "var(--border)",
              opacity: day.active || day.isToday ? 1 : 0.7,
            }}
            title={day.key}
          />
        ))}
      </div>
    </div>
  );
}
