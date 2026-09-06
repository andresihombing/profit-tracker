export type TransactionDTO = {
  id: string;
  date: string;
  description: string;
  salesAmount: number;
  capitalAmount: number;
  profitAmount: number;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DashboardSummary = {
  sales: number;
  capital: number;
  profit: number;
  margin: number | null;
  count: number;
};

export type DailySeriesPoint = {
  date: string;
  label: string;
  sales: number;
  capital: number;
  profit: number;
};

export type MonthlyReportRow = {
  year: number;
  month: number;
  label: string;
  sales: number;
  capital: number;
  profit: number;
  margin: number | null;
  count: number;
};

export type PaginatedTransactions = {
  items: TransactionDTO[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};
