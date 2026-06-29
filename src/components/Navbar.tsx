"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Info, PlusCircle, BookOpen, MessageCircle } from "lucide-react";
import { LOGO_URL } from "@/lib/constants";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 px-3 lg:px-6 pt-3 lg:pt-4 pointer-events-none">
        <nav className="max-w-3xl mx-auto glass rounded-2xl lg:rounded-3xl h-14 lg:h-20 flex items-center justify-between px-4 lg:px-8 custom-shadow pointer-events-auto">
          <Link href="/" className="flex items-center gap-2.5 lg:gap-4">
            <div className="w-9 h-9 lg:w-12 lg:h-12 bg-blue-50 rounded-xl lg:rounded-2xl flex items-center justify-center p-0.5 shadow-sm border border-blue-100/50">
              <img
                src={LOGO_URL}
                className="w-full h-full object-contain"
                alt="Logo"
                decoding="async"
                fetchPriority="high"
              />
            </div>
            <div>
              <h1 className="text-sm lg:text-lg font-extrabold tracking-tight leading-none text-blue-600">
                AL IHSAN
              </h1>
              <p className="text-[8px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                Rumah Belajar
              </p>
            </div>
          </Link>

          <div className="flex bg-slate-100/50 p-1 lg:p-1.5 rounded-xl lg:rounded-2xl gap-0.5">
            <Link
              href="/"
              className={`nav-btn px-2.5 py-2 lg:px-4 lg:py-3 ${isActive("/") && !isActive("/about") && !isActive("/admin") && !isActive("/detail") && !isActive("/modul") && !isActive("/chat") ? "active" : ""}`}
            >
              <LayoutGrid className="w-4 h-4 lg:w-5 lg:h-5" />
            </Link>
            <Link
              href="/modul"
              className={`nav-btn px-2.5 py-2 lg:px-4 lg:py-3 ${isActive("/modul") ? "active" : ""}`}
            >
              <BookOpen className="w-4 h-4 lg:w-5 lg:h-5" />
            </Link>
            <Link
              href="/chat"
              className={`nav-btn px-2.5 py-2 lg:px-4 lg:py-3 ${isActive("/chat") ? "active" : ""}`}
            >
              <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5" />
            </Link>
            <Link
              href="/about"
              className={`nav-btn px-2.5 py-2 lg:px-4 lg:py-3 ${isActive("/about") ? "active" : ""}`}
            >
              <Info className="w-4 h-4 lg:w-5 lg:h-5" />
            </Link>
            <Link
              href="/admin"
              className={`nav-btn px-2.5 py-2 lg:px-4 lg:py-3 ${isActive("/admin") ? "active" : ""}`}
            >
              <PlusCircle className="w-4 h-4 lg:w-5 lg:h-5" />
            </Link>
          </div>
        </nav>
      </div>
      <div className="h-20 lg:h-24"></div>
    </>
  );
}
