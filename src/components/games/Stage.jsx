import Icon from '../Icon'
import { Heart } from './GameArt'
import { CompactCtx } from './compactCtx'
// Bingkai area bermain: bilah atas (kembali, level, nyawa, suara, putar layar) + isi.
export default function Stage({ theme, title, level, unit = 'Soal', rounds, round, lives, maxLives, vland, compact, canRotate, onRotate, muted, onMute, onExit, children }) {
  return (
    <div className={`stage ${theme}${vland ? ' vland' : ''}${compact ? ' compact' : ''}`}>
      <header className="stage-hud">
        <button className="hud-btn" aria-label="Keluar dari game" onClick={onExit}><Icon n="back" size={22} /></button>
        <div className="hud-title"><b>{title}</b><span>Level {level}</span></div>
        <div className="dots" aria-label={`${unit} ${Math.min(round + 1, rounds)} dari ${rounds}`}>
          {Array.from({ length: rounds }, (_, i) => <i key={i} className={i < round ? 'on' : i === round ? 'cur' : ''} />)}
        </div>
        <div className="hearts" role="img" aria-label={`Nyawa tersisa ${lives}`}>
          {Array.from({ length: maxLives }, (_, i) => <Heart key={i} on={i < lives} />)}
        </div>
        <button className="hud-btn" aria-label={muted ? 'Nyalakan suara' : 'Matikan suara'} onClick={onMute}><Icon n={muted ? 'mute' : 'sound'} size={20} /></button>
        {canRotate && <button className="hud-btn" aria-label="Putar tampilan layar" onClick={onRotate}><Icon n="rotate" size={20} /></button>}
      </header>
      <CompactCtx.Provider value={!!compact}><div className="stage-body">{children}</div></CompactCtx.Provider>
    </div>
  )
}
