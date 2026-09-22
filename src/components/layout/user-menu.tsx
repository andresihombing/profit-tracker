"use client";

import { LogOut, UserRound } from "lucide-react";
import { logoutAction } from "@/server/auth-actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="h-9 gap-2 px-1.5 sm:px-2.5" />
        }
      >
        <Avatar className="size-7">
          <AvatarFallback className="bg-zinc-900 text-[11px] text-white">
            {initials || <UserRound className="size-3.5" />}
          </AvatarFallback>
        </Avatar>
        <span className="hidden max-w-40 truncate text-sm font-medium sm:inline">
          {name}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm text-foreground">{name}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {email}
              </span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => logoutAction()}>
          <LogOut className="size-4" />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
