"use client";

import { useState, useEffect, use, useRef, useCallback } from "react";
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

function ImageSlider({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef(0);
  const touchDelta = useRef(0);
  const isDragging = useRef(false);

  const goTo = useCallback(
    (idx: number) => {
      if (idx < 0) idx = images.length - 1;
      if (idx >= images.length) idx = 0;
      setCurrent(idx);
    },
    [images.length]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    touchDelta.current = e.touches[0].clientX - touchStart.current;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (touchDelta.current > 50) goTo(current - 1);
    else if (touchDelta.current < -50) goTo(current + 1);
    touchDelta.current = 0;
  };

  if (images.length === 0) {
    return (
      <div className="rounded-2xl lg:rounded-3xl overflow-hidden aspect-[4/3] bg-slate-100">
        <img
          src={FALLBACK}
          className="w-full h-full object-cover"
          alt="Fallback"
        />
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="rounded-2xl lg:rounded-3xl overflow-hidden aspect-[4/3] bg-slate-100">
        <img
          src={`/api/images?url=${encodeURIComponent(images[0])}`}
          className="w-full h-full object-cover"
          loading="eager"
          alt="Foto"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK;
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className="overflow-hidden rounded-2xl lg:rounded-3xl aspect-[4/3] bg-slate-100 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((img, i) => (
            <div key={i} className="min-w-full h-full flex-shrink-0">
              <img
                src={`/api/images?url=${encodeURIComponent(img)}`}
                className="w-full h-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
                alt={`Foto ${i + 1}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK;
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? "bg-white w-6" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      <div className="absolute top-1/2 left-3 -translate-y-1/2 z-10">
        <button
          onClick={() => goTo(current - 1)}
          className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white active:scale-90"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
      <div className="absolute top-1/2 right-3 -translate-y-1/2 z-10">
        <button
          onClick={() => goTo(current + 1)}
          className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white active:scale-90 rotate-180"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">
        {current + 1} / {images.length}
      </div>
    </div>
  );
}

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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 animate-fade-in">
        <button
          onClick={() => window.history.back()}
          className="mb-6 mt-2 flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-sm uppercase tracking-widest active:translate-x-[-5px] transition-all"
        >
          <ArrowLeft className="w-5 h-5" /> Kembali
        </button>

        <div className="bg-white rounded-2xl lg:rounded-3xl overflow-hidden custom-shadow p-5 sm:p-8 lg:p-10 mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-800 mb-5 leading-snug">
            {report.tema}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs lg:text-sm font-bold uppercase tracking-wider">
              {new Date(report.date).toLocaleDateString("id-ID", {
                dateStyle: "long",
              })}
            </div>
            <button
              onClick={handleLike}
              className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 rounded-full transition-colors cursor-pointer"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span className="text-xs lg:text-sm font-bold text-slate-700">
                {report.likes || 0} Disukai
              </span>
            </button>
          </div>

          <div className="mb-6">
            <ImageSlider images={images} />
          </div>

          <div className="description-text text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed">
            {report.description}
          </div>
        </div>

        <div className="bg-white rounded-2xl lg:rounded-3xl p-5 sm:p-8 lg:p-10 custom-shadow">
          <h4 className="text-lg lg:text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3">
            <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500" />
            Tanggapan ({report.comments.length})
          </h4>

          <div className="space-y-5 mb-8">
            {report.comments.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-6">
                Belum ada tanggapan
              </p>
            )}
            {report.comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-bold text-slate-400 text-sm flex-shrink-0">
                  {c.name ? c.name[0].toUpperCase() : "A"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <p className="text-sm lg:text-base font-extrabold text-slate-800 truncate">
                      {c.name}
                    </p>
                    <p className="text-xs font-bold text-slate-400 flex-shrink-0">
                      {new Date(c.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
                    {c.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleComment} className="space-y-4">
            {!userName ? (
              <input
                type="text"
                name="name"
                placeholder="Nama Lengkap"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm lg:text-base font-bold outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-sm font-bold text-blue-600">
                Balas sebagai: {userName}
              </p>
            )}
            <div className="relative">
              <textarea
                name="comment"
                placeholder="Tulis komentar..."
                required
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 pr-14 text-sm lg:text-base font-medium outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="absolute bottom-3 right-3 bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg hover:bg-blue-700 active:scale-90 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
