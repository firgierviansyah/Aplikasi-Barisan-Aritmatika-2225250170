import { useEffect, useRef, useState } from 'react'
import { materi } from '../data/content'
import { getProg, saveProg } from '../lib/storage'
import ArrowViz from './ArrowViz'
import FormulaViz from './FormulaViz'
import CaseStudy from './CaseStudy'
import Ask from './Ask'
import PopQuiz from './PopQuiz'
import Icon from './Icon'
import M from './M'
import FormulaBox from './FormulaBox'
const Viz = { arrow: ArrowViz, formula: FormulaViz, case: CaseStudy }
export default function Learn({ go }) {
  const [done, setDone] = useState(getProg())
  const first = done.findIndex((d) => !d)
  const [i, setI] = useState(first === -1 ? 0 : first)
  const top = useRef(null), mounted = useRef(false)
  const open = (k) => k === 0 || done[k - 1]
  // Pindah materi: hanya satu modul aktif yang dirender. Setelah pindah, tampilan digulir ke awal modul
  // supaya tidak terlihat seperti materi baru "menempel" di bawah materi sebelumnya.
  const goTo = (k) => { if (k !== i && k >= 0 && k < materi.length && open(k)) setI(k) }
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return }
    top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [i])
  const m = materi[i], V = Viz[m.viz]
  const pass = () => { const d = [...done]; d[i] = true; setDone(d); saveProg(d) }
  const last = i === materi.length - 1
  return (
    <div className="learn" ref={top}>
      <ol className="stepper">
        {materi.map((x, k) => (
          <li key={x.id}>
            <button disabled={!open(k)} className={(k === i ? 'on ' : '') + (done[k] ? 'done' : '')} onClick={() => goTo(k)} aria-current={k === i ? 'step' : undefined}>
              <span className="badge">{done[k] ? <Icon n="check" size={16} /> : !open(k) ? <Icon n="lock" size={16} /> : k + 1}</span>
              <span>{x.judul}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="slide-count" aria-live="polite">Materi {i + 1} dari {materi.length}</p>
      <div key={m.id} className="module">
      <article className="panel enter">
        <h2>{m.judul}</h2>
        <p><M>{m.ringkas}</M></p>
        <ul className="points">{m.poin.map((p) => <li key={p}><M>{p}</M></li>)}</ul>
        {m.rumus.map((r) => <FormulaBox key={r.isi} {...r} />)}
        <V />
        <p className="tip"><Icon n="spark" size={18} /> <span><M>{m.tip}</M></span></p>
      </article>
      <Ask materi={m} />
      <section className="panel surprise">
        <h2><Icon n="spark" size={20} /> Kuis Kejutan</h2>
        {done[i] ? <p className="fb ok">Kuis kejutan tahap ini sudah lulus.</p> : <PopQuiz key={m.id} makers={m.pop} onPass={pass} passLabel={last ? 'Selesaikan semua tahap' : 'Buka tahap berikutnya'} />}
      </section>
      </div>
      <div className="nav">
        {i > 0 && <button className="btn ghost" onClick={() => goTo(i - 1)}><Icon n="back" size={18} /> Sebelumnya</button>}
        {!last && <button className="btn" disabled={!done[i]} onClick={() => goTo(i + 1)}>{done[i] ? '' : <Icon n="lock" size={18} />} Lanjut ke Materi Berikutnya {done[i] && <Icon n="next" size={18} />}</button>}
        {last && done[i] && <button className="btn" onClick={() => go('quiz')}>Ke Kuis Utama <Icon n="next" size={18} /></button>}
      </div>
      {!done[i] && !last && <p className="muted small-note">Selesaikan Kuis Kejutan untuk membuka tombol ini.</p>}
    </div>
  )
}
