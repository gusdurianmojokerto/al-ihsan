"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, UserCheck, ImagePlus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import { showToast } from "@/lib/utils";

interface Report {
  id: number;
  date: string;
  tema: string | null;
  description: string | null;
  images: string[] | null;
  likes: number | null;
}

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState("");
  const [tema, setTema] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitText, setSubmitText] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("al_ihsan_is_admin") === "true";
    setIsAdmin(stored);

    const savedEditId = localStorage.getItem("al_ihsan_edit_id");
    if (savedEditId && stored) {
      const eid = Number(savedEditId);
      setEditId(eid);
      fetch(`/api/reports/${eid}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.id) {
            const d = new Date(data.date);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            setDate(`${yyyy}-${mm}-${dd}`);
            setTema(data.tema || "");
            setDescription(data.description || "");
            setPreviews((data.images as string[]) || []);
          }
          localStorage.removeItem("al_ihsan_edit_id");
        })
        .catch(() => localStorage.removeItem("al_ihsan_edit_id"));
    }

    setLoading(false);
  }, []);

  const handleLogin = () => {
    if (password.toLowerCase() === "gusdurian") {
      setIsAdmin(true);
      localStorage.setItem("al_ihsan_is_admin", "true");
      showToast("Selamat Datang, Pengurus!");
    } else {
      showToast("Kode akses salah!");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("al_ihsan_is_admin");
    showToast("Anda telah keluar");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (selected.length > 5) {
      showToast("Maksimal 5 foto!");
      return;
    }
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            const MAX_SIZE = 1000;
            let { width, height } = img;
            if (width > height) {
              if (width > MAX_SIZE) {
                height *= MAX_SIZE / width;
                width = MAX_SIZE;
              }
            } else {
              if (height > MAX_SIZE) {
                width *= MAX_SIZE / height;
                height = MAX_SIZE;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d")!;
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(new File([blob], file.name, { type: "image/jpeg" }));
                } else {
                  resolve(file);
                }
              },
              "image/jpeg",
              0.8
            );
          } catch {
            resolve(file);
          }
        };
        img.onerror = () => resolve(file);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve(file);
    });
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const isEdit = editId !== null;
      const existingImages = isEdit ? previews.filter((p) => !p.startsWith("blob:")) : [];
      let newImageUrls: string[] = [];

      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          setSubmitText(`Kompres Foto ${i + 1}...`);
          const compressed = await compressImage(files[i]);
          setSubmitText(`Unggah Foto ${i + 1}...`);
          const url = await uploadImage(compressed);
          newImageUrls.push(url);
        }
      }

      const imageUrls = [...existingImages, ...newImageUrls];

      if (imageUrls.length === 0) {
        showToast("Pilih minimal 1 foto!");
        setSubmitting(false);
        setSubmitText("");
        return;
      }

      setSubmitText("Finalisasi...");
      const payload = { date, tema, description, images: imageUrls };

      if (isEdit) {
        await fetch(`/api/reports/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        showToast("Laporan diperbarui!");
      } else {
        await fetch("/api/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        showToast("Laporan berhasil terbit!");
      }

      setDate("");
      setTema("");
      setDescription("");
      setFiles([]);
      setPreviews([]);
      setEditId(null);
      window.location.href = "/";
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      showToast("Gagal: " + message);
    } finally {
      setSubmitting(false);
      setSubmitText("");
    }
  };

  if (loading) return <Loading />;

  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <div className="max-w-xs mx-auto py-20 px-5 text-center">
          <div className="bg-white rounded-[3rem] p-10 custom-shadow">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-500">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="font-extrabold text-lg mb-6 text-slate-800 uppercase tracking-widest leading-tight">
              Keamanan
              <br />
              Pengurus
            </h2>
            <input
              type="password"
              placeholder="KODE AKSES"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full bg-slate-50 border-none rounded-2xl p-5 text-center text-xl font-extrabold mb-4 outline-none focus:ring-2 focus:ring-blue-500 tracking-[0.3em] transition-all"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white font-extrabold py-5 rounded-2xl shadow-xl shadow-blue-100 text-xs tracking-widest uppercase active:scale-95 transition-all"
            >
              Verifikasi
            </button>
          </div>
        </div>
      </>
    );
  }

  const isEditing = editId !== null;

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12 pb-24">
        <div className="flex justify-between items-center mb-10 bg-white/50 p-5 lg:p-6 rounded-3xl lg:rounded-[3rem]">
          <div className="flex items-center gap-4 lg:gap-5">
            <div className="w-11 h-11 lg:w-14 lg:h-14 bg-blue-500 rounded-full flex items-center justify-center text-white">
              <UserCheck className="w-5 h-5 lg:w-7 lg:h-7" />
            </div>
            <p className="text-sm lg:text-base font-extrabold text-slate-700">Mode Pengurus</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs lg:text-sm font-bold text-red-500 bg-red-50 border border-red-100 px-5 py-2.5 lg:px-6 lg:py-3 rounded-xl lg:rounded-2xl uppercase tracking-tighter hover:bg-red-100 transition-colors"
          >
            Keluar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-[3rem] lg:rounded-[4rem] p-8 sm:p-10 lg:p-14 custom-shadow space-y-8">
            <div className="relative bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-12 lg:p-16 text-center group cursor-pointer overflow-hidden transition-colors hover:border-blue-300">
              <input
                type="file"
                multiple
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileSelect}
              />
              <div className="relative z-10">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-sm transition-transform group-hover:scale-110">
                  <ImagePlus className="w-8 h-8 lg:w-10 lg:h-10" />
                </div>
                <p className="text-sm lg:text-base font-extrabold text-slate-500 uppercase tracking-widest">
                  {previews.length
                    ? previews.length + " Foto Terpilih"
                    : "Pilih Gambar Kegiatan"}
                </p>
              </div>
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-5 gap-3 lg:gap-4 px-2">
                {previews.map((p, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-2xl overflow-hidden shadow-sm border border-slate-100 ${isEditing && !p.startsWith("blob:") ? "grayscale opacity-30" : ""}`}
                  >
                    <img
                      src={p}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      alt={`Preview ${i + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs lg:text-sm font-extrabold text-slate-400 uppercase tracking-widest ml-5">
                  Tanggal
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-3xl px-6 py-5 lg:px-7 lg:py-6 text-base lg:text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs lg:text-sm font-extrabold text-slate-400 uppercase tracking-widest ml-5">
                  Tema Kegiatan
                </label>
                <input
                  type="text"
                  placeholder="Misal: Belajar Mewarnai Bersama"
                  required
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-3xl px-6 py-5 lg:px-7 lg:py-6 text-base lg:text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs lg:text-sm font-extrabold text-slate-400 uppercase tracking-widest ml-5">
                  Deskripsi Lengkap
                </label>
                <textarea
                  placeholder="Ceritakan detail kegiatan..."
                  required
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-[3rem] px-6 py-6 lg:px-7 lg:py-7 text-base lg:text-lg font-medium outline-none focus:ring-2 focus:ring-blue-500/20 leading-relaxed"
                />
              </div>
            </div>

            <div className="flex gap-4">
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setDate("");
                    setTema("");
                    setDescription("");
                    setFiles([]);
                    setPreviews([]);
                  }}
                  className="flex-1 bg-slate-100 text-slate-500 font-extrabold py-6 lg:py-7 rounded-[2rem] uppercase tracking-widest text-sm lg:text-base hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="flex-[2] bg-blue-600 text-white font-extrabold py-6 lg:py-7 rounded-[2rem] shadow-xl shadow-blue-100 hover:bg-blue-700 uppercase tracking-widest text-sm lg:text-base transition-all active:scale-95 disabled:opacity-50"
              >
                {submitText ||
                  (isEditing ? "Simpan Perubahan" : "Terbitkan Sekarang")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
