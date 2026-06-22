import { NextResponse } from "next/server";
import sharp from "sharp";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  try {
    let inputBuffer: Buffer;

    if (url.startsWith("/uploads/")) {
      const filePath = join(process.cwd(), "public", url);
      inputBuffer = await readFile(filePath);
    } else {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      inputBuffer = Buffer.from(await res.arrayBuffer());
    }

    const outputBuffer = await sharp(inputBuffer)
      .jpeg({ quality: 95 })
      .toBuffer();

    const body = new Uint8Array(outputBuffer) as BodyInit;

    return new Response(body, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
