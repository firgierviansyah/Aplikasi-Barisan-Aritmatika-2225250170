import { useEffect } from 'react'
import Icon from '../Icon'
// Papan tombol angka digital (tanpa keyboard bawaan HP). Mendukung keyboard fisik.
export default function Keypad({ value, onChange, onSubmit, submitLabel = 'OK', disabled = false, maxLen = 5, allowNeg = true }) {
  const press = (d) => { if (disabled || value.replace('-', '').length >= maxLen) return; onChange(value === '0' ? d : value + d) }
  const neg = () => { if (!disabled) onChange(value.startsWith('-') ? value.slice(1) : '-' + value) }
  const del = () => { if (!disabled) onChange(value.slice(0, -1)) }
  useEffect(() => {
    const h = (e) => {
      if (disabled || e.ctrlKey || e.metaKey || e.altKey) return
      if (/^\d$/.test(e.key)) press(e.key)
      else if (e.key === '-' && allowNeg) neg()
      else if (e.key === 'Backspace') del()
      else if (e.key === 'Enter') onSubmit()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })
  const k = (label, fn, cls = '', aria) => (
    <button type="button" key={aria || label} className={'key tap ' + cls} aria-label={aria} disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} onClick={fn}>{label}</button>
  )
  return (
    <div className="keypad">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => k(d, () => press(d)))}
      {allowNeg ? k('±', neg, 'alt', 'Ganti tanda plus minus') : <span className="key empty" aria-hidden="true" />}
      {k('0', () => press('0'))}
      {k(<Icon n="del" size={22} />, del, 'alt', 'Hapus satu angka')}
      {k(submitLabel, onSubmit, 'go', submitLabel)}
    </div>
  )
}
