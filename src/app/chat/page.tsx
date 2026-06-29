"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/__/g, "")
    .replace(/_/g, "")
    .replace(/#{1,6}\s/g, "")
    .replace(/^\d+\.\s/gm, "• ");
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Saya pengajar Al-Ihsan. Saya siap membantu Anda memahami modul pembelajaran kami tentang 21CLD, Taksonomi Bloom, dan 9 Nilai Gusdurian. Ada yang ingin ditanyakan?",
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
    const timeout = setTimeout(() => controller.abort(), 90000);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
            { role: "user", content: userMessage },
          ],
        }),
      });

      if (!response.ok) throw new Error("Gagal mendapatkan respon");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      // Add placeholder message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  fullText += delta;
                  const cleaned = stripMarkdown(fullText);
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { role: "assistant", content: cleaned };
                    return updated;
                  });
                }
              } catch {}
            }
          }
        }
      }

      if (!fullText) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: "Maaf, tidak ada respon. Silakan coba lagi." };
          return updated;
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        if (updated[updated.length - 1]?.content === "") {
          updated[updated.length - 1] = { role: "assistant", content: "Maaf, terjadi kesalahan. Silakan coba lagi." };
        } else {
          updated.push({ role: "assistant", content: "Maaf, terjadi kesalahan. Silakan coba lagi." });
        }
        return updated;
      });
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
                      {isLoading && index === messages.length - 1 && message.role === "assistant" && (
                        <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse" />
                      )}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
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
