"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactRupiah, formatRupiah } from "@/lib/money";
import type { DailySeriesPoint } from "@/types/transaction";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfitLineChart({ data }: { data: DailySeriesPoint[] }) {
  const hasData = data.some((point) => point.profit !== 0 || point.sales !== 0);

  return (
    <Card className="bg-white shadow-none">
      <CardHeader>
        <CardTitle>Perkembangan keuntungan</CardTitle>
        <CardDescription>Nominal profit harian pada periode yang dipilih.</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#71717a" }} tickLine={false} axisLine={false} />
              <YAxis
                tickFormatter={(value) => formatCompactRupiah(Number(value))}
                tick={{ fontSize: 11, fill: "#71717a" }}
                tickLine={false}
                axisLine={false}
                width={72}
              />
              <Tooltip
                formatter={(value) => formatRupiah(Number(value ?? 0))}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.date ?? ""}
              />
              <Line
                type="monotone"
                dataKey="profit"
                name="Keuntungan"
                stroke="#059669"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart />
        )}
      </CardContent>
    </Card>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-zinc-200 text-sm text-muted-foreground">
      Belum ada transaksi pada periode ini.
    </div>
  );
}
