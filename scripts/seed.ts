// Seed ~16 Kolkata teachers, 6 students, and a spread of ratings so the
// app demos well. Safe to re-run: it wipes seeded rows first (seeded users
// are tagged with a fixed phone prefix in the users table).
//
// Run: npm run db:seed

import { randomUUID } from "node:crypto";
import { drizzle } from "drizzle-orm/postgres-js";
import { inArray } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "../src/db/schema.ts";

const SEED_TAG = "SEED";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Run: npm run db:seed");
  process.exit(1);
}
const client = postgres(url, { prepare: false });
const db = drizzle(client, { schema });

type TeacherSeed = {
  name: string;
  qualifications: string;
  bio: string;
  experienceYears: number;
  subjects: string[];
  grades: number[];
  boards: string[];
  tuitionTypes: string[];
  modes: string[];
  pincodes: string[];
  locality: string;
  feeMin: number;
  feeMax: number;
};

const TEACHERS: TeacherSeed[] = [
  {
    name: "Anirban Sir",
    qualifications: "M.Sc. Mathematics, Jadavpur University",
    bio: "15 years of teaching Math for boards and entrance exams. Batches of 6, plenty of practice tests. Many students above 95% in boards.",
    experienceYears: 15,
    subjects: ["Math", "Physics"],
    grades: [8, 9, 10, 11, 12],
    boards: ["CBSE", "ICSE", "West Bengal Board"],
    tuitionTypes: ["Group", "Solo"],
    modes: ["Teacher's place", "Online"],
    pincodes: ["700032", "700031", "700075"],
    locality: "Jadavpur",
    feeMin: 1200,
    feeMax: 2500,
  },
  {
    name: "Priya Ma'am",
    qualifications: "M.A. English, B.Ed.",
    bio: "English language and literature specialist. Focus on writing skills and grammar foundations. Friendly, patient, results-driven.",
    experienceYears: 9,
    subjects: ["English"],
    grades: [5, 6, 7, 8, 9, 10],
    boards: ["CBSE", "ICSE"],
    tuitionTypes: ["Solo", "Group"],
    modes: ["Student's home", "Online"],
    pincodes: ["700019", "700029", "700025"],
    locality: "Ballygunge",
    feeMin: 1000,
    feeMax: 1800,
  },
  {
    name: "Sourav Das",
    qualifications: "B.Tech CSE, NIT Durgapur",
    bio: "Computer Science for classes 9–12 plus Python for beginners. Hands-on coding in every class.",
    experienceYears: 6,
    subjects: ["Computer Science", "Math"],
    grades: [9, 10, 11, 12],
    boards: ["CBSE", "ICSE", "IB"],
    tuitionTypes: ["Solo"],
    modes: ["Online", "Student's home"],
    pincodes: ["700091", "700064", "700102"],
    locality: "Salt Lake",
    feeMin: 1500,
    feeMax: 3000,
  },
  {
    name: "Rina Chatterjee",
    qualifications: "M.Sc. Chemistry, B.Ed.",
    bio: "Chemistry made simple with real-life examples. HS and board exam specialist, 12 years at a reputed school.",
    experienceYears: 12,
    subjects: ["Chemistry", "Science"],
    grades: [8, 9, 10, 11, 12],
    boards: ["West Bengal Board", "CBSE"],
    tuitionTypes: ["Group"],
    modes: ["Teacher's place"],
    pincodes: ["700004", "700003", "700006"],
    locality: "Shyambazar",
    feeMin: 800,
    feeMax: 1500,
  },
  {
    name: "Abhijit Sen",
    qualifications: "M.Sc. Physics, CU",
    bio: "Physics for WBJEE/NEET aspirants and boards. Concept-first teaching with weekly problem-solving sessions.",
    experienceYears: 18,
    subjects: ["Physics", "Math"],
    grades: [11, 12],
    boards: ["West Bengal Board", "CBSE", "ICSE"],
    tuitionTypes: ["Group"],
    modes: ["Teacher's place", "Online"],
    pincodes: ["700033", "700041", "700040"],
    locality: "Tollygunge",
    feeMin: 1500,
    feeMax: 2200,
  },
  {
    name: "Sanchita Ma'am",
    qualifications: "M.A. Bengali, B.Ed.",
    bio: "Bengali language and literature for all boards. Special attention to grammar and creative writing.",
    experienceYears: 11,
    subjects: ["Bengali", "Hindi"],
    grades: [5, 6, 7, 8, 9, 10],
    boards: ["West Bengal Board", "CBSE", "ICSE"],
    tuitionTypes: ["Solo", "Group"],
    modes: ["Student's home", "Teacher's place"],
    pincodes: ["700034", "700060", "700008"],
    locality: "Behala",
    feeMin: 700,
    feeMax: 1200,
  },
  {
    name: "Rahul Bose",
    qualifications: "M.Com, CA Inter",
    bio: "Accounts, Economics, and Business Studies for 11–12. Exam-pattern notes and past paper drills.",
    experienceYears: 8,
    subjects: ["Accounts", "Economics", "Business Studies"],
    grades: [11, 12],
    boards: ["CBSE", "ICSE", "West Bengal Board"],
    tuitionTypes: ["Group", "Solo"],
    modes: ["Teacher's place", "Online"],
    pincodes: ["700029", "700019", "700026"],
    locality: "Gariahat",
    feeMin: 1200,
    feeMax: 2000,
  },
  {
    name: "Moumita Ghosh",
    qualifications: "M.Sc. Biology, B.Ed.",
    bio: "Biology for classes 9–12 and NEET foundation. Diagrams, mnemonics, and weekly tests.",
    experienceYears: 10,
    subjects: ["Biology", "Science"],
    grades: [9, 10, 11, 12],
    boards: ["CBSE", "West Bengal Board"],
    tuitionTypes: ["Solo", "Group"],
    modes: ["Student's home", "Teacher's place", "Online"],
    pincodes: ["700028", "700030", "700074"],
    locality: "Dum Dum",
    feeMin: 1000,
    feeMax: 2000,
  },
  {
    name: "Arup Sarkar",
    qualifications: "B.Sc. Math (Hons), 20+ yrs experience",
    bio: "Foundation Math for young learners, classes 4–8. Builds speed and confidence with Vedic tricks.",
    experienceYears: 22,
    subjects: ["Math"],
    grades: [4, 5, 6, 7, 8],
    boards: ["CBSE", "ICSE", "West Bengal Board"],
    tuitionTypes: ["Group"],
    modes: ["Teacher's place"],
    pincodes: ["700156", "700157", "700135"],
    locality: "New Town",
    feeMin: 600,
    feeMax: 1000,
  },
  {
    name: "Debolina Ma'am",
    qualifications: "M.A. History, B.Ed.",
    bio: "Social Studies and History made memorable through stories and maps. Classes 6–10, all boards.",
    experienceYears: 7,
    subjects: ["Social Studies"],
    grades: [6, 7, 8, 9, 10],
    boards: ["ICSE", "CBSE"],
    tuitionTypes: ["Solo"],
    modes: ["Student's home", "Online"],
    pincodes: ["700016", "700017", "700071"],
    locality: "Park Street",
    feeMin: 900,
    feeMax: 1500,
  },
  {
    name: "Kaushik Sir",
    qualifications: "M.Sc. Math, IIT Kharagpur",
    bio: "Advanced Math for 11–12 and IIT-JEE foundation. Small batches of 4, entry by aptitude check.",
    experienceYears: 13,
    subjects: ["Math", "Physics"],
    grades: [10, 11, 12],
    boards: ["CBSE", "IB", "IGCSE"],
    tuitionTypes: ["Group", "Solo"],
    modes: ["Teacher's place", "Online"],
    pincodes: ["700091", "700106", "700064"],
    locality: "Salt Lake Sector V",
    feeMin: 2500,
    feeMax: 5000,
  },
  {
    name: "Farhana Begum",
    qualifications: "M.A. English & Hindi, B.Ed.",
    bio: "Bilingual tutor for English and Hindi, classes 3–8. Gentle with beginners, strong on fundamentals.",
    experienceYears: 5,
    subjects: ["English", "Hindi"],
    grades: [3, 4, 5, 6, 7, 8],
    boards: ["CBSE", "West Bengal Board"],
    tuitionTypes: ["Solo", "Group"],
    modes: ["Student's home"],
    pincodes: ["700023", "700024", "700018"],
    locality: "Kidderpore",
    feeMin: 500,
    feeMax: 900,
  },
  {
    name: "Tanmoy Sir",
    qualifications: "M.Sc. Physics, B.Ed.",
    bio: "Science and Physics for 8–10, WB board specialist. Bengali-medium friendly. Home visits across south Kolkata.",
    experienceYears: 14,
    subjects: ["Science", "Physics", "Math"],
    grades: [8, 9, 10],
    boards: ["West Bengal Board"],
    tuitionTypes: ["Solo"],
    modes: ["Student's home"],
    pincodes: ["700032", "700047", "700084", "700092"],
    locality: "Garia",
    feeMin: 800,
    feeMax: 1400,
  },
  {
    name: "Shreya Banerjee",
    qualifications: "B.Sc. Economics (Hons), MBA",
    bio: "Economics and Business Studies with case-study teaching. Online-first with recorded revision notes.",
    experienceYears: 4,
    subjects: ["Economics", "Business Studies"],
    grades: [11, 12],
    boards: ["CBSE", "ICSE", "IB"],
    tuitionTypes: ["Solo", "Group"],
    modes: ["Online"],
    pincodes: ["700019", "700020", "700025"],
    locality: "Bhowanipore",
    feeMin: 1800,
    feeMax: 3200,
  },
  {
    name: "Bikram Adhikari",
    qualifications: "M.Sc. Chemistry",
    bio: "Chemistry for 11–12 boards + JEE/NEET. Known for organic chemistry shortcuts and rigorous mock tests.",
    experienceYears: 9,
    subjects: ["Chemistry"],
    grades: [11, 12],
    boards: ["CBSE", "West Bengal Board"],
    tuitionTypes: ["Group"],
    modes: ["Teacher's place", "Online"],
    pincodes: ["700028", "700055", "700048"],
    locality: "Lake Town",
    feeMin: 1400,
    feeMax: 2400,
  },
  {
    name: "Ishita Ma'am",
    qualifications: "MCA, ex-TCS",
    bio: "Computer Science and Math for ICSE/CBSE 6–10. Scratch to Python journey for younger kids.",
    experienceYears: 6,
    subjects: ["Computer Science", "Math"],
    grades: [6, 7, 8, 9, 10],
    boards: ["ICSE", "CBSE"],
    tuitionTypes: ["Solo", "Group"],
    modes: ["Online", "Teacher's place"],
    pincodes: ["700029", "700031", "700042"],
    locality: "Dhakuria",
    feeMin: 1100,
    feeMax: 1900,
  },
];

