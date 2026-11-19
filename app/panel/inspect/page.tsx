import Link from "next/link";
import { BotDetail } from "@/components/details/BotDetail";
import { ChannelDetail } from "@/components/details/ChannelDetail";
import { InviteDetail } from "@/components/details/InviteDetail";
import { MessageDetail } from "@/components/details/MessageDetail";
import { ServerDetail } from "@/components/details/ServerDetail";
import { UserDetail } from "@/components/details/UserDetail";
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
            Look up a Stoat ULID across users, servers, channels, messages, bots,
            and invites.
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
        <section className="space-y-4">
          <InspectHeader
            kind="User"
            title={fmtUser(result.user)}
            href={`/panel/users/${result.user._id}`}
          />
          <UserDetail
            user={result.user}
            account={result.account}
            memberOf={result.memberOf}
          />
        </section>
      ) : result?.kind === "server" ? (
        <section className="space-y-4">
          <InspectHeader
            kind="Server"
            title={result.server.name || "(unnamed)"}
            href={`/panel/servers/${result.server._id}`}
          />
          <ServerDetail
            server={result.server}
            memberCount={result.memberCount}
            owner={result.owner}
          />
        </section>
      ) : result?.kind === "channel" ? (
        <section className="space-y-4">
          <InspectHeader
            kind="Channel"
            title={result.channel.name || result.channel.channel_type || "Channel"}
          />
          <ChannelDetail
            channel={result.channel}
            serverName={result.serverName}
          />
        </section>
      ) : result?.kind === "message" ? (
        <section className="space-y-4">
          <InspectHeader kind="Message" title="Message" />
          <MessageDetail message={result.message} author={result.author} />
        </section>
      ) : result?.kind === "bot" ? (
        <section className="space-y-4">
          <InspectHeader
            kind="Bot"
            title="Bot"
            href={`/panel/users/${result.bot._id}`}
          />
          <BotDetail bot={result.bot} owner={result.owner} />
        </section>
      ) : result?.kind === "invite" ? (
        <section className="space-y-4">
          <InspectHeader kind="Invite" title={result.invite._id} />
          <InviteDetail
            invite={result.invite}
            creator={result.creator}
            serverName={result.serverName}
          />
        </section>
      ) : null}
    </div>
  );
}

function InspectHeader({
  kind,
  title,
  href,
}: {
  kind: string;
  title: string;
  href?: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-stoat-panel p-4">
      <div className="text-xs uppercase tracking-wide text-stoat-muted">{kind}</div>
      {href ? (
        <Link
          href={href}
          className="mt-1 inline-block text-lg font-semibold text-stoat-text hover:underline"
        >
          {title}
        </Link>
      ) : (
        <div className="mt-1 text-lg font-semibold text-stoat-text">{title}</div>
      )}
    </div>
  );
}
