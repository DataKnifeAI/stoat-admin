import {
  Badge,
  DetailSection,
  Field,
  FieldGrid,
  IdList,
  IdValue,
  InspectLink,
  ServerLink,
  UserLink,
} from "@/components/Field";
import { RawDocument } from "@/components/RawDocument";
import { fmtBool, fmtEnum, fmtUlidCreated } from "@/lib/format";
import type { StoatChannel } from "@/lib/stoat";

export function ChannelDetail({
  channel,
  serverName,
}: {
  channel: StoatChannel;
  serverName?: string | null;
}) {
  const type = channel.channel_type || "Unknown";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="cyan">{type}</Badge>
        {channel.nsfw ? <Badge tone="warn">nsfw</Badge> : null}
      </div>

      {channel.description ? (
        <p className="max-w-2xl text-sm text-stoat-muted">{channel.description}</p>
      ) : null}

      <DetailSection title="Overview">
        <FieldGrid>
          <Field label="Name">
            {channel.name || <span className="text-stoat-muted">—</span>}
          </Field>
          <Field label="Type">{fmtEnum(type)}</Field>
          <Field label="Created">{fmtUlidCreated(channel._id)}</Field>
          <Field label="Channel ID" mono>
            <IdValue id={channel._id} />
          </Field>
          {channel.server ? (
            <Field label="Server">
              <ServerLink id={channel.server} label={serverName} />
            </Field>
          ) : null}
          {channel.owner ? (
            <Field label="Owner">
              <UserLink id={channel.owner} />
            </Field>
          ) : null}
          {channel.user ? (
            <Field label="User">
              <UserLink id={channel.user} />
            </Field>
          ) : null}
          <Field label="NSFW">{fmtBool(channel.nsfw)}</Field>
          <Field label="Active">{fmtBool(channel.active)}</Field>
          <Field label="Slowmode (s)">
            <span className="tabular-nums">
              {channel.slowmode ?? <span className="text-stoat-muted">—</span>}
            </span>
          </Field>
          <Field label="Last message" mono>
            {channel.last_message_id ? (
              <InspectLink id={channel.last_message_id} />
            ) : (
              <span className="text-stoat-muted">—</span>
            )}
          </Field>
          <Field label="Icon file" mono>
            <IdValue id={channel.icon?._id} />
          </Field>
        </FieldGrid>
      </DetailSection>

      {channel.recipients?.length ? (
        <DetailSection title="Recipients">
          <div className="rounded-lg border border-white/10 bg-stoat-panel p-4">
            <IdList
              ids={channel.recipients}
              hrefFor={(id) => `/panel/users/${id}`}
            />
          </div>
        </DetailSection>
      ) : null}

      <RawDocument value={channel} title="Raw channel document" />
    </div>
  );
}
