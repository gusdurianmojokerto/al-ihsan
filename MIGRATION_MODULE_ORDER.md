# Panduan Migration Database - Module Order

## 🗄️ Tabel Baru: module_order

Tabel ini menyimpan urutan modul yang diatur oleh admin secara persisten di database.

---

## 📋 Cara Menjalankan Migration

### Opsi 1: Via Supabase Dashboard (RECOMMENDED)

1. Login ke Supabase: https://supabase.com
2. Pilih project: **dphnwhleycntavygvbfh**
3. Buka menu **SQL Editor**
4. Copy isi file: `prisma/migrations/add_module_order.sql`
5. Paste ke SQL Editor
6. Klik **Run** atau tekan `Ctrl + Enter`
7. Pastikan muncul "Success. No rows returned"

### Opsi 2: Via psql (Command Line)

```bash
psql "postgresql://postgres.dphnwhleycntavygvbfh:GusdurianMojokerto06112001@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres" -f prisma/migrations/add_module_order.sql
```

---

## ✅ Verifikasi Migration Berhasil

Jalankan query ini di SQL Editor:

```sql
SELECT * FROM public.module_order;
```

Harusnya muncul 6 rows dengan data default:
```
id | moduleId | order | updatedAt
---+----------+-------+-------------------------
1  |    1     |   1   | 2026-06-24 00:07:00+00
2  |    2     |   2   | 2026-06-24 00:07:00+00
3  |    3     |   3   | 2026-06-24 00:07:00+00
4  |    4     |   4   | 2026-06-24 00:07:00+00
5  |    5     |   5   | 2026-06-24 00:07:00+00
6  |    6     |   6   | 2026-06-24 00:07:00+00
```

---

## 🔧 Struktur Tabel

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key, auto increment |
| moduleId | INTEGER | ID modul (1-6) |
| order | INTEGER | Urutan tampilan modul |
| updatedAt | TIMESTAMPTZ | Waktu update terakhir |

**Constraint:** `moduleId` harus unique (1 module = 1 order)

---

## 🔐 Security Policies

- **Public Read:** Semua orang bisa melihat urutan modul
- **Authenticated Write:** Hanya user authenticated (admin) yang bisa update

---

## 🚀 Cara Kerja Fitur

### 1. Halaman Modul (`/modul`)
- Fetch urutan dari API `/api/modul` (GET)
- Jika ada data di database, gunakan urutan custom
- Jika tidak ada, gunakan urutan default

### 2. Halaman Admin Modul (`/admin/modul`)
- Admin login terlebih dahulu
- Drag & drop modul untuk ubah urutan
- Klik "Simpan Urutan"
- POST ke API `/api/modul`
- Data tersimpan di tabel `module_order`

### 3. API Endpoint (`/api/modul`)
- **GET:** Ambil urutan dari database
- **POST:** Simpan urutan baru (upsert)

---

## 🔄 Update dari localStorage ke Database

**Sebelumnya:**
- ❌ Urutan tersimpan di localStorage browser
- ❌ Tidak sync antar perangkat
- ❌ Hilang jika clear browser data

**Sekarang:**
- ✅ Urutan tersimpan di database PostgreSQL
- ✅ Sync otomatis ke semua perangkat
- ✅ Persisten dan tidak hilang
- ✅ Bisa diakses dari mana saja

---

## 📝 Testing

### 1. Test API Endpoint
```bash
# GET - Ambil urutan
curl http://localhost:3000/api/modul

# POST - Simpan urutan baru
curl -X POST http://localhost:3000/api/modul \
  -H "Content-Type: application/json" \
  -d '{"modules":[{"id":1,"order":2},{"id":2,"order":1}]}'
```

### 2. Test di Browser
1. Login ke `/admin` (password: gusdurian)
2. Klik "Atur Modul"
3. Drag modul ke posisi baru
4. Klik "Simpan Urutan"
5. Buka tab baru, akses `/modul`
6. Urutan sudah berubah sesuai pengaturan

---

## ⚠️ Troubleshooting

### Error: "Failed to fetch module order"
- Pastikan migration sudah dijalankan
- Cek koneksi database di `.env`
- Cek Prisma client sudah di-generate: `npx prisma generate`

### Urutan tidak berubah
- Cek table `module_order` apakah ada data
- Cek browser console untuk error
- Refresh halaman dengan Ctrl + F5

### Permission denied
- Pastikan RLS policies sudah dibuat
- Cek user authenticated dengan benar

---

**Created:** 24 Juni 2026, 00:07 WIB
**Status:** Ready to deploy
