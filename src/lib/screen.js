// Mencoba layar penuh + kunci landscape (Android Chrome). Jika tidak didukung, game memakai landscape virtual (CSS).
export async function tryLandscape() {
  try {
    const el = document.documentElement
    if (el.requestFullscreen && !document.fullscreenElement) await el.requestFullscreen()
    await window.screen.orientation?.lock?.('landscape')
  } catch { /* tidak didukung: lanjut dengan landscape virtual */ }
}
export function releaseLandscape() {
  try { window.screen.orientation?.unlock?.() } catch { /* abaikan */ }
  try { if (document.fullscreenElement) document.exitFullscreen() } catch { /* abaikan */ }
}
