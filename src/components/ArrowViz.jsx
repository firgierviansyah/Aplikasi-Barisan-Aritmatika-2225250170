import { useState } from 'react'
import { f } from '../data/content'
import { U } from './M'
import StepBars from './StepBars'
export default function ArrowViz() {
  const [a, setA] = useState(3), [b, setB] = useState(2), [sel, setSel] = useState(0)
  const N = 5, X = (i) => 36 + i * 72, val = (i) => a + i * b
  const sign = b >= 0 ? '+' : '−'
  return (
    <div className="viz">
      <p>Geser a dan b untuk mengubah barisan. Setiap panah adalah satu loncatan sebesar b. Ketuk panah untuk melihat cara menghitungnya.</p>
      <svg viewBox="0 0 360 120" className="arrows">
        {Array.from({ length: N - 1 }, (_, i) => (
          <g key={i} className={'arc' + (sel === i ? ' on' : '')} role="button" tabIndex="0" aria-label={`Panah dari suku ${i + 1} ke ${i + 2}`}
            onClick={() => setSel(i)} onKeyDown={(e) => e.key === 'Enter' && setSel(i)}>
            <rect className="hit" x={(X(i) + X(i + 1)) / 2 - 34} y="-8" width="68" height="56" />
            <path d={`M${X(i) + 6} 42 Q${(X(i) + X(i + 1)) / 2} -6 ${X(i + 1) - 10} 38`} />
            <path d={`M${X(i + 1) - 10} 38 l-7 -2 M${X(i + 1) - 10} 38 l-2 -8`} />
            <rect x={(X(i) + X(i + 1)) / 2 - 22} y="2" width="44" height="22" rx="11" />
            <text x={(X(i) + X(i + 1)) / 2} y="17">{sign}{Math.abs(b)}</text>
          </g>
        ))}
        {Array.from({ length: N }, (_, i) => (
          <g key={i} className="node"><circle cx={X(i)} cy="64" r="22" /><text x={X(i)} y="70">{f(val(i))}</text>
            <text x={X(i)} y="106" className="sub">U<tspan dy="3">{i + 1}</tspan></text></g>
        ))}
      </svg>
      <p className="calc-line"><U n={sel + 2} /> − <U n={sel + 1} /> = {f(val(sel + 1))} − {f(val(sel))} = <b>{f(b)}</b></p>
      <div className="sliders">
        <label>Suku pertama a: <b>{a}</b><input type="range" min="-5" max="20" value={a} onChange={(e) => setA(+e.target.value)} /></label>
        <label>Beda b: <b>{f(b)}</b><input type="range" min="-6" max="8" value={b} onChange={(e) => setB(+e.target.value)} /></label>
      </div>
      <p className="cap">Grafik loncatan: makin tinggi batang, makin besar angkanya.</p>
      <StepBars a={a} b={b} n={5} />
      <p className="note">{b === 0 ? 'Beda 0: semua suku sama.' : b > 0 ? 'Beda positif: barisan naik.' : 'Beda negatif: barisan turun.'}</p>
    </div>
  )
}
