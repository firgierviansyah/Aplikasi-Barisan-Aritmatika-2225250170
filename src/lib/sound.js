// Efek suara sederhana (WebAudio), tanpa file audio. Bisa dimatikan.
let ctx = null
let muted = false
try { muted = localStorage.getItem('ba_mute') === '1' } catch { /* abaikan */ }
export const isMuted = () => muted
export const setMuted = (m) => { muted = m; try { localStorage.setItem('ba_mute', m ? '1' : '0') } catch { /* abaikan */ } }
const ac = () => {
  if (!ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C() }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}
function tone(freq, dur, type = 'sine', vol = 0.14, delay = 0, to) {
  if (muted) return
  const c = ac(); if (!c) return
  const t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain()
  o.type = type; o.frequency.setValueAtTime(freq, t)
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur)
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur)
}
const seq = (fs, dur, type, vol, gap) => fs.forEach((x, i) => tone(x, dur, type, vol, i * gap))
export const sfx = {
  hop: () => tone(280, 0.18, 'sine', 0.12, 0, 640),
  good: () => seq([523, 659, 784], 0.16, 'triangle', 0.13, 0.09),
  bad: () => tone(220, 0.22, 'square', 0.07, 0, 120),
  boom: () => { tone(150, 0.45, 'sawtooth', 0.16, 0, 40); tone(90, 0.5, 'square', 0.08, 0, 30) },
  alarm: () => seq([880, 620, 880, 620, 880], 0.13, 'square', 0.09, 0.15),
  open: () => { tone(200, 0.5, 'sawtooth', 0.07, 0, 500); seq([659, 880, 1175], 0.2, 'triangle', 0.12, 0.12) },
  win: () => seq([523, 659, 784, 1047, 784, 1047, 1319], 0.2, 'triangle', 0.13, 0.12)
}
export const buzz = (p = 12) => { try { navigator.vibrate?.(p) } catch { /* abaikan */ } }
