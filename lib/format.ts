export function fmtUser(u: {
  username?: string | null;
  discriminator?: string | null;
}): string {
  if (!u.username) return "(unknown)";
  return u.discriminator ? `${u.username}#${u.discriminator}` : u.username;
}

export function shortId(id: string, keep = 8): string {
  if (id.length <= keep * 2 + 1) return id;
  return `${id.slice(0, keep)}…${id.slice(-keep)}`;
}

export function fmtDate(value: unknown): string {
  if (value == null) return "—";
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toISOString().replace("T", " ").slice(0, 19);
  }
  if (typeof value === "object" && value !== null && "toString" in value) {
    const n = Number(String(value));
    if (!Number.isNaN(n) && n > 1e11) {
      return new Date(n).toISOString().replace("T", " ").slice(0, 19);
    }
  }
  return String(value);
}
