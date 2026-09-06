import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_EMAIL = "demo@profittracker.app";
const DEMO_PASSWORD = "demo1234";

type SeedTx = {
  date: string;
  description: string;
  salesAmount: number;
  capitalAmount: number;
  note?: string;
};

function utcDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

const seedTransactions: SeedTx[] = [
  { date: "2025-10-08", description: "Penjualan toko cabang A", salesAmount: 2_150_000, capitalAmount: 1_420_000, note: "Omzet weekday" },
  { date: "2025-10-22", description: "Grosir sembako", salesAmount: 4_800_000, capitalAmount: 3_650_000 },
  { date: "2025-11-05", description: "Marketplace Shopee", salesAmount: 1_640_000, capitalAmount: 980_000, note: "Promo 11.11 awal" },
  { date: "2025-11-18", description: "Penjualan eceran", salesAmount: 920_000, capitalAmount: 540_000 },
  { date: "2025-12-12", description: "Paket hampers natal", salesAmount: 6_200_000, capitalAmount: 4_100_000, note: "Pre-order Desember" },
  { date: "2025-12-28", description: "Penjualan year-end sale", salesAmount: 3_750_000, capitalAmount: 2_900_000 },
  { date: "2026-01-07", description: "Restock & jual harian", salesAmount: 1_280_000, capitalAmount: 860_000 },
  { date: "2026-01-21", description: "Catering kantor", salesAmount: 2_400_000, capitalAmount: 1_650_000 },
  { date: "2026-02-04", description: "Dropship aksesoris", salesAmount: 510_000, capitalAmount: 240_000 },
  { date: "2026-02-14", description: "Paket valentine", salesAmount: 1_890_000, capitalAmount: 1_120_000 },
  { date: "2026-03-03", description: "Grosir ramadan prep", salesAmount: 5_100_000, capitalAmount: 3_800_000 },
  { date: "2026-03-20", description: "Penjualan toko cabang B", salesAmount: 2_260_000, capitalAmount: 1_480_000 },
  { date: "2026-04-09", description: "Event bazar", salesAmount: 1_350_000, capitalAmount: 1_720_000, note: "Sewa booth lebih besar dari omzet" },
  { date: "2026-04-25", description: "Penjualan online", salesAmount: 1_970_000, capitalAmount: 1_150_000 },
  { date: "2026-05-11", description: "Reseller paket hemat", salesAmount: 1_120_000, capitalAmount: 730_000 },
  { date: "2026-05-27", description: "Penjualan harian", salesAmount: 2_080_000, capitalAmount: 1_310_000 },
  { date: "2026-06-06", description: "Grosir minuman", salesAmount: 3_400_000, capitalAmount: 2_450_000 },
  { date: "2026-06-19", description: "Marketplace TikTok Shop", salesAmount: 1_560_000, capitalAmount: 890_000 },
  { date: "2026-07-02", description: "Penjualan toko cabang A", salesAmount: 2_310_000, capitalAmount: 1_540_000 },
  { date: "2026-07-08", description: "Grosir sembako", salesAmount: 4_250_000, capitalAmount: 3_180_000 },
  { date: "2026-07-15", description: "Penjualan eceran", salesAmount: 980_000, capitalAmount: 560_000 },
  { date: "2026-07-22", description: "Event pop-up store", salesAmount: 1_420_000, capitalAmount: 1_680_000, note: "Sewa tempat belum tertutup" },
  { date: "2026-07-29", description: "Catering pesanan", salesAmount: 2_670_000, capitalAmount: 1_790_000 },
  { date: "2026-08-03", description: "Penjualan harian", salesAmount: 1_740_000, capitalAmount: 1_050_000 },
  { date: "2026-08-07", description: "Marketplace Shopee", salesAmount: 1_290_000, capitalAmount: 760_000 },
  { date: "2026-08-12", description: "Grosir kebutuhan rumah", salesAmount: 3_860_000, capitalAmount: 2_940_000 },
  { date: "2026-08-18", description: "Dropship aksesoris", salesAmount: 470_000, capitalAmount: 190_000 },
  { date: "2026-08-23", description: "Penjualan toko cabang B", salesAmount: 2_520_000, capitalAmount: 1_610_000 },
  { date: "2026-08-28", description: "Reseller paket hemat", salesAmount: 1_080_000, capitalAmount: 690_000 },
  { date: "2026-09-01", description: "Penjualan toko cabang A", salesAmount: 2_450_000, capitalAmount: 1_620_000, note: "Awal bulan September" },
  { date: "2026-09-01", description: "Marketplace Shopee", salesAmount: 1_180_000, capitalAmount: 740_000 },
  { date: "2026-09-02", description: "Grosir sembako", salesAmount: 3_200_000, capitalAmount: 2_400_000 },
  { date: "2026-09-02", description: "Penjualan eceran", salesAmount: 890_000, capitalAmount: 510_000 },
  { date: "2026-09-03", description: "Event pop-up store", salesAmount: 1_500_000, capitalAmount: 1_800_000, note: "Kerugian karena sewa booth" },
  { date: "2026-09-03", description: "Penjualan online", salesAmount: 2_100_000, capitalAmount: 1_250_000 },
  { date: "2026-09-04", description: "Restock & jual harian", salesAmount: 1_750_000, capitalAmount: 1_100_000 },
  { date: "2026-09-04", description: "Reseller paket hemat", salesAmount: 960_000, capitalAmount: 620_000 },
  { date: "2026-09-05", description: "Penjualan weekend prep", salesAmount: 2_800_000, capitalAmount: 1_900_000 },
  { date: "2026-09-05", description: "Dropship aksesoris", salesAmount: 430_000, capitalAmount: 210_000 },
  { date: "2026-09-06", description: "Penjualan harian", salesAmount: 1_000_000, capitalAmount: 600_000, note: "Contoh perhitungan: profit Rp 400.000" },
  { date: "2026-09-06", description: "Catering pesanan", salesAmount: 2_250_000, capitalAmount: 1_480_000 },
];

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { name: "Demo Owner", passwordHash },
    create: {
      email: DEMO_EMAIL,
      name: "Demo Owner",
      passwordHash,
    },
  });

  await prisma.transaction.deleteMany({ where: { userId: user.id } });

  await prisma.transaction.createMany({
    data: seedTransactions.map((tx) => ({
      userId: user.id,
      date: utcDate(tx.date),
      description: tx.description,
      salesAmount: tx.salesAmount,
      capitalAmount: tx.capitalAmount,
      profitAmount: tx.salesAmount - tx.capitalAmount,
      note: tx.note ?? null,
    })),
  });

  console.log(`Seeded ${seedTransactions.length} transactions for ${DEMO_EMAIL}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
