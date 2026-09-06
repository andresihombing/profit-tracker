"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { BrandMark, SidebarNav } from "@/components/layout/sidebar";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; email: string };
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-white/10 bg-zinc-950 px-4 py-5 lg:flex">
        <BrandMark />
        <div className="mt-8 flex-1">
          <SidebarNav />
        </div>
        <p className="px-3 text-[11px] leading-relaxed text-zinc-500">
          Catat penjualan dan modal harian. Keuntungan dihitung otomatis.
        </p>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-zinc-200/80 bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={<Button variant="ghost" size="icon" className="lg:hidden" />}
              >
                <Menu className="size-4" />
                <span className="sr-only">Buka menu</span>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 border-white/10 bg-zinc-950 p-4 text-white"
                showCloseButton
              >
                <SheetHeader className="p-0">
                  <SheetTitle className="sr-only">Navigasi</SheetTitle>
                  <BrandMark />
                </SheetHeader>
                <div className="mt-8">
                  <SidebarNav onNavigate={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <p className="text-sm font-semibold tracking-tight text-zinc-950">
              Profit Tracker
            </p>
          </div>
          <UserMenu name={user.name} email={user.email} />
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
