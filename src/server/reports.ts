import { prisma } from "@/lib/prisma";
import { formatMonthYear, startOfMonth, todayUtcDate, utcDate } from "@/lib/date-range";
import { calculateMarginPercent, decimalToNumber } from "@/lib/money";
import { serializeTransaction } from "@/server/serializers";
import type { MonthlyReportRow, PaginatedTransactions } from "@/types/transaction";

export async function getMonthlyReport(userId: string, months = 12): Promise<MonthlyReportRow[]> {
  const today = todayUtcDate();
  const end = startOfMonth(today);
  const start = utcDate(end.getUTCFullYear(), end.getUTCMonth() + 1 - (months - 1), 1);
  const rangeEnd = utcDate(today.getUTCFullYear(), today.getUTCMonth() + 2, 0);

  const grouped = await prisma.transaction.groupBy({
    by: ["date"],
    where: {
      userId,
      date: {
        gte: start,
        lte: rangeEnd,
      },
    },
    _sum: {
      salesAmount: true,
      capitalAmount: true,
      profitAmount: true,
    },
    _count: true,
  });

  const buckets = new Map<string, MonthlyReportRow>();
  for (let i = 0; i < months; i += 1) {
    const cursor = utcDate(start.getUTCFullYear(), start.getUTCMonth() + 1 + i, 1);
    const year = cursor.getUTCFullYear();
    const month = cursor.getUTCMonth() + 1;
    buckets.set(`${year}-${month}`, {
      year,
      month,
      label: formatMonthYear(year, month),
      sales: 0,
      capital: 0,
      profit: 0,
      margin: null,
      count: 0,
    });
  }

  for (const row of grouped) {
    const year = row.date.getUTCFullYear();
    const month = row.date.getUTCMonth() + 1;
    const key = `${year}-${month}`;
    const bucket = buckets.get(key);
    if (!bucket) continue;
    bucket.sales += decimalToNumber(row._sum.salesAmount ?? 0);
    bucket.capital += decimalToNumber(row._sum.capitalAmount ?? 0);
    bucket.profit += decimalToNumber(row._sum.profitAmount ?? 0);
    bucket.count += row._count;
  }

  return [...buckets.values()].map((row) => ({
    ...row,
    margin: calculateMarginPercent(row.profit, row.sales),
  }));
}

export async function getTransactionsPage(
  userId: string,
  page = 1,
  pageSize = 10,
): Promise<PaginatedTransactions> {
  const where = { userId };
  const [total, items] = await Promise.all([
    prisma.transaction.count({ where }),
    prisma.transaction.findMany({
      where,
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    items: items.map(serializeTransaction),
    page,
    pageSize,
    total,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}
