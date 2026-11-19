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
          <h1 className="text-2xl font-semibold text-stoat-text">Users</h1>
          <p className="mt-1 text-sm text-stoat-muted">
            {total.toLocaleString()} match{total === 1 ? "" : "es"}
          </p>
        </div>
        <SearchForm
          action="/panel/users"
          placeholder="Username or user ULID"
          defaultValue={q}
        />
      </header>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-stoat-panel">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-stoat-raised text-xs uppercase tracking-wide text-stoat-muted">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Flags</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-stoat-muted">
                  No users found.
                </td>
              </tr>
            ) : (
              items.map((u) => (
                <tr key={u._id} className="border-t border-white/5 hover:bg-stoat-raised">
                  <td className="px-4 py-3">
                    <Link
                      href={`/panel/users/${u._id}`}
                      className="font-medium text-stoat-text hover:underline"
                    >
                      {fmtUser(u)}
                    </Link>
                    {u.bot ? (
                      <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium uppercase text-stoat-muted">
                        bot
                      </span>
                    ) : null}
                    {u.privileged ? (
                      <span className="ml-2 rounded bg-stoat-cyan/20 px-1.5 py-0.5 text-[10px] font-medium uppercase text-stoat-cyan">
                        privileged
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-stoat-muted">
                    {shortId(u._id)}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-stoat-muted">
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
