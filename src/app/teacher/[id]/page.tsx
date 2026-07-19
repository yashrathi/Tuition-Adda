import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Clock, GraduationCap, Home, MapPin, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ContactReveal } from "@/components/contact-reveal";
import { RatingForm } from "@/components/rating-form";
import { StarRating } from "@/components/star-rating";
import { getCurrentUser } from "@/lib/auth";
import { getTeacherWithRatings } from "@/lib/queries";
import { formatGrade } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function TeacherPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [teacher, user] = await Promise.all([
    getTeacherWithRatings(id),
    getCurrentUser(),
  ]);
  if (!teacher) notFound();

  const reviews = teacher.ratings;
  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length
      : null;

  const isStudent = user?.role === "student" && !!user.studentProfile;
  const myRating = isStudent
    ? (reviews.find((r) => r.studentId === user!.studentProfile!.id) ?? null)
    : null;

  const initials = teacher.displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[1fr_280px]">
        {/* Main column */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Avatar className="size-20">
              {teacher.photoUrl && (
                <AvatarImage src={teacher.photoUrl} alt={teacher.displayName} />
              )}
              <AvatarFallback className="bg-accent text-xl text-accent-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">{teacher.displayName}</h1>
              {teacher.qualifications && (
                <p className="text-sm text-muted-foreground">
                  {teacher.qualifications}
                </p>
              )}
              <div className="flex items-center gap-2 text-sm">
                {avg ? (
                  <>
                    <StarRating value={avg} />
                    <span className="font-medium">{avg.toFixed(1)}</span>
                    <span className="text-muted-foreground">
                      ({reviews.length} review{reviews.length === 1 ? "" : "s"})
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground">No ratings yet</span>
                )}
              </div>
            </div>
          </div>

          {teacher.bio && (
            <p className="whitespace-pre-line text-sm leading-relaxed">
              {teacher.bio}
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-2 text-sm">
              <BookOpen className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <div className="font-medium">Subjects</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {teacher.subjects.map((s) => (
                    <Badge key={s} variant="secondary">{s}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <GraduationCap className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <div className="font-medium">Grades & boards</div>
                <p className="mt-1 text-muted-foreground">
                  {teacher.grades.map(formatGrade).join(", ")}
                  <br />
                  {teacher.boards.join(", ")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Users className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <div className="font-medium">Tuition type</div>
                <p className="mt-1 text-muted-foreground">
                  {teacher.tuitionTypes.join(" · ")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Home className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <div className="font-medium">Mode</div>
                <p className="mt-1 text-muted-foreground">
                  {teacher.modes.join(" · ")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <div className="font-medium">Areas served</div>
                <p className="mt-1 text-muted-foreground">
                  {teacher.locality && <>{teacher.locality}<br /></>}
                  {teacher.pincodes.join(", ")}
                </p>
              </div>
            </div>
            {teacher.experienceYears > 0 && (
              <div className="flex items-start gap-2 text-sm">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                <div>
                  <div className="font-medium">Experience</div>
                  <p className="mt-1 text-muted-foreground">
                    {teacher.experienceYears} year
                    {teacher.experienceYears === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Rating section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              Reviews ({reviews.length})
            </h2>

            {isStudent && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {myRating ? "Your rating" : "Rate this teacher"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RatingForm
                    teacherId={teacher.id}
                    existing={
                      myRating
                        ? { stars: myRating.stars, review: myRating.review }
                        : null
                    }
                  />
                </CardContent>
              </Card>
            )}
            {!user && (
              <p className="text-sm text-muted-foreground">
                <Link
                  href="/signup"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Sign up as a student
                </Link>{" "}
                to rate this teacher.
              </p>
            )}

            {reviews.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No reviews yet — be the first.
              </p>
            )}
            {reviews.map((r) => (
              <Card key={r.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <StarRating value={r.stars} />
                    <span className="text-sm font-normal text-muted-foreground">
                      {r.student.studentName} · {formatGrade(r.student.grade)}
                    </span>
                  </CardTitle>
                  {r.review && <CardDescription>{r.review}</CardDescription>}
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 md:sticky md:top-20 md:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {teacher.feeMin != null ? (
                  <>
                    ₹{teacher.feeMin}
                    {teacher.feeMax != null && teacher.feeMax !== teacher.feeMin
                      ? `–${teacher.feeMax}`
                      : ""}
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}/ month
                    </span>
                  </>
                ) : (
                  "Contact for fees"
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ContactReveal phone={teacher.phone} whatsapp={teacher.whatsapp} />
            </CardContent>
          </Card>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/search">← Back to search</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
