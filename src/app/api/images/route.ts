import { NextResponse } from "next/server";
import sharp from "sharp";
import { readFile } from "fs/promises";
import { join } from "path";
import { supabase } from "@/lib/supabase";

async function fetchSupabaseImage(url: string): Promise<Buffer> {
  const match = url.match(/\/storage\/v1\/object\/(?:public|sign)\/([^/]+)\/(.+)$/);
  if (!match) throw new Error("Invalid Supabase storage URL");

  const [, bucket, filePath] = match;
  const { data, error } = await supabase.storage.from(bucket).download(filePath);
  if (error) throw error;
  return Buffer.from(await data.arrayBuffer());
}

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
    } else if (url.includes("supabase.co/storage/")) {
      inputBuffer = await fetchSupabaseImage(url);
    } else {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      inputBuffer = Buffer.from(await res.arrayBuffer());
    }

    const outputBuffer = await sharp(inputBuffer)
      .webp({ quality: 80 })
      .toBuffer();

    const body = new Uint8Array(outputBuffer) as BodyInit;

    return new Response(body, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=604800, s-maxage=604800",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
