import { and, arrayContains, avg, count, desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "@/db";
import { ratings, teacherProfiles } from "@/db/schema";

export type SearchFilters = {
  name?: string;
  pincode?: string;
  subject?: string;
  grade?: number;
  board?: string;
  tuitionType?: string;
  mode?: string;
  sort?: "rating" | "newest";
};

export async function searchTeachers(filters: SearchFilters) {
  const conditions = [eq(teacherProfiles.isActive, true)];

  if (filters.name)
    conditions.push(ilike(teacherProfiles.displayName, `%${filters.name}%`));
  if (filters.pincode)
    conditions.push(arrayContains(teacherProfiles.pincodes, [filters.pincode]));
  if (filters.subject)
    conditions.push(arrayContains(teacherProfiles.subjects, [filters.subject]));
  if (filters.grade)
    conditions.push(arrayContains(teacherProfiles.grades, [filters.grade]));
  if (filters.board)
    conditions.push(arrayContains(teacherProfiles.boards, [filters.board]));
  if (filters.tuitionType)
    conditions.push(
      arrayContains(teacherProfiles.tuitionTypes, [filters.tuitionType]),
    );
  if (filters.mode)
    conditions.push(arrayContains(teacherProfiles.modes, [filters.mode]));

  const avgStars = avg(ratings.stars).mapWith(Number);
  const ratingCount = count(ratings.id);

  const rows = await db
    .select({
      profile: teacherProfiles,
      avgStars,
      ratingCount,
    })
    .from(teacherProfiles)
    .leftJoin(ratings, eq(ratings.teacherId, teacherProfiles.id))
    .where(and(...conditions))
    .groupBy(teacherProfiles.id)
    .orderBy(
      filters.sort === "newest"
        ? desc(teacherProfiles.createdAt)
        : sql`avg(${ratings.stars}) DESC NULLS LAST, count(${ratings.id}) DESC`,
    )
    .limit(60);

  return rows;
}

export async function getStudentRatings(studentId: string) {
  return db.query.ratings.findMany({
    where: eq(ratings.studentId, studentId),
    orderBy: desc(ratings.updatedAt),
    with: {
      teacher: { columns: { id: true, displayName: true, locality: true } },
    },
  });
}

export async function getRecentReviews(limit = 12) {
  return db.query.ratings.findMany({
    where: (r, { ne }) => ne(r.review, ""),
    orderBy: desc(ratings.createdAt),
    limit,
    with: {
      teacher: {
        columns: {
          id: true,
          displayName: true,
          photoUrl: true,
          subjects: true,
          modes: true,
          locality: true,
        },
      },
      student: { columns: { studentName: true, grade: true, board: true } },
    },
  });
}

export type RecentReview = Awaited<ReturnType<typeof getRecentReviews>>[number];

export async function getTeacherWithRatings(id: string) {
  const teacher = await db.query.teacherProfiles.findFirst({
    where: eq(teacherProfiles.id, id),
    with: {
      ratings: {
        orderBy: desc(ratings.updatedAt),
        with: { student: { columns: { studentName: true, grade: true } } },
      },
    },
  });
  return teacher ?? null;
}
