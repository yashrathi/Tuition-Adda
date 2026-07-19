import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/lib/actions/user";

const NAV_LINKS = [
  { href: "/search", label: "Find Teachers" },
  { href: "/review", label: "Write a Review" },
];

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group">
          <span className="inline-flex items-center rounded-lg bg-primary px-3 py-1.5 font-display text-lg leading-none text-primary-foreground transition-transform group-hover:-translate-y-0.5">
            Tuition Adda
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[15px] font-bold text-foreground/90 underline-offset-8 transition-colors hover:text-primary hover:underline hover:decoration-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="sm" className="font-bold" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button variant="outline" size="sm" type="submit">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden font-bold sm:inline-flex"
                asChild
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="sm" className="rounded-full font-bold" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
