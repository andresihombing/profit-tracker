import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email wajib diisi")
  .email("Format email tidak valid")
  .max(255)
  .transform((value) => value.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, "Kata sandi minimal 8 karakter")
  .max(72, "Kata sandi terlalu panjang");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Nama minimal 2 karakter")
      .max(80, "Nama terlalu panjang"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
