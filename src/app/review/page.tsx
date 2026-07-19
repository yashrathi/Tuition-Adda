import { Suspense } from "react";
import Link from "next/link";
import { Search, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchFilters } from "@/components/search-filters";
import { ReviewResultCard } from "@/components/review-result-card";
import { getCurrentUser } from "@/lib/auth";
import {
  getStudentRatings,
  searchTeachers,
  type SearchFilters as Filters,
} from "@/lib/queries";
import { GRADES } from "@/lib/constants";

export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };

function parseFilters(sp: SearchParams): Filters {
  const one = (v: string | string[] | undefined) =>
    typeof v === "string" ? v : undefined;

  const gradeRaw = Number(one(sp.grade));
  return {
    name: one(sp.name)?.trim() || undefined,
    pincode: one(sp.pincode),
    subject: one(sp.subject),
    grade: (GRADES as readonly number[]).includes(gradeRaw) ? gradeRaw : undefined,
    board: one(sp.board),
    tuitionType: one(sp.type),
    mode: one(sp.mode),
    sort: one(sp.sort) === "newest" ? "newest" : "rating",
  };
}

async function Results({ searchParams }: { searchParams: SearchParams }) {
  const filters = parseFilters(searchParams);

  const user = await getCurrentUser();
  const isStudent = user?.role === "student" && !!user.studentProfile;
  const isTeacher = user?.role === "teacher";

  let results: Awaited<ReturnType<typeof searchTeachers>>;
  try {
    results = await searchTeachers(filters);
  } catch {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        Database isn&apos;t configured yet. Add your Supabase credentials to{" "}
        <code className="rounded bg-muted px-1">.env.local</code>, then run{" "}
        <code className="rounded bg-muted px-1">npm run db:push</code> and{" "}
        <code className="rounded bg-muted px-1">npm run db:seed</code>.
      </div>
    );
  }

  // For a signed-in student, pre-fill any review they've already left.
  const existingByTeacher = new Map<string, { stars: number; review: string }>();
  if (isStudent) {
    const mine = await getStudentRatings(user!.studentProfile!.id);
    for (const r of mine) {
      existingByTeacher.set(r.teacher.id, { stars: r.stars, review: r.review });
    }
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <SearchX className="size-10 text-muted-foreground" />
        <p className="font-medium">No teachers match your search</p>
        <p className="text-sm text-muted-foreground">
          Try a different name or clear a filter or two.
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/review">Clear search</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!user && (
        <div className="rounded-lg border bg-muted/40 p-4 text-sm">
          <Link
            href="/login?next=/review"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Log in
          </Link>{" "}
          as a student to write a review — or{" "}
          <Link
            href="/signup"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            create an account
          </Link>
          .
        </div>
      )}
      {isTeacher && (
        <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
          You&apos;re signed in as a teacher. Reviews can only be written from a
          student account.
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        {results.length} teacher{results.length === 1 ? "" : "s"} found
      </p>

      <div className="grid gap-4">
        {results.map((r) => (
          <ReviewResultCard
            key={r.profile.id}
            teacher={{
              id: r.profile.id,
              displayName: r.profile.displayName,
              photoUrl: r.profile.photoUrl,
              subjects: r.profile.subjects,
              locality: r.profile.locality,
              avgStars: r.avgStars,
              ratingCount: r.ratingCount,
            }}
            existing={existingByTeacher.get(r.profile.id) ?? null}
            canReview={isStudent}
            loggedIn={!!user}
          />
        ))}
      </div>
    </div>
  );
}

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const currentName = typeof sp.name === "string" ? sp.name : "";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Write a review</h1>
      <p className="mt-1 mb-6 text-muted-foreground">
        Search for your teacher, then share your experience to help other
        students.
      </p>

      <form action="/review" className="relative mb-8">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="name"
          defaultValue={currentName}
          placeholder="Search a teacher by name…"
          className="pl-9"
          aria-label="Search a teacher by name"
        />
      </form>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside>
          <Suspense>
            <SearchFilters />
          </Suspense>
        </aside>
        <section>
          <Suspense fallback={null}>
            <Results searchParams={sp} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
