"use client";

import { Globe, Phone, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import { LOGO_URL } from "@/lib/constants";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 pb-24 animate-fade-in">
        <div className="bg-white rounded-[4rem] lg:rounded-[5rem] p-10 sm:p-14 lg:p-20 custom-shadow mb-10 text-center relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-40 h-40 lg:w-48 lg:h-48 bg-blue-50 rounded-full"></div>
          <div className="w-36 h-36 lg:w-48 lg:h-48 bg-white rounded-[3rem] lg:rounded-[4rem] shadow-xl flex items-center justify-center mx-auto mb-10 p-4 lg:p-6 relative z-10 border border-blue-50">
            <img
              src={LOGO_URL}
              className="w-full h-full object-contain"
              alt="Logo"
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-800 mb-6 tracking-tight">
            Rumah Belajar Al Ihsan
          </h2>
          <p className="text-sm lg:text-base font-extrabold text-blue-600 uppercase tracking-[0.4em] mb-12">
            Gusdurian Mojokerto
          </p>
          <div className="space-y-8 text-base sm:text-lg lg:text-xl xl:text-2xl text-slate-600 text-justify leading-relaxed">
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

        <div className="space-y-6">
          <h4 className="text-sm lg:text-base font-extrabold text-slate-400 uppercase tracking-[0.2em] ml-8 mb-4">
            Hubungi Kami
          </h4>

          <a
            href="https://instagram.com/gusdurian_mojokerto"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card flex items-center gap-6 lg:gap-8 bg-white p-7 lg:p-9 rounded-[3rem] lg:rounded-[4rem] custom-shadow group"
          >
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 rounded-2xl lg:rounded-3xl flex items-center justify-center text-white shadow-lg">
              <Globe className="w-8 h-8 lg:w-10 lg:h-10" />
            </div>
            <div className="flex-1">
              <p className="text-xs lg:text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                Instagram Resmi
              </p>
              <p className="text-base lg:text-lg xl:text-xl font-extrabold text-slate-800">
                @gusdurian_mojokerto
              </p>
            </div>
            <ExternalLink className="w-6 h-6 lg:w-7 lg:h-7 text-slate-200 group-hover:text-blue-500 transition-colors mr-2" />
          </a>

          <a
            href="https://wa.me/6285961567378"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card flex items-center gap-6 lg:gap-8 bg-white p-7 lg:p-9 rounded-[3rem] lg:rounded-[4rem] custom-shadow group"
          >
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-blue-600 rounded-2xl lg:rounded-3xl flex items-center justify-center text-white shadow-lg">
              <Phone className="w-8 h-8 lg:w-10 lg:h-10" />
            </div>
            <div className="flex-1">
              <p className="text-xs lg:text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                WhatsApp Penggerak
              </p>
              <p className="text-base lg:text-lg xl:text-xl font-extrabold text-slate-800">
                Hubungi Kami Langsung
              </p>
            </div>
            <div className="bg-blue-50 text-blue-600 text-xs lg:text-sm font-extrabold px-4 py-2 lg:px-5 lg:py-2.5 rounded-lg lg:rounded-xl uppercase tracking-tight mr-1">
              Aktif
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
