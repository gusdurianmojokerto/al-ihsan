"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Heart, MessageCircle, Layers, Edit2, Trash2 } from "lucide-react";

const FALLBACK =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400";

interface ReportCardProps {
  id: number;
  date: string;
  tema: string | null;
  description: string | null;
  images: string[] | null;
  likes: number | null;
  commentCount: number;
}

export default function ReportCard({
  id,
  date,
  tema,
  description,
  images,
  likes,
  commentCount,
}: ReportCardProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("al_ihsan_is_admin") === "true");
  }, []);

  const dateObj = new Date(date);
  const imgSrc =
    images && images.length > 0
      ? `/api/images?url=${encodeURIComponent(images[0])}`
      : FALLBACK;

  const handleEdit = () => {
    localStorage.setItem("al_ihsan_edit_id", String(id));
    window.location.href = "/admin";
  };

  const handleDelete = async () => {
    if (!confirm("Hapus laporan ini secara permanen?")) return;
    await fetch(`/api/reports/${id}`, { method: "DELETE" });
    window.location.reload();
  };

  return (
    <div className="report-card-container animate-fade-in">
      <div className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-3xl lg:rounded-[2rem] overflow-hidden custom-shadow group h-full flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div>
          <div className="p-6 lg:p-8 flex items-center justify-between">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-11 h-11 lg:w-14 lg:h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Calendar className="w-5 h-5 lg:w-7 lg:h-7" />
              </div>
              <p className="text-xs lg:text-sm font-bold text-slate-400 uppercase tracking-wider">
                {dateObj.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            {isAdmin && (
              <div className="flex gap-2 lg:gap-3">
                <button
                  onClick={handleEdit}
                  className="p-3 lg:p-4 text-blue-500 bg-blue-50 rounded-xl lg:rounded-2xl hover:bg-blue-100 active:scale-90 transition-all"
                >
                  <Edit2 className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-3 lg:p-4 text-red-500 bg-red-50 rounded-xl lg:rounded-2xl hover:bg-red-100 active:scale-90 transition-all"
                >
                  <Trash2 className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            )}
          </div>

          <Link href={`/detail/${id}`} className="px-6 lg:px-8 block">
            <div className="image-aspect-box mb-1">
              <div className="img-placeholder"></div>
              <img
                src={imgSrc}
                className="img-lazy loaded group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                decoding="async"
                alt={tema || "Laporan"}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK;
                }}
              />
              {images && images.length > 1 ? (
                <div className="absolute top-5 right-5 lg:top-6 lg:right-6 bg-white/90 backdrop-blur px-4 py-2.5 lg:px-6 lg:py-3 rounded-full lg:rounded-2xl flex items-center gap-2 shadow-md z-10">
                  <Layers className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                  <span className="text-sm lg:text-base font-bold text-slate-600">
                    {images.length} Foto
                  </span>
                </div>
              ) : null}
            </div>
            <div className="py-6 lg:py-8">
              <h3 className="text-lg lg:text-xl xl:text-2xl font-extrabold text-slate-800 leading-snug mb-3 lg:mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                {tema}
              </h3>
              <p className="text-sm lg:text-base xl:text-lg text-slate-500 line-clamp-3 leading-relaxed">
                {description}
              </p>
            </div>
          </Link>
        </div>

        <div className="px-6 lg:px-8 pb-6 lg:pb-8 flex items-center justify-between border-t border-slate-50 pt-5 mt-auto">
          <div className="flex items-center gap-5 lg:gap-6">
            <button
              onClick={async () => {
                await fetch(`/api/reports/${id}/like`, { method: "PUT" });
                window.location.reload();
              }}
              className="flex items-center gap-2.5 group/btn hover:scale-105 transition-transform"
            >
              <div className="w-11 h-11 lg:w-14 lg:h-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 transition-all active:scale-125">
                <Heart
                  className={`w-5 h-5 lg:w-7 lg:h-7 ${(likes || 0) > 0 ? "fill-rose-500" : ""}`}
                />
              </div>
              <span className="text-base lg:text-lg font-bold text-slate-600">
                {likes || 0}
              </span>
            </button>
            <Link
              href={`/detail/${id}`}
              className="flex items-center gap-2.5 hover:scale-105 transition-transform"
            >
              <div className="w-11 h-11 lg:w-14 lg:h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <MessageCircle className="w-5 h-5 lg:w-7 lg:h-7" />
              </div>
              <span className="text-base lg:text-lg font-bold text-slate-600">
                {commentCount}
              </span>
            </Link>
          </div>
          <Link
            href={`/detail/${id}`}
            className="text-xs lg:text-sm font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-5 py-3 lg:px-7 lg:py-4 rounded-xl lg:rounded-2xl hover:bg-blue-100 transition-colors"
          >
            Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
