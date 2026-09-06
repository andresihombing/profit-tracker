"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatRupiah } from "@/lib/money";
import type { DashboardSummary } from "@/types/transaction";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#d97706", "#059669"];

export function CompositionPieChart({ summary }: { summary: DashboardSummary }) {
  const canShow = summary.profit >= 0 && summary.capital + summary.profit > 0;
  const data = [
    { name: "Modal", value: summary.capital },
    { name: "Profit", value: Math.max(summary.profit, 0) },
  ];

  return (
    <Card className="bg-white shadow-none">
      <CardHeader>
        <CardTitle>Komposisi modal & profit</CardTitle>
        <CardDescription>
          Bagaimana penjualan terbagi antara modal dan keuntungan.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        {canShow ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={88}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatRupiah(Number(value ?? 0))} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-rose-200 bg-rose-50/50 px-6 text-center">
            <p className="text-sm font-medium text-rose-700">Periode ini merugi</p>
            <p className="text-xs text-rose-600">
              Komposisi pie hanya ditampilkan jika profit tidak negatif.
            </p>
          </div>
        )}
        {canShow ? (
          <div className="mt-2 flex justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-600" /> Modal
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-600" /> Profit
            </span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
