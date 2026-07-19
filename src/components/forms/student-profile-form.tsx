"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChipSelect } from "@/components/chip-select";
import {
  saveStudentProfile,
  type StudentProfileInput,
} from "@/lib/actions/profiles";
import {
  BOARDS,
  GRADES,
  MODES,
  SUBJECTS,
  formatGrade,
} from "@/lib/constants";
import type { studentProfiles } from "@/db/schema";

type Props = {
  initial?: typeof studentProfiles.$inferSelect | null;
};

export function StudentProfileForm({ initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [studentName, setStudentName] = useState(initial?.studentName ?? "");
  const [grade, setGrade] = useState<number[]>(initial ? [initial.grade] : []);
  const [board, setBoard] = useState<string[]>(initial ? [initial.board] : []);
  const [subjectsNeeded, setSubjectsNeeded] = useState<string[]>(
    initial?.subjectsNeeded ?? [],
  );
  const [pincode, setPincode] = useState(initial?.pincode ?? "");
  const [preferredModes, setPreferredModes] = useState<string[]>(
    initial?.preferredModes ?? [],
  );
  const [parentName, setParentName] = useState(initial?.parentName ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!grade.length || !board.length) {
      toast.error("Pick the student's grade and board.");
      return;
    }
    const input: StudentProfileInput = {
      studentName,
      grade: grade[0],
      board: board[0],
      subjectsNeeded,
      pincode,
      preferredModes,
      parentName,
      phone,
    };
    startTransition(async () => {
      const result = await saveStudentProfile(input);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Profile saved!");
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="studentName">Student name *</Label>
          <Input
            id="studentName"
            required
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="parentName">Parent name (optional)</Label>
          <Input
            id="parentName"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Grade *</Label>
        <ChipSelect
          options={GRADES}
          selected={grade}
          onChange={setGrade}
          single
          format={(g) => formatGrade(g)}
        />
      </div>

      <div className="space-y-2">
        <Label>Board *</Label>
        <ChipSelect options={BOARDS} selected={board} onChange={setBoard} single />
      </div>

      <div className="space-y-2">
        <Label>Subjects you need help with</Label>
        <ChipSelect
          options={SUBJECTS}
          selected={subjectsNeeded}
          onChange={setSubjectsNeeded}
        />
      </div>

      <div className="space-y-2">
        <Label>Preferred mode</Label>
        <ChipSelect
          options={MODES}
          selected={preferredModes}
          onChange={setPreferredModes}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="pincode">Your pincode *</Label>
          <Input
            id="pincode"
            required
            inputMode="numeric"
            maxLength={6}
            placeholder="e.g. 700019"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Contact phone (optional)</Label>
          <Input
            id="phone"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
