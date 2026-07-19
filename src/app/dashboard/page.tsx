import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getStudentRatings, getTeacherWithRatings } from "@/lib/queries";
import { formatGrade } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/star-rating";
import { TeacherProfileForm } from "@/components/forms/teacher-profile-form";
import { StudentProfileForm } from "@/components/forms/student-profile-form";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const needsOnboarding =
    (user.role === "teacher" && !user.teacherProfile) ||
    (user.role === "student" && !user.studentProfile);
  if (needsOnboarding) redirect("/onboarding");

  if (user.role === "teacher") {
    const teacher = await getTeacherWithRatings(user.teacherProfile!.id);
    const reviews = teacher?.ratings ?? [];
    const avg =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length
        : null;

    return (
      <div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Your teacher profile</h1>
            <p className="mt-1 text-muted-foreground">
              {avg
                ? `${avg.toFixed(1)} ★ from ${reviews.length} review${reviews.length === 1 ? "" : "s"}`
                : "No reviews yet — share your profile to get rated."}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/teacher/${user.teacherProfile!.id}`}>
              View public page
            </Link>
          </Button>
        </div>

        <TeacherProfileForm initial={user.teacherProfile} />

        <Separator />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Reviews ({reviews.length})
          </h2>
          {reviews.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Reviews from students will appear here.
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
    );
  }

  // Student dashboard
  const myRatings = await getStudentRatings(user.studentProfile!.id);

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Your profile</h1>
          <p className="mt-1 text-muted-foreground">
            Keep this updated to find the right teachers.
          </p>
        </div>
        <Button asChild>
          <Link href="/search">Find teachers</Link>
        </Button>
      </div>

      <StudentProfileForm initial={user.studentProfile} />

      <Separator />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Your ratings ({myRatings.length})
        </h2>
        {myRatings.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Rated a teacher? Your reviews will show up here.
          </p>
        )}
        {myRatings.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <StarRating value={r.stars} />
                <Link
                  href={`/teacher/${r.teacher.id}`}
                  className="text-sm font-normal text-primary underline-offset-4 hover:underline"
                >
                  {r.teacher.displayName}
                </Link>
              </CardTitle>
              {r.review && <CardDescription>{r.review}</CardDescription>}
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
