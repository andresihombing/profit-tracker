"use client";

import { useActionState } from "react";
import { registerAction, type AuthActionState } from "@/server/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const initialState: AuthActionState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      {state.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <div className="grid gap-1.5">
        <Label htmlFor="name">Nama</Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={80}
          placeholder="Nama lengkap"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="anda@email.com"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="password">Kata sandi</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
          placeholder="Minimal 8 karakter"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="confirmPassword">Konfirmasi kata sandi</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
        />
      </div>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Membuat akun..." : "Daftar"}
      </Button>
    </form>
  );
}
