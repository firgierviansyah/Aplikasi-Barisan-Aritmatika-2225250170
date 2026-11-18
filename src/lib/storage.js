import { tidy, normName, normSchool, sameSchool, schoolDistance } from './identity.js'

// Semua data belajar & game disimpan per siswa. Kunci unik = nama (dinormalisasi) + sekolah (dinormalisasi):
//   ba_data::<nama>::<sekolah>::<jenis data>
const ACC = 'ba_accounts', SES = 'ba_session'
const LEGACY = { scores: 'ba_scores', progress: 'ba_progress', games: 'ba_games' }

const read = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d } catch { return d } }
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true } catch { return false } }
const del = (k) => { try { localStorage.removeItem(k) } catch { /* abaikan */ } }
const accounts = () => { const a = read(ACC, []); return Array.isArray(a) ? a : [] }
const session = () => { try { return localStorage.getItem(SES) } catch { return null } }
const dk = (name) => { const id = session(); return id ? `ba_data::${id}::${name}` : null }
const mine = (name, d) => { const k = dk(name); return k ? read(k, d) : d }
const put = (name, v) => { const k = dk(name); if (k) write(k, v) }
const drop = (name) => { const k = dk(name); if (k) del(k) }

function moveLegacy(id) {
  for (const [name, key] of Object.entries(LEGACY)) {
    let raw = null
    try { raw = localStorage.getItem(key) } catch { /* abaikan */ }
    if (raw !== null) { try { localStorage.setItem(`ba_data::${id}::${name}`, raw) } catch { /* abaikan */ } del(key) }
  }
}

function findAccount(list, nN, sN) {
  const exact = list.find((a) => a.nN === nN && a.sN === sN)
  if (exact) return { acc: exact, fuzzy: false }
  const near = list.filter((a) => a.nN === nN && sameSchool(a.sN, sN)).sort((x, y) => schoolDistance(x.sN, sN) - schoolDistance(y.sN, sN))
  return near.length ? { acc: near[0], fuzzy: true } : { acc: null, fuzzy: false }
}

// Masuk: mencari akun yang sama (nama persis setelah normalisasi + sekolah sama/mirip). Jika tidak ada, membuat akun baru.
export function loginStudent({ nama, kelas, sekolah }) {
  const nN = normName(nama), sN = normSchool(sekolah), list = accounts()
  const { acc: found } = findAccount(list, nN, sN)
  let acc = found, isNew = false
  if (!acc) {
    isNew = true
    acc = { id: `${nN}::${sN}`, nama: tidy(nama), sekolah: tidy(sekolah), kelas: tidy(kelas), nN, sN, created: Date.now(), last: Date.now() }
    list.push(acc)
  } else { acc.kelas = tidy(kelas); acc.last = Date.now() }
  write(ACC, list)
  try { localStorage.setItem(SES, acc.id) } catch { /* abaikan */ }
  if (isNew && list.length === 1) moveLegacy(acc.id)
  // 'fuzzy' = akun lama ditemukan tetapi penulisan sekolah berbeda dari yang tersimpan (untuk pemberitahuan ramah)
  return { acc, isNew, fuzzy: !isNew && tidy(sekolah).toLowerCase() !== acc.sekolah.toLowerCase() }
}

export function getUser() {
  // Pengguna lama (sebelum sistem akun): ubah menjadi akun dan pindahkan datanya.
  const old = read('ba_user', null)
  if (old) {
    if (old.nama && old.sekolah && accounts().length === 0 && !session()) loginStudent(old)
    del('ba_user')
  }
  const id = session()
  return id ? accounts().find((a) => a.id === id) || null : null
}
export const logout = () => { try { localStorage.removeItem(SES) } catch { /* data siswa tetap aman */ } }

// ----- Nilai kuis -----
export const getScores = () => mine('scores', [])
export const addScore = (s) => put('scores', [...getScores(), { ...s, date: new Date().toISOString() }])
export const clearScores = () => drop('scores')

// ----- Progres belajar terkunci -----
export const getProg = () => { const p = mine('progress', null); return Array.isArray(p) && p.length === 3 ? p : [false, false, false] }
export const saveProg = (p) => put('progress', p)
export const resetProg = () => drop('progress')
// Zona Game terbuka setelah DUA materi awal selesai; Kuis Utama baru terbuka setelah ketiga materi selesai.
export const gamesOpen = () => { const p = getProg(); return !!(p[0] && p[1]) }
export const quizOpen = () => getProg().every(Boolean)

// ----- Game: bintang per level (level terbuka diturunkan dari sini) + riwayat -----
export const getGames = () => { const g = mine('games', {}); return g && typeof g === 'object' ? g : {} }
export const starsOf = (g) => { const a = getGames()[g]; return Array.isArray(a) && a.length === 10 ? a : Array.from({ length: 10 }, (_, i) => (Array.isArray(a) ? a[i] || 0 : 0)) }
export const saveStars = (g, l, s) => { const all = getGames(), a = [...starsOf(g)]; a[l - 1] = Math.max(a[l - 1] || 0, s); all[g] = a; put('games', all) }
export const getHistory = () => { const h = mine('history', []); return Array.isArray(h) ? h : [] }
export const addPlay = (g, level, result, stars = 0) => put('history', [{ g, level, result, stars, date: new Date().toISOString() }, ...getHistory()].slice(0, 100))
