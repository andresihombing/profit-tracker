import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requireUser } from "@/server/auth";
import { getTransactionsPage } from "@/server/reports";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Transaksi",
};

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const data = await getTransactionsPage(user.id, page);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Transaksi</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Semua catatan penjualan dan modal milik Anda, diurutkan dari tanggal terbaru.
          </p>
        </div>
        <Link href="/transactions/new" className={cn(buttonVariants())}>
          <Plus className="size-4" />
          Tambah transaksi
        </Link>
      </div>
      <TransactionTable
        data={data}
        emptyMessage="Belum ada transaksi. Tambahkan catatan penjualan pertama Anda."
      />
    </div>
  );
}
