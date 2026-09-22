import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "@/validations/auth";

describe("loginSchema", () => {
  it("menerima email valid dan menormalkan huruf kecil", () => {
    const parsed = loginSchema.safeParse({
      email: "Anda@Email.COM",
      password: "password123",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.email).toBe("anda@email.com");
    }
  });

  it("menolak kata sandi pendek", () => {
    const parsed = loginSchema.safeParse({
      email: "anda@email.com",
      password: "short",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("menerima payload valid", () => {
    const parsed = registerSchema.safeParse({
      name: "Andi Wijaya",
      email: "andi@email.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(parsed.success).toBe(true);
  });

  it("menolak konfirmasi kata sandi yang tidak cocok", () => {
    const parsed = registerSchema.safeParse({
      name: "Andi Wijaya",
      email: "andi@email.com",
      password: "password123",
      confirmPassword: "password124",
    });
    expect(parsed.success).toBe(false);
  });

  it("menolak nama terlalu pendek", () => {
    const parsed = registerSchema.safeParse({
      name: "A",
      email: "andi@email.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(parsed.success).toBe(false);
  });
});
