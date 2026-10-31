// Logic behind the data-protection widgets of the theory packs (kept apart from
// the components so it can be tested).

/** Shifts letters by `shift` places (negative to decrypt); other characters are kept. */
export function caesar(text: string, shift: number): string {
  const s = ((shift % 26) + 26) % 26;
  return text.replace(/[a-z]/gi, (ch) => {
    const base = ch <= "Z" ? 65 : 97;
    return String.fromCharCode(((ch.charCodeAt(0) - base + s) % 26) + base);
  });
}

// ---------------------------------------------------------------------------
// Firewall rules: the first rule that matches a packet decides
// ---------------------------------------------------------------------------
export type FirewallRule = { port: number | "any"; source: string | "any"; action: "allow" | "block"; note: string };
export type Packet = { port: number; source: string };

export const SCHOOL_RULES: FirewallRule[] = [
  { port: 443, source: "any", action: "allow", note: "HTTPS — the school website" },
  { port: 22, source: "IT office", action: "allow", note: "SSH — remote administration from the IT office only" },
  { port: 3306, source: "Internet", action: "block", note: "MySQL — the database is never reachable from outside" },
  { port: "any", source: "any", action: "block", note: "Everything else is blocked (deny by default)" },
];

export function firstMatch(rules: FirewallRule[], p: Packet): number {
  return rules.findIndex((r) => (r.port === "any" || r.port === p.port) && (r.source === "any" || r.source === p.source));
}

// ---------------------------------------------------------------------------
// Passwords: how long a brute-force attack takes
// ---------------------------------------------------------------------------
export function charsetSize(pw: string): number {
  let n = 0;
  if (/[a-z]/.test(pw)) n += 26;
  if (/[A-Z]/.test(pw)) n += 26;
  if (/[0-9]/.test(pw)) n += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) n += 33;
  return n;
}

/** log10 of the number of possible passwords of this length and character set. */
export function log10Combinations(pw: string): number {
  const n = charsetSize(pw);
  return n === 0 ? 0 : pw.length * Math.log10(n);
}

/** Time to try every combination at `guessesPerSecond`, in words. */
export function crackTime(pw: string, guessesPerSecond = 1e10): string {
  if (!pw) return "—";
  const log10Seconds = log10Combinations(pw) - Math.log10(guessesPerSecond);
  if (log10Seconds < 0) return "less than a second";
  const units: [string, number][] = [
    ["seconds", 1],
    ["minutes", 60],
    ["hours", 3600],
    ["days", 86400],
    ["years", 31_557_600],
  ];
  const seconds = 10 ** log10Seconds;
  if (log10Seconds > 15) return `about 10^${Math.round(log10Seconds - Math.log10(31_557_600))} years`;
  let [name, size] = units[0];
  for (const [u, s] of units) if (seconds >= s) [name, size] = [u, s];
  const v = seconds / size;
  return `about ${v >= 100 ? Math.round(v).toLocaleString("en-GB") : v.toFixed(v >= 10 ? 0 : 1)} ${name}`;
}

// ---------------------------------------------------------------------------
// Restoring from backups: a full backup on Sunday night, then a backup every night
// ---------------------------------------------------------------------------
export const WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

/**
 * The backups needed when the disk fails on the morning of `failDay` (1 = Monday …
 * 6 = Saturday): Sunday's full backup plus, for incremental backups, every
 * night since; for differential backups, only the last one.
 */
export function backupsNeeded(method: "incremental" | "differential", failDay: number): string[] {
  const nights = WEEK.slice(1, failDay); // Monday night … the night before the failure
  const needed = [`${WEEK[0]} (full)`];
  if (nights.length === 0) return needed;
  if (method === "incremental") return needed.concat(nights.map((d) => `${d} (incremental)`));
  return needed.concat(`${nights[nights.length - 1]} (differential)`);
}
