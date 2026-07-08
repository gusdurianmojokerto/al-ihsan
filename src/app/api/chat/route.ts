import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const maxDuration = 60;

const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const API_KEY = process.env.GROQ_API_KEY || "";

let MODUL_CONTENT = "";
try {
  const modulPath = path.join(process.cwd(), "modul-extracted.txt");
  const fullContent = fs.readFileSync(modulPath, "utf-8");
  MODUL_CONTENT = fullContent.substring(0, 12000);
} catch (error) {
  console.error("Failed to load modul:", error);
}

const SYSTEM_PROMPT = `Anda adalah pengajar Ramah Al-Ihsan Mojokerto. Jawab berdasarkan modul berikut:

${MODUL_CONTENT}

Jawab hangat, tanpa markdown, gunakan bullet point.`;

async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      return res;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error("Unreachable");
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await fetchWithRetry(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        stream: true,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Upstream error:", response.status, err);
      return NextResponse.json({ error: "AI unavailable" }, { status: 502 });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
