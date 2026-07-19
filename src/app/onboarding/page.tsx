import { redirect } from "next/navigation";
import { ensureAppUser } from "@/lib/actions/user";
import { getCurrentUser } from "@/lib/auth";
import { TeacherProfileForm } from "@/components/forms/teacher-profile-form";
import { StudentProfileForm } from "@/components/forms/student-profile-form";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  await ensureAppUser();
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Already onboarded → straight to dashboard.
  if (user.role === "teacher" && user.teacherProfile) redirect("/dashboard");
  if (user.role === "student" && user.studentProfile) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">
        {user.role === "teacher"
          ? "Set up your teacher profile"
          : "Tell us what you're looking for"}
      </h1>
      <p className="mt-1 mb-8 text-muted-foreground">
        {user.role === "teacher"
          ? "This is what students and parents will see when they search."
          : "This helps us match you with the right teachers, and lets you rate them."}
      </p>
      {user.role === "teacher" ? <TeacherProfileForm /> : <StudentProfileForm />}
    </div>
  );
}
