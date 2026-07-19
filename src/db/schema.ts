import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Supabase auth.users id
    authId: uuid("auth_id").notNull().unique(),
    role: text("role", { enum: ["teacher", "student"] }).notNull(),
    name: text("name").notNull(),
    phone: text("phone"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
);

export const teacherProfiles = pgTable(
  "teacher_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    displayName: text("display_name").notNull(),
    photoUrl: text("photo_url"),
    bio: text("bio").notNull().default(""),
    qualifications: text("qualifications").notNull().default(""),
    experienceYears: integer("experience_years").notNull().default(0),
    subjects: text("subjects").array().notNull().default(sql`'{}'`),
    grades: integer("grades").array().notNull().default(sql`'{}'`),
    boards: text("boards").array().notNull().default(sql`'{}'`),
    tuitionTypes: text("tuition_types").array().notNull().default(sql`'{}'`),
    modes: text("modes").array().notNull().default(sql`'{}'`),
    pincodes: text("pincodes").array().notNull().default(sql`'{}'`),
    locality: text("locality").notNull().default(""),
    feeMin: integer("fee_min"),
    feeMax: integer("fee_max"),
    phone: text("phone").notNull(),
    whatsapp: text("whatsapp"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("tp_subjects_gin").using("gin", t.subjects),
    index("tp_grades_gin").using("gin", t.grades),
    index("tp_boards_gin").using("gin", t.boards),
    index("tp_pincodes_gin").using("gin", t.pincodes),
  ],
);

export const studentProfiles = pgTable("student_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  studentName: text("student_name").notNull(),
  grade: integer("grade").notNull(),
  board: text("board").notNull(),
  subjectsNeeded: text("subjects_needed").array().notNull().default(sql`'{}'`),
  pincode: text("pincode").notNull(),
  preferredModes: text("preferred_modes").array().notNull().default(sql`'{}'`),
  parentName: text("parent_name"),
  phone: text("phone"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const ratings = pgTable(
  "ratings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => teacherProfiles.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => studentProfiles.id, { onDelete: "cascade" }),
    stars: integer("stars").notNull(),
    // Optional per-category scores (1-5), voted on alongside the review.
    discipline: integer("discipline"),
    patience: integer("patience"),
    personalAttention: integer("personal_attention"),
    homework: integer("homework"),
    review: text("review").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("ratings_teacher_student_unique").on(t.teacherId, t.studentId),
    index("ratings_teacher_idx").on(t.teacherId),
  ],
);

export const usersRelations = relations(users, ({ one }) => ({
  teacherProfile: one(teacherProfiles, {
    fields: [users.id],
    references: [teacherProfiles.userId],
  }),
  studentProfile: one(studentProfiles, {
    fields: [users.id],
    references: [studentProfiles.userId],
  }),
}));

export const teacherProfilesRelations = relations(
  teacherProfiles,
  ({ one, many }) => ({
    user: one(users, {
      fields: [teacherProfiles.userId],
      references: [users.id],
    }),
    ratings: many(ratings),
  }),
);

export const studentProfilesRelations = relations(
  studentProfiles,
  ({ one, many }) => ({
    user: one(users, {
      fields: [studentProfiles.userId],
      references: [users.id],
    }),
    ratings: many(ratings),
  }),
);

export const ratingsRelations = relations(ratings, ({ one }) => ({
  teacher: one(teacherProfiles, {
    fields: [ratings.teacherId],
    references: [teacherProfiles.id],
  }),
  student: one(studentProfiles, {
    fields: [ratings.studentId],
    references: [studentProfiles.id],
  }),
}));
