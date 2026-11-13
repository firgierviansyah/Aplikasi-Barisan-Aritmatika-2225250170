function Kid({ girl, x }) {
  const skin = girl ? '#f6c8a2' : '#e7b48a', hair = girl ? '#3b2b33' : '#2a2540'
  return (
    <g transform={`translate(${x} 0)`}>
      {!girl && <rect x="68" y="64" width="13" height="32" rx="6" fill="#ffb84a" />}
      <rect x="34" y="112" width="10" height="26" rx="5" fill={skin} /><rect x="56" y="112" width="10" height="26" rx="5" fill={skin} />
      <ellipse cx="38" cy="141" rx="10" ry="5" fill="#222c4d" /><ellipse cx="62" cy="141" rx="10" ry="5" fill="#222c4d" />
      {girl ? <path d="M28 94h44l9 26H19z" fill="#2a47c4" /> : <path d="M30 94h40l3 30H27z" fill="#2a47c4" />}
      <rect x="28" y="58" width="44" height="42" rx="13" fill="#fff" stroke="#d9e2f6" />
      <path d="M40 58l10 13 10-13z" fill="#e7eefc" /><path d="M47 70h6l2 15-5 4-5-4z" fill="#ff6a4d" />
      <g className="wave"><path d="M31 68Q12 62 12 42" stroke={skin} strokeWidth="9" strokeLinecap="round" fill="none" /><circle cx="12" cy="40" r="6" fill={skin} /><circle cx="31" cy="67" r="8" fill="#fff" stroke="#d9e2f6" /></g>
      <path d="M69 68Q82 84 66 92" stroke={skin} strokeWidth="9" strokeLinecap="round" fill="none" /><circle cx="69" cy="67" r="8" fill="#fff" stroke="#d9e2f6" />
      <rect x="55" y="80" width="23" height="17" rx="3" fill="#3b5bdb" transform="rotate(-8 66 90)" /><path d="M58 85h15" stroke="#fff" strokeWidth="2" transform="rotate(-8 66 90)" />
      {girl && <><circle cx="23" cy="46" r="8" fill={hair} /><circle cx="77" cy="46" r="8" fill={hair} /></>}
      <circle cx="50" cy="38" r="22" fill={skin} />
      <path d={girl ? 'M27 38Q27 12 50 14Q73 12 73 38Q66 24 50 26Q34 24 27 38z' : 'M28 37Q26 11 50 12Q74 11 72 37Q64 22 50 24Q36 22 28 37z'} fill={hair} />
      <circle cx="42" cy="40" r="2.6" fill="#222c4d" /><circle cx="58" cy="40" r="2.6" fill="#222c4d" />
      <circle cx="37" cy="47" r="3.5" fill="#ff9d8a" opacity=".55" /><circle cx="63" cy="47" r="3.5" fill="#ff9d8a" opacity=".55" />
      <path d="M43 48Q50 56 57 48" stroke="#222c4d" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </g>
  )
}
export default function Mascot({ className = '' }) {
  return (
    <svg className={'mascot ' + className} viewBox="0 0 220 150" role="img" aria-label="Dua siswa SMP berseragam putih biru yang tersenyum">
      <ellipse cx="110" cy="146" rx="98" ry="5" fill="#17235a" opacity=".1" />
      <Kid girl x={0} /><Kid x={110} />
    </svg>
  )
}
