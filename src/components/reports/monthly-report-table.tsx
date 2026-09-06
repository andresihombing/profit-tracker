"use client";

import { Download } from "lucide-react";
import { formatPercent, formatRupiah } from "@/lib/money";
import type { MonthlyReportRow } from "@/types/transaction";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function MonthlyReportTable({ rows }: { rows: MonthlyReportRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white ring-1 ring-foreground/10">
      <div className="flex flex-col gap-3 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold">Rekap 12 bulan terakhir</h2>
          <p className="text-xs text-muted-foreground">
            Total penjualan, modal, dan keuntungan dikelompokkan per bulan.
          </p>
        </div>
        <a
          href="/api/reports/export"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <Download className="size-3.5" />
          Export CSV
        </a>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-50/80">
            <TableHead>Bulan</TableHead>
            <TableHead className="text-right">Penjualan</TableHead>
            <TableHead className="text-right">Modal</TableHead>
            <TableHead className="text-right">Keuntungan</TableHead>
            <TableHead className="text-right">Margin</TableHead>
            <TableHead className="text-right">Transaksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const isLoss = row.profit < 0;
            return (
              <TableRow key={`${row.year}-${row.month}`}>
                <TableCell className="font-medium">{row.label}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatRupiah(row.sales)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatRupiah(row.capital)}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={cn(
                      "tabular-nums font-medium",
                      isLoss ? "text-rose-600" : "text-emerald-700",
                    )}
                  >
                    {formatRupiah(row.profit)}
                  </span>
                  {isLoss ? (
                    <Badge variant="destructive" className="ml-2">
                      Kerugian
                    </Badge>
                  ) : null}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatPercent(row.margin)}
                </TableCell>
                <TableCell className="text-right tabular-nums">{row.count}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
