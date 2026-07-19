"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BOARDS,
  GRADES,
  MODES,
  SUBJECTS,
  TUITION_TYPES,
  formatGrade,
} from "@/lib/constants";

const ALL = "all";

function FilterSelect({
  label,
  param,
  options,
  format = String,
}: {
  label: string;
  param: string;
  options: readonly (string | number)[];
  format?: (o: string | number) => string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === ALL) params.delete(param);
      else params.set(param, value);
      router.push(`${pathname}?${params.toString()}`);
    },
    [param, pathname, router, searchParams],
  );

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select
        value={searchParams.get(param) ?? ALL}
        onValueChange={setParam}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Any</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={String(o)}>
              {format(o)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function SearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setPincode(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value.length === 6) params.set("pincode", value);
    else if (value.length === 0) params.delete("pincode");
    else return;
    router.push(`${pathname}?${params.toString()}`);
  }

  const hasFilters = [...searchParams.keys()].some((k) => k !== "sort");

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-1">
      <div className="space-y-1.5">
        <Label htmlFor="pincode-filter" className="text-xs text-muted-foreground">
          Pincode
        </Label>
        <Input
          id="pincode-filter"
          placeholder="e.g. 700032"
          inputMode="numeric"
          maxLength={6}
          defaultValue={searchParams.get("pincode") ?? ""}
          onChange={(e) => setPincode(e.target.value.trim())}
        />
      </div>
      <FilterSelect label="Subject" param="subject" options={SUBJECTS} />
      <FilterSelect
        label="Grade"
        param="grade"
        options={GRADES}
        format={(g) => formatGrade(Number(g))}
      />
      <FilterSelect label="Board" param="board" options={BOARDS} />
      <FilterSelect label="Solo / Group" param="type" options={TUITION_TYPES} />
      <FilterSelect label="Mode" param="mode" options={MODES} />
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="self-end text-muted-foreground"
          onClick={() => router.push(pathname)}
        >
          Clear all
        </Button>
      )}
    </div>
  );
}
