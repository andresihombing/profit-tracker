"use client";

import { useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg rounded-xl bg-white p-6 text-center ring-1 ring-foreground/10">
      <h2 className="text-lg font-semibold">Terjadi kesalahan</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Halaman gagal dimuat. Coba muat ulang, atau kembali ke dashboard.
      </p>
      <div className="mt-4 flex justify-center gap-2">
        <button
          type="button"
          onClick={reset}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Coba lagi
        </button>
        <Link href="/dashboard" className={cn(buttonVariants())}>
          Ke dashboard
        </Link>
      </div>
    </div>
  );
}
