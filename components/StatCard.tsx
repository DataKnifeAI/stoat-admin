export function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number | string;
  href?: string;
}) {
  const inner = (
    <>
      <div className="text-xs font-medium uppercase tracking-wide text-stoat-muted">
        {label}
      </div>
      <div className="mt-2 text-3xl font-semibold tabular-nums text-stoat-text">
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
    </>
  );
  const cls =
    "block rounded-xl border border-white/10 bg-stoat-panel p-4 transition hover:border-stoat-cyan/40";
  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return <div className={cls}>{inner}</div>;
}
