import { useState } from 'react'
import { getScores, clearScores, getHistory, quizOpen } from '../lib/storage'
import { materi } from '../data/content'
import { analyze } from '../lib/analysis'
import { KakAritma } from './Mascot'
import Icon from './Icon'

// Kak Aritma menganalisis nilai kuis dan game terakhir. Nilai baik -> apresiasi dan motivasi.
// Nilai kurang/menurun -> bimbingan + tombol "Bagian mana yang masih membuatmu bingung?" yang membuka chat Kak Aritma.
function KakAnalysis({ a, nama, go, onConsult }) {
  const open = quizOpen()
  const good = a.level === 'good', none = a.level === 'none'
  const mood = good ? 'semangat' : none ? 'senyum' : 'berpikir'
  const paras = []
  if (none) {
    paras.push(`Halo, ${nama}! Belum ada nilai yang bisa Kakak analisis.`)
    paras.push(open ? 'Kerjakan satu sesi Kuis Utama atau mainkan satu level game, lalu kembali ke sini ya.' : 'Selesaikan dulu ketiga materi untuk membuka kuis, dan dua materi pertama untuk game. Kakak tunggu di sini!')
  } else if (good) {
    if (a.last !== null) paras.push(a.trend === 'naik' ? `Hebat, ${nama}! Nilai kuis terakhirmu ${a.last}, naik dari ${a.prev}. Usahamu terlihat jelas.` : a.trend === 'baru' ? `Awal yang bagus, ${nama}! Nilai kuis pertamamu ${a.last}.` : `Mantap, ${nama}! Nilai kuis terakhirmu ${a.last}, stabil di level yang baik.`)
    else paras.push(`Mantap, ${nama}! Permainanmu di Zona Game berjalan baik.`)
    if (a.gameLine) paras.push(a.gameLine)
    paras.push('Pertahankan caranya: baca soal dengan teliti, cari a dan b dulu, lalu periksa jawabanmu sebelum yakin. Tantang dirimu dengan level game yang lebih tinggi!')
  } else {
    if (a.reason === 'turun') paras.push(`${nama}, nilai kuis terakhirmu ${a.last}, turun dari ${a.prev} di sesi sebelumnya. Tidak apa-apa, naik turun itu wajar saat belajar.`)
    else if (a.reason === 'rendah') paras.push(`${nama}, nilai kuis terakhirmu ${a.last}. Itu tanda ada bagian yang belum kokoh, dan itu bisa kita perbaiki bersama.`)
    else if (a.reason === 'cukup') paras.push(`${nama}, nilai kuis terakhirmu ${a.last}. Sedikit lagi menuju hasil yang mantap!`)
    else paras.push(`${nama}, di beberapa game terakhir nyawamu habis sebelum level selesai. Mungkin ada langkah yang masih terasa membingungkan.`)
    if (a.gameLine && a.reason !== 'game') paras.push(a.gameLine)
    paras.push('Kakak tidak akan langsung memberi jawaban. Kita temukan bagian yang belum dikuasai lewat tiga langkah: mengamati data soal, menganalisis hubungannya, lalu menyimpulkan sendiri.')
  }
  const ctx = a.last !== null ? `nilai kuis terakhir ${a.last}${a.prev !== null ? `, sesi sebelumnya ${a.prev}` : ''}` : 'siswa baru bermain game'
  return (
    <section className={'panel ka-analysis ' + (good ? 'good' : none ? '' : 'low')} aria-label="Analisis Kak Aritma">
      <KakAritma mood={mood} wave={false} />
      <div>
        <h3>Analisis Kak Aritma {!none && a.trend !== 'baru' && a.last !== null && <span className={'trend ' + (a.trend === 'naik' ? 'up' : a.trend === 'turun' ? 'down' : '')}>{a.trend === 'naik' ? 'Naik' : a.trend === 'turun' ? 'Menurun' : 'Stabil'}</span>}</h3>
        <div className="say" role="status">{paras.map((t, k) => <p key={k}>{t}</p>)}</div>
        <div className="ka-btns">
          {!good && !none && <button className="btn" onClick={() => onConsult({ ctx, nama })}><Icon n="chat" size={18} /> Bagian mana yang masih membuatmu bingung?</button>}
          {none && <button className="btn" onClick={() => go(open ? 'quiz' : 'learn')}>{open ? 'Mulai Kuis Utama' : 'Mulai belajar'} <Icon n="next" size={18} /></button>}
          {good && <button className="btn" onClick={() => go('quiz')}><Icon n="target" size={18} /> Pertahankan di kuis berikutnya</button>}
          {good && <button className="btn ghost" onClick={() => go('game')}><Icon n="game" size={18} /> Tantang di Zona Game</button>}
          {!good && !none && <button className="btn ghost" onClick={() => go('learn')}><Icon n="book" size={18} /> Ulangi materi</button>}
        </div>
      </div>
    </section>
  )
}

export default function Progress({ user, go, onConsult }) {
  const [list, setList] = useState(getScores())
  const nama = (user?.nama || 'Teman').split(' ')[0]
  const a = analyze(list, getHistory())
  const consult = (x) => onConsult?.({ ...x, topics: materi.map((m) => m.judul) })
  if (!list.length) return (
    <>
      <KakAnalysis a={a} nama={nama} go={go} onConsult={consult} />
      <div className="panel center"><p>Belum ada nilai kuis. Selesaikan satu sesi kuis untuk melihat grafiknya.</p></div>
    </>
  )
  const nilai = a.pct
  const rata = Math.round(nilai.reduce((x, y) => x + y, 0) / nilai.length)
  const W = 320, H = 160, P = 24, step = (W - 2 * P) / Math.max(nilai.length - 1, 1)
  const pts = nilai.map((v, i) => [P + (nilai.length === 1 ? (W - 2 * P) / 2 : i * step), H - P - (v / 100) * (H - 2 * P)])
  return (
    <>
      <KakAnalysis a={a} nama={nama} go={go} onConsult={consult} />
      <div className="stats">
        <div><b>{list.length}</b><span>sesi kuis</span></div><div><b>{rata}</b><span>rata-rata</span></div><div><b>{Math.max(...nilai)}</b><span>tertinggi</span></div>
      </div>
      <div className="panel">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Grafik nilai kuis" className="chart">
          {[0, 50, 100].map((g) => { const y = H - P - (g / 100) * (H - 2 * P); return <g key={g}><line x1={P} x2={W - P} y1={y} y2={y} className="gl" /><text x="2" y={y + 4}>{g}</text></g> })}
          <polyline points={pts.map((p) => p.join(',')).join(' ')} className="line" />
          {pts.map((p, i) => <g key={i}><circle cx={p[0]} cy={p[1]} r="4.5" className="dot" /><text x={p[0]} y={p[1] - 9} textAnchor="middle">{nilai[i]}</text></g>)}
        </svg>
      </div>
      <div className="panel">
        <h3>Catatan sesi</h3>
        <ul className="log">
          {list.map((s, i) => <li key={i}><span>Sesi {i + 1} · {new Date(s.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span><b>{s.skor}/{s.total}</b></li>).reverse()}
        </ul>
        <button className="btn small ghost danger" onClick={() => { if (confirm('Hapus semua catatan nilai?')) { clearScores(); setList([]) } }}>Reset catatan nilai</button>
      </div>
    </>
  )
}
