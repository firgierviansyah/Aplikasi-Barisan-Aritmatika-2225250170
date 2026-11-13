// ===== Pembangkit soal dinamis: angka diacak tiap sesi =====
const r = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a
const pick = (a) => a[r(0, a.length - 1)]
export const f = (n) => String(n).replace('-', '−')
const rp = (v) => v.toLocaleString('id-ID')
const shuffle = (a) => { const x = [...a]; for (let i = x.length - 1; i > 0; i--) { const j = r(0, i);[x[i], x[j]] = [x[j], x[i]] } return x }
const seq = (a, b, k) => Array.from({ length: k }, (_, i) => f(a + i * b)).join(', ')

function mk(q, ans, wrong, e, fmt = f) {
  const w = [...new Set(wrong)].filter((v) => v !== ans)
  for (let k = 1; w.length < 3; k++) for (const c of [ans + k, ans - k]) if (w.length < 3 && c !== ans && !w.includes(c)) w.push(c)
  const opts = shuffle([ans, ...w.slice(0, 3)])
  return { q, o: opts.map(fmt), a: opts.indexOf(ans), e }
}

export const gBeda = () => {
  const a = r(1, 20), b = pick([-7, -5, -4, -3, -2, 2, 3, 4, 5, 6, 8])
  return mk(`Beda dari barisan ${seq(a, b, 4)}, ... adalah ...`, b, [-b, b + 1, b - 1, a + b],
    `b = U₂ − U₁ = ${f(a + b)} − ${f(a)} = ${f(b)}. Cek: ${f(a + 2 * b)} − ${f(a + b)} = ${f(b)}.`)
}
export const gMissing = () => {
  const a = r(2, 20), b = r(2, 7)
  return mk(`Lengkapi barisan aritmatika berikut: ${a}, ..., ${a + 2 * b}, ${a + 3 * b}. Suku yang hilang adalah ...`, a + b, [a + 2 * b - 1, a + b + 1, a + b - 1, b],
    `Bedanya b = ${a + 3 * b} − ${a + 2 * b} = ${b}. Suku kedua = ${a} + ${b} = ${a + b}.`)
}
export const gNext = () => {
  const a = r(1, 15), b = pick([-4, -3, 3, 4, 5, 6])
  return mk(`Suku berikutnya dari barisan ${seq(a, b, 4)}, ... adalah ...`, a + 4 * b, [a + 5 * b, a + 3 * b, a + 4 * b + 1, a + 4 * b - 1],
    `b = ${f(b)}. Suku keempat ${f(a + 3 * b)}, ditambah ${f(b)} menjadi ${f(a + 4 * b)}.`)
}
export const gUn = () => {
  const a = r(2, 12), b = r(2, 7), n = r(8, 20)
  return mk(`Suku ke-${n} dari barisan ${seq(a, b, 3)}, ... adalah ...`, a + (n - 1) * b, [a + n * b, a + (n - 2) * b, n * b, a + (n - 1) * b + b],
    `a = ${a}, b = ${b}. U${n} = ${a} + (${n} − 1)·${b} = ${a} + ${(n - 1) * b} = ${a + (n - 1) * b}.`)
}
export const gCariA = () => {
  const b = r(2, 6), n = r(4, 8), a = r(2, 12), U = a + (n - 1) * b
  return mk(`Pada barisan aritmatika, beda b = ${b} dan U${n} = ${U}. Suku pertama (a) adalah ...`, a, [U - n * b, U - (n - 2) * b, U + (n - 1) * b, U - b],
    `U${n} = a + (${n} − 1)·${b} → ${U} = a + ${(n - 1) * b} → a = ${U} − ${(n - 1) * b} = ${a}.`)
}
export const gBanyak = () => {
  const a = r(2, 10), b = r(2, 6), n = r(8, 15), last = a + (n - 1) * b
  return mk(`Banyak suku dari barisan ${seq(a, b, 3)}, ..., ${last} adalah ...`, n, [n - 1, n + 1, n + 2, last - a],
    `${last} = ${a} + (n − 1)·${b} → ${last - a} = (n − 1)·${b} → n − 1 = ${n - 1} → n = ${n}.`)
}

export const scen = (i = r(0, 3)) => {
  if (i === 0) { const a = r(5, 10) * 1000, b = pick([500, 1000, 1500, 2000]), n = r(10, 20)
    return { judul: 'Tabungan Dina', a, b, n, sat: (v) => `Rp${rp(v)}`,
      teks: `Dina menabung Rp${rp(a)} pada hari pertama. Setiap hari berikutnya ia menabung Rp${rp(b)} lebih banyak dari hari sebelumnya.`, tanya: `Berapa tabungan Dina pada hari ke-${n}?` } }
  if (i === 1) { const a = r(12, 20), b = pick([2, 3, 4]), n = r(10, 15)
    return { judul: 'Kursi di Aula', a, b, n, sat: (v) => `${f(v)} kursi`,
      teks: `Aula sekolah memiliki ${a} kursi pada baris pertama. Setiap baris di belakangnya memiliki ${b} kursi lebih banyak.`, tanya: `Berapa banyak kursi pada baris ke-${n}?` } }
  if (i === 2) { const a = r(15, 30), b = pick([3, 5, 6]), n = r(8, 14)
    return { judul: 'Penjualan Buku', a, b, n, sat: (v) => `${f(v)} buku`,
      teks: `Toko buku Pak Budi menjual ${a} buku pada hari pertama. Penjualan naik ${b} buku setiap harinya.`, tanya: `Berapa buku yang terjual pada hari ke-${n}?` } }
  const a = r(200, 300), b = -pick([6, 8, 10, 12]), n = r(8, 15)
  return { judul: 'Tangki Air', a, b, n, sat: (v) => `${f(v)} liter`,
    teks: `Sebuah tangki berisi ${a} liter air pada menit pertama. Setiap menit, air dalam tangki berkurang ${-b} liter.`, tanya: `Berapa liter air dalam tangki pada menit ke-${n}?` }
}
export const gCerita = (i) => {
  const s = scen(i), ans = s.a + (s.n - 1) * s.b
  return mk(`${s.teks} ${s.tanya}`, ans, [s.a + s.n * s.b, s.a + (s.n - 2) * s.b, s.a + (s.n - 1) * Math.abs(s.b), s.a + (s.n + 1) * s.b], 
    `a = ${f(s.a)}, b = ${f(s.b)}, n = ${s.n}. U${s.n} = ${f(s.a)} + (${s.n} − 1)·(${f(s.b)}) = ${f(ans)}.`, s.sat)
}

