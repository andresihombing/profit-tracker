"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { parseDateOnly } from "@/lib/date-range";
import { Prisma } from "@prisma/client";
import { calculateProfit } from "@/lib/money";
import { sanitizeOptionalText, sanitizeText } from "@/lib/sanitize";
import { requireUser } from "@/server/auth";
import { serializeTransaction } from "@/server/serializers";
import { transactionSchema } from "@/validations/transaction";

export type ActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

function revalidateFinancePages() {
  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/reports");
}

function parseTransactionPayload(input: unknown) {
  const parsed = transactionSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data transaksi tidak valid." };
  }

  const date = parseDateOnly(parsed.data.date);
  if (!date) {
    return { error: "Tanggal tidak valid." };
  }

  return {
    data: {
      date,
      description: sanitizeText(parsed.data.description),
      salesAmount: parsed.data.salesAmount,
      capitalAmount: parsed.data.capitalAmount,
      note: sanitizeOptionalText(parsed.data.note),
      profitAmount: new Prisma.Decimal(calculateProfit(parsed.data.salesAmount, parsed.data.capitalAmount).toFixed(2)),
    },
  };
}

export async function createTransaction(input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = parseTransactionPayload(input);
  if ("error" in parsed && parsed.error) {
    return { ok: false, error: parsed.error };
  }

  if (!parsed.data) {
    return { ok: false, error: "Data transaksi tidak valid." };
  }

  const created = await prisma.transaction.create({
    data: {
      userId: user.id,
      date: parsed.data.date,
      description: parsed.data.description,
      salesAmount: parsed.data.salesAmount,
      capitalAmount: parsed.data.capitalAmount,
      profitAmount: parsed.data.profitAmount,
      note: parsed.data.note,
    },
  });

  revalidateFinancePages();
  return { ok: true, id: created.id };
}

export async function updateTransaction(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  const user = await requireUser();
  if (!id) return { ok: false, error: "Transaksi tidak ditemukan." };

  const parsed = parseTransactionPayload(input);
  if ("error" in parsed && parsed.error) {
    return { ok: false, error: parsed.error };
  }
  if (!parsed.data) {
    return { ok: false, error: "Data transaksi tidak valid." };
  }

  const existing = await prisma.transaction.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });
  if (!existing) {
    return { ok: false, error: "Transaksi tidak ditemukan." };
  }

  await prisma.transaction.update({
    where: { id },
    data: {
      date: parsed.data.date,
      description: parsed.data.description,
      salesAmount: parsed.data.salesAmount,
      capitalAmount: parsed.data.capitalAmount,
      profitAmount: parsed.data.profitAmount,
      note: parsed.data.note,
    },
  });

  revalidateFinancePages();
  return { ok: true, id };
}

export async function deleteTransaction(id: string): Promise<ActionResult> {
  const user = await requireUser();
  const existing = await prisma.transaction.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });
  if (!existing) {
    return { ok: false, error: "Transaksi tidak ditemukan." };
  }

  await prisma.transaction.delete({ where: { id } });
  revalidateFinancePages();
  return { ok: true, id };
}

export async function getTransaction(id: string) {
  const user = await requireUser();
  const tx = await prisma.transaction.findFirst({
    where: { id, userId: user.id },
  });
  return tx ? serializeTransaction(tx) : null;
}
