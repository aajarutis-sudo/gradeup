import type { RadioGroupOption } from "@/components/ui/RadioGroup";

export default function QuizOption({
  option,
  checked,
}: {
  option: RadioGroupOption;
  checked: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border px-4 py-4 transition ${
        checked
          ? "border-[var(--primary)] bg-[color-mix(in_srgb,var(--accent)_22%,transparent)]"
          : "border-[var(--border)] bg-[var(--background-elevated)] hover:border-[var(--accent)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
            checked ? "bg-[var(--primary)] text-white" : "bg-[var(--accent)]/30 text-[var(--foreground)]"
          }`}
        >
          {option.label.charAt(0)}
        </span>
        <div>
          <p className="font-semibold">{option.label}</p>
          {option.description ? <p className="mt-1 text-sm text-muted">{option.description}</p> : null}
        </div>
      </div>
    </div>
  );
}
