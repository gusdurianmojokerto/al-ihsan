import { prisma } from "@/lib/prisma";
import { jsonResponse } from "@/lib/json-response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const report = await prisma.reports.findUnique({
      where: { id: Number(id) },
      include: { comments: { orderBy: { createdAt: "asc" } } },
    });

    if (!report) {
      return jsonResponse({ error: "Not found" }, { status: 404 });
    }

    return jsonResponse(report);
  } catch (error) {
    console.error("GET /api/reports/[id] error:", error);
    return jsonResponse({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const report = await prisma.reports.update({
      where: { id: Number(id) },
      data: {
        date: new Date(body.date),
        tema: body.tema,
        description: body.description,
        images: body.images,
      },
    });

    return jsonResponse(report);
  } catch (error) {
    console.error("PUT /api/reports/[id] error:", error);
    return jsonResponse({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.reports.delete({ where: { id: Number(id) } });
    return jsonResponse({ success: true });
  } catch (error) {
    console.error("DELETE /api/reports/[id] error:", error);
    return jsonResponse({ error: String(error) }, { status: 500 });
  }
}
