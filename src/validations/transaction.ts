import { z } from "zod";

const moneyField = (label: string) =>
  z.coerce
    .number()
    .finite(`${label} tidak valid`)
    .min(0, `${label} tidak boleh negatif`)
    .max(1_000_000_000_000, `${label} terlalu besar`);

export const transactionSchema = z.object({
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal tidak valid"),
  description: z
    .string()
    .trim()
    .min(1, "Nama transaksi wajib diisi")
    .max(200, "Nama transaksi maksimal 200 karakter"),
  salesAmount: moneyField("Penjualan"),
  capitalAmount: moneyField("Modal"),
  note: z
    .string()
    .trim()
    .max(1000, "Catatan maksimal 1000 karakter")
    .optional()
    .or(z.literal("")),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
