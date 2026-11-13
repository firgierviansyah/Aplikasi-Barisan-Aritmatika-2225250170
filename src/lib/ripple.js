import { buzz, sfx } from './sound'
// Efek sentuh: riak cahaya + getar singkat pada elemen ber-class "tap".
export function ripple(e) {
  const el = e.target.closest?.('.tap,.btn,.card,.opt,.stepper button,.link,.lv,.gz-card,.hud-btn,.key,.stone-btn,.fab,.chip,.chat-send,.bbtn')
  if (!el || el.disabled) return
  const rc = el.getBoundingClientRect(), size = Math.max(rc.width, rc.height) * 2
  const s = document.createElement('span')
  s.className = 'ripple'
  s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rc.left - size / 2}px;top:${e.clientY - rc.top - size / 2}px`
  el.appendChild(s)
  setTimeout(() => s.remove(), 650)
  buzz(8)
}
export { sfx }
