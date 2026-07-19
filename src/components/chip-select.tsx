"use client";

import { cn } from "@/lib/utils";

type ChipSelectProps<T extends string | number> = {
  options: readonly T[];
  selected: T[];
  onChange: (next: T[]) => void;
  /** Single-select mode (still returns an array of 0–1 items) */
  single?: boolean;
  format?: (option: T) => string;
};

export function ChipSelect<T extends string | number>({
  options,
  selected,
  onChange,
  single = false,
  format = String,
}: ChipSelectProps<T>) {
  function toggle(option: T) {
    if (single) {
      onChange(selected.includes(option) ? [] : [option]);
      return;
    }
    onChange(
      selected.includes(option)
        ? selected.filter((s) => s !== option)
        : [...selected, option],
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(option)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-background hover:bg-muted",
            )}
          >
            {format(option)}
          </button>
        );
      })}
    </div>
  );
}
