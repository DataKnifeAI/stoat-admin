import Link from "next/link";
import type { ReactNode } from "react";
import { CopyId } from "./CopyId";

export function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-stoat-text">{title}</h2>
      {children}
    </section>
  );
}

export function FieldGrid({ children }: { children: ReactNode }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</dl>
  );
}

export function Field({
  label,
  children,
  mono,
  span,
}: {
  label: string;
  children: ReactNode;
  mono?: boolean;
  span?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border border-white/10 bg-stoat-panel p-4 ${
        span ? "sm:col-span-2 lg:col-span-3" : ""
      }`}
    >
      <dt className="text-xs uppercase tracking-wide text-stoat-muted">{label}</dt>
      <dd
        className={`mt-1 break-words text-sm text-stoat-text ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {children ?? "—"}
      </dd>
    </div>
  );
}

export function Badge({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "cyan" | "teal" | "warn";
}) {
  const tones = {
    muted: "bg-white/10 text-stoat-muted",
    cyan: "bg-stoat-cyan/20 text-stoat-cyan",
    teal: "bg-stoat-teal/15 text-stoat-teal",
    warn: "bg-amber-400/15 text-amber-200",
  } as const;
  return (
    <span
      className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function BadgeList({ labels }: { labels: string[] }) {
  if (labels.length === 0) {
    return <span className="text-stoat-muted">none</span>;
  }
  return (
    <span className="flex flex-wrap gap-1.5">
      {labels.map((l) => (
        <Badge key={l} tone="cyan">
          {l}
        </Badge>
      ))}
    </span>
  );
}

export function UserLink({
  id,
  label,
}: {
  id?: string | null;
  label?: string | null;
}) {
  if (!id) return <span className="text-stoat-muted">—</span>;
  return (
    <Link href={`/panel/users/${id}`} className="hover:underline">
      {label || id}
    </Link>
  );
}

export function ServerLink({
  id,
  label,
}: {
  id?: string | null;
  label?: string | null;
}) {
  if (!id) return <span className="text-stoat-muted">—</span>;
  return (
    <Link href={`/panel/servers/${id}`} className="hover:underline">
      {label || id}
    </Link>
  );
}

export function InspectLink({
  id,
  label,
}: {
  id?: string | null;
  label?: string | null;
}) {
  if (!id) return <span className="text-stoat-muted">—</span>;
  return (
    <Link
      href={`/panel/inspect?q=${encodeURIComponent(id)}`}
      className="font-mono text-xs hover:underline"
    >
      {label || id}
    </Link>
  );
}

export function IdValue({ id }: { id?: string | null }) {
  if (!id) return <span className="text-stoat-muted">—</span>;
  return <CopyId id={id} className="-ml-1.5" />;
}

export function IdList({
  ids,
  hrefFor,
  empty = "none",
}: {
  ids?: string[] | null;
  hrefFor?: (id: string) => string;
  empty?: string;
}) {
  if (!ids?.length) {
    return <span className="text-stoat-muted">{empty}</span>;
  }
  return (
    <ul className="mt-1 max-h-48 space-y-1 overflow-y-auto font-mono text-xs">
      {ids.map((id) => (
        <li key={id} className="flex items-center gap-2">
          {hrefFor ? (
            <Link href={hrefFor(id)} className="hover:underline">
              {id}
            </Link>
          ) : (
            <CopyId id={id} className="-ml-1.5" />
          )}
        </li>
      ))}
    </ul>
  );
}
