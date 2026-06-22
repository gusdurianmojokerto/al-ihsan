import { prisma } from "@/lib/prisma";
import { jsonResponse } from "@/lib/json-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const reports = await prisma.reports.findMany({
      orderBy: { date: "desc" },
      include: { comments: true },
    });

    let filtered = reports;

    if (month && month !== "all") {
      filtered = filtered.filter((r) => {
        const m = (r.date.getMonth() + 1).toString();
        return m === month;
      });
    }

    if (year && year !== "all") {
      filtered = filtered.filter((r) => {
        const y = r.date.getFullYear().toString();
        return y === year;
      });
    }

    return jsonResponse(filtered);
  } catch (error) {
    console.error("GET /api/reports error:", error);
    return jsonResponse({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, tema, description, images } = body;

    const report = await prisma.reports.create({
      data: {
        date: new Date(date),
        tema,
        description,
        images: images || [],
        likes: 0,
      },
    });

    return jsonResponse(report, { status: 201 });
  } catch (error) {
    console.error("POST /api/reports error:", error);
    return jsonResponse({ error: String(error) }, { status: 500 });
  }
}
