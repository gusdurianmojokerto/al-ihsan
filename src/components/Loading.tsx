"use client";

import { LOGO_URL } from "@/lib/constants";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 backdrop-blur-xl z-[200] transition-opacity duration-500">
      <div className="flex flex-col items-center animate-fade-in">
        <div className="relative w-32 h-32 lg:w-40 lg:h-40 flex items-center justify-center mb-8">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-[2.5rem] lg:rounded-[3rem] rotate-45 opacity-10 animate-pulse"></div>
          
          <div className="absolute inset-2 border-[6px] lg:border-[8px] border-blue-100 rounded-[2rem] lg:rounded-[2.5rem] rotate-45"></div>
          
          <div className="absolute inset-2 border-[6px] lg:border-[8px] border-transparent border-t-blue-500 border-r-cyan-400 rounded-[2rem] lg:rounded-[2.5rem] animate-spin rotate-45"></div>
          
          <div className="absolute inset-4 bg-white rounded-[1.5rem] lg:rounded-[2rem] shadow-xl"></div>
          
          <img
            src={LOGO_URL}
            className="w-16 h-16 lg:w-20 lg:h-20 object-contain relative z-10 animate-pulse"
            alt="Logo"
            decoding="async"
          />
        </div>
        
        <div className="text-center space-y-4">
          <h2 className="text-sm lg:text-base font-extrabold uppercase tracking-[0.3em] shimmer-text">
            Rumah Belajar Al Ihsan
          </h2>
          
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          
          <p className="text-xs lg:text-sm font-bold text-slate-400 uppercase tracking-widest">
            Memuat...
          </p>
        </div>
      </div>
    </div>
  );
}
