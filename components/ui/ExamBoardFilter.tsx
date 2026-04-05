import Link from "next/link";
import { EXAM_BOARD_OPTIONS } from "@/lib/curriculum";

export default function ExamBoardFilter({
  basePath,
  selected,
}: {
  basePath: string;
  selected: string;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {EXAM_BOARD_OPTIONS.map((option, index) => {
        const active = option.value === selected;
        const href = option.value === "all" ? basePath : `${basePath}?board=${option.value}`;

        return (
          <Link
            key={option.value}
            href={href}
            className={`animate-fade-up stagger-${(index % 4) + 1} rounded-full px-4 py-2 text-sm font-semibold transition ${
              active
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--background-elevated)]"
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
