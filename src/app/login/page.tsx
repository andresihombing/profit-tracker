import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Masuk",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-foreground/10 sm:p-8">
        <div className="mb-6">
          <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-zinc-950 text-sm font-semibold text-white">
            P
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Profit Tracker</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Masuk untuk mencatat penjualan, modal, dan keuntungan harian.
          </p>
        </div>
        <LoginForm />
        <p className="mt-6 rounded-lg bg-zinc-50 px-3 py-2 text-xs text-muted-foreground">
          Akun demo: <span className="font-medium text-zinc-800">demo@profittracker.app</span> /{" "}
          <span className="font-medium text-zinc-800">demo1234</span>
        </p>
      </div>
    </div>
  );
}
