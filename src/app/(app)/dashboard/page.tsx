import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { rangeLabel, resolveDateRange } from "@/lib/date-range";
import { requireUser } from "@/server/auth";
import { getDashboardData } from "@/server/dashboard";
import { ComparisonBarChart } from "@/components/dashboard/comparison-bar-chart";
import { CompositionPieChart } from "@/components/dashboard/composition-pie-chart";
import { DateFilter } from "@/components/dashboard/date-filter";
import { ProfitLineChart } from "@/components/dashboard/profit-line-chart";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ preset?: string; from?: string; to?: string; page?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const range = resolveDateRange(params);
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const data = await getDashboardData(user.id, range, page);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ringkasan keuangan akun Anda · {rangeLabel(range)}
          </p>
        </div>
        <Link href="/transactions/new" className={cn(buttonVariants())}>
          <Plus className="size-4" />
          Tambah transaksi
        </Link>
      </div>

      <DateFilter range={range} />
      <SummaryCards summary={data.summary} periodLabel={rangeLabel(range)} />

      <ProfitLineChart data={data.series} />
      <div className="grid gap-4 xl:grid-cols-2">
        <ComparisonBarChart data={data.series} />
        <CompositionPieChart summary={data.summary} />
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold">Transaksi periode ini</h3>
          <p className="text-sm text-muted-foreground">
            Diurutkan dari tanggal terbaru. Ringkasan di atas mengikuti filter yang sama.
          </p>
        </div>
      </div>
      <TransactionTable data={data.transactions} />
    </div>
  );
}
