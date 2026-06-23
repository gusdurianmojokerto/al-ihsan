"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { GripVertical, Save, ArrowLeft, FileText } from "lucide-react";

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
    description: "Panduan lengkap untuk tutor",
    pdfFile: "/modul/modul_pedoman_tutor.pdf",
    pages: 8,
    cover: "bg-gradient-to-br from-blue-500 to-cyan-500",
    order: 1
  },
  {
    id: 2,
    title: "Modul Pedoman Konseptual Visual",
    description: "Kerangka pembelajaran abad 21",
    pdfFile: "/modul/Modul_Pedoman_Konseptual_Visual.pdf",
    pages: 18,
    cover: "bg-gradient-to-br from-purple-500 to-pink-500",
    order: 2
  },
  {
    id: 3,
    title: "Modul Al Ihsan V2 Clean",
    description: "Modul pembelajaran lengkap",
    pdfFile: "/modul/Modul_Al_Ihsan_V2_Clean.pdf",
    pages: 36,
    cover: "bg-gradient-to-br from-green-500 to-teal-500",
    order: 3
  },
  {
    id: 4,
    title: "Modul Ice Breaking Terpadu",
    description: "10 aktivitas ice breaking",
    pdfFile: "/modul/Modul_Ice_Breaking_Terpadu_Al_Ihsan.pdf",
    pages: 10,
    cover: "bg-gradient-to-br from-orange-500 to-red-500",
    order: 4
  },
  {
    id: 5,
    title: "Modul Studi Kasus Rumah Belajar",
    description: "Studi kasus implementasi",
    pdfFile: "/modul/Modul_Studi_Kasus_Rumah_Belajar_Al-Ihsan.pdf",
    pages: 12,
    cover: "bg-gradient-to-br from-indigo-500 to-blue-500",
    order: 5
  },
  {
    id: 6,
    title: "Master Modul Monitoring",
    description: "Instrumen monitoring dan evaluasi",
    pdfFile: "/modul/Master_Modul_Monitoring_7_Halaman.pdf",
    pages: 7,
    cover: "bg-gradient-to-br from-pink-500 to-rose-500",
    order: 6
  }
];

export default function AdminModulePage() {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/modul")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const orderMap = new Map(data.map((item: any) => [item.moduleId, item.order]));
          const sortedModules = [...defaultModules].map((module) => ({
            ...module,
            order: orderMap.get(module.id) || module.order
          })).sort((a, b) => a.order - b.order);
          setModules(sortedModules);
        } else {
          setModules(defaultModules);
        }
      })
      .catch(() => {
        setModules(defaultModules);
      });
  }, []);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newModules = [...modules];
    const draggedModule = newModules[draggedIndex];
    newModules.splice(draggedIndex, 1);
    newModules.splice(index, 0, draggedModule);

    newModules.forEach((module, idx) => {
      module.order = idx + 1;
    });

    setModules(newModules);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/modul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modules: modules.map((m) => ({ id: m.id, order: m.order }))
        })
      });

      if (response.ok) {
        alert("Urutan modul berhasil disimpan ke database!");
      } else {
        throw new Error("Gagal menyimpan");
      }
    } catch (error) {
      alert("Gagal menyimpan urutan modul. Coba lagi.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/admin")}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Admin
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? "Menyimpan..." : "Simpan Urutan"}
          </button>
        </div>

        <div className="glass rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
            Atur Urutan Modul
          </h2>
          <p className="text-slate-600 text-sm">
            Drag & drop untuk mengubah urutan modul. Klik "Simpan Urutan" untuk menyimpan perubahan.
          </p>
        </div>

        <div className="space-y-4">
          {modules.map((module, index) => (
            <div
              key={module.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`glass rounded-xl p-4 cursor-move hover:shadow-lg transition-all ${
                draggedIndex === index ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <GripVertical className="w-6 h-6 text-slate-400 flex-shrink-0" />
                
                <div className="w-12 h-12 flex items-center justify-center text-2xl font-extrabold text-white rounded-lg flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600">
                  {module.order}
                </div>

                <div className={`w-12 h-12 ${module.cover} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <FileText className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 mb-1">{module.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-1">{module.description}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-slate-500">{module.pages} Hal</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 glass rounded-xl p-4 bg-blue-50">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Perubahan urutan akan tersimpan di browser dan akan diterapkan di halaman Modul.
          </p>
        </div>
      </div>
    </>
  );
}
