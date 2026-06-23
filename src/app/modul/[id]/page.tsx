"use client";

import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ArrowLeft, BookOpen, Clock, Target, Users } from "lucide-react";
import { modulesData } from "@/lib/modulesData";

export default function ModulDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  
  const modul = modulesData.find(m => m.id === id);

  if (!modul) {
    return (
      <>
        <Navbar />
        <div className="max-w-[1200px] mx-auto px-4 py-24 text-center">
          <p className="text-slate-400">Modul tidak ditemukan</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>

        <div className="glass rounded-2xl p-6 lg:p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-2">
                {modul.category}
              </span>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 mb-2">
                {modul.title}
              </h1>
              <p className="text-slate-600">{modul.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="font-bold text-slate-600">{modul.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-slate-400" />
              <span className="font-bold text-slate-600">{modul.level}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="font-bold text-slate-600">Semua Usia</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {modul.topics.map((topic, idx) => (
              <span key={idx} className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 lg:p-8">
          <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: modul.content }} />
        </div>
      </div>
    </>
  );
}
