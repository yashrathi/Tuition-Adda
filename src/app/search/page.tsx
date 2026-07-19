import { Suspense } from "react";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchFilters } from "@/components/search-filters";
import { TeacherCard } from "@/components/teacher-card";
import { searchTeachers, type SearchFilters as Filters } from "@/lib/queries";
import { CITY, GRADES } from "@/lib/constants";

export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };

function parseFilters(sp: SearchParams): Filters {
  const one = (v: string | string[] | undefined) =>
    typeof v === "string" ? v : undefined;

  const gradeRaw = Number(one(sp.grade));
  return {
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

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <SearchX className="size-10 text-muted-foreground" />
        <p className="font-medium">No teachers match these filters yet</p>
        <p className="text-sm text-muted-foreground">
          Try removing a filter or two — or check back soon.
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/search">Clear filters</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {results.length} teacher{results.length === 1 ? "" : "s"} found
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {results.map((r) => (
          <TeacherCard
            key={r.profile.id}
            profile={r.profile}
            avgStars={r.avgStars}
            ratingCount={r.ratingCount}
          />
        ))}
      </div>
    </div>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">
        Tuition teachers in {CITY}
      </h1>
      <p className="mt-1 mb-6 text-muted-foreground">
        Filter by area, subject, grade, board, and how you want to learn.
      </p>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside>
          <Suspense>
            <SearchFilters />
          </Suspense>
        </aside>
        <section>
          <Results searchParams={sp} />
        </section>
      </div>
    </div>
  );
}
