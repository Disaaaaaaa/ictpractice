"use client";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { SCHOOL_RULES, WEEK, backupsNeeded, caesar, charsetSize, crackTime, firstMatch, log10Combinations } from "@/lib/theory/security";

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
