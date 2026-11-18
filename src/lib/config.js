// Konfigurasi Gemini. Kunci dibaca dari file .env (variabel VITE_GEMINI_API_KEY), tidak lagi ditulis di kode.
// Di Vercel: isi variabel yang sama di Project Settings > Environment Variables.
// Catatan keamanan: pada aplikasi browser, kunci tetap terlihat di hasil build. Batasi kunci ini di Google AI Studio / Cloud Console
// (batasi domain/HTTP referrer dan kuota) agar tidak disalahgunakan.
export const GEMINI_API_KEY = String(import.meta.env.VITE_GEMINI_API_KEY || '').trim().replace(/^['"]|['"]$/g, '')

// Hanya model versi FLASH (ringan dan cepat), dicoba berurutan: jika model pertama tidak tersedia/penuh,
// otomatis pindah ke berikutnya. (gemini-1.5-flash dan 2.0-flash sudah dihentikan Google, jadi tidak dipakai.)
export const GEMINI_MODELS = ['gemini-1.5-flash']
