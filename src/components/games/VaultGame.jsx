import { useEffect, useMemo, useRef, useState } from 'react'
import { vaultRound } from '../../lib/gamegen'
import { sfx, buzz } from '../../lib/sound'
import { VaultArt, AgentArt } from './GameArt'
import FormulaBox from '../FormulaBox'
import Keypad from './Keypad'
import M from '../M'

// Kode brankas: digit awal sudah diketahui, digit terakhir adalah jawaban soal barisan aritmatika.
function Code({ prefix, digits, val, open, ans }) {
  return (
    <div className={'code' + (open ? ' open' : '')} role="img" aria-label={`Kode brankas: ${prefix.join('')} diikuti ${digits} digit yang dicari`}>
      {prefix.map((d, i) => <span key={'k' + i} className="cd known">{d}</span>)}
      {Array.from({ length: digits }, (_, i) => {
        const t = open ? String(ans)[i] : val[i]
        return <span key={'u' + i} className={'cd unk' + (t ? ' filled' : '')}>{t || '?'}</span>
      })}
    </div>
  )
}

export default function VaultGame({ level, round, onWrong, onRoundDone }) {
  const q = useMemo(() => vaultRound(level, round), [level, round])
  const [val, setVal] = useState('')
  const [open, setOpen] = useState(false)
  const [alarm, setAlarm] = useState(0)
  const [wrongN, setWrongN] = useState(0)
  const [note, setNote] = useState(null)
  const timers = useRef([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const change = (v) => { setVal(v); setNote(null) }
  const submit = () => {
    if (open) return
    if (val.length !== q.digits) { sfx.bad(); setNote(`Digit terakhir kode terdiri dari ${q.digits} angka. Hitung jawaban soalnya dulu, lalu masukkan.`); return }
    if (Number(val) === q.ans) { sfx.open(); buzz(20); setOpen(true); timers.current.push(setTimeout(onRoundDone, 1900)) }
    else { sfx.alarm(); buzz([60, 40, 60, 40, 60]); setAlarm((k) => k + 1); setWrongN((w) => w + 1); setVal(''); onWrong() }
  }
  return (
    <div className="g-grid">
      {alarm > 0 && <div key={alarm} className="alarm-flash" aria-hidden="true" />}
      <section className="vault-card">
        <div key={'v' + alarm} className={alarm ? 'shakey' : ''}><VaultArt open={open} alarm={alarm > 0 && !open} /></div>
        <div className="story">
          <div className="agent"><AgentArt /></div>
          <p><b>{q.known} angka pertama kode sudah diketahui. {q.digits} angka terakhir adalah jawaban soal ini:</b> <M>{q.teks}</M></p>
        </div>
        <FormulaBox mini judul="Rumus inti" isi="Uₙ = a + (n − 1)b" />
        {wrongN > 0 && !open && <p className="gmsg bad"><M>{q.hints[Math.min(wrongN - 1, 1)]}</M></p>}
      </section>
      <section className="ctrl-card">
        <p className="gq">{open ? 'Brankas terbuka! Dokumen rahasia aman.' : `Kode brankas (${q.known + q.digits} angka)`}</p>
        <Code prefix={q.prefix} digits={q.digits} val={val} open={open} ans={q.ans} />
        {note && <p className="gmsg bad">{note}</p>}
        <Keypad value={val} onChange={change} onSubmit={submit} submitLabel="Buka brankas" disabled={open} maxLen={q.digits} allowNeg={false} />
      </section>
    </div>
  )
}
