import Link from "next/link";
import { Check } from "lucide-react";
import type { RecentReview } from "@/lib/queries";

// Warm, brand-adjacent gradients used when a teacher has no photo, so the
// wall stays vivid instead of a grid of grey monograms. Picked by index.
const GRADIENTS = [
  "from-emerald-200 to-teal-300 text-emerald-900",
  "from-amber-200 to-orange-300 text-amber-900",
  "from-violet-200 to-fuchsia-300 text-violet-900",
  "from-sky-200 to-indigo-300 text-sky-900",
  "from-rose-200 to-pink-300 text-rose-900",
  "from-lime-200 to-emerald-300 text-lime-900",
];

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function modeLabel(modes: string[]): string {
  if (!modes.length) return "";
  return modes.every((m) => m === "Online") ? "Online" : "In-person";
}

export function ReviewWall({ reviews }: { reviews: RecentReview[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-8">
      <div className="brand-panel rounded-[2rem] px-6 py-10 sm:px-10 sm:py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">
              Everyone&apos;s talking about
            </h2>
            <p className="mt-2 font-semibold text-primary">
              Real reviews from students across Kolkata
            </p>
          </div>
          <Link
            href="/search"
            className="group inline-flex items-center gap-2 font-bold underline-offset-8 hover:text-primary hover:underline hover:decoration-2"
          >
            View all reviews
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {reviews.map((r, i) => (
            <Link
              key={r.id}
              href={`/teacher/${r.teacher.id}`}
              className="group relative aspect-[3/4] w-56 shrink-0 snap-start overflow-hidden rounded-2xl shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md sm:w-60"
            >
              {r.teacher.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.teacher.photoUrl}
                  alt={r.teacher.displayName}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div
                  className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]}`}
                >
                  <span className="font-display text-6xl opacity-80">
                    {initials(r.teacher.displayName)}
                  </span>
                </div>
              )}

              {/* Review quote reveals on hover for extra context */}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="line-clamp-4 text-sm font-medium text-white">
                  &ldquo;{r.review}&rdquo;
                </p>
              </div>

              <div className="absolute inset-x-3 bottom-3 rounded-xl bg-card/95 px-3 py-2 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-1.5">
                  <span className="truncate font-bold text-card-foreground">
                    {r.teacher.displayName}
                  </span>
                  <span
                    className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    aria-label="Verified review"
                  >
                    <Check className="size-2.5" strokeWidth={3} />
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {[r.teacher.subjects[0], modeLabel(r.teacher.modes)]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
