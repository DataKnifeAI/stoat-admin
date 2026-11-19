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
      <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="mt-2 text-3xl font-semibold tabular-nums text-zinc-900">
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        className="block rounded-lg border border-zinc-200 bg-white p-4 transition hover:border-zinc-400"
      >
        {inner}
      </a>
    );
  }
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">{inner}</div>
  );
}
