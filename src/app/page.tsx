"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ReportCard from "@/components/ReportCard";
import Loading from "@/components/Loading";
import { MONTHS } from "@/lib/constants";

interface Report {
  id: number;
  date: string;
  tema: string | null;
  description: string | null;
  images: string[] | null;
  likes: number | null;
  createdAt: string | null;
  comments: { id: number }[];
}

export default function HomePage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filterMonth, setFilterMonth] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterMonth !== "all") params.set("month", filterMonth);
      if (filterYear !== "all") params.set("year", filterYear);

      const res = await fetch(`/api/reports?${params.toString()}`);
      const data = await res.json();
      setReports(data);
    } catch (e) {
      console.error("Failed to fetch reports:", e);
    } finally {
      setLoading(false);
    }
  }, [filterMonth, filterYear]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const availableYears: string[] = [
    ...new Set(
      reports
        .map((r) => {
          const d = new Date(r.date);
          return isNaN(d.getTime()) ? "" : d.getFullYear().toString();
        })
        .filter((y) => y.length === 4)
    ),
  ].sort((a, b) => b.localeCompare(a));

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <header className="mb-8 lg:mb-12 text-center pt-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-slate-800 mb-3 lg:mb-4">
            Membangun{" "}
            <span className="shimmer-text">Masa Depan</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Melihat kembali senyum dan semangat belajar adik-adik Al Ihsan
          </p>
        </header>

        <div className="flex gap-3 pb-8 justify-center sticky top-24 z-40">
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="glass border-none rounded-xl px-4 pr-10 py-3 text-xs lg:text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
          >
            <option value="all">Semua Bulan</option>
            {MONTHS.map((m, i) => (
              <option key={i + 1} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="glass border-none rounded-xl px-4 pr-10 py-3 text-xs lg:text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
          >
            <option value="all">Semua Tahun</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[1400px] mx-auto">
            {reports.map((r) => (
              <ReportCard
                key={r.id}
                id={r.id}
                date={r.date}
                tema={r.tema}
                description={r.description}
                images={r.images}
                likes={r.likes}
                commentCount={r.comments.length}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center flex flex-col items-center opacity-40">
            <p className="text-sm lg:text-base font-bold text-slate-400 uppercase tracking-widest">
              Laporan tidak ditemukan
            </p>
          </div>
        )}
      </div>
    </>
  );
}
