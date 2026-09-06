import { describe, expect, it } from "vitest";
import { transactionSchema } from "@/validations/transaction";

describe("transactionSchema", () => {
  it("menerima payload valid", () => {
    const parsed = transactionSchema.safeParse({
      date: "2026-09-06",
      description: "Penjualan harian",
      salesAmount: "1000000",
      capitalAmount: "600000",
      note: "",
    });
    expect(parsed.success).toBe(true);
  });

  it("menolak penjualan negatif", () => {
    const parsed = transactionSchema.safeParse({
      date: "2026-09-06",
      description: "Salah",
      salesAmount: -1,
      capitalAmount: 0,
    });
    expect(parsed.success).toBe(false);
  });

  it("menolak deskripsi kosong", () => {
    const parsed = transactionSchema.safeParse({
      date: "2026-09-06",
      description: "   ",
      salesAmount: 1,
      capitalAmount: 1,
    });
    expect(parsed.success).toBe(false);
  });
});
