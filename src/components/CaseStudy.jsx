import { useMemo, useState } from 'react'
import { scen, f } from '../data/content'
import M from './M'
export default function CaseStudy() {
  const [k, setK] = useState(0)
  const [seed, setSeed] = useState(0)
  const s = useMemo(() => scen(), [seed])
  const ans = s.a + (s.n - 1) * s.b
  const steps = [
    ['Diketahui', `a = ${f(s.a)}, b = ${f(s.b)}, n = ${s.n}`],
    ['Ditanya', `U${s.n}, yaitu ${s.tanya.replace('Berapa ', '').replace('?', '')}`],
    ['Rumus', 'Uₙ = a + (n − 1)b'],
    ['Hitung', `U${s.n} = ${f(s.a)} + (${s.n} − 1)·(${f(s.b)}) = ${f(s.a)} + ${f((s.n - 1) * s.b)} = ${f(ans)}`],
    ['Jawaban', `${s.sat(ans)}`]
  ]
  return (
    <div className="viz">
      <h3>{s.judul}</h3>
      <p className="story">{s.teks} {s.tanya}</p>
      <ol className="solve">
        {steps.slice(0, k).map(([t, v]) => <li key={t} className={t === 'Jawaban' ? 'final' : ''}><b>{t}</b><span><M>{v}</M></span></li>)}
      </ol>
      <div className="row">
        {k < steps.length && <button className="btn small" onClick={() => setK(k + 1)}>{k === 0 ? 'Mulai selesaikan' : 'Langkah berikutnya'}</button>}
        <button className="btn small ghost" onClick={() => { setSeed(seed + 1); setK(0) }}>Cerita lain</button>
      </div>
    </div>
  )
}
