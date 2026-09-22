import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Daftar",
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Buat akun"
      description="Daftar untuk mencatat penjualan, modal, dan keuntungan milik Anda sendiri."
      footer={
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-zinc-900 underline-offset-4 hover:underline"
          >
            Masuk
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
