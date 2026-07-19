"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";

// Creates the app users row for the signed-in Supabase user if it doesn't
// exist yet, using the name/role stashed in auth metadata at signup.
export async function ensureAppUser() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null;

  const existing = await db.query.users.findFirst({
    where: eq(users.authId, authUser.id),
  });
  if (existing) return existing;

  const meta = authUser.user_metadata ?? {};
  const role = meta.role === "teacher" ? "teacher" : "student";
  const name = typeof meta.name === "string" && meta.name.trim()
    ? meta.name.trim()
    : (authUser.email ?? "User");

  const [created] = await db
    .insert(users)
    .values({ authId: authUser.id, role, name })
    .onConflictDoNothing({ target: users.authId })
    .returning();

  if (created) return created;
  return (
    (await db.query.users.findFirst({ where: eq(users.authId, authUser.id) })) ??
    null
  );
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
