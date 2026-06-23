"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { BookOpen, Download, FileText, Search } from "lucide-react";

interface Module {
  id: number;
  title: string;
  description: string;
  pdfFile: string;
  pages: number;
  cover: string;
  order: number;
}

const defaultModules: Module[] = [
  {
    id: 1,
    title: "Modul Pedoman Tutor",
    description: "Panduan lengkap untuk tutor mencakup filosofi pembelajaran, protokol ruang kelas, studi kasus implementasi, dan indikator keberhasilan pembelajaran",
    pdfFile: "/modul/modul_pedoman_tutor.pdf",
    pages: 8,
    cover: "bg-gradient-to-br from-blue-500 to-cyan-500",
    order: 1
  },
  {
    id: 2,
    title: "Modul Pedoman Konseptual Visual",
    description: "Memahami kerangka pembelajaran abad 21, tangga kognitif Bloom, dan 9 nilai utama Gusdurian secara terpadu dengan visualisasi lengkap",
    pdfFile: "/modul/Modul_Pedoman_Konseptual_Visual.pdf",
    pages: 18,
    cover: "bg-gradient-to-br from-purple-500 to-pink-500",
    order: 2
  },
  {
    id: 3,
    title: "Modul Al Ihsan V2 Clean",
    description: "Modul pembelajaran lengkap dengan tema-tema terintegrasi: Kreasi Warna, Numerasi, Draw Your Imagination, Narasi Diri, dan aktivitas pembelajaran lainnya",
    pdfFile: "/modul/Modul_Al_Ihsan_V2_Clean.pdf",
    pages: 36,
    cover: "bg-gradient-to-br from-green-500 to-teal-500",
    order: 3
  },
  {
    id: 4,
    title: "Modul Ice Breaking Terpadu",
    description: "10 aktivitas ice breaking dengan integrasi 21CLD dan 9 Nilai Gusdurian: Cuaca Hatiku, Rantai Kata Majapahit, Arsitek Balok Buta, Detektif Nilai, dan lainnya",
    pdfFile: "/modul/Modul_Ice_Breaking_Terpadu_Al_Ihsan.pdf",
    pages: 10,
    cover: "bg-gradient-to-br from-orange-500 to-red-500",
    order: 4
  },
  {
    id: 5,
    title: "Modul Studi Kasus Rumah Belajar",
    description: "Studi kasus implementasi pembelajaran di Rumah Belajar Al-Ihsan dengan contoh nyata penerapan metode dan evaluasi hasil pembelajaran",
    pdfFile: "/modul/Modul_Studi_Kasus_Rumah_Belajar_Al-Ihsan.pdf",
    pages: 12,
    cover: "bg-gradient-to-br from-indigo-500 to-blue-500",
    order: 5
  },
  {
    id: 6,
    title: "Master Modul Monitoring",
    description: "Instrumen monitoring dan evaluasi pembelajaran, rubrik penilaian berbasis 21CLD, formulir refleksi, dan metodologi penilaian tutor",
    pdfFile: "/modul/Master_Modul_Monitoring_7_Halaman.pdf",
    pages: 7,
    cover: "bg-gradient-to-br from-pink-500 to-rose-500",
    order: 6
  }
];

export default function ModulePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [modules, setModules] = useState<Module[]>(defaultModules);

  useEffect(() => {
    const savedOrder = localStorage.getItem("modulOrder");
    if (savedOrder) {
      try {
        const parsedModules = JSON.parse(savedOrder);
        setModules(parsedModules.sort((a: Module, b: Module) => a.order - b.order));
      } catch (e) {
        setModules(defaultModules);
      }
    }
  }, []);

  const filteredModules = modules.filter(module => 
    module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <header className="mb-8 lg:mb-12 text-center pt-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-slate-800 mb-3 lg:mb-4">
            Modul <span className="shimmer-text">Pembelajaran</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Panduan pembelajaran terpadu berbasis 21CLD, Taksonomi Bloom, dan 9 Nilai Gusdurian
          </p>
        </header>

        <div className="glass rounded-2xl p-4 lg:p-6 mb-8 sticky top-24 z-40">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari modul pembelajaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm lg:text-base"
            />
          </div>
        </div>

        {filteredModules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map(module => (
              <div key={module.id} className="glass rounded-2xl overflow-hidden hover:shadow-xl transition-all group">
                <div className={`h-32 ${module.cover} flex items-center justify-center relative`}>
                  <FileText className="w-16 h-16 text-white opacity-80" />
                  <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-white">{module.pages} Halaman</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg lg:text-xl font-extrabold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed line-clamp-3">
                    {module.description}
                  </p>

                  <div className="flex gap-2">
                    <a
                      href={module.pdfFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                    >
                      <BookOpen className="w-4 h-4" />
                      Baca
                    </a>
                    <a
                      href={module.pdfFile}
                      download
                      className="px-4 bg-slate-100 text-slate-700 rounded-xl py-3 font-bold text-sm flex items-center justify-center hover:bg-slate-200 transition-all"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center flex flex-col items-center opacity-40">
            <BookOpen className="w-16 h-16 text-slate-300 mb-4" />
            <p className="text-sm lg:text-base font-bold text-slate-400 uppercase tracking-widest">
              Modul tidak ditemukan
            </p>
          </div>
        )}
      </div>
    </>
  );
}