export const materi = [
  { id: 'beda', judul: 'Mengenal Pola dan Beda', viz: 'arrow',
    ringkas: 'Coba perhatikan angka 2, 5, 8, 11. Setiap angka naik 3 dari angka sebelumnya. Deretan angka yang loncatannya selalu sama seperti ini disebut barisan aritmatika. Besar loncatannya kita sebut beda, ditulis b.',
    poin: ['Cek selisih angka yang bersebelahan. Kalau hasilnya selalu sama, berarti itu barisan aritmatika.', 'Untuk mencari beda, kurangkan angka sesudah dengan angka sebelumnya.', 'Barisan naik berarti b positif. Barisan turun berarti b negatif (pakai tanda minus).', 'Setiap angka disebut suku. U₁ suku pertama, U₂ suku kedua, dan seterusnya.'],
    rumus: [{ judul: 'Rumus beda', isi: 'b = U₂ − U₁', cat: 'Berlaku untuk dua suku berurutan mana pun: b = Uₙ − Uₙ₋₁' }],
    tip: 'Kalau ragu, hitung dua selisih berbeda. Kalau hasilnya sama, kamu benar.',
    hints: ['Coba kurangkan suku kedua dengan suku pertama. Lalu kurangkan suku ketiga dengan suku kedua. Hasilnya sama?', 'Kalau selisihnya selalu sama, itulah beda (b). Kalau angkanya makin kecil, tanda b-nya apa ya?', 'Beda = angka sesudah dikurangi angka sebelumnya. Coba tulis dengan angka dari soalmu.'],
    pop: [gBeda, gMissing] },
  { id: 'un', judul: 'Rumus Suku ke-n', viz: 'formula',
    ringkas: 'Bagaimana kalau kamu ingin tahu angka ke-100 tanpa menulis 100 angka? Tenang, ada rumus pintasnya. Mulai dari suku pertama (a), lalu tambahkan beda (b) sebanyak (n − 1) kali. Kenapa n − 1? Untuk sampai ke suku ke-5, kita hanya melompat 4 kali dari suku pertama.',
    poin: ['a adalah suku pertama, b adalah beda, dan n adalah urutan suku yang dicari.', 'Banyak loncatan selalu satu lebih sedikit dari n.', 'Hitung dulu isi kurung (n − 1), lalu kalikan dengan b, baru tambahkan a.'],
    rumus: [{ judul: 'Rumus suku ke-n', isi: 'Uₙ = a + (n − 1)b', cat: 'Rumus ini juga bisa dipakai untuk mencari a, b, atau n kalau datanya lengkap.' }],
    tip: 'Contoh cepat: 4, 7, 10, ... Suku ke-10 = 4 + 9 × 3 = 31.',
    hints: ['Cari dulu a (suku pertama) dan b (beda) dari soal. Sudah ketemu?', 'Dari suku pertama, berapa kali kita melompat sampai suku ke-n? Petunjuk: bukan n kali.', 'Masukkan a, b, dan n ke Uₙ = a + (n − 1)b, lalu hitung isi kurung lebih dulu.'],
    pop: [gUn, gCariA] },
  { id: 'kasus', judul: 'Pemecahan Kasus', viz: 'case',
    ringkas: 'Soal cerita sebenarnya hanyalah barisan aritmatika yang menyamar. Tugasmu cuma mencari a, b, dan n dari ceritanya, lalu memasukkannya ke rumus. Ikuti tiga langkah di bawah ini.',
    poin: ['Langkah 1: cari angka pertama dalam cerita. Itu a.', 'Langkah 2: cari perubahan yang tetap tiap langkah. Itu b. Kata "berkurang" berarti b negatif.', 'Langkah 3: cari urutan yang ditanya. Itu n. Lalu masukkan ke rumus.'],
    rumus: [{ judul: 'Rumus untuk soal cerita', isi: 'Uₙ = a + (n − 1)b', cat: 'Tulis dulu "Diketahui" dan "Ditanya", baru hitung.' }],
    tip: 'Garis bawahi angka di soal, lalu beri label a, b, atau n.',
    hints: ['Dalam cerita, angka mana yang muncul paling awal? Itu suku pertama (a).', 'Cari kata seperti "bertambah" atau "berkurang". Itu petunjuk untuk b.', 'Kalau a, b, dan n sudah ketemu, masukkan ke Uₙ = a + (n − 1)b.'],
    pop: [() => gCerita(pick([0, 1, 2])), () => gCerita(3)] }
]

export const soalUtama = () => [gBeda(), gMissing(), gNext(), gUn(), gUn(), gCariA(), gBanyak(), gCerita()]
