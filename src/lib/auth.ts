import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";

// The app-level user (role + profiles) for the signed-in Supabase user,
// or null when logged out. Cached per-request.
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.authId, authUser.id),
    with: {
      teacherProfile: true,
      studentProfile: true,
    },
  });

  return user ?? null;
});

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
