"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Info, PlusCircle } from "lucide-react";
import { LOGO_URL } from "@/lib/constants";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 pt-4 lg:pt-6 pointer-events-none">
        <nav className="max-w-[1800px] mx-auto glass rounded-[2.5rem] lg:rounded-[3rem] h-20 lg:h-24 flex items-center justify-between px-6 lg:px-10 custom-shadow pointer-events-auto">
          <Link href="/" className="flex items-center gap-4 lg:gap-5">
            <div className="w-14 h-14 lg:w-16 lg:h-16 bg-blue-50 rounded-2xl lg:rounded-3xl flex items-center justify-center p-1 shadow-sm border border-blue-100/50">
              <img
                src={LOGO_URL}
                className="w-full h-full object-contain"
                alt="Logo"
                decoding="async"
                fetchPriority="high"
              />
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-extrabold tracking-tight leading-none text-blue-600">
                AL IHSAN
              </h1>
              <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                Rumah Belajar
              </p>
            </div>
          </Link>

          <div className="flex bg-slate-100/50 p-1.5 lg:p-2 rounded-2xl lg:rounded-3xl gap-1">
            <Link
              href="/"
              className={`nav-btn px-4 py-3 lg:px-5 lg:py-4 ${isActive("/") && !isActive("/about") && !isActive("/admin") && !isActive("/detail") ? "active" : ""}`}
            >
              <LayoutGrid className="w-5 h-5 lg:w-6 lg:h-6" />
            </Link>
            <Link
              href="/about"
              className={`nav-btn px-4 py-3 lg:px-5 lg:py-4 ${isActive("/about") ? "active" : ""}`}
            >
              <Info className="w-5 h-5 lg:w-6 lg:h-6" />
            </Link>
            <Link
              href="/admin"
              className={`nav-btn px-4 py-3 lg:px-5 lg:py-4 ${isActive("/admin") ? "active" : ""}`}
            >
              <PlusCircle className="w-5 h-5 lg:w-6 lg:h-6" />
            </Link>
          </div>
        </nav>
      </div>
      <div className="h-28 lg:h-36"></div>
    </>
  );
}
