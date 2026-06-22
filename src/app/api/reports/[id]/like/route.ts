import { prisma } from "@/lib/prisma";
import { jsonResponse } from "@/lib/json-response";

export async function PUT(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const report = await prisma.reports.findUnique({
      where: { id: Number(id) },
    });

    if (!report) {
      return jsonResponse({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.reports.update({
      where: { id: Number(id) },
      data: { likes: Number(report.likes || 0) + 1 },
    });

    return jsonResponse(updated);
  } catch (error) {
    console.error("PUT /api/reports/[id]/like error:", error);
    return jsonResponse({ error: String(error) }, { status: 500 });
  }
}
