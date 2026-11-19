import { ulidTimestampMs } from "./ulid";

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

/** Coerce Mongo Long / numberish values to a finite number when possible. */
export function asNumber(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  if (typeof value === "object" && value !== null) {
    const o = value as { low?: unknown; high?: unknown; toNumber?: () => number };
    if (typeof o.toNumber === "function") {
      try {
        const n = o.toNumber();
        return Number.isFinite(n) ? n : null;
      } catch {
        /* fall through */
      }
    }
    if (typeof o.low === "number" && typeof o.high === "number") {
      // signed 64-bit approx — fine for flag bitfields used here
      return o.low + o.high * 0x1_0000_0000;
    }
  }
  return null;
}

export function fmtDate(value: unknown): string {
  if (value == null) return "—";
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return d.toISOString().replace("T", " ").slice(0, 19) + " UTC";
    }
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().replace("T", " ").slice(0, 19) + " UTC";
  }
  const n = asNumber(value);
  if (n != null && n > 1e11) {
    return new Date(n).toISOString().replace("T", " ").slice(0, 19) + " UTC";
  }
  return String(value);
}

export function fmtUlidCreated(id: string | null | undefined): string {
  if (!id) return "—";
  const ms = ulidTimestampMs(id);
  if (ms == null) return "—";
  return fmtDate(ms);
}

export function fmtBool(value: unknown): string {
  if (value == null) return "—";
  return value ? "yes" : "no";
}

export function fmtEnum(value: unknown): string {
  if (value == null || value === "") return "—";
  return String(value);
}

const USER_FLAG_BITS: [number, string][] = [
  [1, "Suspended"],
  [2, "Deleted"],
  [4, "Banned"],
  [8, "Spam"],
];

const USER_BADGE_BITS: [number, string][] = [
  [1, "Developer"],
  [2, "Translator"],
  [4, "Supporter"],
  [8, "Responsible Disclosure"],
  [16, "Founder"],
  [32, "Platform Moderation"],
  [64, "Active Supporter"],
  [128, "Paw"],
  [256, "Early Adopter"],
  [512, "Reserved Relevant Joke Badge 1"],
  [1024, "Reserved Relevant Joke Badge 2"],
];

export function decodeBitfield(
  value: unknown,
  bits: [number, string][],
): { raw: number; labels: string[] } {
  const raw = asNumber(value) ?? 0;
  const labels = bits.filter(([bit]) => (raw & bit) !== 0).map(([, label]) => label);
  return { raw, labels };
}

export function decodeUserFlags(value: unknown) {
  return decodeBitfield(value, USER_FLAG_BITS);
}

export function decodeUserBadges(value: unknown) {
  return decodeBitfield(value, USER_BADGE_BITS);
}

const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "secret",
  "current_session",
  "mfa_ticket",
  "totp_secret",
]);

/** Deep-clone JSON-safe value with known secret fields redacted. */
export function redactDocument(value: unknown): unknown {
  return JSON.parse(
    JSON.stringify(value, (key, v) => {
      if (typeof v === "bigint") return v.toString();
      if (SENSITIVE_KEYS.has(key)) return "[redacted]";
      return v;
    }),
  );
}
