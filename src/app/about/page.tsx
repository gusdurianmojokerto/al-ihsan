"use client";

import { Globe, Phone, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import { LOGO_URL } from "@/lib/constants";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto px-4 pb-24 animate-fade-in">
        <div className="bg-white rounded-3xl p-8 custom-shadow mb-6 text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-50 rounded-full"></div>
          <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6 p-2 relative z-10 border border-blue-50">
            <img
              src={LOGO_URL}
              className="w-full h-full object-contain"
              alt="Logo"
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mb-3 tracking-tight">
            Rumah Belajar Al Ihsan
          </h2>
          <p className="text-[10px] lg:text-xs font-extrabold text-blue-600 uppercase tracking-[0.4em] mb-8">
            Gusdurian Mojokerto
          </p>
          <div className="space-y-4 text-sm text-slate-600 text-justify leading-relaxed">
            <p>
              <span className="font-extrabold text-blue-600">
                Rumah Belajar Al Ihsan
              </span>{" "}
              merupakan oase pendidikan non-formal yang didirikan di bawah
              naungan semangat komunitas Gusdurian Mojokerto.
            </p>
            <p>
              Dengan memegang teguh 9 Nilai Utama Gus Dur, kami berfokus pada
              pengembangan karakter anak-anak melalui metode pembelajaran yang
              humanis, menyenangkan, dan penuh toleransi.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-[0.2em] ml-4 mb-3">
            Hubungi Kami
          </h4>

          <a
            href="https://instagram.com/gusdurian_mojokerto"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card flex items-center gap-4 bg-white p-5 rounded-2xl custom-shadow group"
          >
            <div className="w-12 h-12 bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                Instagram Resmi
              </p>
              <p className="text-sm font-extrabold text-slate-800 truncate">
                @gusdurian_mojokerto
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-200 group-hover:text-blue-500 transition-colors flex-shrink-0" />
          </a>

          <a
            href="https://wa.me/6285961567378"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card flex items-center gap-4 bg-white p-5 rounded-2xl custom-shadow group"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                WhatsApp Penggerak
              </p>
              <p className="text-sm font-extrabold text-slate-800 truncate">
                Hubungi Kami Langsung
              </p>
            </div>
            <div className="bg-blue-50 text-blue-600 text-[10px] font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-tight flex-shrink-0">
              Aktif
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
