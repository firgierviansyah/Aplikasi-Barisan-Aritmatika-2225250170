import Icon from './Icon'
import { materi } from '../data/content'
import { getProg } from '../lib/storage'

// Layar "terkunci" untuk Kuis dan Zona Game (dipakai bila halaman dibuka lewat jalur lain, misalnya tombol Kembali peramban).
export default function Locked({ title, need = 3, go }) {
  const prog = getProg(), done = prog.slice(0, need).filter(Boolean).length
  return (
    <div className="panel center">
      <div className="modal-ic"><Icon n="lock" size={30} /></div>
      <h2 style={{ justifyContent: 'center' }}>{title} masih terkunci</h2>
      <p>{need === 2 ? 'Selesaikan dua materi pertama' : 'Selesaikan ketiga materi'} (beserta Kuis Kejutannya) untuk membuka {title}.</p>
      <ul className="req">
        {materi.slice(0, need).map((m, k) => <li key={m.id} className={prog[k] ? 'ok' : ''}><Icon n={prog[k] ? 'check' : 'lock'} size={16} /> Materi {k + 1}: {m.judul}</li>)}
      </ul>
      <button className="btn" onClick={() => go('learn')}>{done ? 'Lanjutkan belajar' : 'Mulai belajar'}</button>
    </div>
  )
}
