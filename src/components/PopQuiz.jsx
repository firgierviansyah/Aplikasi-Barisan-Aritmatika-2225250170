import { useState } from 'react'
import Mcq from './Mcq'
import Icon from './Icon'
// Kuis kejutan ringkas: 2 soal (dasar lalu tantangan). Jika salah, muncul penjelasan
// lalu soal serupa dengan angka baru, sehingga siswa menuntaskan pemahamannya.
export default function PopQuiz({ makers, onPass, passLabel }) {
  const [i, setI] = useState(0)
  const [tries, setTries] = useState(0)
  const [q, setQ] = useState(() => makers[0]())
  const next = (benar) => {
    if (benar) { if (i + 1 < makers.length) setQ(makers[i + 1]()); setI(i + 1); setTries(0) }
    else { setQ(makers[i]()); setTries((t) => t + 1) }
  }
  if (i >= makers.length) return (
    <div className="result pass"><Icon n="check" size={28} /><h3>Kuis kejutan selesai</h3>
      <button className="btn" onClick={onPass}>{passLabel}</button></div>
  )
  return (
    <>
      <p className="muted">Soal {i + 1} dari {makers.length} · {i === 0 ? 'Dasar' : 'Tantangan'}{tries ? ` · soal serupa ke-${tries + 1}` : ''}</p>
      <Mcq key={`${i}-${tries}`} item={q} onDone={next} retryLabel="Coba soal serupa" />
    </>
  )
}
