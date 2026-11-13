import { useEffect, useRef, useState } from 'react'
import { sfx, buzz } from '../../lib/sound'
import { f } from '../../data/content'
import { MineArt } from './GameArt'
import Board, { colsFor } from './Board'
import M from '../M'

// Level cari beda. Semua batu SERAGAM (tidak ada petunjuk visual letak ranjau). Ranjau baru terbuka
// ketika katak mendarat di batu yang salah.
export default function FrogBeda({ data, onWrong, onRoundDone, onRetry }) {
  const { n, a, b, k, path, given, opts } = data
  const [pos, setPos] = useState(a)
  const [phase, setPhase] = useState('ask') // ask | hop | boom | done
  const [chosen, setChosen] = useState(null)
  const [boomAt, setBoomAt] = useState(null)
  const [ouch, setOuch] = useState(0)
  const [msg, setMsg] = useState({ t: 'info', s: 'Semua batu terlihat sama dan ranjau tersembunyi. Hitung dulu selisih antar suku, lalu tekan tombol beda yang benar.' })
  const timers = useRef([])
  const later = (fn, ms) => { timers.current.push(setTimeout(fn, ms)) }
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const press = (d) => {
    if (phase !== 'ask') return
    setChosen(d); setPhase('hop')
    if (d === b) {
      setMsg({ t: 'good', s: `Beda ${b}! Katak melompat ${k} kali, tiap lompatan melewati ${b} batu.` })
      path.slice(1).forEach((p, i) => later(() => { setPos(p); sfx.hop(); buzz(10) }, 500 + i * 860))
      const end = 500 + (path.length - 1) * 860
      later(() => { setPhase('done'); sfx.good(); setMsg({ t: 'good', s: 'Selamat! Katak mendarat di batu finish dengan selamat.' }) }, end + 700)
      later(onRoundDone, end + 2000)
    } else {
      setMsg({ t: 'info', s: `Katak melompat sejauh ${d} batu…` })
      later(() => { setPos(a + d); sfx.hop(); buzz(10) }, 500)
      later(() => {
        sfx.boom(); buzz([30, 40, 60]); setBoomAt(a + d); setOuch((o) => o + 1); setPhase('boom')
        setMsg({ t: 'bad', s: `Duar! Batu ${a + d} berisi ranjau. Kamu memilih beda ${d}, padahal barisannya naik ${b} setiap langkah: ${a + b} − ${a} = ${b}. Beda adalah selisih dua suku yang berurutan.` })
      }, 1250)
    }
  }
  const lanjut = () => { onWrong(); onRetry() }
  return (
    <div className="g-grid">
      <section className="pond-card">
        <Board cols={colsFor(n)} frogIdx={pos - 1} ouchKey={ouch}>
          {Array.from({ length: n }, (_, i) => {
            const num = i + 1, bang = boomAt === num
            return (
              <div key={num} className="bcell">
                <div className={'sstone' + (bang ? ' boom' : '')}>
                  {bang ? <MineArt /> : <b>{num}</b>}
                  {bang && <span className="burst" />}
                  {num === n && <span className="pole" aria-label="Garis finish" />}
                </div>
              </div>
            )
          })}
        </Board>
        <p className="pond-tip">Barisan: <b>{given.join(', ')}, …</b> Katak mulai dari batu {a} dan harus sampai di batu finish ({n}).</p>
      </section>
      <section className="ctrl-card">
        <p className={'gmsg ' + msg.t}><M>{msg.s}</M></p>
        {phase === 'boom' ? <button className="btn block" onClick={lanjut}>Coba dengan soal baru</button> : (
          <>
            <p className="gq">Berapa <b>beda (b)</b> barisan ini?</p>
            <div className="bchoices">
              {opts.map((d) => <button key={d} className={'bbtn' + (chosen === d ? (d === b ? ' good' : ' bad') : '')} disabled={phase !== 'ask'} onClick={() => press(d)}>{f(d)}</button>)}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
