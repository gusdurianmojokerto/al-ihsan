import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.module_order.findMany({
      orderBy: { order: 'asc' }
    });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching module order:", error);
    return NextResponse.json({ error: "Failed to fetch module order" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { modules } = body;

    if (!Array.isArray(modules)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    await prisma.$transaction(
      modules.map((module: { id: number; order: number }) =>
        prisma.module_order.upsert({
          where: { moduleId: module.id },
          update: { order: module.order },
          create: { moduleId: module.id, order: module.order }
        })
      )
    );

    return NextResponse.json({ success: true, message: "Module order saved successfully" });
  } catch (error) {
    console.error("Error saving module order:", error);
    return NextResponse.json({ error: "Failed to save module order" }, { status: 500 });
  }
}
