import { useEffect, useRef, useState } from 'react'
import Icon from '../Icon'
import M from '../M'
import Stage from './Stage'
import FrogGame from './FrogGame'
import VaultGame from './VaultGame'
import { FrogArt, VaultArt, StarGold } from './GameArt'
import { GameOver, LevelClear, Victory } from './Overlays'
import { getProg, saveStars, starsOf, addPlay, getHistory } from '../../lib/storage'
import { isMuted, setMuted, sfx } from '../../lib/sound'
import { tryLandscape, releaseLandscape } from '../../lib/screen'

const LEVELS = 10, MAXL = 3
// Katak level 5-10 (cari suku): SATU barisan utuh dengan 2 tahap beruntun. Level lain: 2 soal terpisah.
const isSuku = (g, l) => g === 'frog' && l >= 5
const roundsOf = (g, l) => (isSuku(g, l) ? 1 : 2)
const tier = (l) => (l <= 3 ? 'Pemula' : l <= 6 ? 'Tantangan' : l <= 9 ? 'Ahli' : 'Master')
const GAMES = {
  frog: { title: 'Katak Penjelajah Kolam Ranjau', short: 'Katak Penjelajah', theme: 'frog', Comp: FrogGame, label: (l) => (l <= 4 ? 'Cari beda' : 'Cari suku'), desc: 'Level awal: cari beda (b) dan lihat katak melompat. Level lanjut: selesaikan 2 tahap pencarian suku menuju garis finish. Awas ranjau air!' },
  vault: { title: 'Misteri Brankas Rahasia', short: 'Brankas Rahasia', theme: 'vault', Comp: VaultGame, label: (l) => `${l >= 9 ? 3 : 2} digit terakhir`, desc: 'Beberapa digit kode sudah diketahui. Pecahkan soal barisan untuk menemukan digit terakhirnya.' }
}
function useMq(q) {
  const [m, setM] = useState(() => window.matchMedia(q).matches)
  useEffect(() => { const mq = window.matchMedia(q), h = () => setM(mq.matches); mq.addEventListener('change', h); return () => mq.removeEventListener('change', h) }, [q])
  return m
}

