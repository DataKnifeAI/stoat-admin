import {
  Badge,
  BadgeList,
  DetailSection,
  Field,
  FieldGrid,
  IdValue,
  UserLink,
} from "@/components/Field";
import { RawDocument } from "@/components/RawDocument";
import {
  decodeUserBadges,
  decodeUserFlags,
  fmtBool,
  fmtUlidCreated,
  fmtUser,
} from "@/lib/format";
import type { StoatAccount, StoatUser } from "@/lib/stoat";

function statusOf(value: unknown): string {
  if (value == null) return "—";
  if (typeof value === "object" && value !== null && "status" in value) {
    return String((value as { status?: unknown }).status ?? "—");
  }
  return String(value);
}

export function UserDetail({
  user,
  account,
  memberOf,
}: {
  user: StoatUser;
  account: StoatAccount | null;
  memberOf: number;
}) {
  const flags = decodeUserFlags(user.flags);
  const badges = decodeUserBadges(user.badges);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {user.bot ? <Badge tone="muted">bot</Badge> : null}
        {user.privileged ? <Badge tone="cyan">privileged</Badge> : null}
        {account?.disabled ? <Badge tone="warn">disabled</Badge> : null}
        {flags.labels.map((l) => (
          <Badge key={l} tone="warn">
            {l}
          </Badge>
        ))}
      </div>

      <DetailSection title="Profile">
        <FieldGrid>
          <Field label="Username">{fmtUser(user)}</Field>
          <Field label="Display name">
            {user.display_name || <span className="text-stoat-muted">—</span>}
          </Field>
          <Field label="Created">{fmtUlidCreated(user._id)}</Field>
          <Field label="User ID" mono>
            <IdValue id={user._id} />
          </Field>
          <Field label="Privileged">{fmtBool(user.privileged)}</Field>
          <Field label="Server memberships">
            <span className="tabular-nums">{memberOf}</span>
          </Field>
          <Field label="Flags">
            <span className="tabular-nums text-stoat-muted">{flags.raw}</span>
            {flags.labels.length ? (
              <div className="mt-2">
                <BadgeList labels={flags.labels} />
              </div>
            ) : null}
          </Field>
          <Field label="Badges">
            <span className="tabular-nums text-stoat-muted">{badges.raw}</span>
            <div className="mt-2">
              <BadgeList labels={badges.labels} />
            </div>
          </Field>
          <Field label="Presence">
            {user.status?.presence || <span className="text-stoat-muted">—</span>}
            {user.status?.text ? (
              <div className="mt-1 text-stoat-muted">{user.status.text}</div>
            ) : null}
          </Field>
          {user.bot?.owner ? (
            <Field label="Bot owner">
              <UserLink id={user.bot.owner} />
            </Field>
          ) : null}
          <Field label="Avatar file" mono>
            <IdValue id={user.avatar?._id} />
          </Field>
        </FieldGrid>
      </DetailSection>

      <DetailSection title="Account">
        {account ? (
          <FieldGrid>
            <Field label="Email">{account.email || "—"}</Field>
            <Field label="Disabled">{fmtBool(account.disabled)}</Field>
            <Field label="Verification">{statusOf(account.verification)}</Field>
            <Field label="Deletion">
              {account.deletion == null ? (
                <span className="text-stoat-muted">none</span>
              ) : (
                <span className="font-mono text-xs">
                  {typeof account.deletion === "object"
                    ? JSON.stringify(account.deletion)
                    : String(account.deletion)}
                </span>
              )}
            </Field>
            <Field label="Lockout">
              {account.lockout == null ? (
                <span className="text-stoat-muted">none</span>
              ) : (
                <span className="font-mono text-xs">
                  {typeof account.lockout === "object"
                    ? JSON.stringify(account.lockout)
                    : String(account.lockout)}
                </span>
              )}
            </Field>
            <Field label="MFA">
              {account.mfa &&
              typeof account.mfa === "object" &&
              Object.keys(account.mfa as object).length > 0
                ? "configured"
                : "none"}
            </Field>
          </FieldGrid>
        ) : (
          <p className="rounded-lg border border-white/10 bg-stoat-panel px-4 py-3 text-sm text-stoat-muted">
            No account document (bot or missing credentials).
          </p>
        )}
      </DetailSection>

      {user.relations?.length ? (
        <DetailSection title="Relations">
          <div className="overflow-hidden rounded-lg border border-white/10 bg-stoat-panel">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-stoat-raised text-xs uppercase tracking-wide text-stoat-muted">
                <tr>
                  <th className="px-4 py-2 font-medium">User</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {user.relations.map((r) => (
                  <tr key={r._id} className="border-t border-white/5">
                    <td className="px-4 py-2">
                      <UserLink id={r._id} />
                    </td>
                    <td className="px-4 py-2 text-stoat-muted">
                      {r.status || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DetailSection>
      ) : null}

      <RawDocument value={user} title="Raw user document" />
      {account ? <RawDocument value={account} title="Raw account document" /> : null}
    </div>
  );
}
