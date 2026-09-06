import { auth } from "@/auth";
import { buildMonthlyReportCsv } from "@/lib/csv";
import { getMonthlyReport } from "@/server/reports";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rows = await getMonthlyReport(session.user.id);
  const csv = buildMonthlyReportCsv(rows);

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="laporan-profit-tracker.csv"',
      "Cache-Control": "no-store",
    },
  });
}
