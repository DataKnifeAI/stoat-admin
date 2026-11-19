export function SearchForm({
  action,
  placeholder,
  defaultValue,
}: {
  action: string;
  placeholder: string;
  defaultValue?: string;
}) {
  return (
    <form action={action} method="get" className="flex gap-2">
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-md border border-white/15 bg-stoat-panel px-3 py-2 text-sm text-stoat-text outline-none ring-stoat-cyan/30 placeholder:text-stoat-muted focus:ring-2"
      />
      <button
        type="submit"
        className="rounded-md bg-stoat-cyan px-4 py-2 text-sm font-medium text-stoat-slate hover:brightness-110"
      >
        Search
      </button>
    </form>
  );
}
