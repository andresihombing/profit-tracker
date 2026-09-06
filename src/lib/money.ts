export function calculateProfit(salesAmount: number, capitalAmount: number): number {
  const salesCents = Math.round(salesAmount * 100);
  const capitalCents = Math.round(capitalAmount * 100);
  return (salesCents - capitalCents) / 100;
}

export function decimalToNumber(value: { toString(): string } | string | number): number {
  return Number(value);
}

export function formatRupiah(amount: number): string {
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

  return amount < 0 ? `-${formatted}` : formatted;
}

export function formatCompactRupiah(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000_000) {
    return `${amount < 0 ? "-" : ""}Rp ${(abs / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} M`;
  }
  if (abs >= 1_000_000) {
    return `${amount < 0 ? "-" : ""}Rp ${(abs / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
  }
  return formatRupiah(amount);
}

export function calculateMarginPercent(profit: number, sales: number): number | null {
  if (sales === 0) return null;
  return (profit / sales) * 100;
}

export function formatPercent(value: number | null): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `${value.toLocaleString("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
}
