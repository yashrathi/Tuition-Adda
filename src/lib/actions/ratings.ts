"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { ratings } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function submitRating(input: {
  teacherId: string;
  stars: number;
  review: string;
  discipline?: number;
  patience?: number;
  personalAttention?: number;
  homework?: number;
}) {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in to rate a teacher." };
  if (user.role !== "student" || !user.studentProfile) {
    return { error: "Only students can rate teachers. Create a student profile first." };
  }

  const stars = Math.round(input.stars);
  if (stars < 1 || stars > 5) return { error: "Pick 1 to 5 stars." };
  const review = input.review.trim().slice(0, 2000);

  // Each category is optional; a 0/missing value stores as null (not voted).
  const score = (v: number | undefined) => {
    const n = Math.round(v ?? 0);
    return n >= 1 && n <= 5 ? n : null;
  };
  const categories = {
    discipline: score(input.discipline),
    patience: score(input.patience),
    personalAttention: score(input.personalAttention),
    homework: score(input.homework),
  };

  await db
    .insert(ratings)
    .values({
      teacherId: input.teacherId,
      studentId: user.studentProfile.id,
      stars,
      review,
      ...categories,
    })
    .onConflictDoUpdate({
      target: [ratings.teacherId, ratings.studentId],
      set: { stars, review, ...categories, updatedAt: new Date() },
    });

  revalidatePath(`/teacher/${input.teacherId}`);
  revalidatePath("/search");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteRating(teacherId: string) {
  const user = await getCurrentUser();
  if (!user?.studentProfile) return { error: "Not signed in as a student." };

  await db
    .delete(ratings)
    .where(
      and(
        eq(ratings.teacherId, teacherId),
        eq(ratings.studentId, user.studentProfile.id),
      ),
    );

  revalidatePath(`/teacher/${teacherId}`);
  revalidatePath("/dashboard");
  return { success: true };
}
