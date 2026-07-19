import Link from "next/link";
import { GraduationCap, Search, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TeacherCard } from "@/components/teacher-card";
import { searchTeachers } from "@/lib/queries";
import { CITY, SUBJECTS } from "@/lib/constants";

export const dynamic = "force-dynamic";

const STEPS = [
  {
    icon: Search,
    title: "Search",
    blurb: `Filter teachers in ${CITY} by pincode, subject, grade, and board.`,
  },
  {
    icon: Users,
    title: "Connect",
    blurb: "Call or WhatsApp the teacher directly. No middlemen, no fees.",
  },
  {
    icon: Star,
    title: "Rate",
    blurb: "Share your experience so other parents can choose with confidence.",
  },
];

export default async function HomePage() {
  let featured: Awaited<ReturnType<typeof searchTeachers>> = [];
  try {
    featured = (await searchTeachers({ sort: "rating" })).slice(0, 4);
  } catch {
    // DB not configured yet — render the landing page without featured teachers.
  }

  return (
    <div>
      {/* Hero */}
      <section className="border-b bg-accent/40">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
          <Badge variant="secondary" className="mb-4">
            Now live in {CITY}
          </Badge>
          <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Find the right tuition teacher near you
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Search by pincode, subject, grade, and board. Read honest ratings
            from students and parents in {CITY}.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/search">
                <Search className="size-4" /> Find teachers
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/signup">
                <GraduationCap className="size-4" /> I&apos;m a teacher
              </Link>
            </Button>
          </div>

          <div className="mx-auto mt-10 flex max-w-xl flex-wrap justify-center gap-2">
            {SUBJECTS.slice(0, 8).map((s) => (
              <Link key={s} href={`/search?subject=${encodeURIComponent(s)}`}>
                <Badge
                  variant="outline"
                  className="cursor-pointer bg-background px-3 py-1 hover:bg-muted"
                >
                  {s}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-semibold">How it works</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.title} className="rounded-xl border p-6 text-center">
              <step.icon className="mx-auto size-8 text-primary" />
              <h3 className="mt-3 font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{step.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured teachers */}
      {featured.length > 0 && (
        <section className="border-t bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Top-rated teachers</h2>
              <Button variant="ghost" asChild>
                <Link href="/search">See all →</Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {featured.map((r) => (
                <TeacherCard
                  key={r.profile.id}
                  profile={r.profile}
                  avgStars={r.avgStars}
                  ratingCount={r.ratingCount}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Teacher CTA */}
      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold">Are you a tuition teacher?</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Create a free profile and let students and parents in {CITY} find
            you — takes two minutes.
          </p>
          <Button size="lg" className="mt-6" asChild>
            <Link href="/signup">Create your profile</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
