# Fix Chat AI - Groq API

## Perubahan
- API lama `api.iamhc.cn` tidak bekerja (404)
- Diganti dengan **Groq API** (gratis & cepat)
- Model: `llama-3.3-70b-versatile`

## API Details
- Endpoint: `https://api.groq.com/openai/v1/chat/completions`
- Model: `llama-3.3-70b-versatile`
- API Key: Simpan di `.env` → `GROQ_API_KEY`
- Limit: 30 req/menit (gratis)

## Alternatif Model Groq (Tinggal ganti `model`)
1. `llama-3.3-70b-versatile` - Paling pintar & balance
2. `llama-3.1-70b-versatile` - Lebih stabil
3. `mixtral-8x7b-32768` - Context window besar
4. `gemma2-9b-it` - Paling cepat & ringan

## File yang Diubah
- `src/app/api/chat/route.ts` - Line 6-7, 34
- `.env` - Tambah `GROQ_API_KEY`

## Cara Test
1. Jalankan: `npm run dev`
2. Buka: http://localhost:3000/chat
3. Ketik pertanyaan tentang modul pembelajaran

## Status
✅ API Connection: Working
✅ Streaming: Working
✅ Model: llama-3.3-70b-versatile
