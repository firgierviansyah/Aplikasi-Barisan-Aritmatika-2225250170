export function FrogArt() {
  return (
    <svg viewBox="0 0 80 64" aria-hidden="true">
      <ellipse cx="40" cy="59" rx="26" ry="4" fill="#000" opacity=".15" />
      <path d="M14 50q-9 6-4 11 9 0 13-7z" fill="#2fa84f" /><path d="M66 50q9 6 4 11-9 0-13-7z" fill="#2fa84f" />
      <ellipse cx="40" cy="40" rx="26" ry="19" fill="#3cc262" /><ellipse cx="40" cy="48" rx="16" ry="10" fill="#d9f5b8" />
      <circle cx="26" cy="22" r="10" fill="#3cc262" /><circle cx="54" cy="22" r="10" fill="#3cc262" />
      <circle cx="26" cy="21" r="6.5" fill="#fff" /><circle cx="54" cy="21" r="6.5" fill="#fff" />
      <circle cx="27" cy="22" r="3.2" fill="#17235a" /><circle cx="53" cy="22" r="3.2" fill="#17235a" />
      <circle cx="21" cy="35" r="3.5" fill="#ff9d8a" opacity=".6" /><circle cx="59" cy="35" r="3.5" fill="#ff9d8a" opacity=".6" />
      <path d="M30 38Q40 47 50 38" stroke="#17235a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}
export function MineArt() {
  return (
    <svg viewBox="0 0 48 48" width="42" height="42" aria-label="Ranjau" role="img">
      <g stroke="#1b1f33" strokeWidth="4" strokeLinecap="round"><path d="M24 4v8M24 36v8M4 24h8M36 24h8M10 10l6 6M32 32l6 6M38 10l-6 6M16 32l-6 6" /></g>
      <circle cx="24" cy="24" r="12" fill="#2a2f4a" /><circle cx="20" cy="20" r="3.5" fill="#fff" opacity=".35" />
      <circle cx="24" cy="24" r="4" fill="#ff5a4d" />
    </svg>
  )
}
export function AgentArt() {
  return (
    <svg viewBox="0 0 80 110" aria-hidden="true">
      <path d="M16 64Q40 52 64 64L68 108H12z" fill="#1f2a5e" /><path d="M34 60l6 14 6-14z" fill="#fff" /><path d="M38 66h4l2 14-4 3-4-3z" fill="#ff6a4d" />
      <circle cx="40" cy="38" r="16" fill="#f1c29a" />
      <ellipse cx="40" cy="26" rx="27" ry="6" fill="#151d45" /><path d="M24 26Q24 8 40 8T56 26z" fill="#1f2a5e" /><rect x="24" y="20" width="32" height="5" fill="#ffc247" />
      <rect x="25" y="34" width="13" height="8" rx="3" fill="#0c1230" /><rect x="42" y="34" width="13" height="8" rx="3" fill="#0c1230" /><path d="M38 37h4" stroke="#0c1230" strokeWidth="2" />
      <path d="M34 48Q40 53 46 48" stroke="#8a4b2a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="52" y="86" width="22" height="17" rx="3" fill="#8a5a2b" /><rect x="58" y="82" width="10" height="5" rx="2" fill="none" stroke="#5c3a18" strokeWidth="2" />
    </svg>
  )
}
export function VaultArt({ open, alarm }) {
  return (
    <svg className={'vault-art' + (open ? ' open' : '')} viewBox="0 0 240 190" role="img" aria-label={open ? 'Brankas terbuka' : 'Brankas terkunci'}>
      <circle className={'v-lamp' + (alarm ? ' on' : '')} cx="120" cy="11" r="9" />
      <rect x="10" y="22" width="220" height="162" rx="20" fill="#2d3a78" />
      <rect x="26" y="38" width="188" height="130" rx="12" fill="#0e1538" />
      <g className="v-inside">
        <rect x="40" y="52" width="160" height="104" rx="8" fill="#ffd978" opacity=".92" />
        <rect x="62" y="66" width="46" height="62" rx="4" fill="#fff" transform="rotate(-6 85 98)" />
        <rect x="118" y="70" width="46" height="60" rx="4" fill="#e8eeff" transform="rotate(5 141 100)" />
        <path d="M72 84h26M72 94h26M128 88h26M128 98h26" stroke="#9aa7d6" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="v-door">
        <rect x="26" y="38" width="188" height="130" rx="12" fill="#9fb0e6" />
        <rect x="38" y="50" width="164" height="106" rx="8" fill="none" stroke="#7587c4" strokeWidth="3" />
        <g className="v-wheel">
          <circle cx="120" cy="103" r="30" fill="#5d6fb5" />
          <path d="M120 73v60M90 103h60M99 82l42 42M141 82l-42 42" stroke="#e8eeff" strokeWidth="5" strokeLinecap="round" />
          <circle cx="120" cy="103" r="10" fill="#e8eeff" />
        </g>
        <circle cx="50" cy="62" r="4" fill="#5d6fb5" /><circle cx="50" cy="144" r="4" fill="#5d6fb5" /><circle cx="190" cy="62" r="4" fill="#5d6fb5" /><circle cx="190" cy="144" r="4" fill="#5d6fb5" />
      </g>
    </svg>
  )
}
export function Heart({ on = true }) {
  return <svg className={'heart' + (on ? '' : ' off')} viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" /></svg>
}
export function StarGold({ on = true, size = 26, className = '' }) {
  return <svg className={className} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" fill={on ? '#ffc247' : 'rgba(120,130,170,.35)'} stroke={on ? '#f59e0b' : 'none'} strokeWidth="1.2" strokeLinejoin="round" /></svg>
}
export function Trophy() {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120" className="trophy" aria-hidden="true">
      <path d="M34 18h52v26a26 26 0 0 1-52 0z" fill="#ffc247" stroke="#f59e0b" strokeWidth="3" />
      <path d="M34 26H18v8a16 16 0 0 0 18 16M86 26h16v8a16 16 0 0 1-18 16" fill="none" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
      <rect x="54" y="70" width="12" height="18" fill="#f59e0b" /><rect x="38" y="88" width="44" height="12" rx="5" fill="#ffc247" stroke="#f59e0b" strokeWidth="3" />
      <path d="M60 28l4 8 9 1-6.5 6 1.8 9-8.3-4.4-8.3 4.4 1.8-9L47 37l9-1z" fill="#fff" opacity=".85" />
    </svg>
  )
}
