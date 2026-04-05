const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function StreakHeatmap({
  dateKeys,
  days = 56,
}: {
  dateKeys: string[];
  days?: number;
}) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const recentDays = Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - ((days - 1) - index));
    const key = date.toISOString().slice(0, 10);
    return {
      key,
      day: weekdayNames[(date.getUTCDay() + 6) % 7],
      active: dateKeys.includes(key),
      isToday: key === todayKey,
    };
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="grid flex-1 grid-cols-7 gap-3">
          {weekdayNames.map((day) => (
            <p key={day} className="text-center text-xs font-medium text-muted">
              {day}
            </p>
          ))}
        </div>
        <div className="hidden items-center gap-2 rounded-full bg-[var(--surface-strong)] px-3 py-1 text-[11px] font-medium text-muted md:flex">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
          Today
        </div>
      </div>
      <div className="grid grid-cols-7 gap-3">
        {recentDays.map((day) => (
          <div
            key={day.key}
            aria-label={`${day.key}${day.isToday ? " (today)" : ""}${day.active ? " with activity" : ""}`}
            className={`relative h-12 rounded-2xl border transition ${day.isToday ? "shadow-[0_0_0_2px_color-mix(in_srgb,var(--primary)_55%,transparent)]" : ""}`}
            style={{
              background: day.active
                ? "var(--accent)"
                : day.isToday
                  ? "color-mix(in srgb, var(--primary) 18%, var(--surface-strong))"
                  : "var(--surface-strong)",
              borderColor: day.isToday
                ? "color-mix(in srgb, var(--primary) 75%, white 25%)"
                : "var(--border)",
              opacity: day.active || day.isToday ? 1 : 0.7,
            }}
            title={day.key}
          >
            {day.isToday ? (
              <span
                className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full"
                style={{
                  background: day.active ? "white" : "var(--primary)",
                  boxShadow: "0 0 0 2px color-mix(in srgb, var(--surface-strong) 55%, transparent)",
                }}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
