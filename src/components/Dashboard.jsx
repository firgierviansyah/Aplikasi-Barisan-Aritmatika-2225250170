import { useEffect, useState } from 'react'
import Icon from './Icon'
import Mascot from './Mascot'
import { getScores, getProg } from '../lib/storage'
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
  const locked = !(prog[0] && prog[1])
  const [pop, setPop] = useState(false)
  useEffect(() => { if (!pop) return; const h = (e) => e.key === 'Escape' && setPop(false); window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }, [pop])
  return (
    <>
      <section className="hero">
        <div>
          <p className="kicker">Halo, {user.nama.split(' ')[0]}</p>
          <h1>Siap menaklukkan barisan aritmatika?</h1>
          <p className="muted">{done === 3 ? 'Semua tahap belajar selesai. Uji dirimu di kuis dan game.' : `Tahap belajar selesai: ${done} dari 3.`}{n ? ` Sesi kuis: ${n}.` : ''}</p>
          <button className="btn" onClick={() => go('learn')}>{done ? 'Lanjutkan belajar' : 'Mulai belajar'}</button>
        </div>
        <Mascot />
      </section>
      <div className="grid">
        {menu.map(([id, ic, t, d, c]) => {
          const lock = id === 'game' && locked
          return (
            <button key={id} className={'card ' + c + (lock ? ' locked' : '')} aria-disabled={lock} onClick={() => (lock ? setPop(true) : go(id))}>
              <span className="ic"><Icon n={ic} size={26} /></span><b>{t}</b><span className="muted">{lock ? 'Terkunci. Selesaikan dua materi pertama dan kuisnya.' : d}</span>
              <span className="go"><Icon n={lock ? 'lock' : 'next'} size={18} /></span>
            </button>
          )
        })}
      </div>
      {pop && (
        <div className="modal-back" onClick={() => setPop(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="mt" onClick={(e) => e.stopPropagation()}>
            <div className="modal-ic"><Icon n="lock" size={30} /></div>
            <h2 id="mt">Zona Game masih terkunci</h2>
            <p>Selesaikan dulu materi dan kuis pembuka untuk membuka Zona Game!</p>
            <ul className="req">
              <li className={prog[0] ? 'ok' : ''}><Icon n={prog[0] ? 'check' : 'lock'} size={16} /> Materi 1: Mengenal Pola dan Beda</li>
              <li className={prog[1] ? 'ok' : ''}><Icon n={prog[1] ? 'check' : 'lock'} size={16} /> Materi 2: Rumus Suku ke-n</li>
            </ul>
            <div className="row center-row"><button className="btn" onClick={() => { setPop(false); go('learn') }}>Mulai belajar</button><button className="btn ghost" onClick={() => setPop(false)}>Nanti saja</button></div>
          </div>
        </div>
      )}
    </>
  )
}
