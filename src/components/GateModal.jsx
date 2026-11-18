import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import M from './M'
import Icon from './Icon'
import { KakAritma } from './Mascot'
import { sfx } from '../lib/sound'

// Kuis Kejutan berbentuk modal "gerbang" (gating) yang dipandu Kak Aritma.
// - Halaman di belakang dikunci: backdrop gelap, scroll dimatikan, isi halaman tidak bisa difokus (inert).
// - Siswa harus menjawab benar BERURUTAN semua soal (streak). Satu jawaban salah mereset streak ke 0.
// - Jika salah: jawaban benar tidak langsung dibuka. Kak Aritma memberi petunjuk bertahap
//   (petunjuk 1 → 2 → 3 → pembahasan), baru siswa boleh mengulang dengan angka soal yang baru.
// - Gembok terbuka (onPass dipanggil) hanya setelah streak penuh.
// - Lulus yang melengkapi Materi 1 dan 2 (fresh) = Zona Game terbuka: pilihan Mainkan Game / Tetap di Menu Materi.
// - Lulus materi terakhir (last) = Kuis Utama terbuka: pilihan Mulai Kuis Utama / Mainkan Game / Tetap di Menu Materi.
export default function GateModal({ materi, nextTitle, user, last, fresh = false, onPass, onFinish, onStartQuiz, onPlayGame, onClose }) {
  const makers = materi.pop, total = makers.length, hints = materi.hints
  const nama = (user?.nama || 'Teman').split(' ')[0]
  const [i, setI] = useState(0)            // soal ke-berapa sekaligus panjang streak saat ini
  const [q, setQ] = useState(() => makers[0]())
  const [pick, setPick] = useState(null)
  const [stage, setStage] = useState(0)   // tahap remediasi: 0..hints.length (terakhir = pembahasan)
  const [round, setRound] = useState(0)   // sudah berapa kali mengulang dari awal
  const [passed, setPassed] = useState(false)
  const box = useRef(null), timer = useRef(null)

  const benar = pick !== null && pick === q.a
  const salah = pick !== null && !benar

  // Kunci halaman: scroll mati, latar tidak bisa difokus/dibaca pembaca layar, fokus pindah ke modal.
  useEffect(() => {
    const html = document.documentElement, body = document.body, root = document.getElementById('root')
    const prev = { h: html.style.overflow, b: body.style.overflow, p: body.style.paddingRight }
    const sw = window.innerWidth - html.clientWidth
    html.style.overflow = 'hidden'; body.style.overflow = 'hidden'
    if (sw > 0) body.style.paddingRight = sw + 'px'   // cegah halaman "melompat" saat scrollbar hilang
    root?.setAttribute('inert', ''); root?.setAttribute('aria-hidden', 'true')
    const before = document.activeElement
    box.current?.focus()
    return () => {
      html.style.overflow = prev.h; body.style.overflow = prev.b; body.style.paddingRight = prev.p
      root?.removeAttribute('inert'); root?.removeAttribute('aria-hidden')
      try { before?.focus?.() } catch { /* abaikan */ }
    }
  }, [])
  useEffect(() => () => clearTimeout(timer.current), [])

  // X/Esc: sebelum lulus = kembali ke materi (gembok tetap terkunci); sesudah lulus yang membuka Kuis & Game = "Tetap di Menu Materi" (lanjut ke materi berikutnya).
  const dismiss = () => onClose(passed)

  // Esc menutup; Tab dikurung di dalam modal.
  const onKey = (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); dismiss(); return }
    if (e.key !== 'Tab') return
    const f = [...box.current.querySelectorAll('button:not(:disabled),[href],input,[tabindex]:not([tabindex="-1"])')]
    if (!f.length) { e.preventDefault(); return }
    const a = document.activeElement
    if (e.shiftKey && (a === f[0] || a === box.current)) { e.preventDefault(); f[f.length - 1].focus() }
    else if (!e.shiftKey && a === f[f.length - 1]) { e.preventDefault(); f[0].focus() }
  }

  const choose = (k) => {
    if (pick !== null || passed) return
    setPick(k)
    if (k === q.a) {
      sfx.good()
      timer.current = setTimeout(() => {
        if (i + 1 >= total) { setPassed(true); sfx.open(); onPass() }
        else { setI(i + 1); setQ(makers[i + 1]()); setPick(null) }
      }, 1100)
    } else { sfx.bad(); setStage(0) }
  }
  const restart = () => { setI(0); setQ(makers[0]()); setPick(null); setStage(0); setRound((r) => r + 1) }

  // Ucapan dan ekspresi Kak Aritma mengikuti keadaan.
  let mood = 'senyum', say
  if (passed && fresh) { mood = 'semangat'; say = `Selamat, ${nama}! Dua materi awal sudah kamu selesaikan, jadi gembok Zona Game kini terbuka. Mau langsung bermain, atau lanjut ke Materi 3? Kuis Utama akan terbuka setelah Materi 3 selesai.` }
  else if (passed && last) { mood = 'semangat'; say = `Selamat, ${nama}! Seluruh modul materi sudah kamu selesaikan, jadi gembok Kuis Utama kini terbuka. Mau ke mana dulu? Zona Game juga siap kamu mainkan.` }
  else if (passed) { mood = 'semangat'; say = `Hebat, ${nama}! Semua jawabanmu benar berturut-turut. Gemboknya terbuka, kamu siap lanjut.` }
  else if (salah) { mood = 'berpikir'; say = stage === 0 ? `Belum tepat, tidak apa-apa. Salah itu bagian dari belajar. Streak kembali ke 0, jadi kita pahami dulu pelan-pelan.` : stage < hints.length ? 'Bagus, terus ikuti petunjuknya ya.' : 'Nah, sekarang lihat pembahasannya, lalu coba lagi dengan soal baru.' }
  else if (benar) { mood = 'semangat'; say = i + 1 >= total ? 'Tepat sekali! Itu soal terakhir.' : 'Tepat! Satu soal lagi untuk menjaga streak-mu.' }
  else if (i > 0) { mood = 'semangat'; say = 'Mantap, streak-mu terjaga! Soal berikutnya sedikit lebih menantang.' }
  else if (round > 0) say = 'Siap mencoba lagi? Angkanya sudah berganti, jadi hitung ulang dengan tenang.'
  else say = `Halo, ${nama}! Sebelum membuka ${last ? 'penutup materi' : nextTitle}, jawab ${total} soal kejutan dengan benar secara berurutan. Kakak temani, ya!`

  const nStage = hints.length
  const choices = fresh || last   // setelah lulus: tampilkan tiga pilihan navigasi
  return createPortal(
    <div className="gate-back">
      <div className="gate" role="dialog" aria-modal="true" aria-labelledby="gate-t" tabIndex={-1} ref={box} onKeyDown={onKey}>
        <header className="gate-head">
          <span className={'gate-lock' + (passed ? ' open' : '')}><Icon n={passed ? (choices ? 'unlock' : 'check') : 'lock'} size={22} /></span>
          <div><small>Kuis Kejutan · {materi.judul}</small><h2 id="gate-t">{passed ? (last ? 'Kuis Utama terbuka!' : fresh ? 'Zona Game terbuka!' : 'Gembok terbuka!') : 'Buka gemboknya dulu, yuk'}</h2></div>
          <button className="gate-x" aria-label={passed && choices ? 'Tetap di menu materi' : passed ? 'Tutup' : 'Kembali ke materi'} onClick={dismiss}><Icon n="x" size={20} /></button>
        </header>

        <div className="gate-ka">
          <KakAritma mood={mood} wave={false} />
          <div className="gate-say" role="status" aria-live="polite"><M>{say}</M></div>
        </div>

        <div className="gate-streak" aria-label={`Streak benar ${passed ? total : salah ? 0 : i} dari ${total}`}>
          <span>Streak</span>
          {Array.from({ length: total }, (_, k) => <i key={k} className={!salah && (k < i || passed || (k === i && benar)) ? 'on' : k === i && salah ? 'x' : ''} />)}
          <b>{passed ? total : salah ? 0 : i + (benar ? 1 : 0)}/{total}</b>
        </div>

        {!passed && (
          <div className="gate-body" key={`${round}-${i}`}>
            <p className="muted gate-tag">Soal {i + 1} dari {total} · {i === 0 ? 'Dasar' : 'Tantangan'}{round ? ` · percobaan ke-${round + 1}` : ''}</p>
            <p className="q"><M>{q.q}</M></p>
            {q.o.map((t, k) => (
              <button key={k} onClick={() => choose(k)} disabled={pick !== null}
                className={'opt' + (benar && k === pick ? ' ok' : '') + (salah && k === pick ? ' bad' : '')}>
                <i>{String.fromCharCode(65 + k)}</i><span><M>{t}</M></span>
              </button>
            ))}
            {benar && <p className="fb ok">Benar!</p>}

            {salah && (
              <div className="gate-fix" aria-live="polite">
                <h3>Mari kita pahami lagi</h3>
                <ol>
                  {hints.slice(0, Math.min(stage + 1, nStage)).map((h, k) => <li key={k}><span className="tag-h">Petunjuk {k + 1}</span><M>{h}</M></li>)}
                </ol>
                {stage >= nStage && (
                  <div className="fb ok gate-sol"><b>Pembahasan:</b> <M>{q.e}</M><br />Jawaban yang tepat: <b>{String.fromCharCode(65 + q.a)}. <M>{q.o[q.a]}</M></b></div>
                )}
                {stage < nStage
                  ? <button className="btn small ghost" onClick={() => setStage(stage + 1)}>{stage < nStage - 1 ? 'Petunjuk berikutnya' : 'Lihat pembahasan'}</button>
                  : <button className="btn block" onClick={restart}>Ulangi kuis dari awal</button>}
              </div>
            )}
          </div>
        )}

        {passed && !choices && (
          <div className="gate-body center" key="p-materi">
            <button className="btn block" onClick={onFinish}>Buka materi berikutnya <Icon n="next" size={18} /></button>
          </div>
        )}

        {passed && choices && (
          <div className="gate-body center" key="p-unlock" role="group" aria-label="Pilihan setelah gembok terbuka">
            <ul className="gate-games">
              {last && <li><Icon n="target" size={22} /><span><b>Kuis Utama</b><small>8 soal pilihan ganda, nilainya masuk Analisis Nilai</small></span></li>}
              <li><Icon n="game" size={22} /><span><b>Zona Game</b><small>Katak Penjelajah dan Misteri Brankas, 10 level masing-masing</small></span></li>
            </ul>
            <div className="gate-actions">
              {last && <button className="btn block" onClick={onStartQuiz}><Icon n="target" size={18} /> Mulai Kuis Utama</button>}
              <button className={'btn block' + (last ? '' : '')} onClick={onPlayGame}><Icon n="game" size={18} /> Mainkan Game</button>
              <button className="btn block ghost" onClick={() => onClose(true)}><Icon n="book" size={18} /> Tetap di Menu Materi</button>
            </div>
            {!last && <p className="muted gate-tag">Materi berikutnya juga sudah terbuka di menu materi.</p>}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
