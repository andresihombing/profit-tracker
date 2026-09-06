import { formatDateOnly } from "@/lib/date-range";
import { formatPercent, formatRupiah } from "@/lib/money";
import type { MonthlyReportRow } from "@/types/transaction";

export function buildMonthlyReportCsv(rows: MonthlyReportRow[]): string {
  const header = [
    "Bulan",
    "Total Penjualan",
    "Total Modal",
    "Total Keuntungan",
    "Margin (%)",
    "Jumlah Transaksi",
  ];

  const lines = rows.map((row) => {
    const month = formatDateOnly(new Date(Date.UTC(row.year, row.month - 1, 1))).slice(0, 7);
    return [
      month,
      row.sales.toFixed(2),
      row.capital.toFixed(2),
      row.profit.toFixed(2),
      row.margin == null ? "" : row.margin.toFixed(2),
      String(row.count),
    ].join(",");
  });

  return `\uFEFF${header.join(",")}\n${lines.join("\n")}\n`;
}

export function buildMonthlyReportPreview(rows: MonthlyReportRow[]) {
  return rows.map((row) => ({
    bulan: `${row.year}-${String(row.month).padStart(2, "0")}`,
    penjualan: formatRupiah(row.sales),
    modal: formatRupiah(row.capital),
    keuntungan: formatRupiah(row.profit),
    margin: formatPercent(row.margin),
  }));
}
