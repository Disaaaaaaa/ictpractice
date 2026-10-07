// Ordering of structured-question part labels: "(a)" < "(a)(i)" < "(a)(ii)" < "(b)".
const ROMAN: Record<string, number> = { i: 1, v: 5, x: 10 };

function roman(s: string): number | null {
  if (!/^[ivx]+$/.test(s)) return null;
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const v = ROMAN[s[i]];
    const next = ROMAN[s[i + 1]] ?? 0;
    total += v < next ? -v : v;
  }
  return total;
}

export function partSortKey(label: string): number[] {
  const groups = [...label.toLowerCase().matchAll(/\(([^)]+)\)/g)].map((m) => m[1].trim());
  if (groups.length === 0) groups.push(label.toLowerCase().trim());
  return groups.map((g, depth) => {
    if (/^\d+$/.test(g)) return Number(g);
    if (depth > 0) {
      const r = roman(g);
      if (r !== null) return r;
    }
    return g.length === 1 ? g.charCodeAt(0) - 96 : 1000;
  });
}

export function comparePartLabels(a: string, b: string): number {
  const x = partSortKey(a);
  const y = partSortKey(b);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] ?? -1) - (y[i] ?? -1);
    if (d !== 0) return d;
  }
  return 0;
}

/** "a" or "(a)" or "a)(i" → "(a)", "(a)(i)". */
export function normalizePartLabel(raw: string): string {
  const s = raw.trim();
  if (!s) return s;
  if (/^\(.*\)$/.test(s)) return s.replace(/\s+/g, "");
  return s
    .split(/[\s()]+/)
    .filter(Boolean)
    .map((x) => `(${x})`)
    .join("");
}
