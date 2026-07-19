"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/star-rating";
import { RatingForm } from "@/components/rating-form";

export type ReviewTeacher = {
  id: string;
  displayName: string;
  photoUrl: string | null;
  subjects: string[];
  locality: string;
  avgStars: number | null;
  ratingCount: number;
};

type Props = {
  teacher: ReviewTeacher;
  existing: { stars: number; review: string } | null;
  canReview: boolean;
  loggedIn: boolean;
};

export function ReviewResultCard({
  teacher,
  existing,
  canReview,
  loggedIn,
}: Props) {
  const [open, setOpen] = useState(false);

  const initials = teacher.displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Avatar className="size-14">
            {teacher.photoUrl && (
              <AvatarImage src={teacher.photoUrl} alt={teacher.displayName} />
            )}
            <AvatarFallback className="bg-accent text-accent-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/teacher/${teacher.id}`}
                className="truncate font-semibold underline-offset-4 hover:underline"
              >
                {teacher.displayName}
              </Link>
              {canReview ? (
                <Button
                  size="sm"
                  variant={open ? "ghost" : "default"}
                  className="shrink-0"
                  onClick={() => setOpen((o) => !o)}
                >
                  {open ? "Cancel" : existing ? "Edit review" : "Write review"}
                </Button>
              ) : !loggedIn ? (
                <Button size="sm" className="shrink-0" asChild>
                  <Link href="/login?next=/review">Log in to review</Link>
                </Button>
              ) : null}
            </div>

            <div className="flex items-center gap-1.5 text-sm">
              {teacher.ratingCount > 0 ? (
                <>
                  <StarRating value={teacher.avgStars ?? 0} />
                  <span className="font-medium">
                    {teacher.avgStars?.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    ({teacher.ratingCount})
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">No ratings yet</span>
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              {teacher.subjects.slice(0, 4).map((s) => (
                <Badge key={s} variant="secondary" className="text-xs">
                  {s}
                </Badge>
              ))}
              {teacher.subjects.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{teacher.subjects.length - 4}
                </Badge>
              )}
            </div>

            {teacher.locality && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                {teacher.locality}
              </p>
            )}
          </div>
        </div>

        {canReview && open && (
          <div className="border-t pt-4">
            <RatingForm teacherId={teacher.id} existing={existing} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
