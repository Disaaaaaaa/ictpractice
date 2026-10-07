// Tiny Boolean-expression parser for the truth-table widget.
// Grammar (lowest → highest precedence): OR/NOR/XOR, AND/NAND, NOT, atom.
export type BoolNode =
  | { op: "var"; name: string }
  | { op: "const"; value: boolean }
  | { op: "not"; a: BoolNode }
  | { op: "and" | "or" | "xor" | "nand" | "nor"; a: BoolNode; b: BoolNode };

function tokenize(src: string): string[] {
  const tokens = src
    .replace(/[()]/g, " $& ")
    .replace(/[¬!~]/g, " NOT ")
    .replace(/[∧&·*.]/g, " AND ")
    .replace(/[∨|+]/g, " OR ")
    .replace(/⊕/g, " XOR ")
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.toUpperCase());
  if (tokens.length === 0) throw new Error("Enter an expression.");
  return tokens;
}

export function parseBoolean(src: string): BoolNode {
  const tokens = tokenize(src);
  let i = 0;
  const peek = () => tokens[i];
  const take = () => tokens[i++];

  function atom(): BoolNode {
    const t = take();
    if (t === undefined) throw new Error("Unexpected end of expression.");
    if (t === "(") {
      const e = orExpr();
      if (take() !== ")") throw new Error("Missing closing bracket.");
      return e;
    }
    if (t === "NOT") return { op: "not", a: atom() };
    if (t === "1" || t === "TRUE") return { op: "const", value: true };
    if (t === "0" || t === "FALSE") return { op: "const", value: false };
    if (/^[A-Z]$/.test(t)) return { op: "var", name: t };
    throw new Error(`Unexpected "${t}".`);
  }
  function andExpr(): BoolNode {
    let left = atom();
    while (peek() === "AND" || peek() === "NAND") {
      const op = take() === "AND" ? "and" : "nand";
      left = { op, a: left, b: atom() };
    }
    return left;
  }
  function orExpr(): BoolNode {
    let left = andExpr();
    while (peek() === "OR" || peek() === "NOR" || peek() === "XOR") {
      const t = take();
      left = { op: t === "OR" ? "or" : t === "NOR" ? "nor" : "xor", a: left, b: andExpr() };
    }
    return left;
  }

  const ast = orExpr();
  if (i < tokens.length) throw new Error(`Unexpected "${tokens[i]}".`);
  return ast;
}

export function variablesOf(n: BoolNode, acc = new Set<string>()): string[] {
  if (n.op === "var") acc.add(n.name);
  else if (n.op === "not") variablesOf(n.a, acc);
  else if (n.op !== "const") {
    variablesOf(n.a, acc);
    variablesOf(n.b, acc);
  }
  return [...acc].sort();
}

export function evaluateBoolean(n: BoolNode, env: Record<string, boolean>): boolean {
  switch (n.op) {
    case "var":
      return env[n.name] ?? false;
    case "const":
      return n.value;
    case "not":
      return !evaluateBoolean(n.a, env);
    case "and":
      return evaluateBoolean(n.a, env) && evaluateBoolean(n.b, env);
    case "or":
      return evaluateBoolean(n.a, env) || evaluateBoolean(n.b, env);
    case "xor":
      return evaluateBoolean(n.a, env) !== evaluateBoolean(n.b, env);
    case "nand":
      return !(evaluateBoolean(n.a, env) && evaluateBoolean(n.b, env));
    case "nor":
      return !(evaluateBoolean(n.a, env) || evaluateBoolean(n.b, env));
  }
}
