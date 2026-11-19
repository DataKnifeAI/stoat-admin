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
        className="min-w-0 flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-orange-600/30 placeholder:text-zinc-400 focus:ring-2"
      />
      <button
        type="submit"
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Search
      </button>
    </form>
  );
}
