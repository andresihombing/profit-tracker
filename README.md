# Profit Tracker

Aplikasi web untuk mencatat penjualan, modal, dan keuntungan bisnis harian. Keuntungan dihitung otomatis: **Penjualan − Modal**.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- PostgreSQL + Prisma
- Auth.js (NextAuth) dengan credentials (siap dikembangkan ke multi-user)
- Zod + React Hook Form
- Recharts

## Fitur

- Dashboard dengan kartu ringkasan, filter tanggal, grafik, dan tabel
- CRUD transaksi (profit dihitung di server, tidak diinput manual)
- Laporan bulanan + export CSV
- Kerugian ditampilkan jika modal lebih besar dari penjualan
- Akun demo dengan data seed

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

3. Install, migrasi, dan seed:

```bash
npm install
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

Aplikasi berjalan di [http://localhost:43123](http://localhost:43123).

Akun demo:

- Email: `demo@profittracker.app`
- Kata sandi: `demo1234`

## Skrip

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Server pengembangan di port 43123 |
| `npm run build` | Production build |
| `npm test` | Unit test (profit, filter tanggal, validasi) |
| `npm run lint` | ESLint |
| `npm run db:seed` | Isi data dummy |

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
