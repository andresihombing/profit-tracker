import { describe, expect, it } from "vitest";
import { sanitizeOptionalText, sanitizeText } from "@/lib/sanitize";

describe("sanitizeText", () => {
  it("menghapus tag HTML dan spasi tepi", () => {
    expect(sanitizeText("  <b>Penjualan</b> harian  ")).toBe("Penjualan harian");
  });

  it("mengosongkan catatan opsional yang hanya spasi", () => {
    expect(sanitizeOptionalText("   ")).toBeNull();
  });
});
