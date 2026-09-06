"use client";

import { useRouter } from "next/navigation";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { calculateProfit, formatRupiah } from "@/lib/money";
import { formatDateOnly, todayUtcDate } from "@/lib/date-range";
import { createTransaction, updateTransaction } from "@/server/transactions";
import {
  transactionSchema,
  type TransactionInput,
} from "@/validations/transaction";
import type { TransactionDTO } from "@/types/transaction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function TransactionForm({
  transaction,
}: {
  transaction?: TransactionDTO;
}) {
  const router = useRouter();
  const form = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema) as Resolver<TransactionInput>,
    defaultValues: {
      date: transaction ? transaction.date.slice(0, 10) : formatDateOnly(todayUtcDate()),
      description: transaction?.description ?? "",
      salesAmount: transaction?.salesAmount ?? 0,
      capitalAmount: transaction?.capitalAmount ?? 0,
      note: transaction?.note ?? "",
    },
  });

  const sales = Number(useWatch({ control: form.control, name: "salesAmount" }) || 0);
  const capital = Number(useWatch({ control: form.control, name: "capitalAmount" }) || 0);
  const profit = Number.isFinite(sales) && Number.isFinite(capital)
    ? calculateProfit(sales, capital)
    : 0;

  async function onSubmit(values: TransactionInput) {
    const result = transaction
      ? await updateTransaction(transaction.id, values)
      : await createTransaction(values);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(
      transaction ? "Transaksi berhasil diperbarui." : "Transaksi berhasil disimpan.",
    );
    router.push("/transactions");
    router.refresh();
  }

  return (
    <Card className="mx-auto max-w-2xl bg-white shadow-none">
      <CardHeader>
        <CardTitle>{transaction ? "Ubah transaksi" : "Tambah transaksi"}</CardTitle>
        <CardDescription>
          Keuntungan dihitung otomatis dari penjualan dikurangi modal. Nilai bisa negatif jika merugi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
          <Field
            label="Tanggal"
            htmlFor="date"
            error={form.formState.errors.date?.message}
          >
            <Input id="date" type="date" {...form.register("date")} />
          </Field>

          <Field
            label="Nama transaksi"
            htmlFor="description"
            error={form.formState.errors.description?.message}
          >
            <Input
              id="description"
              placeholder="Misalnya penjualan harian toko"
              {...form.register("description")}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Total penjualan (Rp)"
              htmlFor="salesAmount"
              error={form.formState.errors.salesAmount?.message}
            >
              <Input
                id="salesAmount"
                type="number"
                min={0}
                step="1"
                inputMode="numeric"
                {...form.register("salesAmount")}
              />
            </Field>
            <Field
              label="Total modal (Rp)"
              htmlFor="capitalAmount"
              error={form.formState.errors.capitalAmount?.message}
            >
              <Input
                id="capitalAmount"
                type="number"
                min={0}
                step="1"
                inputMode="numeric"
                {...form.register("capitalAmount")}
              />
            </Field>
          </div>

          <div
            className={cn(
              "rounded-lg border px-3 py-3",
              profit < 0 ? "border-rose-200 bg-rose-50" : "border-emerald-200 bg-emerald-50",
            )}
          >
            <p className="text-xs font-medium text-muted-foreground">
              {profit < 0 ? "Kerugian (otomatis)" : "Keuntungan (otomatis)"}
            </p>
            <p
              className={cn(
                "mt-1 text-lg font-semibold",
                profit < 0 ? "text-rose-700" : "text-emerald-700",
              )}
            >
              {formatRupiah(profit)}
            </p>
          </div>

          <Field
            label="Catatan (opsional)"
            htmlFor="note"
            error={form.formState.errors.note?.message}
          >
            <Textarea
              id="note"
              rows={3}
              placeholder="Keterangan tambahan"
              {...form.register("note")}
            />
          </Field>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/transactions")}
            >
              Batal
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Menyimpan..." : "Simpan transaksi"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
