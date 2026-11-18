// Kak Aritma: kakak pembimbing akademis (bust-shot / setengah badan).
// mood: 'senyum' (menyapa), 'berpikir', 'semangat'.
// crop: hanya wajah (untuk avatar bulat di chat); atribut tambahan (lambaian, gelembung, kilau) disembunyikan.
const SKIN = '#f6c8a2', HAIR = '#3a2a3f', ROBE = '#26357a', ROBE2 = '#32449a', INK = '#1d2a5c'
const LABEL = {
  senyum: 'Kak Aritma, kakak pembimbing berkacamata, tersenyum menyapa',
  berpikir: 'Kak Aritma, kakak pembimbing berkacamata, sedang berpikir',
  semangat: 'Kak Aritma, kakak pembimbing berkacamata, memberi semangat'
}

function Face({ mood }) {
  const eyes = {
    senyum: <><circle cx="83" cy="81" r="3.4" fill={INK} /><circle cx="117" cy="81" r="3.4" fill={INK} /><circle cx="84.2" cy="79.8" r="1.1" fill="#fff" /><circle cx="118.2" cy="79.8" r="1.1" fill="#fff" /></>,
    berpikir: <><circle cx="85" cy="79" r="3.4" fill={INK} /><circle cx="119" cy="79" r="3.4" fill={INK} /><circle cx="86.2" cy="77.8" r="1.1" fill="#fff" /><circle cx="120.2" cy="77.8" r="1.1" fill="#fff" /></>,
    semangat: <><path d="M77 83Q83 74 89 83" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" /><path d="M111 83Q117 74 123 83" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" /></>
  }[mood]
  const brows = {
    senyum: <><path d="M75 68Q83 64 91 67" stroke={HAIR} strokeWidth="2.4" fill="none" strokeLinecap="round" /><path d="M109 67Q117 64 125 68" stroke={HAIR} strokeWidth="2.4" fill="none" strokeLinecap="round" /></>,
    berpikir: <><path d="M75 69Q83 67 91 69" stroke={HAIR} strokeWidth="2.4" fill="none" strokeLinecap="round" /><path d="M109 62Q117 57 125 63" stroke={HAIR} strokeWidth="2.4" fill="none" strokeLinecap="round" /></>,
    semangat: <><path d="M75 65Q83 59 91 63" stroke={HAIR} strokeWidth="2.4" fill="none" strokeLinecap="round" /><path d="M109 63Q117 59 125 65" stroke={HAIR} strokeWidth="2.4" fill="none" strokeLinecap="round" /></>
  }[mood]
  const mouth = {
    senyum: <path d="M89 100Q100 111 111 100" stroke="#b2443f" strokeWidth="2.6" fill="none" strokeLinecap="round" />,
    berpikir: <path d="M93 104Q100 104 108 101" stroke="#b2443f" strokeWidth="2.6" fill="none" strokeLinecap="round" />,
    semangat: <><path d="M86 97Q100 120 114 97Z" fill="#9c2f3a" /><path d="M89 98.5Q100 103 111 98.5Q100 101 89 98.5Z" fill="#fff" /><path d="M93 110Q100 106 107 110Q100 117 93 110Z" fill="#ff8a8a" /></>
  }[mood]
  return (
    <>
      <ellipse cx="73" cy="95" rx="8" ry="4.5" fill="#ff9d8a" opacity=".5" /><ellipse cx="127" cy="95" rx="8" ry="4.5" fill="#ff9d8a" opacity=".5" />
      <g className="ka-eyes">{eyes}</g>
      {brows}
      {/* Kacamata pintar berbingkai tipis */}
      <rect x="70" y="69" width="26" height="22" rx="9" fill="#cfe0ff" fillOpacity=".28" stroke={INK} strokeWidth="2.4" />
      <rect x="104" y="69" width="26" height="22" rx="9" fill="#cfe0ff" fillOpacity=".28" stroke={INK} strokeWidth="2.4" />
      <path d="M96 78Q100 75 104 78" stroke={INK} strokeWidth="2.2" fill="none" />
      <path d="M70 76L63 73M130 76L137 73" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M74 72L80 71" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".8" />
      <path d="M99 87Q100 89 102 88" stroke="#d9a07c" strokeWidth="2" fill="none" strokeLinecap="round" />
      {mouth}
    </>
  )
}

function Star({ x, y, s = 1, d = 0 }) {
  return <path className="ka-spark" style={{ animationDelay: d + 's', transformOrigin: `${x}px ${y}px` }} d={`M${x} ${y - 9 * s}Q${x + 1.5 * s} ${y - 1.5 * s} ${x + 9 * s} ${y}Q${x + 1.5 * s} ${y + 1.5 * s} ${x} ${y + 9 * s}Q${x - 1.5 * s} ${y + 1.5 * s} ${x - 9 * s} ${y}Q${x - 1.5 * s} ${y - 1.5 * s} ${x} ${y - 9 * s}Z`} fill="#ffc247" />
}