export default function GameZone({ user, go }) {
  const [view, setView] = useState('hub')
  const [gid, setGid] = useState('frog')
  const [level, setLevel] = useState(1)
  const [status, setStatus] = useState('play')
  const [lives, setLives] = useState(MAXL)
  const [round, setRound] = useState(0)
  const [step, setStep] = useState(0) // tahap yang sudah selesai pada level cari suku (0..2)
  const [earned, setEarned] = useState(0)
  const [partial, setPartial] = useState(false)
  const [runKey, setRunKey] = useState(0)
  const [pref, setPref] = useState(true)
  const [muted, setMutedS] = useState(isMuted())
  const livesRef = useRef(MAXL), roundRef = useRef(0), mist = useRef(0)
  const portrait = useMq('(orientation: portrait) and (max-width: 760px)')
  const short = useMq('(max-height: 520px)')
  const coarse = useMq('(pointer: coarse)')
  const vland = view === 'play' && portrait && pref
  const prog = getProg()
  const unlocked = prog[0] && prog[1]

  useEffect(() => { if (!vland) return; const o = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = o } }, [vland])
  useEffect(() => () => releaseLandscape(), [])
  useEffect(() => { if (status === 'win') sfx.win(); else if (status === 'clear') sfx.good(); else if (status === 'over') sfx.bad() }, [status])

  if (!unlocked) return (
    <div className="panel center"><div className="modal-ic"><Icon n="lock" size={30} /></div>
      <h2 style={{ justifyContent: 'center' }}>Zona Game masih terkunci</h2>
      <p>Selesaikan dulu materi dan kuis pembuka untuk membuka Zona Game!</p>
      <button className="btn" onClick={() => go('learn')}>Mulai belajar</button></div>
  )

  const start = (g, l) => {
    livesRef.current = MAXL; roundRef.current = 0; mist.current = 0
    setGid(g); setLevel(l); setLives(MAXL); setRound(0); setStep(0); setEarned(0); setPartial(false); setStatus('play'); setRunKey((k) => k + 1); setView('play')
    if (portrait && coarse && pref) tryLandscape()
  }
  const leave = (to = 'levels') => { releaseLandscape(); setView(to) }
  const wrong = () => {
    livesRef.current -= 1; mist.current += 1; setLives(livesRef.current)
    if (livesRef.current <= 0) { addPlay(gid, level, 'over', 0); setStatus('over') }
  }
  // Tahap 1 berhasil tapi tahap 2 gagal: level berakhir dengan bintang parsial (maks. 2 dari 3).
  const partialDone = () => {
    mist.current += 1
    const st = mist.current === 1 ? 2 : 1
    saveStars(gid, level, st); addPlay(gid, level, 'clear', st); setEarned(st); setPartial(true); setStatus('clear')
  }
  const roundDone = () => {
    const nr = roundRef.current + 1; roundRef.current = nr; setRound(nr)
    if (nr >= roundsOf(gid, level)) {
      const st = mist.current === 0 ? 3 : mist.current === 1 ? 2 : 1
      saveStars(gid, level, st); addPlay(gid, level, 'clear', st); setEarned(st); setStatus(level >= LEVELS ? 'win' : 'clear')
    }
  }
  const G = GAMES[gid], suku = isSuku(gid, level), stars = starsOf(gid), history = getHistory()

  if (view === 'play') {
    const Comp = G.Comp
    return (
      <Stage theme={G.theme} title={G.short} level={level} unit={suku ? 'Tahap' : 'Soal'} rounds={2} round={suku ? step : round} lives={lives} maxLives={MAXL}
        vland={vland} compact={vland || short} canRotate={portrait} onRotate={() => setPref((p) => !p)}
        muted={muted} onMute={() => { setMuted(!muted); setMutedS(!muted) }} onExit={() => leave()}>
        {status === 'play' && <Comp key={`${runKey}-${round}`} level={level} round={round} onWrong={wrong} onPartial={partialDone} onRoundDone={roundDone} onStep={setStep} />}
        {status === 'over' && <GameOver level={level} onRetry={() => start(gid, level)} onExit={() => leave()} />}
        {status === 'clear' && <LevelClear level={level} stars={earned} partial={partial} onNext={level < LEVELS ? () => start(gid, level + 1) : undefined} onReplay={() => start(gid, level)} onExit={() => leave()} />}
        {status === 'win' && <Victory name={user.nama.split(' ')[0]} title={G.title} total={stars.reduce((x, y) => x + y, 0)} onReplay={() => start(gid, LEVELS)} onExit={() => leave('hub')} />}
      </Stage>
    )
  }
  if (view === 'levels') return (
    <>
      <button className="link" onClick={() => setView('hub')}><Icon n="back" size={18} /> Zona Game</button>
      <h1>{G.title}</h1>
      <p className="muted"><M>{G.desc}</M> Ada 10 level. Kamu punya 3 nyawa tiap level. Kalau habis, cukup ulangi level itu saja.</p>
      <div className="lv-grid">
        {Array.from({ length: LEVELS }, (_, i) => i + 1).map((l) => {
          const open = l === 1 || stars[l - 2] > 0
          return (
            <button key={l} className="lv" disabled={!open} onClick={() => start(gid, l)} aria-label={`Level ${l} ${tier(l)}${open ? '' : ', terkunci'}`}>
              <span className="num">{open ? l : <Icon n="lock" size={16} />}</span>
              <b>Level {l}</b><small>{tier(l)}</small><small>{G.label(l)}</small>
              <span className="stars">{[0, 1, 2].map((i) => <StarGold key={i} on={i < stars[l - 1]} size={18} />)}</span>
            </button>
          )
        })}
      </div>
    </>
  )
  return (
    <>
      <h1>Zona Game</h1>
      <p className="muted">Belajar sambil bermain. Selesaikan 10 level di tiap game untuk jadi master barisan aritmatika.</p>
      {portrait && <div className="rot-tip"><Icon n="rotate" size={22} /><span>Game lebih lega dalam mode landscape. Saat bermain, layar diputar otomatis, atau kamu bisa memutar HP.</span></div>}
      <div className="gz-grid">
        {Object.entries(GAMES).map(([id, g]) => {
          const sum = starsOf(id).reduce((x, y) => x + y, 0)
          return (
            <button key={id} className={'gz-card ' + id} onClick={() => { setGid(id); setView('levels') }}>
              <div className="art">{id === 'frog' ? <FrogArt /> : <VaultArt open={false} />}</div>
              <h2>{g.title}</h2><p><M>{g.desc}</M></p>
              <span className="mini-stars"><StarGold size={18} /> {sum} / 30 bintang</span>
            </button>
          )
        })}
      </div>
      {history.length > 0 && (
        <section className="panel">
          <h3>Riwayat permainan terakhir</h3>
          <ul className="log">
            {history.slice(0, 6).map((h, i) => (
              <li key={i}><span>{GAMES[h.g]?.short} · Level {h.level} · {h.result === 'clear' ? `selesai, ${h.stars} bintang` : 'nyawa habis'}</span>
                <b>{new Date(h.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</b></li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
