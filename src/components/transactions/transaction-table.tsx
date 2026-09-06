"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { formatLongDate } from "@/lib/date-range";
import { formatRupiah } from "@/lib/money";
import { deleteTransaction } from "@/server/transactions";
import type { PaginatedTransactions } from "@/types/transaction";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function TransactionTable({
  data,
  emptyMessage = "Belum ada transaksi pada periode ini.",
}: {
  data: PaginatedTransactions;
  emptyMessage?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function confirmDelete() {
    if (!deleteId) return;
    const result = await deleteTransaction(deleteId);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Transaksi dihapus.");
    setDeleteId(null);
    router.refresh();
  }

  function goToPage(page: number) {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(page));
    startTransition(() => {
      router.push(`${window.location.pathname}?${params.toString()}`);
    });
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl bg-white ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/80">
              <TableHead>Tanggal</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="text-right">Penjualan</TableHead>
              <TableHead className="text-right">Modal</TableHead>
              <TableHead className="text-right">Profit</TableHead>
              <TableHead>Catatan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-28 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.items.map((tx) => {
                const isLoss = tx.profitAmount < 0;
                return (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium">
                      {formatLongDate(new Date(tx.date))}
                    </TableCell>
                    <TableCell className="max-w-48 truncate">{tx.description}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatRupiah(tx.salesAmount)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatRupiah(tx.capitalAmount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span
                          className={cn(
                            "tabular-nums font-medium",
                            isLoss ? "text-rose-600" : "text-emerald-700",
                          )}
                        >
                          {formatRupiah(tx.profitAmount)}
                        </span>
                        {isLoss ? (
                          <Badge variant="destructive">Kerugian</Badge>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-40 truncate text-muted-foreground">
                      {tx.note || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/transactions/${tx.id}/edit`}
                          className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
                          aria-label="Ubah transaksi"
                        >
                          <Pencil className="size-3.5" />
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteId(tx.id)}
                          aria-label="Hapus transaksi"
                        >
                          <Trash2 className="size-3.5 text-rose-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
          <p>
            {data.total === 0
              ? "Tidak ada data"
              : `Halaman ${data.page} dari ${data.pageCount} · ${data.total} transaksi`}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pending || data.page <= 1}
              onClick={() => goToPage(data.page - 1)}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pending || data.page >= data.pageCount}
              onClick={() => goToPage(data.page + 1)}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus transaksi?</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data penjualan, modal, dan profit akan dihapus.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
