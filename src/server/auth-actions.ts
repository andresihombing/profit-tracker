"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { loginSchema } from "@/validations/auth";

export type AuthActionState = {
  error?: string;
};

export async function loginAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data login tidak valid." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email atau kata sandi tidak valid." };
    }
    throw error;
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
