import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
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

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
