export function JsonBlock({ value }: { value: unknown }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-xs leading-relaxed text-stoat-teal">
      {JSON.stringify(
        value,
        (_, v) => (typeof v === "bigint" ? v.toString() : v),
        2,
      )}
    </pre>
  );
}
