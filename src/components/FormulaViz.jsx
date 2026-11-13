import { useState } from 'react'
import { f } from '../data/content'
import M, { U } from './M'
import FormulaBox from './FormulaBox'
import StepBars from './StepBars'
export default function FormulaViz() {
  const [a, setA] = useState(4), [b, setB] = useState(3), [n, setN] = useState(7)
  const loncat = n - 1
  return (
    <div className="viz">
      <p>Geser a, b, dan n. Lihat: dari suku pertama kita hanya melompat <b>n − 1</b> kali untuk sampai ke suku ke-n.</p>
      <div className="sliders">
        <label>a: <b>{a}</b><input type="range" min="1" max="20" value={a} onChange={(e) => setA(+e.target.value)} /></label>
        <label>b: <b>{f(b)}</b><input type="range" min="-5" max="8" value={b} onChange={(e) => setB(+e.target.value)} /></label>
        <label>n: <b>{n}</b><input type="range" min="1" max="15" value={n} onChange={(e) => setN(+e.target.value)} /></label>
      </div>
      <div className="jumps" aria-label={`${loncat} lompatan`}>
        <span className="dotn first">a</span>
        {Array.from({ length: loncat }, (_, i) => <span key={i} className="jump">{b >= 0 ? '+' : '−'}{Math.abs(b)}</span>)}
        <span className="dotn"><U n={n} /></span>
      </div>
      <FormulaBox mini judul="Rumus inti" isi="Uₙ = a + (n − 1)b" />
      <div className="steps">
        <p><U n={n} /> = {a} + ({n} − 1) × ({f(b)})</p>
        <p><U n={n} /> = {a} + {f(loncat * b)}</p>
        <p><b><U n={n} /> = {f(a + loncat * b)}</b></p>
      </div>
      <p className="cap">Grafik loncatan: batang paling kanan adalah suku ke-n.</p>
      <StepBars a={a} b={b} n={n} highlightLast />
    </div>
  )
}
