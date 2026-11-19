import Link from "next/link";
import { SearchForm } from "@/components/SearchForm";
import { shortId } from "@/lib/format";
import { listServers } from "@/lib/stoat";

export const dynamic = "force-dynamic";

export default async function ServersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const { items, total } = await listServers({ q });

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Servers</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {total.toLocaleString()} match{total === 1 ? "" : "es"}
          </p>
        </div>
        <SearchForm
          action="/panel/servers"
          placeholder="Server name or ULID"
          defaultValue={q}
        />
      </header>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Channels</th>
              <th className="px-4 py-3 font-medium">Owner</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                  No servers found.
                </td>
              </tr>
            ) : (
              items.map((s) => (
                <tr key={s._id} className="border-t border-zinc-100 hover:bg-zinc-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/panel/servers/${s._id}`}
                      className="font-medium text-zinc-900 hover:underline"
                    >
                      {s.name || "(unnamed)"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                    {shortId(s._id)}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-zinc-600">
                    {s.channels?.length ?? 0}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                    {s.owner ? (
                      <Link
                        href={`/panel/users/${s.owner}`}
                        className="hover:underline"
                      >
                        {shortId(s.owner)}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
