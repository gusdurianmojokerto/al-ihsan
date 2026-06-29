"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Assalamualaikum! Saya pengajar Al-Ihsan. Saya siap membantu Anda memahami modul pembelajaran kami yang mengintegrasikan 21CLD, Taksonomi Bloom, dan 9 Nilai Gusdurian. Ada yang ingin ditanyakan?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch("https://api.iamhc.cn/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer sk-k7xS8eAB3FjGcBM52P19xoxZr4qxfcycb1xFGUsaiavvkmSO",
        },
        body: JSON.stringify({
          model: "glm-4.7",
          messages: [
            {
              role: "system",
              content: `Anda adalah pengajar di Rumah Belajar Al-Ihsan Mojokerto yang berpengalaman dan ramah. Anda memiliki pemahaman mendalam tentang:

1. 21CLD (21st Century Learning Design) - Keterampilan esensial untuk masa depan seperti Kolaborasi, Konstruksi Pengetahuan, Pemecahan Masalah, Komunikasi Terampil, dan Regulasi Diri.

2. Taksonomi Bloom (C1-C6) - Tangga kognitif untuk mengukur kedalaman berpikir anak dari tingkat mengingat hingga mencipta.

3. 9 Nilai Gusdurian - Pondasi moralitas dan karakter welas asih.

4. Ritual Check-In & Check-Out - Proses transisi mental anak untuk membangun ruang aman.

5. Rubrik Observasi Terintegrasi - Memberikan bukti spesifik dalam observasi pembelajaran.

6. Siklus Intervensi Data-Driven - Pengumpulan, Sintesis, Pivot/Respon, dan Retrospeksi.

Tugas Anda adalah membantu tutor, orang tua, atau siapapun yang bertanya tentang:
- Cara mengimplementasikan modul pembelajaran
- Memahami konsep 21CLD, Bloom, dan Nilai Gusdurian
- Memberikan contoh praktis dan studi kasus
- Tips fasilitasi pembelajaran yang memanusiakan
- Cara melakukan observasi dan evaluasi yang efektif

Jawablah dengan bahasa yang hangat, mudah dipahami, dan penuh empati. Gunakan contoh konkret dari konteks Mojokerto jika memungkinkan. JANGAN pernah memulai jawaban dengan salam (Assalamualaikum/Salam). Langsung jawab pertanyaan saja. JANGAN gunakan format markdown seperti **bold**, *italic*, ###, atau simbol lainnya. JANGAN gunakan nomor (1., 2., 3.) untuk list. Gunakan bullet point (•) untuk setiap poin. Tulis biasa saja tanpa formatting.`,
            },
            ...messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            { role: "user", content: userMessage },
          ],
          temperature: 0.7,
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal mendapatkan respon dari AI");
      }

      const data = await response.json();
      let assistantMessage = data.choices[0].message.content || "Maaf, saya tidak dapat merespon saat ini. Silakan coba lagi.";
      assistantMessage = assistantMessage
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/__/g, "")
        .replace(/_/g, "")
        .replace(/#{1,6}\s/g, "")
        .replace(/^\d+\.\s/gm, "• ")
        .replace(/\n\s*[-•]\s/g, "\n• ");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        },
      ]);
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col">
        <div className="max-w-4xl mx-auto w-full px-4 flex-1 flex flex-col pb-6">
          <div className="glass rounded-3xl p-6 lg:p-8 custom-shadow mb-6 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-blue-600">
                  Chat Pengajar Al-Ihsan
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Tanyakan tentang modul pembelajaran kami
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl custom-shadow flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 animate-fade-in ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600"
                        : "bg-gradient-to-br from-slate-100 to-slate-200"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  <div
                    className={`flex-1 rounded-2xl p-4 ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                        : "bg-white border border-slate-200"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-200">
                    <Bot className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1 rounded-2xl p-4 bg-white border border-slate-200">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-slate-500">Sedang mengetik...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-slate-200 p-4 lg:p-6 bg-white/50"
            >
              <div className="flex gap-3 items-end">
                <div className="flex-1 bg-white rounded-2xl border-2 border-slate-200 focus-within:border-blue-500 transition-colors">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    placeholder="Ketik pertanyaan Anda..."
                    className="w-full px-4 py-3 bg-transparent outline-none resize-none max-h-32"
                    rows={1}
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">
                Tekan Enter untuk kirim, Shift+Enter untuk baris baru
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
