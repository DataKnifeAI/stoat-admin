export function JsonBlock({ value }: { value: unknown }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-100">
      {JSON.stringify(value, (_, v) => (typeof v === "bigint" ? v.toString() : v), 2)}
    </pre>
  );
}
