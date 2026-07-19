"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { studentProfiles, teacherProfiles } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import {
  BOARDS,
  GRADES,
  MODES,
  SUBJECTS,
  TUITION_TYPES,
  isValidKolkataPincode,
} from "@/lib/constants";

export type TeacherProfileInput = {
  displayName: string;
  bio: string;
  qualifications: string;
  experienceYears: number;
  subjects: string[];
  grades: number[];
  boards: string[];
  tuitionTypes: string[];
  modes: string[];
  pincodes: string[];
  locality: string;
  feeMin: number | null;
  feeMax: number | null;
  phone: string;
  whatsapp: string;
};

export type StudentProfileInput = {
  studentName: string;
  grade: number;
  board: string;
  subjectsNeeded: string[];
  pincode: string;
  preferredModes: string[];
  parentName: string;
  phone: string;
};

const inList = <T,>(values: T[], allowed: readonly T[]) =>
  values.filter((v) => allowed.includes(v));

export async function saveTeacherProfile(input: TeacherProfileInput) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not signed in." };
  if (user.role !== "teacher") return { error: "Only teachers can create a teacher profile." };

  const displayName = input.displayName.trim();
  const phone = input.phone.trim();
  if (!displayName) return { error: "Name is required." };
  if (!/^[6-9]\d{9}$/.test(phone)) return { error: "Enter a valid 10-digit mobile number." };

  const subjects = inList(input.subjects, SUBJECTS as readonly string[]);
  const grades = inList(input.grades, GRADES as readonly number[]);
  const boards = inList(input.boards, BOARDS as readonly string[]);
  const tuitionTypes = inList(input.tuitionTypes, TUITION_TYPES as readonly string[]);
  const modes = inList(input.modes, MODES as readonly string[]);
  const pincodes = [...new Set(input.pincodes.map((p) => p.trim()))].filter(Boolean);

  if (!subjects.length) return { error: "Pick at least one subject." };
  if (!grades.length) return { error: "Pick at least one grade." };
  if (!boards.length) return { error: "Pick at least one board." };
  if (!tuitionTypes.length) return { error: "Pick solo, group, or both." };
  if (!modes.length) return { error: "Pick at least one mode." };
  if (!pincodes.length) return { error: "Add at least one pincode you serve." };
  const badPin = pincodes.find((p) => !isValidKolkataPincode(p));
  if (badPin) return { error: `${badPin} is not a Kolkata pincode (700001–700163).` };

  if (input.feeMin != null && input.feeMax != null && input.feeMin > input.feeMax) {
    return { error: "Minimum fee can't be more than maximum fee." };
  }

  const values = {
    displayName,
    bio: input.bio.trim(),
    qualifications: input.qualifications.trim(),
    experienceYears: Math.max(0, Math.min(60, Math.round(input.experienceYears || 0))),
    subjects,
    grades,
    boards,
    tuitionTypes,
    modes,
    pincodes,
    locality: input.locality.trim(),
    feeMin: input.feeMin,
    feeMax: input.feeMax,
    phone,
    whatsapp: input.whatsapp.trim() || null,
    updatedAt: new Date(),
  };

  await db
    .insert(teacherProfiles)
    .values({ userId: user.id, ...values })
    .onConflictDoUpdate({ target: teacherProfiles.userId, set: values });

  revalidatePath("/search");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function saveStudentProfile(input: StudentProfileInput) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not signed in." };
  if (user.role !== "student") return { error: "Only students can create a student profile." };

  const studentName = input.studentName.trim();
  if (!studentName) return { error: "Student name is required." };
  if (!(GRADES as readonly number[]).includes(input.grade)) return { error: "Pick a grade." };
  if (!(BOARDS as readonly string[]).includes(input.board)) return { error: "Pick a board." };
  if (!isValidKolkataPincode(input.pincode.trim())) {
    return { error: "Enter a valid Kolkata pincode (700001–700163)." };
  }

  const subjectsNeeded = inList(input.subjectsNeeded, SUBJECTS as readonly string[]);
  const preferredModes = inList(input.preferredModes, MODES as readonly string[]);

  const values = {
    studentName,
    grade: input.grade,
    board: input.board,
    subjectsNeeded,
    pincode: input.pincode.trim(),
    preferredModes,
    parentName: input.parentName.trim() || null,
    phone: input.phone.trim() || null,
  };

  await db
    .insert(studentProfiles)
    .values({ userId: user.id, ...values })
    .onConflictDoUpdate({ target: studentProfiles.userId, set: values });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function setTeacherActive(isActive: boolean) {
  const user = await getCurrentUser();
  if (!user?.teacherProfile) return { error: "No teacher profile." };
  await db
    .update(teacherProfiles)
    .set({ isActive, updatedAt: new Date() })
    .where(eq(teacherProfiles.id, user.teacherProfile.id));
  revalidatePath("/search");
  revalidatePath("/dashboard");
  return { success: true };
}
