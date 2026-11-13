import { useState } from 'react'
import { soalUtama } from '../data/content'
import { addScore, getScores } from '../lib/storage'
import Mcq from './Mcq'
import Mascot from './Mascot'
import Icon from './Icon'

const JUMLAH = 8
// Alur: layar penyambut (intro) -> soal (play) -> hasil (done). Soal baru dibuat hanya saat tombol Mulai ditekan.
export default function Quiz() {
  const [phase, setPhase] = useState('intro')
  const [qs, setQs] = useState([])
  const [i, setI] = useState(0)
  const [skor, setSkor] = useState(0)
  const start = () => { setQs(soalUtama()); setI(0); setSkor(0); setPhase('play') }
  const next = (benar) => {
    const s = skor + (benar ? 1 : 0); setSkor(s)
    if (i + 1 >= qs.length) { addScore({ skor: s, total: qs.length }); setPhase('done') } else setI(i + 1)
  }

  if (phase === 'intro') {
    const last = getScores().slice(-1)[0]
    return (
      <div className="panel center quiz-intro">
        <Mascot />
        <h2>Siap untuk kuis?</h2>
        <p className="muted">Tarik napas dulu, santai saja. Kamu pasti bisa!</p>
        <ul className="facts">
          <li><Icon n="target" size={18} /> {JUMLAH} soal pilihan ganda</li>
          <li><Icon n="check" size={18} /> Tanpa timer, bebas berpikir</li>
          <li><Icon n="spark" size={18} /> Angka soal selalu baru</li>
        </ul>
        {last && <p className="muted">Nilai kuis terakhirmu: <b>{Math.round((last.skor / last.total) * 100)}</b></p>}
        <button className="btn" onClick={start}>Mulai Kuis <Icon n="next" size={18} /></button>
      </div>
    )
  }
  if (phase === 'done') return (
    <div className="panel center">
      <h2>{skor === qs.length ? 'Sempurna!' : skor >= qs.length / 2 ? 'Bagus sekali!' : 'Terus berlatih ya!'}</h2>
      <p className="big">{skor} / {qs.length}</p>
      <p className="muted">Nilaimu {Math.round((skor / qs.length) * 100)}. Hasil tersimpan di Analisis Nilai.</p>
      <button className="btn" onClick={() => setPhase('intro')}>Kembali ke awal kuis</button>
    </div>
  )
  return (
    <>
      <div className="bar"><i style={{ width: `${(i / qs.length) * 100}%` }} /></div>
      <p className="muted">Soal {i + 1} dari {qs.length}. Tidak ada batas waktu.</p>
      <div className="panel"><Mcq key={i} item={qs[i]} onDone={next} /></div>
    </>
  )
}
