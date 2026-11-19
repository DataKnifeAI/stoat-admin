const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/** Decode the millisecond timestamp embedded in a ULID / Stoat snowflake id. */
export function ulidTimestampMs(id: string): number | null {
  if (!id || id.length < 10) return null;
  let ts = 0;
  for (const raw of id.slice(0, 10)) {
    const c = raw.toUpperCase();
    const v = CROCKFORD.indexOf(c);
    if (v < 0) return null;
    ts = ts * 32 + v;
  }
  return ts;
}

export function dayKeyUTC(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}
