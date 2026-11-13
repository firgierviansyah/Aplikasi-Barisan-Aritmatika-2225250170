import { useEffect, useRef, useState } from 'react'
import { frogOptions } from '../../lib/gamegen'
import { sfx, buzz } from '../../lib/sound'
import { f } from '../../data/content'
import { MineArt } from './GameArt'
import Board, { colsFor } from './Board'
import M, { U } from '../M'

// Level cari suku: SATU barisan utuh (data.cells) dengan 2 tahap pertanyaan beruntun (currentStep 1 lalu 2).
// Semua batu selain dua suku misterius sudah tertulis angkanya, dan ada dua suku berdampingan yang terbuka untuk mencari beda.
// Katak SELALU melompat satu batu per lompatan (tidak teleportasi, tidak melompati banyak batu sekaligus).
// Tahap 1 benar -> katak melompat satu-satu: suku misterius 1 -> batu berangka berikutnya (siaga), lanjut ke tahap 2.
// Tahap 1 salah -> ulangi tahap 1 (nyawa berkurang), katak tidak bergerak.
// Tahap 2 benar -> katak melompat satu-satu: suku misterius 2 -> finish, level selesai (onRoundDone).
// Tahap 2 salah -> katak tertahan di batu aman sebelumnya, level berakhir dengan bintang parsial (onPartial).
const HOP = 760, GAP = 880 // durasi satu lompatan (ms) dan jeda antar-lompatan
export default function FrogSuku({ data, onWrong, onPartial, onRoundDone, onStep }) {
  const { cells, frogAt, stages, b, count } = data
  const [currentStep, setCurrentStep] = useState(1)
  const [pos, setPos] = useState(frogAt)
  const [rev, setRev] = useState([])
  const [phase, setPhase] = useState('pick') // pick | hop | done | failed
  const [opts, setOpts] = useState(() => frogOptions({ target: stages[0].target, b, count }))
  const [boom, setBoom] = useState(null)
  const [ouch, setOuch] = useState(0)
  const [msg, setMsg] = useState(null)
  const timers = useRef([])
  const later = (fn, ms) => { timers.current.push(setTimeout(fn, ms)) }
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const st = stages[currentStep - 1]

  const pick = (i) => {
    if (boom !== null || phase !== 'pick') return
    if (opts[i] === st.target) {
      setPhase('hop'); buzz(15)
      const last = st.path.length - 1
      st.path.forEach((c, n) => later(() => {
        setPos(c); sfx.hop(); buzz(10)
        const k = cells[c].kind
        if (k === 't1' || k === 't2') { setRev((r) => [...r, c]); setMsg({ t: 'good', s: `Benar! Katak mendarat di batu U${cells[c].i}.` }) }
        else if (k === 'finish') setMsg({ t: 'good', s: 'Lompatan terakhir menuju garis finish!' })
        else setMsg({ t: 'info', s: `Katak lanjut melompat ke batu U${cells[c].i}, yang angkanya sudah diketahui.` })
      }, n * GAP))
      const end = last * GAP + HOP
      if (currentStep === 1) {
        later(() => sfx.good(), end)
        later(() => {
          setCurrentStep(2); onStep?.(1)
          setOpts(frogOptions({ target: stages[1].target, b, count })); setPhase('pick')
          setMsg({ t: 'info', s: 'Katak siaga. Lanjut ke tahap 2, cari suku misterius berikutnya!' })
        }, end + 800)
      } else {
        later(() => { setPhase('done'); onStep?.(2); sfx.good(); setMsg({ t: 'good', s: 'Katak sampai di garis finish!' }) }, end + 100)
        later(onRoundDone, end + 1500)
      }
    } else if (currentStep === 1) {
      // Tahap 1 salah: wajib diulang sampai benar, katak belum bergerak.
      sfx.boom(); buzz([30, 40, 60]); setBoom(i); setOuch((k) => k + 1)
      setMsg({ t: 'bad', s: 'Duar! Batu itu berisi ranjau. Coba lagi tahap 1 ya.' })
      later(() => { onWrong(); setBoom(null); setOpts(frogOptions({ target: st.target, b, count })); setMsg({ t: 'info', s: st.hint }) }, 1300)
    } else {
      // Tahap 2 salah: katak tertahan di batu aman (checkpoint), level berakhir dengan bintang parsial.
      sfx.boom(); buzz([30, 40, 60]); setBoom(i); setOuch((k) => k + 1); setPhase('failed')
      setMsg({ t: 'bad', s: `Duar! Tahap 2 belum berhasil. Katak tertahan aman di batu U${cells[pos].i}.` })
      later(onPartial, 2200)
    }
  }
  const cell = (c, k) => {
    if (c.kind === 'gap') return <div key={k} className="bcell"><div className="gapc" aria-hidden="true">· · ·</div></div>
    const isT = c.kind === 't1' || c.kind === 't2'
    const shown = c.kind === 'known' || c.kind === 'finish' || (isT && rev.includes(k))
    const cur = isT && k === st.cell && !rev.includes(k)
    const cls = 'sstone' + (cur ? ' target' : '') + (!shown && !cur ? ' dim' : '')
    return (
      <div key={k} className="bcell">
        <div className={cls}>
          <b>{shown ? f(c.v) : '?'}</b><small><U n={c.i} /></small>
          {c.kind === 'finish' && <span className="pole" aria-label="Garis finish" />}
        </div>
      </div>
    )
  }
  return (
    <div className="g-grid">
      <section className="pond-card">
        <Board cols={colsFor(cells.length)} frogIdx={pos} ouchKey={ouch}>{cells.map(cell)}</Board>
        <div className="pips" aria-label={`Tahap ${currentStep} dari 2`}>
          <i className={currentStep > 1 ? 'on' : 'cur'} /><i className={currentStep > 1 ? (phase === 'done' ? 'on' : 'cur') : ''} /><span>menuju finish</span>
        </div>
        <p className="gq story-q"><M>{st.text}</M></p>
      </section>
      <section className="ctrl-card">
        {msg && <p className={'gmsg ' + msg.t}><M>{msg.s}</M></p>}
        <p className="gq">Pilih batu untuk <b><U n={st.t} /></b>. Awas ranjau!</p>
        <div className="choices">
          {opts.map((v, i) => (
            <button key={i} className={'stone-btn' + (boom === i ? ' boom' : '') + ((phase === 'hop' || phase === 'done') && v === st.target ? ' ok' : '')}
              disabled={phase !== 'pick' || boom !== null} onClick={() => pick(i)} aria-label={boom === i ? 'Ranjau' : `Batu ${f(v)}`}>
              {boom === i ? <MineArt /> : <b>{f(v)}</b>}{boom === i && <span className="burst" />}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
