import Link from "next/link";
import { MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/star-rating";
import { formatGrade } from "@/lib/constants";
import type { teacherProfiles } from "@/db/schema";

type Props = {
  profile: typeof teacherProfiles.$inferSelect;
  avgStars: number | null;
  ratingCount: number;
};

function gradeRange(grades: number[]): string {
  if (!grades.length) return "";
  const sorted = [...grades].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  return min === max
    ? formatGrade(min)
    : `${formatGrade(min)}–${formatGrade(max)}`;
}

export function TeacherCard({ profile, avgStars, ratingCount }: Props) {
  const initials = profile.displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Link href={`/teacher/${profile.id}`} className="block">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="flex gap-4">
          <Avatar className="size-14">
            {profile.photoUrl && (
              <AvatarImage src={profile.photoUrl} alt={profile.displayName} />
            )}
            <AvatarFallback className="bg-accent text-accent-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate font-semibold">{profile.displayName}</h3>
              {profile.feeMin != null && (
                <span className="shrink-0 text-sm text-muted-foreground">
                  ₹{profile.feeMin}
                  {profile.feeMax != null && profile.feeMax !== profile.feeMin
                    ? `–${profile.feeMax}`
                    : ""}
                  /mo
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-sm">
              {ratingCount > 0 ? (
                <>
                  <StarRating value={avgStars ?? 0} />
                  <span className="font-medium">{avgStars?.toFixed(1)}</span>
                  <span className="text-muted-foreground">({ratingCount})</span>
                </>
              ) : (
                <span className="text-muted-foreground">No ratings yet</span>
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              {profile.subjects.slice(0, 4).map((s) => (
                <Badge key={s} variant="secondary" className="text-xs">
                  {s}
                </Badge>
              ))}
              {profile.subjects.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{profile.subjects.length - 4}
                </Badge>
              )}
            </div>

            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              {profile.locality || profile.pincodes.slice(0, 3).join(", ")}
              <span>·</span>
              {gradeRange(profile.grades)} · {profile.boards.join(", ")}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
