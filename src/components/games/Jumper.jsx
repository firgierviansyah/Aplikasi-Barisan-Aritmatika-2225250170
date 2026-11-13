import { useLayoutEffect, useRef } from 'react'
import { FrogArt } from './GameArt'

const calm = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Katak yang MELOMPAT: saat posisi berubah, katak diletakkan di tujuan lalu dianimasikan dari titik lama.
//  - gerak mendatar hanya terjadi saat di udara (setelah menekuk, sebelum mendarat)
//  - gerak vertikal berbentuk busur (naik melambat, turun mempercepat) + efek menekuk dan mendarat (squash & stretch)
export default function Jumper({ left, top, ouchKey = 0, dur = 640 }) {
  const el = useRef(null), inner = useRef(null), prev = useRef(null)

  useLayoutEffect(() => {
    const p = prev.current; prev.current = { left, top }
    if (!p || !el.current) return // lompatan inti gim: tetap dianimasikan walau reduce-motion aktif, kalau tidak katak tampak teleportasi
    const W = el.current.parentElement.offsetWidth
    const dx = ((p.left - left) / 100) * W, dy = p.top - top
    if (!dx && !dy) return
    const h = Math.min(44, 24 + Math.hypot(dx, dy) * 0.1)
    el.current.animate(
      [{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'translate(0,0)' }],
      { duration: dur * 0.76, delay: dur * 0.12, easing: 'linear', fill: 'both' })
    inner.current.animate([
      { transform: 'translateY(0) scale(1,1)', offset: 0 },
      { transform: 'translateY(0) scale(1.15,.8)', offset: 0.12, easing: 'cubic-bezier(.2,.7,.4,1)' },
      { transform: `translateY(${-h}px) scale(.9,1.15)`, offset: 0.5, easing: 'cubic-bezier(.6,0,.8,.3)' },
      { transform: 'translateY(0) scale(1.12,.86)', offset: 0.88 },
      { transform: 'translateY(0) scale(1,1)', offset: 1 }
    ], { duration: dur })
  }, [left, top, dur])

  useLayoutEffect(() => {
    if (!ouchKey || !inner.current || calm()) return
    inner.current.animate([
      { transform: 'translateX(0) rotate(0)' }, { transform: 'translateX(-8px) rotate(-10deg)' },
      { transform: 'translateX(8px) rotate(10deg)', filter: 'brightness(1.6) saturate(2)' },
      { transform: 'translateX(-5px) rotate(-4deg)' }, { transform: 'translateX(0) rotate(0)' }
    ], { duration: 650 })
  }, [ouchKey])

  return (
    <div ref={el} className="frogger" style={{ left: left + '%', top }}>
      <div ref={inner} className="frog-in"><FrogArt /></div>
    </div>
  )
}
