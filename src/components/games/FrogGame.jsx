import { useMemo, useState } from 'react'
import { frogRound } from '../../lib/gamegen'
import FrogBeda from './FrogBeda'
import FrogSuku from './FrogSuku'

// Level 1-4: cari beda (2 soal). Level 5-10: cari suku, SATU barisan dengan 2 tahap menuju finish.
export default function FrogGame({ level, round, onWrong, onPartial, onRoundDone, onStep }) {
  const [seed, setSeed] = useState(0) // soal baru setelah penjelasan ranjau di mode cari beda
  const data = useMemo(() => frogRound(level, round), [level, round, seed])
  return data.mode === 'beda'
    ? <FrogBeda key={seed} data={data} onWrong={onWrong} onRoundDone={onRoundDone} onRetry={() => setSeed((s) => s + 1)} />
    : <FrogSuku key={seed} data={data} onWrong={onWrong} onPartial={onPartial} onRoundDone={onRoundDone} onStep={onStep} />
}
