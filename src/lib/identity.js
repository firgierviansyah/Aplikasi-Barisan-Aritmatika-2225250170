// Normalisasi & pencocokan identitas siswa (murni, tanpa akses browser).
const strip = (s) => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
export const tidy = (s) => String(s ?? '').trim().replace(/\s+/g, ' ')

// Nama: trim + huruf kecil + spasi ganda dirapikan + tanda baca dibuang. "Firgi" = "FIRGI" = "  firgi ".
export const normName = (s) => strip(tidy(s)).toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim()

const JENJANG = new Set(['sd', 'mi', 'smp', 'mts', 'sma', 'smk', 'ma'])
const EXPAND = { smpn: ['smp', 'negeri'], smps: ['smp', 'swasta'], mtsn: ['mts', 'negeri'], mtss: ['mts', 'swasta'], sman: ['sma', 'negeri'], smkn: ['smk', 'negeri'], sdn: ['sd', 'negeri'], min: ['mi', 'negeri'] }

// Sekolah: seragamkan singkatan (SMPN 1 = SMP Negeri 1 = SMP N 1), buang "no/nomor", rapikan.
export function normSchool(raw) {
  let s = strip(tidy(raw)).toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ')
  s = s.replace(/sekolah menengah pertama/g, 'smp').replace(/sekolah menengah atas/g, 'sma').replace(/sekolah menengah kejuruan/g, 'smk')
    .replace(/madrasah tsanawiyah/g, 'mts').replace(/\bsltp\b/g, 'smp')
    .replace(/([a-z])(\d)/g, '$1 $2').replace(/(\d)([a-z])/g, '$1 $2')
  const out = []
  for (const w of s.split(/\s+/).filter(Boolean)) {
    const prev = out[out.length - 1]
    if (w === 'no' || w === 'nomor') continue
    if (EXPAND[w]) out.push(...EXPAND[w])
    else if (w === 'neg' || w === 'negri' || w === 'ngeri') out.push('negeri')
    else if (w === 'n' && JENJANG.has(prev)) out.push('negeri')
    else if (w === 's' && JENJANG.has(prev)) out.push('swasta')
    else out.push(w)
  }
  return out.join(' ')
}

export function lev(a, b) {
  const m = a.length, n = b.length
  if (!m) return n
  if (!n) return m
  let prev = Array.from({ length: n + 1 }, (_, j) => j)
  for (let i = 1; i <= m; i++) {
    const cur = [i]
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    prev = cur
  }
  return prev[n]
}
const letters = (s) => s.replace(/\d+/g, '').replace(/\s+/g, '')
export const schoolDistance = (a, b) => lev(letters(a), letters(b))

// Sekolah sama jika: nomor identik, jenjang tidak bertukar (SMP != SMA), dan huruf hanya beda 1-2 karakter.
export function sameSchool(a, b) {
  if (a === b) return true
  const da = (a.match(/\d+/g) || []).join('-'), db = (b.match(/\d+/g) || []).join('-')
  if (da !== db) return false
  const ja = a.split(' ')[0], jb = b.split(' ')[0]
  if (ja !== jb) { if (JENJANG.has(ja) && JENJANG.has(jb)) return false; if (lev(ja, jb) > 1) return false }
  const la = letters(a), lb = letters(b), len = Math.min(la.length, lb.length)
  return lev(la, lb) <= (len >= 8 ? 2 : len >= 5 ? 1 : 0)
}
