# 🎓 Portal Laporan & Modul - Rumah Belajar Al Ihsan

## ✅ Status: SIAP DIGUNAKAN

### 📱 Fitur Aplikasi

#### 1. **Halaman Laporan Kegiatan** (`/`)
- Grid laporan dengan foto kegiatan
- Filter berdasarkan bulan dan tahun
- Sistem like dan komentar
- Detail laporan dengan gambar full screen

#### 2. **Halaman Modul Pembelajaran** (`/modul`)
- 6 Modul PDF pembelajaran lengkap
- Tombol Baca (buka PDF di tab baru)
- Tombol Download
- Search/pencarian modul
- Tampilan card yang rapi dengan cover berwarna

#### 3. **Halaman About** (`/about`)
- Informasi Rumah Belajar Al Ihsan
- Kontak dan lokasi

#### 4. **Halaman Admin** (`/admin`)
- Upload laporan kegiatan baru
- Upload multiple gambar
- Protected dengan password

---

## 📚 Modul PDF yang Tersedia

1. **Modul Pedoman Tutor** (8 halaman)
2. **Modul Pedoman Konseptual Visual** (18 halaman)
3. **Modul Al Ihsan V2 Clean** (36 halaman)
4. **Modul Ice Breaking Terpadu** (10 halaman)
5. **Modul Studi Kasus Rumah Belajar** (12 halaman)
6. **Master Modul Monitoring** (7 halaman)

---

## 🚀 Cara Menjalankan

### Development Mode
```bash
cd C:\Users\Belal\Documents\rm
npm run dev
```
Akses: http://localhost:3000

### Production Build
```bash
npm run build
npm start
```

---

## 📁 Struktur Folder

```
rm/
├── public/
│   └── modul/                    # Folder PDF modul (6 file)
│       ├── modul_pedoman_tutor.pdf
│       ├── Modul_Pedoman_Konseptual_Visual.pdf
│       ├── Modul_Al_Ihsan_V2_Clean.pdf
│       ├── Modul_Ice_Breaking_Terpadu_Al_Ihsan.pdf
│       ├── Modul_Studi_Kasus_Rumah_Belajar_Al-Ihsan.pdf
│       └── Master_Modul_Monitoring_7_Halaman.pdf
├── src/
│   ├── app/
│   │   ├── page.tsx              # Halaman laporan
│   │   ├── modul/
│   │   │   └── page.tsx          # Halaman modul PDF
│   │   ├── about/
│   │   ├── admin/
│   │   └── detail/
│   └── components/
│       ├── Navbar.tsx            # Navigasi dengan 4 menu
│       ├── ReportCard.tsx
│       └── Loading.tsx
├── prisma/
│   └── schema.prisma             # Database schema
└── .env                          # Environment variables
```

---

## 🎨 Teknologi yang Digunakan

- **Framework:** Next.js 16.2.7 (App Router)
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Font:** Plus Jakarta Sans

---

## 🔑 Kredensial Admin

- **Password:** gusdurian

---

## 📝 Catatan Penting

### Menambah/Mengubah PDF Modul
1. Letakkan file PDF di folder: `public/modul/`
2. Edit file: `src/app/modul/page.tsx`
3. Update array `modules` dengan informasi PDF baru

### Database
- Terhubung ke Supabase PostgreSQL
- Schema: reports, comments
- Auto-generate Prisma client: `npx prisma generate`

### Deployment
- Build: `npm run build`
- Pastikan environment variables sudah di-set di production

---

## 🌐 URL Menu

- **Home:** http://localhost:3000
- **Modul:** http://localhost:3000/modul
- **About:** http://localhost:3000/about
- **Admin:** http://localhost:3000/admin

---

## 📞 Support

Untuk pertanyaan atau masalah:
- GitHub: https://github.com/anomalyco/opencode/issues

---

**Dibuat dengan ❤️ untuk Rumah Belajar Al Ihsan - Gusdurian Mojokerto**
