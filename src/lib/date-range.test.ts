import { describe, expect, it } from "vitest";
import {
  formatDateOnly,
  parseDateOnly,
  resolveDateRange,
  startOfWeekMonday,
  todayUtcDate,
} from "@/lib/date-range";

describe("parseDateOnly", () => {
  it("menerima tanggal kalender valid", () => {
    const date = parseDateOnly("2026-09-06");
    expect(date).not.toBeNull();
    expect(formatDateOnly(date!)).toBe("2026-09-06");
  });

  it("menolak tanggal mustahil", () => {
    expect(parseDateOnly("2026-02-31")).toBeNull();
    expect(parseDateOnly("06-09-2026")).toBeNull();
  });
});

describe("resolveDateRange", () => {
  const now = new Date("2026-09-06T06:25:00.000Z");

  it("memakai hari ini sesuai zona Jakarta", () => {
    const range = resolveDateRange({ preset: "today", now });
    expect(formatDateOnly(range.start)).toBe("2026-09-06");
    expect(formatDateOnly(range.end)).toBe("2026-09-06");
  });

  it("memakai minggu ISO Senin-Minggu", () => {
    const range = resolveDateRange({ preset: "week", now });
    expect(formatDateOnly(range.start)).toBe("2026-08-31");
    expect(formatDateOnly(range.end)).toBe("2026-09-06");
  });

  it("memakai bulan berjalan", () => {
    const range = resolveDateRange({ preset: "month", now });
    expect(formatDateOnly(range.start)).toBe("2026-09-01");
    expect(formatDateOnly(range.end)).toBe("2026-09-06");
  });

  it("menerima rentang kustom dan menukar jika terbalik", () => {
    const range = resolveDateRange({
      preset: "custom",
      from: "2026-09-30",
      to: "2026-09-01",
      now,
    });
    expect(formatDateOnly(range.start)).toBe("2026-09-01");
    expect(formatDateOnly(range.end)).toBe("2026-09-30");
  });
});

describe("calendar helpers", () => {
  it("todayUtcDate memakai tanggal Jakarta", () => {
    expect(formatDateOnly(todayUtcDate(new Date("2026-09-06T16:30:00.000Z")))).toBe(
      "2026-09-06",
    );
  });

  it("startOfWeekMonday mundur ke Senin", () => {
    const sunday = parseDateOnly("2026-09-06")!;
    expect(formatDateOnly(startOfWeekMonday(sunday))).toBe("2026-08-31");
  });
});
