export const APP_TIMEZONE = "Asia/Jakarta";

export type DatePreset = "today" | "week" | "month" | "custom";

export type DateRange = {
  preset: DatePreset;
  start: Date;
  end: Date;
};

function zonedYmd(date = new Date(), timeZone = APP_TIMEZONE) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const y = Number(parts.find((part) => part.type === "year")?.value);
  const m = Number(parts.find((part) => part.type === "month")?.value);
  const d = Number(parts.find((part) => part.type === "day")?.value);

  return { y, m, d };
}

export function utcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

export function parseDateOnly(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = utcDate(year, month, day);
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

export function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function todayUtcDate(now = new Date()): Date {
  const { y, m, d } = zonedYmd(now);
  return utcDate(y, m, d);
}

export function startOfWeekMonday(date: Date): Date {
  const day = date.getUTCDay();
  const offset = day === 0 ? 6 : day - 1;
  return utcDate(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate() - offset,
  );
}

export function startOfMonth(date: Date): Date {
  return utcDate(date.getUTCFullYear(), date.getUTCMonth() + 1, 1);
}

export function endOfMonth(date: Date): Date {
  return utcDate(date.getUTCFullYear(), date.getUTCMonth() + 2, 0);
}

export function addDays(date: Date, amount: number): Date {
  return utcDate(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate() + amount,
  );
}

export function eachDateInRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  let cursor = start;
  while (cursor.getTime() <= end.getTime()) {
    dates.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return dates;
}

export function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
  }).format(date);
}

export function formatMonthYear(year: number, month: number): string {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(utcDate(year, month, 1));
}

export function isDatePreset(value: string | undefined): value is DatePreset {
  return value === "today" || value === "week" || value === "month" || value === "custom";
}

export function resolveDateRange(params: {
  preset?: string;
  from?: string;
  to?: string;
  now?: Date;
}): DateRange {
  const today = todayUtcDate(params.now);
  const preset = isDatePreset(params.preset) ? params.preset : "month";

  if (preset === "today") {
    return { preset, start: today, end: today };
  }

  if (preset === "week") {
    const start = startOfWeekMonday(today);
    return { preset, start, end: addDays(start, 6) };
  }

  if (preset === "month") {
    return { preset, start: startOfMonth(today), end: endOfMonth(today) };
  }

  const start = parseDateOnly(params.from ?? "") ?? startOfMonth(today);
  const end = parseDateOnly(params.to ?? "") ?? today;
  if (start.getTime() > end.getTime()) {
    return { preset: "custom", start: end, end: start };
  }
  return { preset: "custom", start, end };
}

export function rangeLabel(range: DateRange): string {
  if (range.start.getTime() === range.end.getTime()) {
    return formatLongDate(range.start);
  }
  return `${formatLongDate(range.start)} – ${formatLongDate(range.end)}`;
}
