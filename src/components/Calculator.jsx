import { useState } from 'react'
import { terms } from '../lib/math'
import { f } from '../data/content'
import M, { U } from './M'
import FormulaBox from './FormulaBox'

const r6 = (x) => +x.toFixed(6)
const g = (x) => f(r6(x))
const par = (x) => (x < 0 ? `(${g(x)})` : g(x))

// Menyelesaikan variabel yang dikosongkan dari rumus Uₙ = a + (n − 1)b
function solve({ a, b, n, u }) {
  const have = [a, b, n, u].filter((x) => x !== null).length
  if (have < 3) return { info: 'Isi tiga kolom, lalu kosongkan satu kolom yang ingin dicari.' }
  if (n !== null && (!Number.isInteger(n) || n < 1)) return { error: 'n harus bilangan bulat, minimal 1.' }
  const head = 'Uₙ = a + (n − 1)b'
  if (have === 4) {
    const exp = a + (n - 1) * b, ok = Math.abs(u - exp) < 1e-9
    return { head, ok, lines: [`U${n} = ${g(a)} + (${n} − 1) × ${par(b)}`, `U${n} = ${g(a)} + ${g((n - 1) * b)} = ${g(exp)}`],
      answer: ok ? `Benar: U${n} = ${g(u)}` : `Seharusnya U${n} = ${g(exp)}, bukan ${g(u)}`, vals: { a, b, n } }
  }
  if (u === null) { const x = a + (n - 1) * b
    return { head, lines: [`U${n} = ${g(a)} + (${n} − 1) × ${par(b)}`, `U${n} = ${g(a)} + ${g((n - 1) * b)}`], answer: `U${n} = ${g(x)}`, vals: { a, b, n } } }
  if (a === null) { const x = u - (n - 1) * b
    return { head, lines: [`${g(u)} = a + (${n} − 1) × ${par(b)}`, `${g(u)} = a + ${g((n - 1) * b)}`, `a = ${g(u)} − ${par((n - 1) * b)}`], answer: `a = ${g(x)}`, vals: { a: x, b, n } } }
  if (b === null) {
    if (n === 1) return Math.abs(u - a) < 1e-9 ? { error: 'Untuk n = 1, beda b bisa bernilai berapa saja.' } : { error: 'Untuk n = 1, U₁ harus sama dengan a.' }
    const x = (u - a) / (n - 1)
    return { head, lines: [`${g(u)} = ${g(a)} + (${n} − 1) × b`, `${g(u - a)} = ${n - 1} × b`, `b = ${g(u - a)} ÷ ${n - 1}`], answer: `b = ${g(x)}`, vals: { a, b: x, n } }
  }
  if (b === 0) return Math.abs(u - a) < 1e-9 ? { error: 'Beda 0 dan Uₙ = a: n bisa berapa saja.' } : { error: 'Dengan beda 0, semua suku sama dengan a, jadi Uₙ tidak mungkin berbeda dari a.' }
  const k = (u - a) / b
  if (!Number.isInteger(r6(k)) || k < 0) return { error: `Hasilnya n = ${g(k + 1)}, bukan bilangan bulat positif. Angka ${g(u)} bukan suku dari barisan ini.` }
  const x = Math.round(k) + 1
  return { head, lines: [`${g(u)} = ${g(a)} + (n − 1) × ${par(b)}`, `${g(u - a)} = (n − 1) × ${par(b)}`, `n − 1 = ${g(u - a)} ÷ ${par(b)} = ${g(k)}`], answer: `n = ${g(k)} + 1 = ${x}`, vals: { a, b, n: x } }
}

export default function Calculator() {
  const [v, setV] = useState({ a: '', b: '', n: '', u: '' })
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value })
  const num = (k) => (v[k] === '' || !Number.isFinite(parseFloat(v[k])) ? null : parseFloat(v[k]))
  const res = solve({ a: num('a'), b: num('b'), n: num('n'), u: num('u') })
  const vals = res.vals
  return (
    <>
      <p className="muted">Isi tiga kolom, kosongkan satu yang ingin dicari (a, b, n, atau <U n="n" />). Jika keempatnya diisi, kalkulator memeriksa kebenarannya.</p>
      <div className="panel form3">
        <label>a (suku pertama)<input type="number" value={v.a} onChange={set('a')} placeholder="dicari" /></label>
        <label>b (beda)<input type="number" value={v.b} onChange={set('b')} placeholder="dicari" /></label>
        <label>n (urutan suku)<input type="number" min="1" step="1" value={v.n} onChange={set('n')} placeholder="dicari" /></label>
        <label><U n="n" /> (nilai suku ke-n)<input type="number" value={v.u} onChange={set('u')} placeholder="dicari" /></label>
      </div>
      {res.info && <p className="muted">{res.info}</p>}
      {res.error && <div className="panel"><p className="fb bad"><M>{res.error}</M></p></div>}
      {res.lines && (
        <div className="panel steps">
          <h3>Langkah penyelesaian {res.ok !== undefined && <span className={'tag ' + (res.ok ? 'ok' : 'bad')}>{res.ok ? 'Jawabanmu benar' : 'Jawabanmu belum sama'}</span>}</h3>
          <FormulaBox mini judul="Rumus inti" isi={res.head} />
          {res.lines.map((l, i) => <p key={i}><M>{l}</M></p>)}
          <p><b><M>{res.answer}</M></b></p>
          {vals && (<>
            <h3>Beberapa suku pertama</h3>
            <p>{terms(vals.a, vals.b, Math.min(vals.n, 8)).map((x) => g(x)).join(', ')}{vals.n > 8 ? ', …' : ''}</p>
          </>)}
        </div>
      )}
    </>
  )
}
