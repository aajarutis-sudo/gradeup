import type { ReactNode } from "react";

export type RadioGroupOption = {
  value: string;
  label: string;
  description?: string;
};

export default function RadioGroup({
  name,
  options,
  value,
  onChange,
  renderOption,
}: {
  name: string;
  options: RadioGroupOption[];
  value?: string;
  onChange: (value: string) => void;
  renderOption?: (option: RadioGroupOption, checked: boolean) => ReactNode;
}) {
  return (
    <div className="space-y-3">
      {options.map((option) => {
        const checked = value === option.value;
        return (
          <label key={option.value} className="block cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {renderOption ? (
              renderOption(option, checked)
            ) : (
              <div
                className={`rounded-2xl border px-4 py-3 transition ${
                  checked
                    ? "border-[var(--primary)] bg-[color-mix(in_srgb,var(--accent)_25%,transparent)]"
                    : "border-[var(--border)] bg-[var(--background-elevated)]"
                }`}
              >
                <p className="font-semibold">{option.label}</p>
                {option.description ? <p className="mt-1 text-sm text-muted">{option.description}</p> : null}
              </div>
            )}
          </label>
        );
      })}
    </div>
  );
}
