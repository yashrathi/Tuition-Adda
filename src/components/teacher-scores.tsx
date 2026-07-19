import { Heart, NotebookPen, ShieldCheck, UserCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { RATING_CATEGORIES, type RatingCategoryKey } from "@/lib/constants";

const ICONS: Record<RatingCategoryKey, LucideIcon> = {
  discipline: ShieldCheck,
  patience: Heart,
  personalAttention: UserCheck,
  homework: NotebookPen,
};

type CategoryScore = Partial<Record<RatingCategoryKey, number | null>>;

export function TeacherScores({ reviews }: { reviews: CategoryScore[] }) {
  const stats = RATING_CATEGORIES.map((c) => {
    const values = reviews
      .map((r) => r[c.key])
      .filter((v): v is number => typeof v === "number" && v > 0);
    const avg =
      values.length > 0
        ? values.reduce((sum, v) => sum + v, 0) / values.length
        : null;
    return { ...c, avg, count: values.length, Icon: ICONS[c.key] };
  });

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {stats.map(({ key, label, avg, count, Icon }) => (
        <div key={key} className="rounded-lg border p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Icon className="size-4 shrink-0 text-primary" />
              <span className="text-sm font-medium">{label}</span>
            </div>
            <span className="text-sm tabular-nums">
              {avg != null ? (
                <>
                  <span className="font-semibold">{avg.toFixed(1)}</span>
                  <span className="text-muted-foreground"> / 5</span>
                </>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-amber-400 transition-all"
              style={{ width: `${avg != null ? (avg / 5) * 100 : 0}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {count > 0
              ? `${count} vote${count === 1 ? "" : "s"}`
              : "Not rated yet"}
          </p>
        </div>
      ))}
    </div>
  );
}
