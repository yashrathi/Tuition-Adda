"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { RATING_CATEGORIES, type RatingCategoryKey } from "@/lib/constants";
import { StarRating } from "@/components/star-rating";
import { deleteRating, submitRating } from "@/lib/actions/ratings";

type CategoryScores = Partial<Record<RatingCategoryKey, number>>;

type Props = {
  teacherId: string;
  existing?: ({ stars: number; review: string } & CategoryScores) | null;
};

function StarPicker({
  value,
  onChange,
  size = "size-7",
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: string;
  label?: string;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          aria-label={`${label ? `${label}: ` : ""}${i} star${i === 1 ? "" : "s"}`}
          onClick={() => onChange(i === value ? 0 : i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
        >
          <Star
            className={cn(
              size,
              "transition-colors",
              i <= (hover || value)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/40",
            )}
          />
        </button>
      ))}
    </div>
  );
}

function initCategories(existing?: CategoryScores | null): CategoryScores {
  const init: CategoryScores = {};
  for (const c of RATING_CATEGORIES) init[c.key] = existing?.[c.key] ?? 0;
  return init;
}

export function RatingForm({ teacherId, existing }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [stars, setStars] = useState(existing?.stars ?? 0);
  const [review, setReview] = useState(existing?.review ?? "");
  const [categories, setCategories] = useState<CategoryScores>(() =>
    initCategories(existing),
  );
  // Collapse to a summary once a rating exists; expand only when editing.
  const [editing, setEditing] = useState(false);

  function setCategory(key: RatingCategoryKey, v: number) {
    setCategories((prev) => ({ ...prev, [key]: v }));
  }

  function resetToExisting() {
    setStars(existing?.stars ?? 0);
    setReview(existing?.review ?? "");
    setCategories(initCategories(existing));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (stars < 1) {
      toast.error("Pick a star rating first.");
      return;
    }
    startTransition(async () => {
      const result = await submitRating({
        teacherId,
        stars,
        review,
        ...categories,
      });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(existing ? "Rating updated!" : "Thanks for rating!");
      setEditing(false);
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteRating(teacherId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setStars(0);
      setReview("");
      setCategories({});
      setEditing(true);
      toast.success("Rating removed.");
      router.refresh();
    });
  }

  // Collapsed summary of the student's saved rating.
  if (existing && !editing) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <StarRating value={existing.stars} />
          <span className="text-sm font-medium">
            {existing.stars.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground">overall</span>
        </div>
        <div className="grid gap-x-4 gap-y-1.5 rounded-lg border bg-muted/30 p-3 sm:grid-cols-2">
          {RATING_CATEGORIES.map((c) => {
            const v = existing[c.key] ?? 0;
            return (
              <div
                key={c.key}
                className="flex items-center justify-between gap-2"
              >
                <span className="text-sm text-muted-foreground">{c.label}</span>
                {v > 0 ? (
                  <StarRating value={v} />
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </div>
            );
          })}
        </div>
        {existing.review && (
          <p className="text-sm text-muted-foreground">
            &ldquo;{existing.review}&rdquo;
          </p>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setEditing(true)}
        >
          Edit rating
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <div className="text-sm font-medium">Overall rating</div>
        <StarPicker value={stars} onChange={setStars} label="Overall" />
      </div>

      <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
        <div className="text-sm font-medium">Rate by category</div>
        <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
          {RATING_CATEGORIES.map((c) => (
            <div
              key={c.key}
              className="flex items-center justify-between gap-2"
            >
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <StarPicker
                value={categories[c.key] ?? 0}
                onChange={(v) => setCategory(c.key, v)}
                size="size-5"
                label={c.label}
              />
            </div>
          ))}
        </div>
      </div>

      <Textarea
        rows={3}
        placeholder="How was your experience? (optional)"
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : existing ? "Update rating" : "Submit rating"}
        </Button>
        {existing && (
          <>
            <Button
              type="button"
              variant="ghost"
              disabled={pending}
              onClick={() => {
                resetToExisting();
                setEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={pending}
              onClick={handleDelete}
            >
              Remove
            </Button>
          </>
        )}
      </div>
    </form>
  );
}
