import { prisma } from "@/lib/prisma";
import {
  eachDateInRange,
  formatDateOnly,
  formatShortDate,
  type DateRange,
} from "@/lib/date-range";
import { calculateMarginPercent, decimalToNumber } from "@/lib/money";
import { serializeTransaction } from "@/server/serializers";
import type {
  DailySeriesPoint,
  DashboardSummary,
  PaginatedTransactions,
} from "@/types/transaction";

const DEFAULT_PAGE_SIZE = 8;

export async function getDashboardData(
  userId: string,
  range: DateRange,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
) {
  const where = {
    userId,
    date: {
      gte: range.start,
      lte: range.end,
    },
  };

  const [aggregates, grouped, total, items] = await Promise.all([
    prisma.transaction.aggregate({
      where,
      _sum: {
        salesAmount: true,
        capitalAmount: true,
        profitAmount: true,
      },
      _count: true,
    }),
    prisma.transaction.groupBy({
      by: ["date"],
      where,
      _sum: {
        salesAmount: true,
        capitalAmount: true,
        profitAmount: true,
      },
      orderBy: { date: "asc" },
    }),
    prisma.transaction.count({ where }),
    prisma.transaction.findMany({
      where,
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const sales = decimalToNumber(aggregates._sum.salesAmount ?? 0);
  const capital = decimalToNumber(aggregates._sum.capitalAmount ?? 0);
  const profit = decimalToNumber(aggregates._sum.profitAmount ?? 0);

  const summary: DashboardSummary = {
    sales,
    capital,
    profit,
    margin: calculateMarginPercent(profit, sales),
    count: aggregates._count,
  };

  const totalsByDate = new Map(
    grouped.map((row) => [
      formatDateOnly(row.date),
      {
        sales: decimalToNumber(row._sum.salesAmount ?? 0),
        capital: decimalToNumber(row._sum.capitalAmount ?? 0),
        profit: decimalToNumber(row._sum.profitAmount ?? 0),
      },
    ]),
  );

  const series: DailySeriesPoint[] = eachDateInRange(range.start, range.end).map((date) => {
    const key = formatDateOnly(date);
    const point = totalsByDate.get(key) ?? { sales: 0, capital: 0, profit: 0 };
    return {
      date: key,
      label: formatShortDate(date),
      ...point,
    };
  });

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const transactions: PaginatedTransactions = {
    items: items.map(serializeTransaction),
    page,
    pageSize,
    total,
    pageCount,
  };

  return { summary, series, transactions };
}