const STUDENTS = [
  { name: "Riya Saha", grade: 9, board: "CBSE", subjects: ["Math", "Science"], pincode: "700032", parent: "Mr. Saha" },
  { name: "Aditya Roy", grade: 11, board: "West Bengal Board", subjects: ["Physics", "Chemistry"], pincode: "700033", parent: "Mrs. Roy" },
  { name: "Sneha Dutta", grade: 7, board: "ICSE", subjects: ["English", "Social Studies"], pincode: "700019", parent: "Mr. Dutta" },
  { name: "Arjun Mukherjee", grade: 12, board: "CBSE", subjects: ["Math", "Computer Science"], pincode: "700091", parent: "Mrs. Mukherjee" },
  { name: "Pooja Singh", grade: 10, board: "CBSE", subjects: ["Math", "Science", "English"], pincode: "700028", parent: "Mr. Singh" },
  { name: "Sayan Bose", grade: 8, board: "West Bengal Board", subjects: ["Bengali", "Math"], pincode: "700034", parent: "Mrs. Bose" },
];

// (teacherIdx, studentIdx, stars, review)
const RATINGS: [number, number, number, string][] = [
  [0, 0, 5, "Anirban Sir's practice tests made a huge difference. My daughter went from 70% to 92% in Math."],
  [0, 3, 5, "Best Math teacher in Jadavpur area, period. Strict but worth it."],
  [0, 4, 4, "Very good teaching, batches fill up fast so book early."],
  [1, 2, 5, "Priya Ma'am is wonderful with kids. My son actually enjoys English homework now."],
  [1, 4, 4, "Good grammar foundation. Would love slightly longer classes."],
  [2, 3, 5, "Sourav da taught me Python from scratch. Cracked my school CS project easily."],
  [3, 1, 4, "Chemistry concepts explained clearly. Group batch is a bit large."],
  [4, 1, 5, "Abhijit Sir's problem-solving sessions are gold for WBJEE prep."],
  [5, 5, 5, "Sanchita Ma'am comes home and is extremely patient. Bengali grammar much improved."],
  [6, 3, 4, "Solid Accounts teacher. Notes are exam-ready."],
  [7, 4, 5, "Moumita Ma'am's diagrams and mnemonics are amazing for Biology."],
  [8, 5, 4, "Good foundation math for my younger son. Vedic tricks are fun."],
  [10, 3, 5, "Kaushik Sir is expensive but the IIT foundation batch is exceptional."],
  [12, 0, 4, "Tanmoy Sir explains in Bengali which really helps. Very regular and sincere."],
  [14, 1, 3, "Decent chemistry classes but mock tests could be more frequent."],
];

