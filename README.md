# Belajar Barisan Aritmatika (SMP)
Pengembang: Firgi Erviansyah

## Menjalankan
    npm install
    npm run dev      # buka http://localhost:5173

## Fitur
- Alur belajar terkunci: Mengenal Pola dan Beda → Rumus Suku ke-n → Pemecahan Kasus. Tahap berikutnya terbuka setelah Kuis Kejutan lulus.
- Soal kuis dibangkitkan acak tiap sesi (`src/data/content.js`).
- Kalkulator fleksibel: cari a, b, n, atau Uₙ dengan mengosongkan satu kolom.
- Akun per siswa (kunci = nama + sekolah, huruf besar-kecil dan typo sekolah ringan ditoleransi); progres belajar, level game, dan riwayat tersimpan per akun di localStorage.
- Zona Game (terkunci sampai Materi 1 dan 2 beserta kuis kejutannya lulus): Katak Penjelajah Kolam Ranjau dan Misteri Brankas Rahasia, masing-masing 10 level, 3 nyawa per level, dengan layar tamat. Katak: level 1-4 cari beda (tombol, lompatan per beda, ranjau), level 5-10 cari suku dengan posisi katak bervariasi. Brankas: sebagian digit kode diketahui, digit terakhir adalah jawaban soal barisan. Di HP tegak, area game diputar ke landscape virtual otomatis.
- Kuis Kejutan ringkas (2 soal: dasar dan tantangan) di tiap tahap; Kuis Utama dan analisis nilai (dengan reset catatan).

## Asisten AI (Google Gemini)
Memakai model Flash (`gemini-3.8-flash`, cadangan `3.6-flash` dan `2.5-flash`; daftar ada di `config.js`) dengan streaming: jawaban muncul kata per kata. Batas tunggu 45 detik per respons pertama dan per jeda data, dan indikator "sedang mengetik" tampil sampai teks pertama datang.
Kunci API dibaca dari file `.env` (tidak ikut di-upload ke GitHub). Salin `.env.example` menjadi `.env`, isi `VITE_GEMINI_API_KEY=...`, lalu jalankan ulang `npm run dev`. Asisten melayang tampil di semua halaman kecuali Kuis dan Zona Game. "Tanya asisten" di halaman Belajar membimbing siswa dengan petunjuk bertahap. Batasi kunci di Google AI Studio (domain dan kuota) sebelum dipakai siswa.
