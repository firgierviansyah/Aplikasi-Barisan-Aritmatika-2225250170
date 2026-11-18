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
- Gembok Kuis Utama dan Zona Game: Zona Game terbuka setelah DUA materi awal (Materi 1 dan 2 beserta Kuis Kejutannya) selesai, sedangkan Kuis Interaktif baru terbuka setelah KETIGA materi selesai. Kartu di menu utama dan halaman langsung (`Locked.jsx`) menampilkan daftar materi yang belum selesai. Syarat dicek lewat `gamesOpen()` dan `quizOpen()` di `lib/storage.js`.
- Zona Game: Katak Penjelajah Kolam Ranjau dan Misteri Brankas Rahasia, masing-masing 10 level, 3 nyawa per level, dengan layar tamat. Katak: level 1-4 cari beda (tombol, lompatan per beda, ranjau), level 5-10 cari suku dengan posisi katak bervariasi. Brankas: sebagian digit kode diketahui, digit terakhir adalah jawaban soal barisan. Di HP tegak, area game diputar ke landscape virtual otomatis.
- Notifikasi gembok terbuka: Kuis Kejutan Materi 2 lulus: modal Kak Aritma membuka Zona Game dengan pilihan "Mainkan Game" atau "Tetap di Menu Materi". Materi 3 lulus: Kuis Utama terbuka dengan tiga pilihan: "Mulai Kuis Utama", "Mainkan Game", atau "Tetap di Menu Materi" (X/Esc sama dengan tombol terakhir; setelah Materi 2 siswa dibawa ke Materi 3). Di halaman Belajar muncul bilah pintasan setelah gembok terbuka.
- Navigasi selesai kuis: Lanjut ke Kuis Berikutnya (soal baru), Menuju Analisis Nilai, Lanjut ke Tantangan (Game), dan Kembali ke Menu Utama.
- Analisis Nilai dengan Kak Aritma (`lib/analysis.js`, `Progress.jsx`): membaca nilai kuis terakhir, tren dibanding sesi sebelumnya (naik/stabil/turun >= 10 poin), dan hasil game terakhir. Nilai >= 75 tanpa penurunan: apresiasi dan motivasi. Nilai kurang atau menurun: bimbingan plus tombol "Bagian mana yang masih membuatmu bingung?" yang membuka chat Kak Aritma dengan pilihan topik materi; konteks nilai ikut dikirim ke instruksi asisten (aturan RMT/MLE di `ai.js` tidak berubah).
- Kuis Kejutan berupa modal terkunci (gating) yang dipandu Kak Aritma (`GateModal.jsx`): tombol Lanjut atau gembok tahap berikutnya memunculkan overlay gelap, scroll halaman dimatikan, dan latar tidak bisa difokus. Siswa harus menjawab 2 soal (dasar, tantangan) benar berurutan (streak). Jika salah, streak kembali ke 0, jawaban benar tidak langsung dibuka, Kak Aritma memberi 3 petunjuk bertahap lalu pembahasan, dan siswa mengulang dengan angka soal baru. Gembok terbuka hanya setelah streak penuh. Setelah lulus, gembok materi berikutnya terbuka; lulus materi terakhir membuka notifikasi Kuis dan Game (lihat di atas). Tombol X sebelum lulus hanya mengembalikan siswa ke materi (gembok tetap terkunci).

## Asisten AI (Google Gemini)
Memakai model Flash (`gemini-3.8-flash`, cadangan `3.6-flash` dan `2.5-flash`; daftar ada di `config.js`) dengan streaming: jawaban muncul kata per kata. Batas tunggu 45 detik per respons pertama dan per jeda data, dan indikator "sedang mengetik" tampil sampai teks pertama datang.
Kunci API dibaca dari file `.env` (variabel `VITE_GEMINI_API_KEY`) lewat `src/lib/config.js`; di Vercel isi variabel yang sama di Environment Variables. Di layar sempit (HP), tombol asisten berbentuk kartu kecil dengan ikon chat bertanda tanya dan label "Tanya Kak Aritma". Instruksi asisten (`src/lib/ai.js`) menerapkan RMT (Input, Elaborasi, Output) dan MLE: tidak pernah memberi jawaban akhir langsung, dan membimbing bertahap dengan contoh angka konkret (menentukan a dan b). Asisten melayang tampil di semua halaman kecuali Kuis dan Zona Game. "Tanya asisten" di halaman Belajar membimbing siswa dengan petunjuk bertahap. Batasi kunci di Google AI Studio (domain dan kuota) sebelum dipakai siswa.
