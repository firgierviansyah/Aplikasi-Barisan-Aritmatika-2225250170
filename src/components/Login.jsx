import { useState } from 'react'
import Mascot from './Mascot'
import Icon from './Icon'
import { ripple } from '../lib/ripple'
const floaters = ['+3', 'a', 'U₁₀', 'b', '2 · 5 · 8', 'n − 1', '+2', 'Uₙ']
export default function Login({ onLogin }) {
  const [f, setF] = useState({ nama: '', kelas: '', sekolah: '' })
  const ok = f.nama.trim() && f.kelas.trim() && f.sekolah.trim()
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  return (
    <div className="login-wrap" onPointerDown={ripple}>
      <div className="bg-orbs" aria-hidden="true">
        <i /><i /><i />
        {floaters.map((t, i) => <span key={i} style={{ '--i': i }}>{t}</span>)}
      </div>
      <header className="login-title">
        <span className="logo big"><Icon n="chart" size={26} /></span>
        <h1>Aplikasi Belajar Barisan Aritmatika SMP</h1>
        <p>Pahami pola angka dengan cara yang seru dan mudah</p>
      </header>
      <div className="login">
        <div className="login-art"><Mascot mood="senyum" /><div className="chips"><span>2</span><span>5</span><span>8</span><span>11</span></div></div>
        <form className="login-card" onSubmit={(e) => { e.preventDefault(); ok && onLogin({ nama: f.nama.trim(), kelas: f.kelas.trim(), sekolah: f.sekolah.trim() }) }}>
          <h2>Selamat datang!</h2>
          <p className="muted">Isi data singkat ini untuk mulai belajar. Tanpa kata sandi.</p>
          <label>Nama lengkap<input value={f.nama} onChange={set('nama')} placeholder="Contoh: Rina Putri" autoComplete="name" /></label>
          <label>Kelas<input value={f.kelas} onChange={set('kelas')} placeholder="Contoh: Kelas IX" /></label>
          <label>Asal sekolah<input value={f.sekolah} onChange={set('sekolah')} placeholder="Contoh: SMP Negeri 1" /></label>
          <button className="btn block" disabled={!ok}>Masuk</button>
          <p className="login-note"><Icon n="info" size={16} /><span><b>Catatan:</b> Gunakan nama lengkap dan asal sekolah yang sama seperti sebelumnya agar progres belajar dan level game kamu tidak berubah.</span></p>
        </form>
      </div>
    </div>
  )
}
