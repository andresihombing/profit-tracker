"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { DatePreset, DateRange } from "@/lib/date-range";
import { formatDateOnly } from "@/lib/date-range";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const presets: { value: DatePreset; label: string }[] = [
  { value: "today", label: "Hari ini" },
  { value: "week", label: "Minggu ini" },
  { value: "month", label: "Bulan ini" },
  { value: "custom", label: "Custom" },
];

export function DateFilter({
  range,
  pathname = "/dashboard",
}: {
  range: DateRange;
  pathname?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function push(next: { preset: DatePreset; from?: string; to?: string }) {
    const params = new URLSearchParams();
    params.set("preset", next.preset);
    if (next.preset === "custom") {
      params.set("from", next.from ?? formatDateOnly(range.start));
      params.set("to", next.to ?? formatDateOnly(range.end));
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.value}
            type="button"
            size="sm"
            variant={range.preset === preset.value ? "default" : "outline"}
            disabled={pending}
            onClick={() => push({ preset: preset.value })}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <div
        className={cn(
          "grid gap-3 sm:grid-cols-2",
          range.preset === "custom" ? "opacity-100" : "opacity-60",
        )}
      >
        <div className="grid gap-1.5">
          <Label htmlFor="start-date" className="text-xs text-muted-foreground">
            Tanggal mulai
          </Label>
          <Input
            id="start-date"
            type="date"
            value={formatDateOnly(range.start)}
            disabled={pending}
            onChange={(event) =>
              push({
                preset: "custom",
                from: event.target.value,
                to: formatDateOnly(range.end),
              })
            }
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="end-date" className="text-xs text-muted-foreground">
            Tanggal akhir
          </Label>
          <Input
            id="end-date"
            type="date"
            value={formatDateOnly(range.end)}
            disabled={pending}
            onChange={(event) =>
              push({
                preset: "custom",
                from: formatDateOnly(range.start),
                to: event.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
