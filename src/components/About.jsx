import Mascot from './Mascot'
export default function About() {
  return (
    <div className="panel about">
      <Mascot />
      <p>Aplikasi ini membantu siswa SMP memahami barisan aritmatika: konsep beda dan rumus suku ke-n, lalu menerapkannya pada soal cerita.</p>
      <ul className="points">
        <li>Belajar bertahap: tahap berikutnya terbuka setelah Kuis Kejutan lulus.</li>
        <li>Visual panah untuk memahami beda, dan asisten untuk bertanya.</li>
        <li>Kalkulator dengan langkah runtut dan kuis tanpa timer.</li>
        <li>Grafik nilai untuk memantau perkembangan.</li>
      </ul>
      <p className="credit">Dikembangkan oleh <b>Firgi Erviansyah</b></p>
    </div>
  )
}
