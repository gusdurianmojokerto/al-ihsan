"use client";

import { useState, useEffect, use } from "react";
import { ArrowLeft, Heart, MessageCircle, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";

interface Comment {
  id: number;
  name: string | null;
  text: string | null;
  createdAt: string;
}

interface Report {
  id: number;
  date: string;
  tema: string | null;
  description: string | null;
  images: string[] | null;
  likes: number | null;
  createdAt: string | null;
  comments: Comment[];
}

const FALLBACK =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400";

export default function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("al_ihsan_name") || "";
    setUserName(stored);

    fetch(`/api/reports/${id}`)
      .then((res) => res.json())
      .then((data) => setReport(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    if (!report) return;
    const newLikes = (report.likes || 0) + 1;
    setReport({ ...report, likes: newLikes });
    await fetch(`/api/reports/${report.id}/like`, { method: "PUT" });
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !userName.trim()) return;

    setSubmitting(true);
    try {
      await fetch(`/api/reports/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, text: commentText }),
      });

      if (!localStorage.getItem("al_ihsan_name")) {
        localStorage.setItem("al_ihsan_name", userName);
      }

      setCommentText("");
      const res = await fetch(`/api/reports/${id}`);
      const data = await res.json();
      setReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (!report) return null;

  const images = (report.images as string[]) || [];

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 pb-24 animate-fade-in">
        <button
          onClick={() => window.history.back()}
          className="mb-10 flex items-center gap-3 text-slate-400 hover:text-blue-600 font-bold text-base lg:text-lg uppercase tracking-widest active:translate-x-[-5px] transition-all"
        >
          <ArrowLeft className="w-6 h-6 lg:w-7 lg:h-7" /> Kembali
        </button>

        <div className="bg-white rounded-[4rem] lg:rounded-[5rem] overflow-hidden custom-shadow p-8 sm:p-12 lg:p-16 mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-800 mb-8 leading-snug">
            {report.tema}
          </h1>
          <div className="flex flex-wrap items-center gap-5 lg:gap-8 mb-10">
            <div className="px-6 py-3 lg:px-8 lg:py-4 bg-blue-50 text-blue-600 rounded-full text-sm lg:text-base font-bold uppercase tracking-wider">
              {new Date(report.date).toLocaleDateString("id-ID", {
                dateStyle: "long",
              })}
            </div>
            <button
              onClick={handleLike}
              className="flex items-center gap-3 px-6 py-3 lg:px-8 lg:py-4 bg-rose-50 hover:bg-rose-100 rounded-full transition-colors cursor-pointer"
            >
              <Heart className="w-5 h-5 lg:w-6 lg:h-6 text-rose-500 fill-rose-500" />
              <span className="text-sm lg:text-base font-bold text-slate-700">
                {report.likes || 0} Disukai
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-10">
            {images.map((img, i) => (
              <div
                key={i}
                className="rounded-[3rem] lg:rounded-[4rem] overflow-hidden aspect-[4/3] bg-slate-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
              >
                <img
                  src={`/api/images?url=${encodeURIComponent(img)}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  alt={`Foto ${i + 1}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK;
                  }}
                />
              </div>
            ))}
          </div>

          <div className="description-text text-slate-600 px-2 text-base sm:text-lg lg:text-xl xl:text-2xl leading-relaxed">
            {report.description}
          </div>
        </div>

        <div className="bg-white rounded-[4rem] lg:rounded-[5rem] p-8 sm:p-12 lg:p-16 custom-shadow">
          <h4 className="text-2xl lg:text-3xl xl:text-4xl font-extrabold text-slate-800 mb-10 flex items-center gap-4">
            <MessageCircle className="w-7 h-7 lg:w-9 lg:h-9 text-blue-500" />
            Tanggapan ({report.comments.length})
          </h4>

          <div className="space-y-8 lg:space-y-10 mb-12">
            {report.comments.map((c) => (
              <div key={c.id} className="flex gap-5 lg:gap-6">
                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl lg:rounded-3xl bg-slate-50 flex items-center justify-center font-bold text-slate-400 text-base lg:text-xl">
                  {c.name ? c.name[0].toUpperCase() : "A"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-base lg:text-lg xl:text-xl font-extrabold text-slate-800">
                      {c.name}
                    </p>
                    <p className="text-sm lg:text-base font-bold text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <p className="text-base lg:text-lg xl:text-xl text-slate-600 leading-relaxed">
                    {c.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleComment} className="space-y-6">
            {!userName ? (
              <input
                type="text"
                name="name"
                placeholder="Nama Lengkap"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-3xl px-7 py-5 lg:px-8 lg:py-6 text-base lg:text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-base lg:text-lg font-bold text-blue-600 px-2">
                Balas sebagai: {userName}
              </p>
            )}
            <div className="relative">
              <textarea
                name="comment"
                placeholder="Tulis komentar..."
                required
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-[3rem] px-7 py-6 lg:px-8 lg:py-7 text-base lg:text-lg font-medium outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={submitting}
                className="absolute bottom-6 right-6 lg:bottom-7 lg:right-7 bg-blue-600 text-white w-14 h-14 lg:w-16 lg:h-16 rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-lg hover:bg-blue-700 active:scale-90 transition-all disabled:opacity-50"
              >
                <Send className="w-6 h-6 lg:w-7 lg:h-7" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
