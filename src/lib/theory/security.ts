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

// ---------------------------------------------------------------------------
// Symmetric and asymmetric encryption (toy versions for the theory widget)
// ---------------------------------------------------------------------------
/**
 * Vigenère cipher: each letter is shifted by the matching letter of the key
 * (A = 0 … Z = 25), so the same secret key encrypts and decrypts — symmetric.
 * Other characters are kept and do not use up a key letter.
 */
export function vigenere(text: string, key: string, decrypt = false): string {
  const shifts = [...key.toUpperCase()].filter((c) => c >= "A" && c <= "Z").map((c) => c.charCodeAt(0) - 65);
  if (shifts.length === 0) return text;
  let i = 0;
  return text.replace(/[a-z]/gi, (ch) => caesar(ch, (decrypt ? -1 : 1) * shifts[i++ % shifts.length]));
}

/** base^exp mod m (exact while m² stays below 2^53, as for the toy key). */
export function modPow(base: number, exp: number, m: number): number {
  let r = 1;
  let b = base % m;
  for (let e = exp; e > 0; e = Math.floor(e / 2)) {
    if (e % 2 === 1) r = (r * b) % m;
    b = (b * b) % m;
  }
  return r;
}

/** A tiny RSA key pair (p = 61, q = 53). Real keys are 2048 bits or more. */
export const TOY_RSA = { n: 3233, e: 17, d: 2753 } as const;

/** Applies an RSA key (exponent, n) to every number: c = m^exp mod n. */
export function rsaApply(values: number[], exp: number, n: number = TOY_RSA.n): number[] {
  return values.map((v) => modPow(v, exp, n));
}

// ---------------------------------------------------------------------------
// Biometrics: the match threshold trades false acceptance for false rejection
// ---------------------------------------------------------------------------
/** Standard normal cumulative distribution (Abramowitz–Stegun 7.1.26, error < 1.5e-7). */
export function normalCdf(x: number, mean = 0, sd = 1): number {
  const z = (x - mean) / (sd * Math.SQRT2);
  const t = 1 / (1 + 0.3275911 * Math.abs(z));
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z);
  return 0.5 * (1 + (z >= 0 ? y : -y));
}

/** Match scores (0–100) of the right person and of other people, as a typical fingerprint reader gives them. */
export const BIOMETRIC_SCORES = { genuine: { mean: 72, sd: 9 }, impostor: { mean: 38, sd: 10 } } as const;

/** False acceptance and false rejection rates (0–1) when a score of `threshold` or more is accepted. */
export function biometricRates(threshold: number): { far: number; frr: number } {
  const { genuine, impostor } = BIOMETRIC_SCORES;
  return { far: 1 - normalCdf(threshold, impostor.mean, impostor.sd), frr: normalCdf(threshold, genuine.mean, genuine.sd) };
}
