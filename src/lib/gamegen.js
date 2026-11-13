import { f } from '../data/content.js'
const r = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a
const pick = (x) => x[r(0, x.length - 1)]
const shuffle = (a) => { const x = [...a]; for (let i = x.length - 1; i > 0; i--) { const j = r(0, i);[x[i], x[j]] = [x[j], x[i]] } return x }

// ===================== GAME 1: KATAK =====================
// Level 1-4  : CARI BEDA (b = 2, 3, 4, 5). Papan 20 batu yang tampilannya SERAGAM. Beda salah => katak mendarat di batu
//              berisi ranjau (baru terbuka saat katak mendarat). Beda benar => katak melompat sampai batu finish (batu ke-20).
// Level 5-10 : CARI SUKU, satu barisan dengan 2 TAHAP menuju finish; katak melompat satu per satu batu.
const BOARD = 20
const BEDA = [{ bs: [2, 3], k: 3, count: 3 }, { bs: [2, 3, 4], k: 3, count: 4 }, { bs: [3, 4, 5], k: 4, count: 4 }, { bs: [3, 4, 5], k: 4, count: 5 }]
// Pengecoh beda: positif, bukan kelipatan b (agar lompatan salah tidak kebetulan mendarat di batu aman).
const bedaPengecoh = (b, maxD) => [b + 1, b - 1, b + 2, b - 2, b + 3, b + 4, b + 5]
  .filter((d) => d > 0 && d !== b && d <= maxD && !(d % b === 0 && d / b >= 2))

function bedaRound(level) {
  const c = BEDA[level - 1], b = pick(c.bs), k = Math.min(c.k, Math.floor((BOARD - 1) / b)), a = BOARD - k * b
  const wrong = shuffle(bedaPengecoh(b, k * b)).slice(0, c.count - 1)
  return { mode: 'beda', n: BOARD, a, b, k, path: Array.from({ length: k + 1 }, (_, j) => a + j * b), given: [a, a + b, a + 2 * b], opts: shuffle([b, ...wrong]) }
}

const SUKU = {
  5: { type: 'next', lo: 2, hi: 6, neg: false, count: 4 }, 6: { type: 'next', lo: 2, hi: 6, neg: true, count: 5 },
  7: { type: 'leap', lo: 3, hi: 8, neg: true, count: 5 }, 8: { type: 'far', lo: 3, hi: 9, neg: true, count: 6 },
  9: { type: 'leap', lo: 3, hi: 8, neg: true, count: 6 }, 10: { type: 'mix', lo: 5, hi: 12, neg: true, count: 7 }
}
// SATU barisan aritmatika utuh per level (tidak berganti selama level berjalan), 2 suku misterius (t1, t2).
// Aturan matematika: semua batu SELAIN t1 dan t2 langsung tertulis angkanya (termasuk finish), dan katak mulai di f0 >= 2
// sehingga U(f0-1) dan U(f0) berdampingan dan sudah terbuka -> beda b = U(f0) - U(f0-1) bisa dihitung murni.
// Struktur: t2 = t1 + 2, batu berangka m = t1 + 1 di antaranya, finish tf = t2 + 1.
// Contoh 6 suku: U1=17, U2=19, U3=?, U4=23, U5=?, U6=27 (finish). Katak di U2.
//   Tahap 1: cari U3. Benar -> katak melompat satu-satu: U2 -> U3 -> U4 (siaga).
//   Tahap 2: cari U5. Benar -> katak melompat satu-satu: U4 -> U5 -> U6 (finish).
function sukuRound(level) {
  const c = SUKU[level]
  const type = c.type === 'mix' ? pick(['leap', 'far']) : c.type
  let b = r(c.lo, c.hi); if (c.neg && Math.random() < 0.5) b = -b
  let f0, t1
  if (type === 'next') { f0 = r(2, 3); t1 = f0 + 1 }
  else if (type === 'leap') { f0 = r(2, 3); t1 = f0 + r(2, 3) }
  else { f0 = 2; t1 = r(5, 7) }
  const m = t1 + 1, t2 = t1 + 2, tf = t2 + 1
  const a = b < 0 ? -b * (tf - 1) + r(3, 15) : r(2, 20), val = (i) => a + (i - 1) * b
  const cells = Array.from({ length: tf }, (_, k) => {
    const i = k + 1
    if (i === tf) return { i, kind: 'finish', v: val(i) }
    if (i === t1) return { i, kind: 't1', v: val(i) }
    if (i === t2) return { i, kind: 't2', v: val(i) }
    return { i, kind: 'known', v: val(i) }
  })
  const frogAt = f0 - 1, c1 = t1 - 1, cm = m - 1, c2 = t2 - 1, finishIdx = tf - 1
  const range = (x, y) => Array.from({ length: y - x + 1 }, (_, k) => x + k)
  const after = ` Kalau benar, katak melompat satu-satu ke U${t1}, lalu lanjut ke U${m}.`
  const adj = `Dua batu berdampingan U${f0 - 1} dan U${f0} sudah terbuka, jadi beda bisa kamu cari.`
  let text1, hint1
  if (type === 'next') { text1 = `Tahap 1 dari 2. Katak berada di batu U${f0}. ${adj} Berapa angka di batu U${t1}?` + after; hint1 = `Beda = U${f0} − U${f0 - 1}. Lalu tambahkan beda ke angka di tempat katak berdiri.` }
  else if (type === 'leap') { text1 = `Tahap 1 dari 2. Katak berada di batu U${f0}. ${adj} Berapa angka di batu U${t1}?` + after; hint1 = `Cari beda dulu dari dua batu berdampingan. Dari U${f0} ke U${t1} ada ${t1 - f0} lompatan, jadi tambahkan beda sebanyak ${t1 - f0} kali.` }
  else { text1 = `Tahap 1 dari 2. Katak berada di batu U${f0}. Diketahui a = ${f(a)} dan b = ${f(b)}. Berapa angka di batu U${t1}?` + after; hint1 = `Pakai Uₙ = a + (n − 1)b dengan n = ${t1}.` }
  const text2 = `Tahap 2 dari 2. Katak siaga di batu U${m} (angkanya ${f(val(m))}). Berapa angka di batu U${t2}? Kalau benar, katak melompat ke U${t2}, lalu lompatan terakhir ke finish di U${tf}.`
  const hint2 = type === 'far' ? `Pakai Uₙ = a + (n − 1)b dengan n = ${t2}.` : `Tambahkan beda 1 kali ke angka di U${m}.`
  // Satu array barisan (cells) dipakai bersama Tahap 1 dan Tahap 2; hanya target pertanyaan yang berganti.
  return { mode: 'suku', type, cells, frogAt, finishIdx, b, count: c.count, tf,
    stages: [{ cell: c1, t: t1, target: val(t1), text: text1, hint: hint1, path: range(frogAt + 1, cm) },
             { cell: c2, t: t2, target: val(t2), text: text2, hint: hint2, path: [c2, finishIdx] }] }
}
export const frogRound = (level) => (level <= 4 ? bedaRound(level) : sukuRound(level))

