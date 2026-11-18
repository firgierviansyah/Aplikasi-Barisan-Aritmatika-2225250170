import { useEffect, useRef, useState } from 'react'
import { materi } from '../data/content'
import { getProg, saveProg, gamesOpen } from '../lib/storage'
import ArrowViz from './ArrowViz'
import FormulaViz from './FormulaViz'
import CaseStudy from './CaseStudy'
import Ask from './Ask'
import GateModal from './GateModal'
import Icon from './Icon'
import M from './M'
import FormulaBox from './FormulaBox'
const Viz = { arrow: ArrowViz, formula: FormulaViz, case: CaseStudy }
export default function Learn({ go, user }) {
  const [done, setDone] = useState(getProg())
  const first = done.findIndex((d) => !d)
  const [i, setI] = useState(first === -1 ? 0 : first)
  const [gate, setGate] = useState(false)
  const [fresh, setFresh] = useState(false)
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
  // Gerbang kuis: tombol lanjut / gembok tahap berikutnya memunculkan modal Kuis Kejutan bila tahap ini belum lulus.
  // 'fresh' = lulus gerbang ini yang melengkapi Materi 1 dan 2, jadi Kuis & Game baru terbuka sekarang.
  const openGate = () => { setFresh(!gamesOpen() && [0, 1].every((k) => k === i || done[k])); setGate(true) }
  const next = () => (done[i] ? goTo(i + 1) : openGate())
  const onStep = (k) => { if (open(k)) goTo(k); else if (k === i + 1) openGate() }
  const closeGate = (passed) => { setGate(false); if (passed && !last) goTo(i + 1) }
  const finishGate = () => { setGate(false); if (!last) goTo(i + 1) }
  const startQuiz = () => { setGate(false); go('quiz') }
  const playGame = () => { setGate(false); go('game') }
  const gameOpen = !!(done[0] && done[1]), all = done.every(Boolean)
  return (
    <div className="learn" ref={top}>
      <ol className="stepper">
        {materi.map((x, k) => (
          <li key={x.id}>
            <button disabled={!open(k) && k !== i + 1} className={(k === i ? 'on ' : '') + (done[k] ? 'done ' : '') + (!open(k) ? 'locked' : '')} onClick={() => onStep(k)} aria-current={k === i ? 'step' : undefined}>
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
        {done[i]
          ? <p className="fb ok">Kuis kejutan tahap ini sudah lulus.</p>
          : <p className="muted">Sudah selesai membaca? Tekan tombol di bawah. Kak Aritma akan memberimu {m.pop.length} soal kejutan berurutan untuk membuka gembok {i === 1 ? 'Zona Game (sekaligus materi berikutnya)' : last ? 'Kuis Utama' : 'materi berikutnya'}.</p>}
      </section>
      </div>
      <div className="nav">
        {i > 0 && <button className="btn ghost" onClick={() => goTo(i - 1)}><Icon n="back" size={18} /> Sebelumnya</button>}
        {!last && <button className="btn" onClick={next}>{!done[i] && <Icon n="lock" size={18} />} Lanjut ke Materi Berikutnya {done[i] && <Icon n="next" size={18} />}</button>}
        {last && (done[i]
          ? <button className="btn" onClick={() => go('quiz')}>Ke Kuis Utama <Icon n="next" size={18} /></button>
          : <button className="btn" onClick={next}><Icon n="lock" size={18} /> Selesaikan Semua Tahap</button>)}
      </div>
      {!done[i] && <p className="muted small-note">Tombol ini membuka Kuis Kejutan. Jawab benar berurutan untuk membuka gemboknya.</p>}
      {gameOpen && (
        <section className="panel unlocked-bar" aria-label="Zona Game sudah terbuka">
          <span className="gate-lock open"><Icon n="unlock" size={22} /></span>
          <div><b>{all ? 'Kuis Utama dan Zona Game sudah terbuka' : 'Zona Game sudah terbuka'}</b><p className="muted">{all ? 'Kamu bisa langsung mencoba, atau tetap di sini untuk mengulang materi.' : 'Selesaikan Materi 3 untuk membuka Kuis Utama.'}</p></div>
          <div className="unlocked-actions">
            {all && <button className="btn small" onClick={() => go('quiz')}><Icon n="target" size={16} /> Kuis Utama</button>}
            <button className={'btn small' + (all ? ' ghost' : '')} onClick={() => go('game')}><Icon n="game" size={16} /> Game</button>
          </div>
        </section>
      )}
      {gate && <GateModal materi={m} nextTitle={last ? null : materi[i + 1].judul} user={user} last={last} fresh={fresh} onPass={pass} onFinish={finishGate} onStartQuiz={startQuiz} onPlayGame={playGame} onClose={closeGate} />}
    </div>
  )
}
