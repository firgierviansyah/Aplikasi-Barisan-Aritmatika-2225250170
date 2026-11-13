// Kunci API dibaca dari file .env (TIDAK di-upload ke GitHub). Lihat .env.example dan README.
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

// Hanya model versi FLASH (ringan dan cepat), dicoba berurutan: jika model pertama tidak tersedia/penuh,
// otomatis pindah ke berikutnya.
export const GEMINI_MODELS = ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-2.5-flash']
