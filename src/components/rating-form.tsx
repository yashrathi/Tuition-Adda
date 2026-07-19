"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { deleteRating, submitRating } from "@/lib/actions/ratings";

type Props = {
  teacherId: string;
  existing?: { stars: number; review: string } | null;
};

export function RatingForm({ teacherId, existing }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [stars, setStars] = useState(existing?.stars ?? 0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState(existing?.review ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (stars < 1) {
      toast.error("Pick a star rating first.");
      return;
    }
    startTransition(async () => {
      const result = await submitRating({ teacherId, stars, review });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(existing ? "Rating updated!" : "Thanks for rating!");
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
      toast.success("Rating removed.");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i} star${i === 1 ? "" : "s"}`}
            onClick={() => setStars(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              className={cn(
                "size-7 transition-colors",
                i <= (hover || stars)
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/40",
              )}
            />
          </button>
        ))}
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
          <Button
            type="button"
            variant="ghost"
            disabled={pending}
            onClick={handleDelete}
          >
            Remove
          </Button>
        )}
      </div>
    </form>
  );
}