export function KakAritma({ mood = 'senyum', crop = false, wave, className = '' }) {
  const m = LABEL[mood] ? mood : 'senyum'
  const waving = wave ?? m === 'senyum'
  return (
    <svg className={'mascot ka ' + className} viewBox={crop ? '38 10 124 124' : '0 0 200 220'} role="img" aria-label={LABEL[m]}>
      {!crop && <ellipse cx="100" cy="216" rx="84" ry="4" fill="#17235a" opacity=".1" />}
      <g className={crop ? '' : 'ka-bob'}>
        {/* Rambut bagian belakang (bob panjang sebahu) */}
        <path d="M58 70Q54 22 100 20Q146 22 142 70L144 128Q130 138 118 128L82 128Q70 138 56 128Z" fill={HAIR} />
        {!crop && <>
          {/* Lengan yang melambai / mengepal semangat berada di belakang badan agar rapi */}
          {m === 'senyum' && waving && (
            <g className="ka-wave">
              <path d="M146 170Q172 160 172 126" stroke={ROBE} strokeWidth="19" strokeLinecap="round" fill="none" />
              <path d="M172 140L172 124" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
              <circle cx="172" cy="116" r="10" fill={SKIN} />
              <path d="M165 108Q166 100 169 104M172 106Q173 98 176 103M178 109Q181 103 182 109" stroke={SKIN} strokeWidth="4" strokeLinecap="round" fill="none" />
            </g>
          )}
          {m === 'semangat' && (
            <g className="ka-cheer">
              <path d="M146 172Q176 166 170 132" stroke={ROBE} strokeWidth="19" strokeLinecap="round" fill="none" />
              <path d="M170 146L170 134" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
              <rect x="159" y="112" width="22" height="22" rx="9" fill={SKIN} />
              <rect x="164" y="98" width="8" height="18" rx="4" fill={SKIN} transform="rotate(-8 168 108)" />
              <path d="M160 122H181M160 128H181" stroke="#e3a97f" strokeWidth="1.6" opacity=".7" />
            </g>
          )}
        </>}
        {/* Badan: toga akademik tipis berwarna navy dengan kerah putih */}
        <path d="M18 220Q20 162 68 148L132 148Q180 162 182 220Z" fill={ROBE} />
        <path d="M68 148L100 190L132 148Q116 142 100 142Q84 142 68 148Z" fill="#fff" />
        <path d="M68 148L97 196L84 220L40 220Q42 170 68 148Z" fill={ROBE2} />
        <path d="M132 148L103 196L116 220L160 220Q158 170 132 148Z" fill={ROBE2} />
        {/* Selempang (stola) kelulusan */}
        <path d="M70 149L84 150L104 220L86 220Z" fill="#ffc247" /><path d="M130 149L116 150L96 220L114 220Z" fill="#ffb02e" />
        <path d="M91 196L96 220M109 196L104 220" stroke="#e08f12" strokeWidth="1.6" opacity=".7" />
        <path d="M86 156L104 218" stroke="#fff" strokeWidth="1.5" opacity=".5" />
        {/* Kerah dan dasi kupu-kupu kecil */}
        <path d="M84 146L100 166L116 146Q100 150 84 146Z" fill="#e7eefc" />
        <path d="M91 160L100 164L109 160L109 169L100 165L91 169Z" fill="#ff6a4d" /><circle cx="100" cy="164.5" r="2.6" fill="#e5533a" />
        {/* Pin kecil bertuliskan Σ */}
        <circle cx="146" cy="176" r="8" fill="#fff" /><text x="146" y="181" textAnchor="middle" fontSize="12" fontWeight="800" fill="#3b5bdb" fontFamily="Georgia,serif">Σ</text>
        {/* Leher */}
        <path d="M89 118H111V148Q100 156 89 148Z" fill="#e7b48a" />
        <g className={m === 'berpikir' ? 'ka-tilt' : ''}>
          {/* Telinga dan kepala */}
          <ellipse cx="62" cy="86" rx="5" ry="8" fill={SKIN} /><ellipse cx="138" cy="86" rx="5" ry="8" fill={SKIN} />
          <ellipse cx="100" cy="82" rx="37" ry="40" fill={SKIN} />
          <Face mood={m} />
          {/* Poni menyamping dan sanggul */}
          <circle cx="100" cy="17" r="13" fill={HAIR} /><path d="M92 14Q100 8 108 14" stroke="#5b4561" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M61 82Q56 30 100 30Q146 30 140 82Q134 56 112 52Q92 60 78 64Q66 70 61 82Z" fill={HAIR} />
          <path d="M80 48Q96 42 116 50" stroke="#5b4561" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity=".7" />
        </g>
        {/* Helai rambut di depan bahu */}
        <path d="M60 96Q56 112 60 134Q70 138 76 128Q70 114 70 98Z" fill={HAIR} /><path d="M140 96Q144 112 140 134Q130 138 124 128Q130 114 130 98Z" fill={HAIR} />
      </g>
      {!crop && m === 'berpikir' && (
        <g className="ka-think">
          <circle cx="140" cy="48" r="3.5" fill="#fff" stroke="#c7d3f5" /><circle cx="150" cy="38" r="5" fill="#fff" stroke="#c7d3f5" />
          <rect x="132" y="2" width="62" height="32" rx="16" fill="#fff" stroke="#c7d3f5" strokeWidth="1.5" />
          <text x="163" y="23" textAnchor="middle" fontSize="15" fontWeight="800" fill="#3b5bdb" fontFamily="Georgia,serif">b = ?</text>
        </g>
      )}
      {!crop && m === 'semangat' && <><Star x={30} y={50} s={1.3} /><Star x={178} y={44} s={1} d={0.5} /><Star x={44} y={108} s={0.8} d={1} /></>}
    </svg>
  )
}

// Avatar bulat (kepala saja) untuk header chat dan gelembung percakapan.
export function KakAvatar({ mood = 'senyum', size = 40, className = '' }) {
  return <span className={'ka-avatar ' + className} style={{ width: size, height: size }} aria-hidden="true"><KakAritma mood={mood} crop /></span>
}

// Kompatibel dengan pemakaian lama: <Mascot /> kini menampilkan Kak Aritma.
export default function Mascot({ mood = 'senyum', className = '', wave }) {
  return <KakAritma mood={mood} className={className} wave={wave} />
}
