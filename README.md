# Profit Tracker

Aplikasi web untuk mencatat penjualan, modal, dan keuntungan bisnis harian. Keuntungan dihitung otomatis: **Penjualan − Modal**.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- PostgreSQL + Prisma
- Auth.js (NextAuth) dengan credentials (multi-user)
- Zod + React Hook Form
- Recharts

## Fitur

- Registrasi akun dan login
- Data terisolasi per pengguna (setiap akun hanya melihat dan mengelola transaksinya sendiri)
- Dashboard dengan kartu ringkasan, filter tanggal, grafik, dan tabel
- CRUD transaksi (profit dihitung di server, tidak diinput manual)
- Laporan bulanan + export CSV
- Kerugian ditampilkan jika modal lebih besar dari penjualan

## Menjalankan secara lokal

1. Siapkan PostgreSQL (Docker):

```bash
docker compose up -d
```

2. Salin environment:

```bash
cp .env.example .env
```

Isi `AUTH_SECRET` dengan string acak yang panjang. `DATABASE_URL` default cocok dengan `docker-compose.yml`.

3. Install dan migrasi:

```bash
npm install
npx prisma migrate deploy
npm run dev
```

Aplikasi berjalan di [http://localhost:43123](http://localhost:43123). Daftar akun baru di `/register`, lalu mulai mencatat transaksi.

## Skrip

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Server pengembangan di port 43123 |
| `npm run build` | Production build |
| `npm test` | Unit test (profit, filter tanggal, validasi) |
| `npm run lint` | ESLint |
| `npm run db:seed` | Hapus akun demo lama (jika masih ada) |

## Struktur

```
src/
  app/            # App Router: dashboard, transaksi, laporan, auth
  components/     # UI layout, grafik, form, tabel
  lib/            # Prisma client, uang, tanggal, sanitasi
  server/         # Server actions & query
  types/          # DTO & NextAuth types
  validations/    # Skema Zod
prisma/           # Schema, migrasi, seed
```

Profit **tidak pernah** diisi manual. Server menghitung `profitAmount = salesAmount - capitalAmount` setiap create/update.
