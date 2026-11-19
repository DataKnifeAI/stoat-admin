import {
  Badge,
  DetailSection,
  Field,
  FieldGrid,
  IdList,
  IdValue,
  InspectLink,
  UserLink,
} from "@/components/Field";
import { RawDocument } from "@/components/RawDocument";
import { fmtBool, fmtUlidCreated, fmtUser } from "@/lib/format";
import type { StoatServer, StoatUser } from "@/lib/stoat";

export function ServerDetail({
  server,
  memberCount,
  owner,
}: {
  server: StoatServer;
  memberCount: number;
  owner: StoatUser | null;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {server.nsfw ? <Badge tone="warn">nsfw</Badge> : null}
        {server.discoverable ? <Badge tone="teal">discoverable</Badge> : null}
      </div>

      {server.description ? (
        <p className="max-w-2xl text-sm text-stoat-muted">{server.description}</p>
      ) : null}

      <DetailSection title="Overview">
        <FieldGrid>
          <Field label="Name">{server.name || "(unnamed)"}</Field>
          <Field label="Created">{fmtUlidCreated(server._id)}</Field>
          <Field label="Server ID" mono>
            <IdValue id={server._id} />
          </Field>
          <Field label="Owner">
            {owner ? (
              <UserLink id={owner._id} label={fmtUser(owner)} />
            ) : (
              <UserLink id={server.owner} />
            )}
          </Field>
          <Field label="Members">
            <span className="tabular-nums">{memberCount}</span>
          </Field>
          <Field label="Channels">
            <span className="tabular-nums">{server.channels?.length ?? 0}</span>
          </Field>
          <Field label="NSFW">{fmtBool(server.nsfw)}</Field>
          <Field label="Flags">
            <span className="tabular-nums">{server.flags ?? 0}</span>
          </Field>
          <Field label="Icon file" mono>
            <IdValue id={server.icon?._id} />
          </Field>
          <Field label="Banner file" mono>
            <IdValue id={server.banner?._id} />
          </Field>
        </FieldGrid>
      </DetailSection>

      <DetailSection title="Channels">
        <div className="rounded-lg border border-white/10 bg-stoat-panel p-4">
          <IdList
            ids={server.channels}
            hrefFor={(id) => `/panel/inspect?q=${encodeURIComponent(id)}`}
            empty="No channels on this server."
          />
        </div>
      </DetailSection>

      {server.system_messages &&
      Object.keys(server.system_messages).length > 0 ? (
        <DetailSection title="System message channels">
          <FieldGrid>
            {Object.entries(server.system_messages).map(([key, channelId]) => (
              <Field key={key} label={key} mono>
                {channelId ? (
                  <InspectLink id={String(channelId)} />
                ) : (
                  <span className="text-stoat-muted">—</span>
                )}
              </Field>
            ))}
          </FieldGrid>
        </DetailSection>
      ) : null}

      <RawDocument value={server} title="Raw server document" />
    </div>
  );
}
