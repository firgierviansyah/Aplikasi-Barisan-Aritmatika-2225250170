// Konfigurasi Gemini. Kunci dibaca dari file .env (variabel VITE_GEMINI_API_KEY), tidak ditulis di kode.
// Di Vercel: isi variabel yang sama di Project Settings > Environment Variables, lalu Redeploy.
// Catatan keamanan: pada aplikasi browser, kunci tetap terlihat di hasil build. Batasi kunci ini di Google AI Studio / Cloud Console
// (batasi domain/HTTP referrer dan kuota) agar tidak disalahgunakan.
export const GEMINI_API_KEY = String(import.meta.env.VITE_GEMINI_API_KEY || '').trim().replace(/^['"]|['"]$/g, '')

// SATU-SATUNYA tempat nama model ditulis. Dicoba berurutan: jika model pertama tidak tersedia/penuh,
// otomatis pindah ke berikutnya. Semua nama dicek di https://ai.google.dev/gemini-api/docs/deprecations
// (per 18 Nov 2026). JANGAN pakai gemini-1.5-* (dimatikan 29 Sep 2025) atau gemini-2.0-* (dimatikan 1 Jun 2026):
// keduanya membalas 404 sehingga chatbot menampilkan "asisten sedang bermasalah".
// thinking = tingkat "berpikir" yang diminta; dipilih yang paling rendah yang didukung model agar balasan cepat
// dan jatah token tidak habis untuk berpikir. (3.8-flash tidak punya "minimal", paling rendah "low".)
export const GEMINI_MODELS = ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.5-flash-lite']
export const THINKING_LEVEL = {
  'gemini-3.8-flash': 'low',
  'gemini-3.6-flash': 'minimal',
  'gemini-3.5-flash-lite': 'minimal'
}
