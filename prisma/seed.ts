import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_EMAIL = "demo@profittracker.app";

async function main() {
  const deleted = await prisma.user.deleteMany({
    where: { email: DEMO_EMAIL },
  });

  if (deleted.count > 0) {
    console.log(`Removed demo account ${DEMO_EMAIL} and its transactions.`);
    return;
  }

  console.log("No demo account to remove.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
