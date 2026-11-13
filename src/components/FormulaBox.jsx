import M from './M'
import Icon from './Icon'
// Kotak penyorot untuk rumus inti yang wajib diingat.
export default function FormulaBox({ judul = 'Rumus inti', isi, cat, mini }) {
  return (
    <div className={'formula-box' + (mini ? ' mini' : '')}>
      <span className="lbl"><Icon n="spark" size={12} /> {judul}</span>
      <div className="eq"><M>{isi}</M></div>
      {cat && <small><M>{cat}</M></small>}
    </div>
  )
}
