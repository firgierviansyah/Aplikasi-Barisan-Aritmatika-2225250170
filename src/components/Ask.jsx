import { useEffect, useRef, useState } from 'react'
import M from './M'
import Icon from './Icon'
import { askGemini, friendly, tutorPrompt } from '../lib/ai'

const CHIPS = ['Aku bingung, beri petunjuk pertama', 'Tolong jelaskan dengan contoh angka kecil']

// "Tanya Asisten" di halaman Belajar: tutor Gemini yang membimbing bertahap.
export default function Ask({ materi }) {
  const [log, setLog] = useState([])
  const [q, setQ] = useState('')
  const [busy, setBusy] = useState(false)
  const alive = useRef(true)
  const box = useRef(null)
  const stop = useRef(new AbortController())
  useEffect(() => { alive.current = true; stop.current = new AbortController(); return () => { alive.current = false; stop.current.abort() } }, [])
  useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight }, [log])

  const send = async (text) => {
    const t = text.trim()
    if (!t || busy) return
    const asked = log.filter((m) => m.role === 'user').length, before = log, id = Date.now() + Math.random()
    setLog((l) => [...l, { role: 'user', content: t }, { id, role: 'assistant', content: '', pending: true }]); setQ(''); setBusy(true)
    const patch = (fn) => { if (alive.current) setLog((l) => l.map((m) => (m.id === id ? fn(m) : m))) }
    try {
      const jawab = await askGemini({ system: tutorPrompt(materi, asked), history: before, question: t, signal: stop.current.signal, onText: (x) => patch((m) => ({ ...m, content: x })) })
      patch((m) => ({ ...m, content: jawab, pending: false }))
    } catch (e) {
      patch((m) => (m.content ? { ...m, pending: false } : { ...m, content: friendly(e), error: true, pending: false }))
    } finally { if (alive.current) setBusy(false) }
  }
  return (
    <section className="panel ask">
      <h3>Tanya asisten</h3>
      <p className="muted">Ada bagian yang kurang jelas? Tulis pertanyaanmu. Asisten akan membimbingmu langkah demi langkah dengan petunjuk, supaya kamu bisa menemukan jawabannya sendiri.</p>
      {log.length === 0 && <div className="chips-row">{CHIPS.map((c) => <button key={c} type="button" className="chip" onClick={() => send(c)}>{c}</button>)}</div>}
      <div className="ask-log" ref={box}>
        {log.map((m, i) => m.pending && !m.content
          ? <div key={m.id || i} className="bubble assistant typing" role="status" aria-label="Asisten sedang mengetik"><i /><i /><i /></div>
          : <div key={m.id || i} className={'bubble ' + m.role + (m.error ? ' error' : '') + (m.pending ? ' streaming' : '')}><M>{m.content}</M></div>)}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(q) }} className="row">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Contoh: Kenapa memakai (n − 1)?" aria-label="Pertanyaanmu" />
        <button className="btn small" disabled={busy || !q.trim()}><Icon n="send" size={16} /> Kirim</button>
      </form>
    </section>
  )
}
