CREATE TABLE "ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teacher_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"stars" integer NOT NULL,
	"review" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"student_name" text NOT NULL,
	"grade" integer NOT NULL,
	"board" text NOT NULL,
	"subjects_needed" text[] DEFAULT '{}' NOT NULL,
	"pincode" text NOT NULL,
	"preferred_modes" text[] DEFAULT '{}' NOT NULL,
	"parent_name" text,
	"phone" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "student_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "teacher_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"display_name" text NOT NULL,
	"photo_url" text,
	"bio" text DEFAULT '' NOT NULL,
	"qualifications" text DEFAULT '' NOT NULL,
	"experience_years" integer DEFAULT 0 NOT NULL,
	"subjects" text[] DEFAULT '{}' NOT NULL,
	"grades" integer[] DEFAULT '{}' NOT NULL,
	"boards" text[] DEFAULT '{}' NOT NULL,
	"tuition_types" text[] DEFAULT '{}' NOT NULL,
	"modes" text[] DEFAULT '{}' NOT NULL,
	"pincodes" text[] DEFAULT '{}' NOT NULL,
	"locality" text DEFAULT '' NOT NULL,
	"fee_min" integer,
	"fee_max" integer,
	"phone" text NOT NULL,
	"whatsapp" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "teacher_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_id" uuid NOT NULL,
	"role" text NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_auth_id_unique" UNIQUE("auth_id")
);
--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_teacher_id_teacher_profiles_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teacher_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_student_id_student_profiles_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_profiles" ADD CONSTRAINT "teacher_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "ratings_teacher_student_unique" ON "ratings" USING btree ("teacher_id","student_id");--> statement-breakpoint
CREATE INDEX "ratings_teacher_idx" ON "ratings" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "tp_subjects_gin" ON "teacher_profiles" USING gin ("subjects");--> statement-breakpoint
CREATE INDEX "tp_grades_gin" ON "teacher_profiles" USING gin ("grades");--> statement-breakpoint
CREATE INDEX "tp_boards_gin" ON "teacher_profiles" USING gin ("boards");--> statement-breakpoint
CREATE INDEX "tp_pincodes_gin" ON "teacher_profiles" USING gin ("pincodes");