// 1 batu benar + sisanya ranjau (angka pengecoh dari kesalahan umum)
export function frogOptions({ target, b, count }) {
  const cand = [target + b, target - b, target + 1, target - 1, target + 2, target - 2, target + 2 * b, target - 2 * b, target + b + 1, target - b - 1, target + b - 1, target - b + 1]
  const mines = shuffle([...new Set(cand)].filter((v) => v !== target)).slice(0, count - 1)
  return shuffle([target, ...mines])
}

// ===================== GAME 2: BRANKAS =====================
// Kode brankas = digit awal yang sudah diketahui + digit terakhir yang harus dicari dari soal barisan.
// [jenis, bLo, bHi, nLo, nHi, banyak digit yang dicari, banyak digit yang diketahui]
const V = [['seq', 2, 5, 5, 9, 2, 2], ['seq', 3, 7, 8, 13, 2, 2], ['story', 2, 6, 8, 14, 2, 2], ['story', 4, 9, 12, 20, 2, 3], ['neg', 2, 4, 7, 12, 2, 3],
  ['negseq', 3, 6, 8, 14, 2, 3], ['two', 3, 7, 10, 18, 2, 3], ['twoNeg', 3, 6, 10, 16, 2, 3], ['two', 5, 12, 20, 30, 3, 3], ['twoNegBig', 5, 10, 20, 35, 3, 3]]
const generic = 'Cari dulu a (angka pertama) dan b (perubahan tiap langkah). Kata "turun" atau "berkurang" berarti b negatif. Lalu pakai Uₙ = a + (n − 1)b.'

function buildVault(level, round) {
  const [kind, lo, hi, nlo, nhi, digits, known] = V[level - 1]
  const neg = kind === 'neg' || kind === 'negseq' || kind === 'twoNeg' || kind === 'twoNegBig'
  let b = r(lo, hi); if (neg) b = -b
  const n = r(nlo, nhi)
  const off = kind === 'twoNegBig' ? r(100, 400) : r(10, 40)
  const a = neg ? -b * (n - 1) + off : r(2, 30)
  let teks, hints = [generic, `Di soal ini a = ${f(a)} dan b = ${f(b)}. Masukkan ke Uₙ = a + (n − 1)b dengan n = ${n}.`]
  if (kind === 'seq' || kind === 'negseq') teks = `Tentukan suku ke-${n} dari barisan: ${[0, 1, 2].map((i) => f(a + i * b)).join(', ')}, ...`
  else if (kind === 'story') teks = round % 2
    ? `Agen Dimas menyimpan ${a} dokumen pada hari pertama, lalu menambah ${b} dokumen setiap hari. Berapa banyak dokumen pada hari ke-${n}?`
    : `Agen Rani menemukan sandi: angka pertama ${a}, lalu naik ${b} pada setiap langkah. Berapa angka pada langkah ke-${n}?`
  else if (kind === 'neg') teks = round % 2
    ? `Tangki rahasia berisi ${a} liter pada menit pertama, lalu berkurang ${-b} liter tiap menit. Berapa liter isi tangki pada menit ke-${n}?`
    : `Layar kunci menampilkan ${a}, lalu turun ${-b} setiap detik. Berapa angka yang tampil pada detik ke-${n}?`
  else {
    const p = r(2, 4), q = p + r(2, 4), X = a + (p - 1) * b, Y = a + (q - 1) * b
    teks = `Dalam barisan aritmatika, suku ke-${p} adalah ${f(X)} dan suku ke-${q} adalah ${f(Y)}. Tentukan suku ke-${n}.`
    hints = [`Selisih suku ke-${p} dan suku ke-${q} sama dengan ${q - p} kali beda. Cari b lebih dulu, lalu cari a.`,
      `b = (${f(Y)} − ${f(X)}) ÷ ${q - p} = ${f(b)}, lalu a = ${f(X)} − ${p - 1} × (${f(b)}) = ${f(a)}. Sekarang hitung U${n}.`]
  }
  return { teks, n, ans: a + (n - 1) * b, hints, digits, known }
}
export function vaultRound(level, round = 0) {
  let q
  for (let t = 0; t < 300; t++) { q = buildVault(level, round); if (String(q.ans).length === q.digits && q.ans > 0) break }
  const prefix = Array.from({ length: q.known }, (_, i) => (i === 0 ? r(1, 9) : r(0, 9)))
  return { ...q, prefix, code: prefix.join('') + q.ans }
}
