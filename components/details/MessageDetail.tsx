import {
  Badge,
  DetailSection,
  Field,
  FieldGrid,
  IdValue,
  InspectLink,
  UserLink,
} from "@/components/Field";
import { RawDocument } from "@/components/RawDocument";
import { fmtBool, fmtDate, fmtUlidCreated, fmtUser } from "@/lib/format";
import type { StoatMessage, StoatUser } from "@/lib/stoat";

export function MessageDetail({
  message,
  author,
}: {
  message: StoatMessage;
  author?: StoatUser | null;
}) {
  const attachmentCount = message.attachments?.length ?? 0;
  const mentionCount = message.mentions?.length ?? 0;
  const content =
    typeof message.content === "string"
      ? message.content
      : message.content == null
        ? null
        : JSON.stringify(message.content);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {message.pinned ? <Badge tone="teal">pinned</Badge> : null}
        {message.system ? <Badge tone="muted">system</Badge> : null}
        {attachmentCount > 0 ? (
          <Badge tone="cyan">{attachmentCount} attachment{attachmentCount === 1 ? "" : "s"}</Badge>
        ) : null}
      </div>

      <DetailSection title="Overview">
        <FieldGrid>
          <Field label="Created">{fmtUlidCreated(message._id)}</Field>
          <Field label="Message ID" mono>
            <IdValue id={message._id} />
          </Field>
          <Field label="Author">
            {author ? (
              <UserLink id={author._id} label={fmtUser(author)} />
            ) : (
              <UserLink id={message.author} />
            )}
          </Field>
          <Field label="Channel" mono>
            <InspectLink id={message.channel} />
          </Field>
          <Field label="Edited">
            {message.edited ? fmtDate(message.edited) : (
              <span className="text-stoat-muted">never</span>
            )}
          </Field>
          <Field label="Pinned">{fmtBool(message.pinned)}</Field>
          <Field label="Mentions">
            <span className="tabular-nums">{mentionCount}</span>
          </Field>
          <Field label="Attachments">
            <span className="tabular-nums">{attachmentCount}</span>
          </Field>
          <Field label="Nonce" mono>
            {message.nonce || <span className="text-stoat-muted">—</span>}
          </Field>
        </FieldGrid>
      </DetailSection>

      <DetailSection title="Content">
        <div className="rounded-lg border border-white/10 bg-stoat-panel p-4">
          {content ? (
            <pre className="whitespace-pre-wrap break-words font-sans text-sm text-stoat-text">
              {content}
            </pre>
          ) : message.system ? (
            <pre className="overflow-x-auto font-mono text-xs text-stoat-teal">
              {JSON.stringify(message.system, null, 2)}
            </pre>
          ) : (
            <span className="text-sm text-stoat-muted">(empty)</span>
          )}
        </div>
      </DetailSection>

      {message.replies?.length ? (
        <DetailSection title="Replies to">
          <FieldGrid>
            {message.replies.map((id) => (
              <Field key={id} label="Message" mono>
                <InspectLink id={id} />
              </Field>
            ))}
          </FieldGrid>
        </DetailSection>
      ) : null}

      <RawDocument value={message} title="Raw message document" />
    </div>
  );
}
