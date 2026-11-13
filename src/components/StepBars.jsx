import { f } from '../data/content'
// Grafik loncatan: tinggi batang = nilai suku.
export default function StepBars({ a, b, n, highlightLast = false }) {
  const vals = Array.from({ length: n }, (_, i) => a + i * b)
  const W = 360, H = 128, P = 18, max = Math.max(0, ...vals), min = Math.min(0, ...vals), span = max - min || 1
  const slot = (W - 2 * P) / n, bw = Math.min(36, slot - 5), y0 = P + (max / span) * (H - 2 * P)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="bars" role="img" aria-label="Grafik loncatan nilai suku">
      <line x1={P / 2} x2={W - P / 2} y1={y0} y2={y0} className="base" />
      {vals.map((v, i) => {
        const h = Math.max((Math.abs(v) / span) * (H - 2 * P), 2), x = P + i * slot + (slot - bw) / 2, y = v >= 0 ? y0 - h : y0
        const last = highlightLast && i === n - 1, label = n <= 8 || last
        return (
          <g key={i} className={'bar' + (v < 0 ? ' neg' : '') + (last ? ' last' : '')}>
            <rect x={x} y={y} width={bw} height={h} rx="6" />
            {label && <text x={x + bw / 2} y={v >= 0 ? y - 4 : y + h + 11}>{f(v)}</text>}
          </g>
        )
      })}
    </svg>
  )
}
