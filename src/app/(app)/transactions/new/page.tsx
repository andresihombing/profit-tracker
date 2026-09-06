import type { Metadata } from "next";
import { TransactionForm } from "@/components/transactions/transaction-form";

export const metadata: Metadata = {
  title: "Tambah transaksi",
};

export default function NewTransactionPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Tambah transaksi</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Isi penjualan dan modal. Sistem menghitung keuntungan secara otomatis.
        </p>
      </div>
      <TransactionForm />
    </div>
  );
}