async function main() {
  console.log("Seeding…");

  // Wipe previous seed run (cascades to profiles and ratings).
  const oldSeedUsers = await db.query.users.findMany({
    where: (u, { eq }) => eq(u.phone, SEED_TAG),
  });
  if (oldSeedUsers.length) {
    await db.delete(schema.users).where(
      inArray(
        schema.users.id,
        oldSeedUsers.map((u) => u.id),
      ),
    );
    console.log(`Removed ${oldSeedUsers.length} previously seeded users.`);
  }

  const teacherIds: string[] = [];
  for (const [i, t] of TEACHERS.entries()) {
    const [user] = await db
      .insert(schema.users)
      .values({ authId: randomUUID(), role: "teacher", name: t.name, phone: SEED_TAG })
      .returning();
    const phone = `98300${String(10000 + i).slice(1)}`;
    const [profile] = await db
      .insert(schema.teacherProfiles)
      .values({
        userId: user.id,
        displayName: t.name,
        bio: t.bio,
        qualifications: t.qualifications,
        experienceYears: t.experienceYears,
        subjects: t.subjects,
        grades: t.grades,
        boards: t.boards,
        tuitionTypes: t.tuitionTypes,
        modes: t.modes,
        pincodes: t.pincodes,
        locality: t.locality,
        feeMin: t.feeMin,
        feeMax: t.feeMax,
        phone,
        whatsapp: phone,
      })
      .returning();
    teacherIds.push(profile.id);
  }
  console.log(`Inserted ${teacherIds.length} teachers.`);

  const studentIds: string[] = [];
  for (const s of STUDENTS) {
    const [user] = await db
      .insert(schema.users)
      .values({ authId: randomUUID(), role: "student", name: s.parent, phone: SEED_TAG })
      .returning();
    const [profile] = await db
      .insert(schema.studentProfiles)
      .values({
        userId: user.id,
        studentName: s.name,
        grade: s.grade,
        board: s.board,
        subjectsNeeded: s.subjects,
        pincode: s.pincode,
        preferredModes: ["Student's home", "Online"],
        parentName: s.parent,
      })
      .returning();
    studentIds.push(profile.id);
  }
  console.log(`Inserted ${studentIds.length} students.`);

  for (const [teacherIdx, studentIdx, stars, review] of RATINGS) {
    await db.insert(schema.ratings).values({
      teacherId: teacherIds[teacherIdx],
      studentId: studentIds[studentIdx],
      stars,
      review,
    });
  }
  console.log(`Inserted ${RATINGS.length} ratings.`);

  await client.end();
  console.log("Done ✅");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
