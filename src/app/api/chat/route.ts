import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await fetch("https://api.iamhc.cn/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer sk-k7xS8eAB3FjGcBM52P19xoxZr4qxfcycb1xFGUsaiavvkmSO",
      },
      body: JSON.stringify({
        model: "glm-4.7",
        stream: true,
        messages: [
          {
            role: "system",
            content: "Anda adalah pengajar Ramah Al-Ihsan Mojokerto. Paham 21CLD, Taksonomi Bloom, 9 Nilai Gusdurian. Jawab hangat. Jangan mulai salam. Jangan pakai markdown. Gunakan bullet point.",
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upstream API error:", response.status, errorText);
      return NextResponse.json(
        { error: "AI service unavailable" },
        { status: 502 }
      );
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
