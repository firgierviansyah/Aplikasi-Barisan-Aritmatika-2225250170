// Menampilkan notasi suku (U₇, Uₙ, U10) dengan subskrip yang rapi.
const SUB = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', 'ₙ': 'n', '₋': '−' }
const conv = (s) => [...s].map((c) => SUB[c] ?? c).join('')
export function U({ n }) { return <span className="U">U<sub>{n}</sub></span> }
export default function M({ children }) {
  const parts = String(children ?? '').split(/(U(?:[₀-₉ₙ₋]+|\d+))/g)
  return <>{parts.map((p, i) => (i % 2 ? <U key={i} n={conv(p.slice(1))} /> : p))}</>
}
