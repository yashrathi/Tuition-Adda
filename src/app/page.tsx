import Link from "next/link";
import {
  Atom,
  Briefcase,
  Calculator,
  FlaskConical,
  GraduationCap,
  Search,
  SquarePen,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TeacherCard } from "@/components/teacher-card";
import { ReaderIllustration } from "@/components/reader-illustration";
import { searchTeachers } from "@/lib/queries";
import { CITY } from "@/lib/constants";

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

const SUBJECT_CARDS = [
  { icon: Calculator, label: "Math", subject: "Math" },
  { icon: FlaskConical, label: "Chem", subject: "Chemistry" },
  { icon: Atom, label: "Physics", subject: "Physics" },
  { icon: Briefcase, label: "Commerce", subject: "Economics" },
  { icon: SquarePen, label: "English", subject: "English" },
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
      <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8">
        <div className="brand-panel relative overflow-hidden rounded-[2rem] px-6 py-14 sm:px-12 sm:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <Badge className="mb-6 rounded-full px-3 py-1 text-xs font-bold">
                <span className="mr-1.5 inline-block size-2 rounded-full bg-primary-foreground" />
                Now live in {CITY}
              </Badge>

              <h1 className="font-display text-5xl leading-[0.95] sm:text-6xl md:text-7xl">
                Every great student
                <br />
                has a <span className="text-primary">great teacher</span>
              </h1>

              <p className="mt-5 max-w-md text-lg font-semibold text-primary sm:text-xl">
                Read honest reviews from students and parents before you join a
                tuition in {CITY}.
              </p>

              {/* Search bar */}
              <form
                action="/search"
                className="mt-8 flex max-w-lg items-center gap-2 rounded-full border border-border bg-card p-2 shadow-sm focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15"
              >
                <Search className="ml-3 size-5 shrink-0 text-muted-foreground" />
                <input
                  name="subject"
                  type="text"
                  placeholder="Search teacher, subject or area"
                  aria-label="Search teachers"
                  className="min-w-0 flex-1 bg-transparent px-1 text-base outline-none placeholder:text-muted-foreground"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="size-11 shrink-0 rounded-full"
                  aria-label="Search"
                >
                  <Search className="size-5" />
                </Button>
              </form>
            </div>

            <ReaderIllustration className="hidden w-64 self-end lg:block xl:w-72" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="text-center text-3xl sm:text-4xl">How it works</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <step.icon className="size-6" />
                </span>
                <span className="font-display text-3xl text-primary/30">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-xl">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pick a subject */}
      <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6 sm:pb-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl sm:text-4xl">Pick a subject</h2>
            <p className="mt-2 text-muted-foreground">
              Find the perfect teacher for what you need
            </p>
          </div>
          <Link
            href="/search"
            className="group inline-flex items-center gap-2 font-bold underline-offset-8 hover:text-primary hover:underline hover:decoration-2"
          >
            View all subjects
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {SUBJECT_CARDS.map((s) => (
            <Link
              key={s.label}
              href={`/search?subject=${encodeURIComponent(s.subject)}`}
              className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-violet-100 py-9 text-foreground transition-all hover:-translate-y-1 hover:bg-violet-200 hover:shadow-md dark:bg-violet-500/15 dark:hover:bg-violet-500/25"
            >
              <s.icon className="size-11" strokeWidth={1.5} />
              <span className="text-lg font-bold">{s.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured teachers */}
      {featured.length > 0 && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="text-3xl sm:text-4xl">Top-rated teachers</h2>
              <Button variant="ghost" className="font-bold" asChild>
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
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="rounded-[2rem] bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
          <h2 className="text-3xl text-primary-foreground sm:text-4xl">
            Are you a tuition teacher?
          </h2>
          <p className="mx-auto mt-3 max-w-md font-medium text-primary-foreground/85">
            Create a free profile and let students and parents in {CITY} find
            you — takes two minutes.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-7 rounded-full font-bold"
            asChild
          >
            <Link href="/signup">
              <GraduationCap className="size-4" /> Create your profile
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
