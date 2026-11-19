export function AreaChart({
  series,
  color = "#00d8ff",
  label,
}: {
  series: { day: string; count: number }[];
  color?: string;
  label: string;
}) {
  const w = 560;
  const h = 160;
  const pad = { t: 12, r: 8, b: 24, l: 36 };
  const max = Math.max(1, ...series.map((s) => s.count));
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const pts = series.map((s, i) => {
    const x = pad.l + (series.length <= 1 ? innerW / 2 : (i / (series.length - 1)) * innerW);
    const y = pad.t + innerH - (s.count / max) * innerH;
    return { x, y, ...s };
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area =
    pts.length > 0
      ? `${line} L${pts[pts.length - 1].x.toFixed(1)},${(pad.t + innerH).toFixed(1)} L${pts[0].x.toFixed(1)},${(pad.t + innerH).toFixed(1)} Z`
      : "";

  return (
    <div className="rounded-xl border border-white/10 bg-stoat-panel p-4">
      <div className="mb-3 text-xs font-medium uppercase tracking-wide text-stoat-muted">
        {label}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-40 w-full" role="img" aria-label={label}>
        <defs>
          <linearGradient id={`fill-${label.replace(/\s+/g, "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((t) => {
          const y = pad.t + innerH * (1 - t);
          return (
            <g key={t}>
              <line
                x1={pad.l}
                x2={w - pad.r}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
              />
              <text
                x={pad.l - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-stoat-muted"
                fontSize="10"
              >
                {Math.round(max * t)}
              </text>
            </g>
          );
        })}
        {area ? (
          <path d={area} fill={`url(#fill-${label.replace(/\s+/g, "")})`} />
        ) : null}
        {line ? <path d={line} fill="none" stroke={color} strokeWidth="2" /> : null}
        {pts.length > 0 ? (
          <>
            <text x={pad.l} y={h - 6} className="fill-stoat-muted" fontSize="10">
              {pts[0].day.slice(5)}
            </text>
            <text
              x={w - pad.r}
              y={h - 6}
              textAnchor="end"
              className="fill-stoat-muted"
              fontSize="10"
            >
              {pts[pts.length - 1].day.slice(5)}
            </text>
          </>
        ) : null}
      </svg>
    </div>
  );
}

export function BarChart({
  items,
  color = "#00ffd8",
  label,
}: {
  items: { name: string; count: number }[];
  color?: string;
  label: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="rounded-xl border border-white/10 bg-stoat-panel p-4">
      <div className="mb-3 text-xs font-medium uppercase tracking-wide text-stoat-muted">
        {label}
      </div>
      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-stoat-muted">No data yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.name}>
              <div className="mb-1 flex justify-between gap-2 text-sm">
                <span className="truncate text-stoat-text">{item.name}</span>
                <span className="tabular-nums text-stoat-muted">
                  {item.count.toLocaleString()}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(item.count / max) * 100}%`,
                    background: color,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function HeatStrip({
  hours,
  label,
}: {
  hours: { hour: number; count: number }[];
  label: string;
}) {
  const max = Math.max(1, ...hours.map((h) => h.count));
  return (
    <div className="rounded-xl border border-white/10 bg-stoat-panel p-4">
      <div className="mb-3 text-xs font-medium uppercase tracking-wide text-stoat-muted">
        {label}
      </div>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}
      >
        {hours.map((h) => {
          const t = h.count / max;
          return (
            <div
              key={h.hour}
              title={`${h.hour}:00 UTC — ${h.count}`}
              className="aspect-square rounded-sm"
              style={{
                background: `rgba(0, 216, 255, ${0.08 + t * 0.85})`,
              }}
            />
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-stoat-muted">
        <span>00:00 UTC</span>
        <span>12:00</span>
        <span>23:00</span>
      </div>
    </div>
  );
}
