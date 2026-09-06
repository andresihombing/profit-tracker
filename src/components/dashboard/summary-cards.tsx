import { TrendingDown, TrendingUp, Wallet, Coins } from "lucide-react";
import { formatPercent, formatRupiah } from "@/lib/money";
import type { DashboardSummary } from "@/types/transaction";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SummaryCards({
  summary,
  periodLabel,
}: {
  summary: DashboardSummary;
  periodLabel: string;
}) {
  const isLoss = summary.profit < 0;
  const cards = [
    {
      title: "Total Penjualan",
      value: formatRupiah(summary.sales),
      hint: `${summary.count} transaksi`,
      icon: Wallet,
      accent: "text-blue-600 bg-blue-50",
    },
    {
      title: "Total Modal",
      value: formatRupiah(summary.capital),
      hint: "Biaya modal periode ini",
      icon: Coins,
      accent: "text-amber-600 bg-amber-50",
    },
    {
      title: isLoss ? "Total Kerugian" : "Total Keuntungan",
      value: formatRupiah(summary.profit),
      hint: isLoss ? "Modal lebih besar dari penjualan" : "Penjualan dikurangi modal",
      icon: isLoss ? TrendingDown : TrendingUp,
      accent: isLoss ? "text-rose-600 bg-rose-50" : "text-emerald-600 bg-emerald-50",
      valueClass: isLoss ? "text-rose-600" : "text-emerald-700",
    },
    {
      title: "Margin Keuntungan",
      value: formatPercent(summary.margin),
      hint: "Profit / penjualan",
      icon: TrendingUp,
      accent: "text-zinc-700 bg-zinc-100",
      valueClass: isLoss ? "text-rose-600" : undefined,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="bg-white shadow-none">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardDescription>{card.title}</CardDescription>
                <CardTitle className={cn("mt-1 text-xl tracking-tight", card.valueClass)}>
                  {card.value}
                </CardTitle>
              </div>
              <span className={cn("rounded-lg p-2", card.accent)}>
                <Icon className="size-4" />
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {card.hint} · {periodLabel}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
