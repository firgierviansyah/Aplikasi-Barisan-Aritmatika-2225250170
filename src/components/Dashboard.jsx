import { useEffect, useState } from 'react'
import Icon from './Icon'
import Mascot from './Mascot'
import { getScores, getProg } from '../lib/storage'
import { materi } from '../data/content'
const menu = [
  ['learn', 'book', 'Belajar & Studi Kasus', 'Materi bertahap, visual panah, dan soal cerita', 'c1'],
  ['calc', 'calc', 'Kalkulator Barisan', 'Cari a, b, n, atau Uₙ dengan langkah runtut', 'c2'],
  ['quiz', 'target', 'Kuis Interaktif', 'Pilihan ganda tanpa timer, angka selalu baru', 'c3'],
  ['game', 'game', 'Zona Game', 'Belajar sambil bermain: 2 game, 10 level', 'c6'],
  ['progress', 'chart', 'Analisis Nilai', 'Grafik perkembangan dan catatan sesi', 'c4'],
  ['about', 'info', 'Tentang Aplikasi', 'Fungsi aplikasi dan pembuatnya', 'c5']
]
export default function Dashboard({ user, go }) {
  const prog = getProg(), done = prog.filter(Boolean).length, n = getScores().length
  const gameLocked = !(prog[0] && prog[1]), quizLocked = !prog.every(Boolean)   // Game: 2 materi awal. Kuis: ketiga materi.
  const [pop, setPop] = useState(null)   // 'quiz' | 'game' | null
  useEffect(() => { if (!pop) return; const h = (e) => e.key === 'Escape' && setPop(null); window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }, [pop])
  return (
    <>
      <section className="hero">
        <div>
          <p className="kicker">Halo, {user.nama.split(' ')[0]}</p>
          <h1>Siap menaklukkan barisan aritmatika?</h1>
          <p className="muted">{done === 3 ? 'Semua tahap belajar selesai. Uji dirimu di kuis dan game.' : `Tahap belajar selesai: ${done} dari 3.`}{n ? ` Sesi kuis: ${n}.` : ''}</p>
          <button className="btn" onClick={() => go('learn')}>{done ? 'Lanjutkan belajar' : 'Mulai belajar'}</button>
        </div>
        <Mascot mood="senyum" />
      </section>
      <div className="grid">
        {menu.map(([id, ic, t, d, c]) => {
          const lock = (id === 'game' && gameLocked) || (id === 'quiz' && quizLocked)
          return (
            <button key={id} className={'card ' + c + (lock ? ' locked' : '')} aria-disabled={lock} onClick={() => (lock ? setPop(id) : go(id))}>
              <span className="ic"><Icon n={ic} size={26} /></span><b>{t}</b><span className="muted">{lock ? (id === 'game' ? 'Terkunci. Selesaikan dua materi pertama untuk membukanya.' : 'Terkunci. Selesaikan ketiga materi untuk membukanya.') : d}</span>
              <span className="go"><Icon n={lock ? 'lock' : 'next'} size={18} /></span>
            </button>
          )
        })}
      </div>
      {pop && (
        <div className="modal-back" onClick={() => setPop(null)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="mt" onClick={(e) => e.stopPropagation()}>
            <div className="modal-ic"><Icon n="lock" size={30} /></div>
            <h2 id="mt">{pop === 'quiz' ? 'Kuis Interaktif' : 'Zona Game'} masih terkunci</h2>
            <p>{pop === 'game' ? 'Selesaikan dua materi pertama' : 'Selesaikan ketiga materi'} (beserta Kuis Kejutannya) untuk membukanya.</p>
            <ul className="req">
              {materi.slice(0, pop === 'game' ? 2 : 3).map((m, k) => <li key={m.id} className={prog[k] ? 'ok' : ''}><Icon n={prog[k] ? 'check' : 'lock'} size={16} /> Materi {k + 1}: {m.judul}</li>)}
            </ul>
            <div className="row center-row"><button className="btn" onClick={() => { setPop(null); go('learn') }}>{done ? 'Lanjutkan belajar' : 'Mulai belajar'}</button><button className="btn ghost" onClick={() => setPop(null)}>Nanti saja</button></div>
          </div>
        </div>
      )}
    </>
  )
}
