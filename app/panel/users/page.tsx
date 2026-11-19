import Link from "next/link";
import { SearchForm } from "@/components/SearchForm";
import { fmtUser, shortId } from "@/lib/format";
import { listUsers } from "@/lib/stoat";

export const dynamic = "force-dynamic";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const { items, total } = await listUsers({ q });

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Users</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {total.toLocaleString()} match{total === 1 ? "" : "es"}
          </p>
        </div>
        <SearchForm
          action="/panel/users"
          placeholder="Username or user ULID"
          defaultValue={q}
        />
      </header>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Flags</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-zinc-500">
                  No users found.
                </td>
              </tr>
            ) : (
              items.map((u) => (
                <tr key={u._id} className="border-t border-zinc-100 hover:bg-zinc-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/panel/users/${u._id}`}
                      className="font-medium text-zinc-900 hover:underline"
                    >
                      {fmtUser(u)}
                    </Link>
                    {u.bot ? (
                      <span className="ml-2 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-zinc-600">
                        bot
                      </span>
                    ) : null}
                    {u.privileged ? (
                      <span className="ml-2 rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-orange-800">
                        privileged
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                    {shortId(u._id)}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-zinc-600">
                    {u.flags ?? 0}
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
