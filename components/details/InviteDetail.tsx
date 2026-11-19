import {
  Badge,
  DetailSection,
  Field,
  FieldGrid,
  IdValue,
  InspectLink,
  ServerLink,
  UserLink,
} from "@/components/Field";
import { RawDocument } from "@/components/RawDocument";
import { fmtEnum, fmtUlidCreated, fmtUser } from "@/lib/format";
import type { StoatInvite, StoatUser } from "@/lib/stoat";

export function InviteDetail({
  invite,
  creator,
  serverName,
}: {
  invite: StoatInvite;
  creator?: StoatUser | null;
  serverName?: string | null;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="cyan">{invite.type || "Invite"}</Badge>
      </div>

      <DetailSection title="Overview">
        <FieldGrid>
          <Field label="Code / ID" mono>
            <IdValue id={invite._id} />
          </Field>
          <Field label="Type">{fmtEnum(invite.type)}</Field>
          <Field label="Created">{fmtUlidCreated(invite._id)}</Field>
          <Field label="Server">
            <ServerLink id={invite.server} label={serverName} />
          </Field>
          <Field label="Channel" mono>
            <InspectLink id={invite.channel} />
          </Field>
          <Field label="Creator">
            {creator ? (
              <UserLink id={creator._id} label={fmtUser(creator)} />
            ) : (
              <UserLink id={invite.creator} />
            )}
          </Field>
          {invite.member_count != null ? (
            <Field label="Member count">
              <span className="tabular-nums">{invite.member_count}</span>
            </Field>
          ) : null}
        </FieldGrid>
      </DetailSection>

      <RawDocument value={invite} title="Raw invite document" />
    </div>
  );
}
