import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonBlock } from "@/components/JsonBlock";
import { fmtUser } from "@/lib/format";
import { getServer } from "@/lib/stoat";

export const dynamic = "force-dynamic";

export default async function ServerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { server, memberCount, owner } = await getServer(id);
  if (!server) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/panel/servers"
          className="text-sm text-stoat-muted hover:underline"
        >
          ← Servers
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-stoat-text">
          {server.name || "(unnamed)"}
        </h1>
        <p className="mt-1 font-mono text-xs text-stoat-muted">{server._id}</p>
        {server.description ? (
          <p className="mt-3 max-w-2xl text-sm text-stoat-muted">
            {server.description}
          </p>
        ) : null}
      </div>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-stoat-panel p-4">
          <dt className="text-xs uppercase tracking-wide text-stoat-muted">Owner</dt>
          <dd className="mt-1 text-sm text-stoat-text">
            {owner ? (
              <Link
                href={`/panel/users/${owner._id}`}
                className="hover:underline"
              >
                {fmtUser(owner)}
              </Link>
            ) : (
              server.owner || "—"
            )}
          </dd>
        </div>
        <div className="rounded-lg border border-white/10 bg-stoat-panel p-4">
          <dt className="text-xs uppercase tracking-wide text-stoat-muted">Members</dt>
          <dd className="mt-1 text-sm tabular-nums text-stoat-text">
            {memberCount}
          </dd>
        </div>
        <div className="rounded-lg border border-white/10 bg-stoat-panel p-4">
          <dt className="text-xs uppercase tracking-wide text-stoat-muted">
            Channels
          </dt>
          <dd className="mt-1 text-sm tabular-nums text-stoat-text">
            {server.channels?.length ?? 0}
          </dd>
        </div>
      </dl>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-stoat-text">Server document</h2>
        <JsonBlock value={server} />
      </section>
    </div>
  );
}
