"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactRupiah, formatRupiah } from "@/lib/money";
import type { DailySeriesPoint } from "@/types/transaction";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ComparisonBarChart({ data }: { data: DailySeriesPoint[] }) {
  const hasData = data.some((point) => point.sales !== 0 || point.capital !== 0);
  const chartData =
    data.length > 21
      ? data.reduce<DailySeriesPoint[]>((weeks, point, index) => {
          if (index % 7 === 0) {
            weeks.push({ ...point, label: point.label });
          } else {
            const last = weeks[weeks.length - 1];
            last.sales += point.sales;
            last.capital += point.capital;
            last.profit += point.profit;
            last.label = `${last.label}–${point.label}`;
          }
          return weeks;
        }, [])
      : data;

  return (
    <Card className="bg-white shadow-none">
      <CardHeader>
        <CardTitle>Penjualan vs modal vs profit</CardTitle>
        <CardDescription>
          Perbandingan tiga metrik {data.length > 21 ? "per minggu" : "harian"}.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#71717a" }} tickLine={false} axisLine={false} />
              <YAxis
                tickFormatter={(value) => formatCompactRupiah(Number(value))}
                tick={{ fontSize: 11, fill: "#71717a" }}
                tickLine={false}
                axisLine={false}
                width={72}
              />
              <Tooltip formatter={(value) => formatRupiah(Number(value ?? 0))} />
              <Legend />
              <Bar dataKey="sales" name="Penjualan" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="capital" name="Modal" fill="#d97706" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Profit" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-zinc-200 text-sm text-muted-foreground">
            Belum ada data untuk dibandingkan.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
