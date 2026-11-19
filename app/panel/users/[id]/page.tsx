import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonBlock } from "@/components/JsonBlock";
import { fmtUser } from "@/lib/format";
import { getUser } from "@/lib/stoat";

export const dynamic = "force-dynamic";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, account, memberOf } = await getUser(id);
  if (!user) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/panel/users" className="text-sm text-zinc-500 hover:underline">
          ← Users
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
          {fmtUser(user)}
        </h1>
        <p className="mt-1 font-mono text-xs text-zinc-500">{user._id}</p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <dt className="text-xs uppercase tracking-wide text-zinc-500">Email</dt>
          <dd className="mt-1 text-sm text-zinc-900">
            {account?.email ?? "—"}
          </dd>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <dt className="text-xs uppercase tracking-wide text-zinc-500">
            Account disabled
          </dt>
          <dd className="mt-1 text-sm text-zinc-900">
            {account?.disabled ? "yes" : "no"}
          </dd>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <dt className="text-xs uppercase tracking-wide text-zinc-500">
            Server memberships
          </dt>
          <dd className="mt-1 text-sm tabular-nums text-zinc-900">{memberOf}</dd>
        </div>
      </dl>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-zinc-900">User document</h2>
        <JsonBlock value={user} />
      </section>
      {account ? (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-zinc-900">Account document</h2>
          <JsonBlock
            value={{
              ...account,
              // never render password hashes if present
              password: account && "password" in account ? "[redacted]" : undefined,
            }}
          />
        </section>
      ) : null}
    </div>
  );
}
