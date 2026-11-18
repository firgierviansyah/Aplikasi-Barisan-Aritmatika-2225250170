// Analisis perkembangan nilai untuk Kak Aritma: dari kuis (nilai 0-100) dan permainan terakhir di Zona Game.
// Aturan: 'good' bila nilai kuis terakhir >= 75, tidak turun >= 10 poin dari sesi sebelumnya, dan game terbaru tidak sering gagal.
const GAME = { frog: 'Katak Penjelajah', vault: 'Brankas Rahasia' }
const avg = (a) => Math.round(a.reduce((x, y) => x + y, 0) / a.length)

export function analyze(scores, history) {
  const pct = scores.map((s) => Math.round((s.skor / s.total) * 100))
  const last = pct.length ? pct[pct.length - 1] : null
  const prev = pct.length > 1 ? pct[pct.length - 2] : null
  const trend = prev === null ? 'baru' : last - prev >= 10 ? 'naik' : prev - last >= 10 ? 'turun' : 'stabil'
  const recent = history.slice(0, 3) // riwayat game: terbaru lebih dulu
  const gameFail = recent.length >= 2 && recent.filter((h) => h.result === 'over').length >= 2
  const g = history[0] || null
  const gameLine = g
    ? g.result === 'clear' ? `Di game terakhir (${GAME[g.g] || 'Zona Game'}, level ${g.level}) kamu berhasil dengan ${g.stars} bintang.`
      : `Di game terakhir (${GAME[g.g] || 'Zona Game'}, level ${g.level}) nyawamu habis sebelum level selesai.`
    : ''
  let level = 'none'
  if (last !== null) level = last >= 75 && trend !== 'turun' && !gameFail ? 'good' : 'low'
  else if (history.length) level = gameFail ? 'low' : 'good'
  const reason = last === null ? 'game' : trend === 'turun' ? 'turun' : last < 60 ? 'rendah' : last < 75 ? 'cukup' : 'game'
  return { pct, last, prev, trend, avgBefore: pct.length > 1 ? avg(pct.slice(0, -1)) : null, gameFail, gameLine, level, reason, hasGame: history.length > 0 }
}
