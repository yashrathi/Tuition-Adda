// Category vocabulary for Tuition Adda. Fixed picklists so filters never
// fragment ("Maths" vs "Math"). Update here, everywhere else derives.

export const CITY = "Kolkata";

export const SUBJECTS = [
  "Math",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Hindi",
  "Bengali",
  "Social Studies",
  "Computer Science",
  "Accounts",
  "Economics",
  "Business Studies",
] as const;

export const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export const BOARDS = [
  "CBSE",
  "ICSE",
  "West Bengal Board",
  "IB",
  "IGCSE",
] as const;

export const TUITION_TYPES = ["Solo", "Group"] as const;

export const MODES = ["Student's home", "Teacher's place", "Online"] as const;

export type Subject = (typeof SUBJECTS)[number];
export type Grade = (typeof GRADES)[number];
export type Board = (typeof BOARDS)[number];
export type TuitionType = (typeof TUITION_TYPES)[number];
export type Mode = (typeof MODES)[number];

// Kolkata pincodes are 700001–700163.
export function isValidKolkataPincode(pin: string): boolean {
  if (!/^\d{6}$/.test(pin)) return false;
  const n = Number(pin);
  return n >= 700001 && n <= 700163;
}

export function formatGrade(g: number): string {
  const suffix = g === 1 ? "st" : g === 2 ? "nd" : g === 3 ? "rd" : "th";
  return `${g}${suffix}`;
}
