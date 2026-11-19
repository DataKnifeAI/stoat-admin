import Link from "next/link";
import { JsonBlock } from "@/components/JsonBlock";
import { SearchForm } from "@/components/SearchForm";
import { fmtUser } from "@/lib/format";
import { inspectId } from "@/lib/stoat";

export const dynamic = "force-dynamic";

export default async function InspectPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const result = q?.trim() ? await inspectId(q.trim()) : null;

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div>
          <h1 className="text-2xl font-semibold text-stoat-text">Inspect ID</h1>
          <p className="mt-1 text-sm text-stoat-muted">
            Look up a Stoat ULID across users, servers, channels, messages, and
            bots.
          </p>
        </div>
        <SearchForm
          action="/panel/inspect"
          placeholder="01…"
          defaultValue={q}
        />
      </header>

      {!q?.trim() ? null : result?.kind === "none" ? (
        <p className="rounded-lg border border-white/10 bg-stoat-panel px-4 py-6 text-sm text-stoat-muted">
          No document found for <span className="font-mono">{q.trim()}</span>.
        </p>
      ) : result?.kind === "user" ? (
        <section className="space-y-3">
          <div className="rounded-lg border border-white/10 bg-stoat-panel p-4">
            <div className="text-xs uppercase tracking-wide text-stoat-muted">
              User
            </div>
            <Link
              href={`/panel/users/${result.user._id}`}
              className="mt-1 inline-block text-lg font-semibold text-stoat-text hover:underline"
            >
              {fmtUser(result.user)}
            </Link>
          </div>
          <JsonBlock value={{ user: result.user, account: result.account }} />
        </section>
      ) : result?.kind === "server" ? (
        <section className="space-y-3">
          <div className="rounded-lg border border-white/10 bg-stoat-panel p-4">
            <div className="text-xs uppercase tracking-wide text-stoat-muted">
              Server
            </div>
            <Link
              href={`/panel/servers/${result.server._id}`}
              className="mt-1 inline-block text-lg font-semibold text-stoat-text hover:underline"
            >
              {result.server.name || "(unnamed)"}
            </Link>
          </div>
          <JsonBlock value={result.server} />
        </section>
      ) : result ? (
        <section className="space-y-3">
          <div className="rounded-lg border border-white/10 bg-stoat-panel p-4">
            <div className="text-xs uppercase tracking-wide text-stoat-muted">
              {result.kind}
            </div>
          </div>
          <JsonBlock
            value={
              result.kind === "channel"
                ? result.channel
                : result.kind === "message"
                  ? result.message
                  : result.bot
            }
          />
        </section>
      ) : null}
    </div>
  );
}
