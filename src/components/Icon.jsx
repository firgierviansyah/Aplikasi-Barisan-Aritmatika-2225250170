const P = {
  book: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19V5M9 7h6" /></>,
  calc: <><rect x="5" y="3" width="14" height="18" rx="3" /><path d="M8 7h8M8 12h2M12 12h2M8 16h2M12 16h4" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
  chart: <><path d="M4 20V4M4 20h16" /><path d="M8 15l4-4 3 3 5-6" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.01" /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="3" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  unlock: <><rect x="5" y="11" width="14" height="10" rx="3" /><path d="M8 11V8a4 4 0 0 1 7.5-2" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  back: <path d="M15 5l-7 7 7 7" />,
  next: <path d="M9 5l7 7-7 7" />,
  out: <><path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M15 8l4 4-4 4M19 12H9" /></>,
  game: <><path d="M7 8h10a5 5 0 0 1 5 5v1a3 3 0 0 1-5.2 2L15 14H9l-1.8 2A3 3 0 0 1 2 14v-1a5 5 0 0 1 5-5z" /><path d="M8 10.5v3M6.5 12h3M16 11.5h.01M18 13h.01" /></>,
  sound: <><path d="M4 10v4h4l5 4V6L8 10z" /><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11" /></>,
  mute: <><path d="M4 10v4h4l5 4V6L8 10z" /><path d="M17 9l4 6M21 9l-4 6" /></>,
  rotate: <path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5" />,
  del: <><path d="M20 6H9l-5 6 5 6h11z" /><path d="M13 10l4 4M17 10l-4 4" /></>,
  chat: <><path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-6l-5 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" /><path d="M8 10h8M8 13h5" /></>,
  send: <><path d="M4 12L20 4l-6 16-3-7z" /><path d="M11 13l9-9" /></>,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  spark: <path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z" />
}
export default function Icon({ n, size = 22 }) {
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{P[n]}</svg>
}
