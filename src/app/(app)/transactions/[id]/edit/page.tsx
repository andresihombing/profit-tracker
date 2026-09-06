import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTransaction } from "@/server/transactions";
import { TransactionForm } from "@/components/transactions/transaction-form";

export const metadata: Metadata = {
  title: "Ubah transaksi",
};

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const transaction = await getTransaction(id);
  if (!transaction) notFound();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Ubah transaksi</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Profit akan dihitung ulang dari penjualan dan modal terbaru.
        </p>
      </div>
      <TransactionForm transaction={transaction} />
    </div>
  );
}
