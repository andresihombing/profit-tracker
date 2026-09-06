import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center ring-1 ring-foreground/10">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="mt-2 text-xl font-semibold">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Periksa URL, atau kembali ke dashboard.
        </p>
        <Link href="/dashboard" className={cn(buttonVariants(), "mt-6")}>
          Ke dashboard
        </Link>
      </div>
    </div>
  );
}
