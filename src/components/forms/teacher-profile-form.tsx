"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChipSelect } from "@/components/chip-select";
import {
  saveTeacherProfile,
  type TeacherProfileInput,
} from "@/lib/actions/profiles";
import {
  BOARDS,
  GRADES,
  MODES,
  SUBJECTS,
  TUITION_TYPES,
  formatGrade,
  isValidKolkataPincode,
} from "@/lib/constants";
import type { teacherProfiles } from "@/db/schema";

type Props = {
  initial?: typeof teacherProfiles.$inferSelect | null;
};

export function TeacherProfileForm({ initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [displayName, setDisplayName] = useState(initial?.displayName ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [qualifications, setQualifications] = useState(initial?.qualifications ?? "");
  const [experienceYears, setExperienceYears] = useState(initial?.experienceYears ?? 0);
  const [subjects, setSubjects] = useState<string[]>(initial?.subjects ?? []);
  const [grades, setGrades] = useState<number[]>(initial?.grades ?? []);
  const [boards, setBoards] = useState<string[]>(initial?.boards ?? []);
  const [tuitionTypes, setTuitionTypes] = useState<string[]>(initial?.tuitionTypes ?? []);
  const [modes, setModes] = useState<string[]>(initial?.modes ?? []);
  const [pincodes, setPincodes] = useState<string[]>(initial?.pincodes ?? []);
  const [pincodeDraft, setPincodeDraft] = useState("");
  const [locality, setLocality] = useState(initial?.locality ?? "");
  const [feeMin, setFeeMin] = useState(initial?.feeMin?.toString() ?? "");
  const [feeMax, setFeeMax] = useState(initial?.feeMax?.toString() ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(initial?.whatsapp ?? "");

  function addPincode() {
    const pin = pincodeDraft.trim();
    if (!isValidKolkataPincode(pin)) {
      toast.error("Enter a valid Kolkata pincode (700001–700163).");
      return;
    }
    if (!pincodes.includes(pin)) setPincodes([...pincodes, pin]);
    setPincodeDraft("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: TeacherProfileInput = {
      displayName,
      bio,
      qualifications,
      experienceYears,
      subjects,
      grades,
      boards,
      tuitionTypes,
      modes,
      pincodes,
      locality,
      feeMin: feeMin ? Number(feeMin) : null,
      feeMax: feeMax ? Number(feeMax) : null,
      phone,
      whatsapp,
    };
    startTransition(async () => {
      const result = await saveTeacherProfile(input);
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
          <Label htmlFor="displayName">Display name *</Label>
          <Input
            id="displayName"
            required
            placeholder="e.g. Anirban Sir, Priya Ma'am"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience">Years of experience</Label>
          <Input
            id="experience"
            type="number"
            min={0}
            max={60}
            value={experienceYears}
            onChange={(e) => setExperienceYears(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="qualifications">Qualifications</Label>
        <Input
          id="qualifications"
          placeholder="e.g. M.Sc. Mathematics, B.Ed."
          value={qualifications}
          onChange={(e) => setQualifications(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">About you</Label>
        <Textarea
          id="bio"
          rows={4}
          placeholder="Teaching style, results, batch timings…"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Subjects you teach *</Label>
        <ChipSelect options={SUBJECTS} selected={subjects} onChange={setSubjects} />
      </div>

      <div className="space-y-2">
        <Label>Grades *</Label>
        <ChipSelect
          options={GRADES}
          selected={grades}
          onChange={setGrades}
          format={(g) => formatGrade(g)}
        />
      </div>

      <div className="space-y-2">
        <Label>Boards *</Label>
        <ChipSelect options={BOARDS} selected={boards} onChange={setBoards} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Tuition type *</Label>
          <ChipSelect
            options={TUITION_TYPES}
            selected={tuitionTypes}
            onChange={setTuitionTypes}
          />
        </div>
        <div className="space-y-2">
          <Label>Mode *</Label>
          <ChipSelect options={MODES} selected={modes} onChange={setModes} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pincode">Pincodes you serve *</Label>
        <div className="flex gap-2">
          <Input
            id="pincode"
            placeholder="e.g. 700032"
            inputMode="numeric"
            maxLength={6}
            value={pincodeDraft}
            onChange={(e) => setPincodeDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addPincode();
              }
            }}
          />
          <Button type="button" variant="secondary" onClick={addPincode}>
            Add
          </Button>
        </div>
        {pincodes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {pincodes.map((pin) => (
              <Badge key={pin} variant="secondary" className="gap-1">
                {pin}
                <button
                  type="button"
                  aria-label={`Remove ${pin}`}
                  onClick={() => setPincodes(pincodes.filter((p) => p !== pin))}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="locality">Locality / area</Label>
        <Input
          id="locality"
          placeholder="e.g. Jadavpur, Salt Lake Sector V"
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="feeMin">Fee from (₹/month)</Label>
          <Input
            id="feeMin"
            type="number"
            min={0}
            placeholder="e.g. 800"
            value={feeMin}
            onChange={(e) => setFeeMin(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="feeMax">Fee up to (₹/month)</Label>
          <Input
            id="feeMax"
            type="number"
            min={0}
            placeholder="e.g. 2000"
            value={feeMax}
            onChange={(e) => setFeeMax(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            required
            inputMode="numeric"
            placeholder="10-digit mobile"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp (if different)</Label>
          <Input
            id="whatsapp"
            inputMode="numeric"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
