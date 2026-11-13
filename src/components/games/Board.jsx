import { useContext } from 'react'
import Jumper from './Jumper'
import { CompactCtx } from './compactCtx'
// Ukuran papan (px). Mode ringkas dipakai di HP / layar pendek agar seluruh papan dan soal muat tanpa merombak tata letak.
const SIZE = { full: { row: 70, head: 48, stone: 40, frog: 38 }, compact: { row: 56, head: 44, stone: 34, frog: 32 } }
// Papan batu maksimal 2 baris. Sel diisi dari luar; katak berpindah antar sel dengan lompatan.
export default function Board({ children, cols, frogIdx, ouchKey }) {
  const z = useContext(CompactCtx) ? SIZE.compact : SIZE.full
  const row = Math.floor(frogIdx / cols), col = frogIdx % cols
  // Katak berdiri di atas batu: bagian bawah katak tumpang-tindih 10px dengan batu.
  const top = z.head + row * z.row + (z.row - 2 - z.stone - z.frog + 10)
  return (
    <div className="board" style={{ '--cols': cols, '--row': z.row + 'px', '--head': z.head + 'px' }}>
      {children}
      <Jumper left={((col + 0.5) / cols) * 100} top={top} ouchKey={ouchKey} dur={760} />
    </div>
  )
}
export const colsFor = (n) => (n <= 7 ? n : Math.ceil(n / 2))
