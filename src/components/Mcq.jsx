import { useEffect, useRef, useState } from 'react'
import M from './M'
export default function Mcq({ item, onDone, retryLabel = 'Lanjut' }) {
  const [pick, setPick] = useState(null)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  const done = pick !== null, benar = pick === item.a
  const choose = (i) => { if (done) return; setPick(i); if (i === item.a) timer.current = setTimeout(() => onDone(true), 900) }
  return (
    <div className="mcq">
      <p className="q"><M>{item.q}</M></p>
      {item.o.map((t, i) => (
        <button key={i} onClick={() => choose(i)} disabled={done && i !== pick && i !== item.a}
          className={'opt' + (done && i === item.a ? ' ok' : '') + (done && i === pick && !benar ? ' bad' : '')}>
          <i>{String.fromCharCode(65 + i)}</i><span><M>{t}</M></span>
        </button>
      ))}
      {done && benar && <p className="fb ok">Benar! Lanjut sebentar lagi…</p>}
      {done && !benar && (
        <div className="fb bad"><b>Belum tepat.</b> Jawaban benar: {String.fromCharCode(65 + item.a)}. <M>{item.o[item.a]}</M>
          <p><M>{item.e}</M></p><button className="btn small" onClick={() => onDone(false)}>{retryLabel}</button></div>
      )}
    </div>
  )
}
