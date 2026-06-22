import { prisma } from "@/lib/prisma";
import { jsonResponse } from "@/lib/json-response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comments = await prisma.comments.findMany({
      where: { reportId: Number(id) },
      orderBy: { createdAt: "asc" },
    });

    return jsonResponse(comments);
  } catch (error) {
    console.error("GET /api/reports/[id]/comments error:", error);
    return jsonResponse({ error: String(error) }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, text } = body;

    const comment = await prisma.comments.create({
      data: {
        reportId: Number(id),
        name,
        text,
      },
    });

    return jsonResponse(comment, { status: 201 });
  } catch (error) {
    console.error("POST /api/reports/[id]/comments error:", error);
    return jsonResponse({ error: String(error) }, { status: 500 });
  }
}
