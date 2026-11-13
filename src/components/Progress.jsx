import { useState } from 'react'
import { getScores, clearScores } from '../lib/storage'
export default function Progress() {
  const [list, setList] = useState(getScores())
  if (!list.length) return <div className="panel center"><p>Belum ada nilai. Selesaikan satu sesi kuis untuk melihat grafiknya.</p></div>
  const nilai = list.map((s) => Math.round((s.skor / s.total) * 100))
  const rata = Math.round(nilai.reduce((x, y) => x + y, 0) / nilai.length)
  const W = 320, H = 160, P = 24, step = (W - 2 * P) / Math.max(nilai.length - 1, 1)
  const pts = nilai.map((v, i) => [P + (nilai.length === 1 ? (W - 2 * P) / 2 : i * step), H - P - (v / 100) * (H - 2 * P)])
  return (
    <>
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
