import { useEffect, useRef, useState } from 'react'
import M from './M'
import Icon from './Icon'
import { askGemini, friendly, chatPrompt } from '../lib/ai'

const CHIPS = ['Apa itu barisan aritmatika?', 'Bagaimana cara mencari beda?', 'Beri tips belajar matematika']

// Widget chat melayang. Riwayat chat (log) disimpan di App, jadi tidak hilang saat widget disembunyikan.
export default function FloatingChat({ user, halaman, log, setLog }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [busy, setBusy] = useState(false)
  const body = useRef(null), input = useRef(null)
  useEffect(() => { if (body.current) body.current.scrollTop = body.current.scrollHeight }, [log, open])
  useEffect(() => { if (open) input.current?.focus() }, [open])
  useEffect(() => { if (!open) return; const h = (e) => e.key === 'Escape' && setOpen(false); window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }, [open])

  const send = async (text) => {
    const t = text.trim()
    if (!t || busy) return
    const before = log, id = Date.now() + Math.random()
    // Gelembung jawaban dibuat kosong dulu (tampil "sedang mengetik"), lalu terisi kata per kata saat streaming.
    setLog((l) => [...l, { role: 'user', content: t }, { id, role: 'assistant', content: '', pending: true }]); setQ(''); setBusy(true)
    const patch = (fn) => setLog((l) => l.map((m) => (m.id === id ? fn(m) : m)))
    try {
      const jawab = await askGemini({ system: chatPrompt(user.nama.split(' ')[0], halaman), history: before, question: t, onText: (x) => patch((m) => ({ ...m, content: x })) })
      patch((m) => ({ ...m, content: jawab, pending: false }))
    } catch (e) {
      patch((m) => (m.content ? { ...m, pending: false } : { ...m, content: friendly(e), error: true, pending: false }))
    } finally { setBusy(false) }
  }
  if (!open) return <button className="fab" aria-label="Buka asisten belajar" onClick={() => setOpen(true)}><Icon n="chat" size={26} /><span>Tanya AI</span></button>
  return (
    <section className="chat-panel" role="dialog" aria-label="Asisten belajar">
      <header className="chat-head">
        <span className="av"><Icon n="spark" size={20} /></span>
        <div><b>Kak Aritma</b><small>Asisten belajarmu</small></div>
        <button className="hud-btn" aria-label="Tutup chat" onClick={() => setOpen(false)}><Icon n="x" size={20} /></button>
      </header>
      <div className="chat-body" ref={body}>
        <div className="bubble assistant">Halo, {user.nama.split(' ')[0]}! Aku Kak Aritma. Tanya apa saja ya, aku bantu dengan petunjuk langkah demi langkah.</div>
        {log.length === 0 && <div className="chips-row">{CHIPS.map((c) => <button key={c} type="button" className="chip" onClick={() => send(c)}>{c}</button>)}</div>}
        {log.map((m, i) => m.pending && !m.content
          ? <div key={m.id || i} className="bubble assistant typing" role="status" aria-label="Kak Aritma sedang mengetik"><i /><i /><i /></div>
          : <div key={m.id || i} className={'bubble ' + m.role + (m.error ? ' error' : '') + (m.pending ? ' streaming' : '')}><M>{m.content}</M></div>)}
      </div>
      <form className="chat-foot" onSubmit={(e) => { e.preventDefault(); send(q) }}>
        <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tulis pertanyaanmu…" aria-label="Pertanyaanmu" />
        <button className="btn small chat-send" disabled={busy || !q.trim()} aria-label="Kirim"><Icon n="send" size={18} /></button>
      </form>
    </section>
  )
}
