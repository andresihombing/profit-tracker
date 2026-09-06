import type { Metadata } from "next";
import { requireUser } from "@/server/auth";
import { getMonthlyReport } from "@/server/reports";
import { MonthlyReportTable } from "@/components/reports/monthly-report-table";
import { formatPercent, formatRupiah } from "@/lib/money";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Laporan",
};

export default async function ReportsPage() {
  const user = await requireUser();
  const rows = await getMonthlyReport(user.id);
  const totals = rows.reduce(
    (acc, row) => {
      acc.sales += row.sales;
      acc.capital += row.capital;
      acc.profit += row.profit;
      acc.count += row.count;
      return acc;
    },
    { sales: 0, capital: 0, profit: 0, count: 0 },
  );
  const margin = totals.sales === 0 ? null : (totals.profit / totals.sales) * 100;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Laporan</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ringkasan kinerja keuangan per bulan, siap diunduh sebagai CSV.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-white shadow-none">
          <CardHeader>
            <CardDescription>Total penjualan 12 bulan</CardDescription>
            <CardTitle className="text-xl">{formatRupiah(totals.sales)}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {totals.count} transaksi
          </CardContent>
        </Card>
        <Card className="bg-white shadow-none">
          <CardHeader>
            <CardDescription>Total modal 12 bulan</CardDescription>
            <CardTitle className="text-xl">{formatRupiah(totals.capital)}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-white shadow-none">
          <CardHeader>
            <CardDescription>Total keuntungan 12 bulan</CardDescription>
            <CardTitle className={totals.profit < 0 ? "text-xl text-rose-600" : "text-xl text-emerald-700"}>
              {formatRupiah(totals.profit)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Margin {formatPercent(margin)}
          </CardContent>
        </Card>
      </div>

      <MonthlyReportTable rows={rows} />
    </div>
  );
}
