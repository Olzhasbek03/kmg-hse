import type { BodyCounts } from '../data/passportIncidents';

function Pin({ x, y, n }: { x: number; y: number; n: number }) {
  if (n <= 0) return null;
  return (
    <g>
      <circle cx={x} cy={y} r={14} fill="#1559a8" />
      <text x={x} y={y + 4} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={700}>
        {n}
      </text>
    </g>
  );
}

export function BodySilhouette({ counts, year, title }: { counts: BodyCounts; year: number; title: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">{title}</div>
      <div className="mb-1 text-lg font-extrabold text-kmg-blue">{year}</div>
      <svg viewBox="0 0 120 260" className="h-56 w-28" aria-hidden>
        <ellipse cx="60" cy="28" rx="22" ry="26" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" />
        <rect x="38" y="52" width="44" height="70" rx="10" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" />
        <rect x="8" y="58" width="22" height="72" rx="8" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" />
        <rect x="90" y="58" width="22" height="72" rx="8" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" />
        <rect x="42" y="124" width="16" height="88" rx="8" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" />
        <rect x="62" y="124" width="16" height="88" rx="8" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" />
        <Pin x={60} y={24} n={counts.head} />
        <Pin x={60} y={88} n={counts.chest} />
        <Pin x={19} y={92} n={counts.armLeft} />
        <Pin x={101} y={92} n={counts.armRight} />
        <Pin x={50} y={168} n={counts.legLeft} />
        <Pin x={70} y={168} n={counts.legRight} />
      </svg>
    </div>
  );
}
