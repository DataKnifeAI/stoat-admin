import {
  Badge,
  DetailSection,
  Field,
  FieldGrid,
  IdValue,
  UserLink,
} from "@/components/Field";
import { RawDocument } from "@/components/RawDocument";
import { fmtBool, fmtUlidCreated, fmtUser } from "@/lib/format";
import type { StoatBot, StoatUser } from "@/lib/stoat";

export function BotDetail({
  bot,
  owner,
}: {
  bot: StoatBot;
  owner?: StoatUser | null;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="muted">bot</Badge>
        {bot.public ? <Badge tone="teal">public</Badge> : <Badge>private</Badge>}
      </div>

      <DetailSection title="Overview">
        <FieldGrid>
          <Field label="Bot user ID" mono>
            <IdValue id={bot._id} />
          </Field>
          <Field label="Created">{fmtUlidCreated(bot._id)}</Field>
          <Field label="Owner">
            {owner ? (
              <UserLink id={owner._id} label={fmtUser(owner)} />
            ) : (
              <UserLink id={bot.owner} />
            )}
          </Field>
          <Field label="Public">{fmtBool(bot.public)}</Field>
          <Field label="Flags">
            <span className="tabular-nums">{bot.flags ?? 0}</span>
          </Field>
          <Field label="Token">
            <span className="text-stoat-muted">[redacted]</span>
          </Field>
          <Field label="Interactions URL" span>
            {bot.interactions_url || (
              <span className="text-stoat-muted">—</span>
            )}
          </Field>
          <Field label="Terms of service" span>
            {bot.terms_of_service_url || (
              <span className="text-stoat-muted">—</span>
            )}
          </Field>
          <Field label="Privacy policy" span>
            {bot.privacy_policy_url || (
              <span className="text-stoat-muted">—</span>
            )}
          </Field>
        </FieldGrid>
      </DetailSection>

      <RawDocument
        value={{ ...bot, token: bot.token ? "[redacted]" : undefined }}
        title="Raw bot document"
      />
    </div>
  );
}
