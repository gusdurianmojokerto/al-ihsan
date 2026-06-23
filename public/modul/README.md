# Panduan Upload File PDF Modul

## Lokasi File
Letakkan 6 file PDF modul di folder: `public/modul/`

## Nama File yang Dibutuhkan
1. `modul-1-checkin-checkout.pdf` - Modul Check-In & Check-Out (6 halaman)
2. `modul-2-integrasi-konsep.pdf` - Modul Integrasi 21CLD, Bloom & Gusdurian (18 halaman)
3. `modul-3-pembelajaran.pdf` - Modul Pembelajaran Terpadu Tema 1-12 (11 halaman)
4. `modul-4-icebreaking.pdf` - Modul Ice Breaking Terpadu (10 halaman)
5. `modul-5-pedoman-tutor.pdf` - Modul Pedoman Tutor Lengkap (8 halaman)
6. `modul-6-penilaian.pdf` - Modul Refleksi & Penilaian Holistik (5 halaman)

## Cara Upload
1. Buka folder: `C:\Users\Belal\Documents\rm\public\modul\`
2. Copy 6 file PDF Anda ke folder tersebut
3. Pastikan nama file sesuai dengan daftar di atas
4. Restart server: `npm run dev`

## Catatan
- Jika nama file berbeda, edit file `src/app/modul/page.tsx` di bagian `pdfFile`
- Jumlah halaman bisa disesuaikan di bagian `pages`
- Warna cover bisa diubah di bagian `cover`
