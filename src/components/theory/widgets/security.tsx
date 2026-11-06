"use client";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { BIOMETRIC_SCORES, SCHOOL_RULES, TOY_RSA, WEEK, backupsNeeded, biometricRates, caesar, charsetSize, crackTime, firstMatch, log10Combinations, rsaApply, vigenere } from "@/lib/theory/security";

const box = "rounded-lg border border-border bg-surface p-4";
const inputCls = "h-10 w-full rounded-lg border border-border bg-surface px-3 font-mono text-sm focus:border-primary focus:outline-none";

/** Encrypt / decrypt with a Caesar cipher, and break it by trying every key. */
export function CaesarCipher() {
  const [text, setText] = useState("MEET AT THE LIBRARY");
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const out = caesar(text, mode === "encrypt" ? shift : -shift);
  return (
    <div className={box}>
      <div className="grid gap-3 sm:grid-cols-[1fr_8rem_9rem]">
        <label className="space-y-1 text-sm">
          <span className="font-medium">{mode === "encrypt" ? "Plaintext" : "Ciphertext"}</span>
          <input className={inputCls} value={text} maxLength={120} onChange={(e) => setText(e.target.value)} />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Key (shift)</span>
          <input className={inputCls} type="number" min={0} max={25} value={shift} onChange={(e) => setShift(Math.max(0, Math.min(25, Number(e.target.value) || 0)))} />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Mode</span>
          <select className={inputCls} value={mode} onChange={(e) => setMode(e.target.value as "encrypt" | "decrypt")}>
            <option value="encrypt">Encrypt</option>
            <option value="decrypt">Decrypt</option>
          </select>
        </label>
      </div>
      <div className="mt-3 rounded-md bg-surface-2 px-3 py-2">
        <p className="text-xs text-muted">{mode === "encrypt" ? "Ciphertext" : "Plaintext"}</p>
        <p className="font-mono text-base font-semibold break-all">{out || "—"}</p>
      </div>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer font-medium">Brute-force attack: try all 25 keys</summary>
        <p className="mt-1 text-xs text-muted">An attacker who does not know the key simply tries every shift and looks for a message that makes sense.</p>
        <ol className="mt-2 grid gap-x-4 gap-y-0.5 font-mono text-xs sm:grid-cols-2">
          {Array.from({ length: 25 }, (_, i) => i + 1).map((k) => (
            <li key={k} className={cn(mode === "decrypt" && k === shift && "font-bold text-primary")}>
              {String(k).padStart(2, " ")}: {caesar(text, -k).slice(0, 40)}
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}

/** Send a packet through the school's firewall rules and see which rule decides. */
export function FirewallTester() {
  const [source, setSource] = useState("Internet");
  const [port, setPort] = useState(3306);
  const hit = firstMatch(SCHOOL_RULES, { port, source });
  const rule = SCHOOL_RULES[hit];
  return (
    <div className={box}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium">The packet comes from</span>
          <select className={inputCls} value={source} onChange={(e) => setSource(e.target.value)}>
            <option>Internet</option>
            <option>IT office</option>
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Destination port</span>
          <select className={inputCls} value={port} onChange={(e) => setPort(Number(e.target.value))}>
            <option value={443}>443 — HTTPS (website)</option>
            <option value={80}>80 — HTTP (unencrypted web)</option>
            <option value={22}>22 — SSH (remote login)</option>
            <option value={23}>23 — Telnet (old remote login)</option>
            <option value={3306}>3306 — MySQL (database)</option>
          </select>
        </label>
      </div>
      <ol className="mt-4 space-y-1 text-sm">
        {SCHOOL_RULES.map((r, i) => (
          <li
            key={i}
            className={cn(
              "flex flex-wrap items-center gap-2 rounded-md border px-3 py-1.5",
              i === hit ? (r.action === "allow" ? "border-success bg-success-soft" : "border-danger bg-danger-soft") : i < hit ? "border-border text-muted line-through decoration-muted/50" : "border-border text-muted",
            )}
          >
            <span className="font-mono text-xs">Rule {i + 1}</span>
            <span className="font-mono text-xs">port {r.port} · from {r.source}</span>
            <span className={cn("rounded px-1.5 text-xs font-semibold uppercase", r.action === "allow" ? "text-success" : "text-danger")}>{r.action}</span>
            <span className="text-xs">{r.note}</span>
          </li>
        ))}
      </ol>
      <p className={cn("mt-3 text-sm font-semibold", rule.action === "allow" ? "text-success" : "text-danger")}>
        {rule.action === "allow" ? "Allowed" : "Blocked"} by rule {hit + 1}. The firewall checks the rules from the top and stops at the first one that matches.
      </p>
    </div>
  );
}

/** How long a brute-force attack would take — nothing typed here leaves the page. */
export function PasswordStrength() {
  const [pw, setPw] = useState("sunny2009");
  const size = charsetSize(pw);
  const log = log10Combinations(pw);
  // full class names, so that Tailwind keeps them
  const rating = log < 10 ? ["Very weak", "text-danger"] : log < 14 ? ["Weak", "text-warning"] : log < 18 ? ["Fair", "text-info"] : ["Strong", "text-success"];
  return (
    <div className={box}>
      <label className="space-y-1 text-sm">
        <span className="font-medium">Try a password</span>
        <input className={inputCls} value={pw} maxLength={40} autoComplete="off" spellCheck={false} onChange={(e) => setPw(e.target.value)} />
      </label>
      <p className="mt-1 text-xs text-muted">Do not type a real password. Nothing you type is saved or sent anywhere.</p>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-4">
        {[
          ["Length", String(pw.length)],
          ["Characters used", `${size} kinds`],
          ["Possible passwords", pw ? `about 10^${Math.round(log)}` : "—"],
          ["Brute force at 10 billion guesses / s", crackTime(pw)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-md bg-surface-2 px-3 py-2">
            <dt className="text-xs text-muted">{k}</dt>
            <dd className="font-mono font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
      {pw && <p className={cn("mt-3 text-sm font-semibold", rating[1])}>{rating[0]}</p>}
      <p className="mt-1 text-xs text-muted">
        Each extra character multiplies the number of possibilities. Real attackers try dictionary words and common passwords first, so a long password made of real words in a common pattern (e.g. <span className="font-mono">Password2026!</span>) is weaker than it looks here.
      </p>
    </div>
  );
}

/** Which backups are needed to restore after a failure during the week. */
export function BackupRestore() {
  const [method, setMethod] = useState<"incremental" | "differential">("incremental");
  const [failDay, setFailDay] = useState(4);
  const needed = useMemo(() => backupsNeeded(method, failDay), [method, failDay]);
  return (
    <div className={box}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium">Backups on Monday–Saturday nights</span>
          <select className={inputCls} value={method} onChange={(e) => setMethod(e.target.value as "incremental" | "differential")}>
            <option value="incremental">Incremental (changes since the last backup)</option>
            <option value="differential">Differential (changes since Sunday&apos;s full backup)</option>
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">The disk fails on the morning of</span>
          <select className={inputCls} value={failDay} onChange={(e) => setFailDay(Number(e.target.value))}>
            {WEEK.slice(1).map((d, i) => (
              <option key={d} value={i + 1}>{d}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px]">
        {WEEK.map((d, i) => {
          const night = i === 0 ? "full" : i < failDay ? method : null;
          const used = needed.some((n) => n.startsWith(d));
          return (
            <div key={d} className={cn("rounded-md border px-1 py-2", used ? "border-primary bg-primary-soft" : "border-border", i === failDay && "border-danger bg-danger-soft")}>
              <p className="font-semibold">{d.slice(0, 3)}</p>
              <p className="text-muted">{i === failDay ? "failure" : night ? night.slice(0, 4) + "." : "—"}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm">
        <span className="font-semibold">Restore, in this order:</span> {needed.join(" → ")}
      </p>
      <p className="mt-1 text-xs text-muted">
        {method === "incremental"
          ? "Incremental backups are quick to make, but every one since the full backup is needed to restore."
          : "Differential backups grow every night, but only the full backup and the latest differential are needed to restore."}{" "}
        Work done on {WEEK[failDay]} morning before the failure is lost.
      </p>
    </div>
  );
}

/** Symmetric (one shared key), asymmetric (a public / private key pair) and hashing side by side. */
export function EncryptionKeys() {
  const [tab, setTab] = useState<"symmetric" | "asymmetric" | "hashing">("symmetric");
  return (
    <div className={box}>
      <div role="tablist" className="mb-4 flex flex-wrap gap-2">
        {(["symmetric", "asymmetric", "hashing"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn("rounded-md border px-3 py-1.5 text-sm font-medium capitalize", tab === t ? "border-primary bg-primary text-primary-fg" : "border-border hover:bg-surface-2")}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "symmetric" ? <SymmetricDemo /> : tab === "asymmetric" ? <AsymmetricDemo /> : <HashDemo />}
    </div>
  );
}

const out = "rounded-md bg-surface-2 px-3 py-2";

function SymmetricDemo() {
  const [text, setText] = useState("MEET AT NOON");
  const [key, setKey] = useState("SECRET");
  const [bobKey, setBobKey] = useState("SECRET");
  const cipher = vigenere(text, key);
  const back = vigenere(cipher, bobKey, true);
  const ok = back === text;
  return (
    <div className="space-y-3 text-sm">
      <p className="text-muted">Alice and Bob share <b>one secret key</b>. The same key encrypts and decrypts (here a Vigenère cipher: each letter is shifted by the matching letter of the key).</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="font-medium">Alice&apos;s message (plaintext)</span>
          <input className={inputCls} value={text} maxLength={60} onChange={(e) => setText(e.target.value)} />
        </label>
        <label className="space-y-1">
          <span className="font-medium">Secret key</span>
          <input className={inputCls} value={key} maxLength={20} onChange={(e) => setKey(e.target.value)} />
        </label>
      </div>
      <div className={out}>
        <p className="text-xs text-muted">Ciphertext sent over the Internet</p>
        <p className="font-mono font-semibold break-all">{cipher || "—"}</p>
      </div>
      <label className="block space-y-1">
        <span className="font-medium">Bob decrypts with the key</span>
        <input className={inputCls} value={bobKey} maxLength={20} onChange={(e) => setBobKey(e.target.value)} />
      </label>
      <div className={cn(out, "border", ok ? "border-success" : "border-danger")}>
        <p className="text-xs text-muted">Bob reads</p>
        <p className="font-mono font-semibold break-all">{back || "—"}</p>
        <p className={cn("mt-1 text-xs font-semibold", ok ? "text-success" : "text-danger")}>
          {ok ? "Same key — the message is readable." : "Different key — the message stays unreadable."}
        </p>
      </div>
      <p className="text-xs text-muted">The problem: Alice must get the key to Bob <b>secretly</b> first. Anyone who intercepts the key can read every message.</p>
    </div>
  );
}

const asChars = (codes: number[]) => codes.map((c) => (c >= 32 && c < 127) || (c >= 0x400 && c < 0x4ff) ? String.fromCharCode(c) : "·").join("");

function AsymmetricDemo() {
  const [text, setText] = useState("HELLO BOB");
  const [using, setUsing] = useState<"private" | "public">("private");
  const codes = [...text].map((c) => c.charCodeAt(0)).filter((c) => c < TOY_RSA.n);
  const cipher = rsaApply(codes, TOY_RSA.e);
  const back = rsaApply(cipher, using === "private" ? TOY_RSA.d : TOY_RSA.e);
  const ok = using === "private";
  return (
    <div className="space-y-3 text-sm">
      <p className="text-muted">Bob has a <b>key pair</b>. He gives his <b>public key</b> to everyone and keeps his <b>private key</b> secret. What one key locks, only the other can unlock.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-md border border-info px-3 py-2">
          <p className="text-xs text-muted">Bob&apos;s public key — anyone may have it</p>
          <p className="font-mono font-semibold">e = {TOY_RSA.e}, n = {TOY_RSA.n}</p>
        </div>
        <div className="rounded-md border border-warning px-3 py-2">
          <p className="text-xs text-muted">Bob&apos;s private key — only Bob</p>
          <p className="font-mono font-semibold">d = {TOY_RSA.d}, n = {TOY_RSA.n}</p>
        </div>
      </div>
      <label className="block space-y-1">
        <span className="font-medium">Alice&apos;s message</span>
        <input className={inputCls} value={text} maxLength={30} onChange={(e) => setText(e.target.value)} />
      </label>
      <div className={out}>
        <p className="text-xs text-muted">Each character code m is encrypted with Bob&apos;s public key: c = m^{TOY_RSA.e} mod {TOY_RSA.n}</p>
        <p className="font-mono text-xs font-semibold break-all">{cipher.join(" ") || "—"}</p>
      </div>
      <label className="block space-y-1">
        <span className="font-medium">Try to decrypt with</span>
        <select className={inputCls} value={using} onChange={(e) => setUsing(e.target.value as "private" | "public")}>
          <option value="private">Bob&apos;s private key (Bob)</option>
          <option value="public">Bob&apos;s public key (a hacker who has it)</option>
        </select>
      </label>
      <div className={cn(out, "border", ok ? "border-success" : "border-danger")}>
        <p className="font-mono font-semibold break-all">{asChars(back) || "—"}</p>
        <p className={cn("mt-1 text-xs font-semibold", ok ? "text-success" : "text-danger")}>
          {ok ? "The private key decrypts the message." : "The public key cannot undo its own encryption — the hacker gets nonsense."}
        </p>
      </div>
      <p className="text-xs text-muted">This toy key uses tiny numbers (n = 61 × 53). Real RSA keys are 2048 bits or longer, so finding the private key from the public key would take millions of years.</p>
    </div>
  );
}

function HashDemo() {
  const [text, setText] = useState("Password123");
  const [hash, setHash] = useState("");
  useEffect(() => {
    let live = true;
    const subtle = globalThis.crypto?.subtle;
    if (!subtle) return;
    subtle.digest("SHA-256", new TextEncoder().encode(text)).then((buf) => {
      if (live) setHash([...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join(""));
    });
    return () => {
      live = false;
    };
  }, [text]);
  return (
    <div className="space-y-3 text-sm">
      <p className="text-muted">A <b>hash</b> is a fixed-length fingerprint of the data. It uses <b>no key</b> and is <b>one-way</b>: it cannot be turned back into the original. Change one character and the whole hash changes.</p>
      <label className="block space-y-1">
        <span className="font-medium">Text (do not type a real password)</span>
        <input className={inputCls} value={text} maxLength={80} autoComplete="off" spellCheck={false} onChange={(e) => setText(e.target.value)} />
      </label>
      <div className={out}>
        <p className="text-xs text-muted">SHA-256 hash (always 64 hexadecimal characters)</p>
        <p className="font-mono text-xs font-semibold break-all">{hash || "—"}</p>
      </div>
      <p className="text-xs text-muted">Websites store the hash of your password, not the password. At login they hash what you type and compare the two hashes. Nothing typed here leaves the page.</p>
    </div>
  );
}

/** Moving the match threshold of a fingerprint reader: false acceptances fall as false rejections rise. */
export function BiometricThreshold() {
  const [t, setT] = useState(55);
  const { far, frr } = biometricRates(t);
  const W = 560;
  const H = 150;
  const x = (score: number) => (score / 100) * W;
  const pdf = (v: number, m: number, sd: number) => Math.exp(-((v - m) ** 2) / (2 * sd * sd)) / (sd * Math.sqrt(2 * Math.PI));
  const peak = pdf(BIOMETRIC_SCORES.genuine.mean, BIOMETRIC_SCORES.genuine.mean, BIOMETRIC_SCORES.genuine.sd) * 1.15;
  const y = (d: number) => H - (d / peak) * (H - 10);
  const curve = (m: number, sd: number, from = 0, to = 100) => {
    const pts: string[] = [];
    for (let v = from; v <= to; v += 0.5) pts.push(`${x(v).toFixed(1)},${y(pdf(v, m, sd)).toFixed(1)}`);
    return pts;
  };
  const { genuine: g, impostor: im } = BIOMETRIC_SCORES;
  const area = (m: number, sd: number, from: number, to: number) => `M${x(from)},${H} L${curve(m, sd, from, to).join(" L")} L${x(to)},${H} Z`;
  const pct = (v: number) => (v < 0.001 ? "< 0.1%" : `${(v * 100).toFixed(v < 0.1 ? 1 : 0)}%`);
  const verdict = t >= 70 ? "Very strict — almost no strangers get in, but genuine users are often refused (e.g. a bank vault)." : t <= 45 ? "Very relaxed — users are rarely refused, but strangers are often let in. Not secure." : "A balance between security and convenience (e.g. a phone).";
  return (
    <div className={box}>
      <svg viewBox={`0 0 ${W} ${H + 22}`} className="w-full" role="img" aria-label="Match scores of genuine users and impostors with the threshold">
        <path d={area(im.mean, im.sd, t, 100)} className="fill-danger/30" />
        <path d={area(g.mean, g.sd, 0, t)} className="fill-warning/40" />
        <polyline points={curve(im.mean, im.sd).join(" ")} className="fill-none stroke-danger" strokeWidth={2} />
        <polyline points={curve(g.mean, g.sd).join(" ")} className="fill-none stroke-success" strokeWidth={2} />
        <line x1={x(t)} x2={x(t)} y1={4} y2={H} className="stroke-fg" strokeWidth={2} strokeDasharray="4 3" />
        <line x1={0} x2={W} y1={H} y2={H} className="stroke-border" />
        <text x={x(im.mean)} y={H + 16} textAnchor="middle" className="fill-danger text-[11px]">other people</text>
        <text x={x(g.mean)} y={H + 16} textAnchor="middle" className="fill-success text-[11px]">the right person</text>
      </svg>
      <label className="mt-2 block space-y-1 text-sm">
        <span className="font-medium">Match threshold: a score of {t} or more is accepted</span>
        <input type="range" min={30} max={95} value={t} onChange={(e) => setT(Number(e.target.value))} className="w-full" />
      </label>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div className="rounded-md bg-danger-soft px-3 py-2">
          <dt className="text-xs text-muted">False acceptance — a stranger is let in</dt>
          <dd className="font-mono text-lg font-semibold">{pct(far)}</dd>
        </div>
        <div className="rounded-md bg-warning-soft px-3 py-2">
          <dt className="text-xs text-muted">False rejection — the right person is refused</dt>
          <dd className="font-mono text-lg font-semibold">{pct(frr)}</dd>
        </div>
      </dl>
      <p className="mt-2 text-sm">{verdict}</p>
      <p className="mt-1 text-xs text-muted">Each scan gives a similarity score. The green curve shows the scores of the right person, the red one the scores of other people. They overlap, so no threshold removes both errors.</p>
    </div>
  );
}
