import { describe, expect, it } from "vitest";
import {
  calculateMarginPercent,
  calculateProfit,
  formatPercent,
  formatRupiah,
} from "@/lib/money";

describe("calculateProfit", () => {
  it("menghitung keuntungan positif", () => {
    expect(calculateProfit(1_000_000, 600_000)).toBe(400_000);
  });

  it("menghasilkan kerugian jika modal lebih besar", () => {
    expect(calculateProfit(500_000, 700_000)).toBe(-200_000);
  });

  it("menghasilkan nol jika penjualan sama dengan modal", () => {
    expect(calculateProfit(250_000, 250_000)).toBe(0);
  });
});

describe("formatRupiah", () => {
  it("memformat angka positif", () => {
    expect(formatRupiah(1_000_000)).toContain("1.000.000");
  });

  it("menandai nilai negatif", () => {
    expect(formatRupiah(-200_000).startsWith("-")).toBe(true);
  });
});

describe("margin", () => {
  it("menghitung persentase margin", () => {
    expect(calculateMarginPercent(400_000, 1_000_000)).toBe(40);
    expect(formatPercent(40)).toBe("40,0%");
  });

  it("mengembalikan null jika penjualan nol", () => {
    expect(calculateMarginPercent(-200_000, 0)).toBeNull();
    expect(formatPercent(null)).toBe("—");
  });
});
