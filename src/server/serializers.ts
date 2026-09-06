import type { Transaction } from "@prisma/client";
import { decimalToNumber } from "@/lib/money";
import type { TransactionDTO } from "@/types/transaction";

export function serializeTransaction(tx: Transaction): TransactionDTO {
  return {
    id: tx.id,
    date: tx.date.toISOString(),
    description: tx.description,
    salesAmount: decimalToNumber(tx.salesAmount),
    capitalAmount: decimalToNumber(tx.capitalAmount),
    profitAmount: decimalToNumber(tx.profitAmount),
    note: tx.note,
    createdAt: tx.createdAt.toISOString(),
    updatedAt: tx.updatedAt.toISOString(),
  };
}
