import { useMemo } from 'react'
import Icon from '../Icon'
import { StarGold, Trophy } from './GameArt'
const Ovl = ({ children, className = '' }) => <div className={'ovl ' + className}><div className="ovl-card">{children}</div></div>

export function GameOver({ level, onRetry, onExit }) {
  return (
    <Ovl>
      <h2>Nyawa habis</h2>
      <p>Tenang, kamu tidak mulai dari awal. Kamu hanya mengulang <b>Level {level}</b> dengan angka yang baru.</p>
      <div className="row center-row"><button className="btn" onClick={onRetry}>Coba lagi Level {level}</button><button className="btn ghost" onClick={onExit}>Pilih level</button></div>
    </Ovl>
  )
}
export function LevelClear({ level, stars, partial, onNext, onReplay, onExit }) {
  return (
    <Ovl>
      <h2>{partial ? `Level ${level} berakhir` : `Level ${level} selesai!`}</h2>
      <div className="starrow">{[0, 1, 2].map((i) => <StarGold key={i} on={i < stars} size={58} className="starbig" />)}</div>
      <p>{partial ? 'Tahap 1 berhasil, tahap 2 belum. Katak berhenti di batu terakhir sebelum finish. Ulangi untuk meraih bintang penuh!' : stars === 3 ? 'Sempurna, tanpa salah sedikit pun!' : stars === 2 ? 'Bagus sekali, hanya satu salah.' : 'Berhasil! Ulangi kalau ingin bintang lebih banyak.'}</p>
      <div className="row center-row">{onNext && <button className="btn" onClick={onNext}>Lanjut ke Level {level + 1} <Icon n="next" size={18} /></button>}<button className="btn ghost" onClick={onReplay}>Ulangi</button><button className="btn ghost" onClick={onExit}>Pilih level</button></div>
    </Ovl>
  )
}
export function Victory({ name, title, total, onReplay, onExit }) {
  const bits = useMemo(() => Array.from({ length: 36 }, (_, i) => ({ l: Math.random() * 100, d: 3 + Math.random() * 4, dl: Math.random() * 4, c: ['#ffc247', '#ffe08a', '#74a8ff', '#ffffff', '#4d7cff'][i % 5] })), [])
  return (
    <Ovl className="victory">
      <div className="confetti" aria-hidden="true">{bits.map((b, i) => <i key={i} style={{ left: b.l + '%', background: b.c, animationDuration: b.d + 's', animationDelay: b.dl + 's' }} />)}</div>
      <Trophy />
      <div className="starrow">{[0, 1, 2, 3, 4].map((i) => <StarGold key={i} size={i === 2 ? 56 : 40} className="starbig" />)}</div>
      <h2>Selamat, {name}!</h2>
      <p>Kamu menamatkan <b>{title}</b> sampai Level 10. Luar biasa, kamu sekarang master barisan aritmatika!</p>
      <p className="muted-w">Total bintang: {total} dari 30</p>
      <div className="row center-row"><button className="btn" onClick={onExit}>Kembali ke Zona Game</button><button className="btn ghost" onClick={onReplay}>Main Level 10 lagi</button></div>
    </Ovl>
  )
}
