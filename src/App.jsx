import { useEffect, useState } from 'react'
import { getUser, loginStudent, logout } from './lib/storage'
import Icon from './components/Icon'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Learn from './components/Learn'
import Calculator from './components/Calculator'
import Quiz from './components/Quiz'
import Progress from './components/Progress'
import About from './components/About'
import GameZone from './components/games/GameZone'
import FloatingChat from './components/FloatingChat'
import { ripple } from './lib/ripple'
const pages = { learn: Learn, game: GameZone, calc: Calculator, quiz: Quiz, progress: Progress, about: About }
const titles = { game: 'Zona Game', learn: 'Belajar & Studi Kasus', calc: 'Kalkulator Barisan', quiz: 'Kuis Interaktif', progress: 'Analisis Nilai', about: 'Tentang Aplikasi' }
export default function App() {
  const [user, setUser] = useState(getUser())
  const [page, setPage] = useState('home')
  const [notice, setNotice] = useState(null)
  const [chatLog, setChatLog] = useState([])
  useEffect(() => {
    const onPop = (e) => { setPage(e.state?.p || 'home'); window.scrollTo(0, 0) }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  useEffect(() => { if (!notice) return; const t = setTimeout(() => setNotice(null), 9000); return () => clearTimeout(t) }, [notice])
  const go = (p) => { if (p !== 'home') window.history.pushState({ p }, ''); setPage(p); window.scrollTo(0, 0) }
  const home = () => { if (window.history.state?.p) window.history.back(); else { setPage('home'); window.scrollTo(0, 0) } }
  if (!user) return <Login onLogin={(u) => {
    const r = loginStudent(u), first = r.acc.nama.split(' ')[0]
    setUser(r.acc)
    setNotice(r.isNew ? `Halo, ${first}! Akun barumu dibuat. Progres belajar dan game akan tersimpan di perangkat ini.`
      : `Selamat datang kembali, ${first}! Progres belajar dan level game kamu dilanjutkan.${r.fuzzy ? ` Nama sekolah dikenali sebagai "${r.acc.sekolah}".` : ''}`)
  }} />
  const Page = pages[page]
  return (
    <div className={'shell' + (page === 'game' ? ' wide' : '')} onPointerDown={ripple}>
      <header className="top">
        {page === 'home'
          ? <strong className="brand"><span className="logo"><Icon n="chart" size={18} /></span>Barisan Aritmatika</strong>
          : <button className="link" onClick={home}><Icon n="back" size={18} /> Menu utama</button>}
        <span className="who"><span className="avatar">{user.nama[0].toUpperCase()}</span><span className="hide-s">{user.nama} · {user.kelas}</span>
          <button className="link" aria-label="Keluar" onClick={() => { logout(); setUser(null); setNotice(null); setChatLog([]); setPage('home') }}><Icon n="out" size={18} /></button></span>
      </header>
      <main key={page}>
        {page === 'home' && notice && <div className="notice" role="status"><Icon n="info" size={20} /><span>{notice}</span><button className="link" aria-label="Tutup pemberitahuan" onClick={() => setNotice(null)}>Tutup</button></div>}
        {page === 'home' ? <Dashboard user={user} go={go} /> : (<>{page !== 'game' && <h1>{titles[page]}</h1>}<Page user={user} go={go} /></>)}</main>
      {/* Asisten melayang disembunyikan (tidak dirender) di Kuis dan Zona Game agar tidak ada kecurangan */}
      {page !== 'quiz' && page !== 'game' && <FloatingChat user={user} halaman={page === 'home' ? 'Menu utama' : titles[page]} log={chatLog} setLog={setChatLog} />}
    </div>
  )
}
