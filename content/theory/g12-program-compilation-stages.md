---
summary: The stages of compilation — lexical analysis, syntax analysis, code generation and optimisation — with worked examples of each.
---
# The stages of compilation
@lo 12.5.1.3

:::mermaid From source code to machine code
flowchart LR
  S[Source code] --> L[Lexical analysis] --> Y[Syntax analysis] --> G[Code generation] --> O[Optimisation] --> M[Object / machine code]
  L -. symbol table .- Y
:::

:::compare What each stage does
| Stage | Input → output | Main tasks | Errors found |
|---|---|---|---|
| Lexical analysis | Characters → **tokens** | Removes spaces and comments; splits code into tokens (keywords, identifiers, operators, literals); builds the **symbol table** | Illegal characters, invalid identifiers |
| Syntax analysis | Tokens → **parse (syntax) tree** | Checks tokens follow the **grammar rules** of the language | Syntax errors (missing bracket, wrong order) |
| Code generation | Parse tree → **object code** | Produces machine code / intermediate code for each construct | — |
| Optimisation | Object code → **better object code** | Makes code faster or smaller without changing what it does | — |
:::

# Lexical and syntax analysis
@lo 12.5.1.4

## Lexical analysis — tokens

```c | Source line
if (count > 10) total = total + count;   // check limit
```

:::compare Tokens produced (comment and spaces removed)
| Token | Type |
|---|---|
| `if` | Keyword |
| `(` | Bracket / separator |
| `count` | Identifier |
| `>` | Relational operator |
| `10` | Numeric literal (constant) |
| `)` | Bracket / separator |
| `total` | Identifier |
| `=` | Assignment operator |
| `total` | Identifier |
| `+` | Arithmetic operator |
| `count` | Identifier |
| `;` | Separator |
:::

:::compare Symbol table
| Identifier | Type | Address |
|---|---|---|
| count | integer | 0x00A4 |
| total | integer | 0x00A8 |
:::

## Syntax analysis — the parse tree

The parser checks that the tokens form a valid statement according to the grammar, and builds a tree.

:::mermaid Parse tree for total = total + count
flowchart TB
  A["="] --> T1[total]
  A --> P["+"]
  P --> T2[total]
  P --> C[count]
:::

:::warning
`if (count > 10 total = total + count;` passes lexical analysis (all tokens are valid) but **fails syntax analysis** — a bracket is missing.
:::

# Code generation
@lo 12.5.1.5

Each node of the parse tree is turned into machine-code (or assembly) instructions.

```text | Code generated for total = total + count
LDA total     ; load total into the accumulator
ADD count     ; add count
STO total     ; store the result in total
```

- Memory addresses are allocated for variables (from the symbol table).
- The output is **object code**, which the **linker** joins with library code to create an executable file.

# Code optimisation
@lo 12.5.1.6

:::cards
### Constant folding
Calculate constant expressions at compile time: `x = 60 * 60 * 24` → `x = 86400`.
### Dead code elimination
Remove code that can **never run** or whose result is never used: `a = 5; if (a != 5) { … }` — the block is removed.
### Common sub-expression elimination
`y = (a+b)*c; z = (a+b)*d;` → compute `t = a+b` once.
### Loop optimisation
Move calculations that do not change out of a loop (**loop-invariant code motion**).
### Redundant instruction removal
`STO x` followed immediately by `LDA x` — the `LDA` is unnecessary.
:::

```c | Before and after optimisation
// before                          // after
for (i = 0; i < n; i++) {          k = r * 2;                 // moved out of the loop
    k = r * 2;                     for (i = 0; i < n; i++) {
    a[i] = k + i;                      a[i] = k + i;
}                                  }
```

:::compare Benefits and drawbacks of optimisation
| Benefits | Drawbacks |
|---|---|
| Program runs **faster** | Compilation takes **longer** |
| Uses **less memory** | Debugging is harder — compiled code differs from the source |
| Less power used (mobile devices) | Aggressive optimisation can introduce subtle bugs |
:::
