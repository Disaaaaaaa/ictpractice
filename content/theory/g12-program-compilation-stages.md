---
summary: The stages a compiler goes through — lexical analysis, syntax analysis, code generation and code optimisation — with tokens, the symbol table, parse trees, intermediate code and common optimisation techniques.
---
# Overview of compilation
@lo 12.5.1.3

A **compiler** translates the whole **source code** of a high-level program into **object code** (machine code) that the processor can execute. It does this in a sequence of **stages**; each stage takes the output of the previous one.

:::mermaid The stages of compilation
flowchart TB
  S[Source code] --> L[1 Lexical analysis]
  L -->|tokens| P[2 Syntax analysis]
  P -->|parse tree| G[3 Code generation]
  G -->|intermediate or object code| O[4 Code optimisation]
  O --> OB[Object code / executable]
  ST[(Symbol table)] -.- L
  ST -.- P
  ST -.- G
:::

:::compare What each stage does
| Stage | Input | What it does | Output | Errors found |
|---|---|---|---|---|
| **Lexical analysis** | Source code (characters) | Removes spaces and comments; splits the code into **tokens**; builds the **symbol table** | Token stream | Lexical errors: illegal characters, invalid identifiers |
| **Syntax analysis** | Tokens | Checks the tokens follow the **grammar rules** of the language; builds a **parse tree** | Parse tree / abstract syntax tree | Syntax errors: missing bracket, wrong order of tokens |
| **Code generation** | Parse tree | Produces **intermediate code** and then **object (machine) code** | Object code | — |
| **Code optimisation** | Generated code | Makes the code **faster / smaller** without changing what it does | Optimised object code | — |
:::

:::callout info Symbol table
The **symbol table** is a data structure built during lexical analysis and used by every later stage. It stores each **identifier** (variable, constant, function name) with information such as its **data type**, **scope** and **memory address**.
:::

:::callout info Semantic analysis
Many compilers add **semantic analysis** after syntax analysis: it checks that the program **makes sense** — variables are declared before use and operations have compatible **data types** (e.g. you cannot multiply a string by a Boolean).
:::

# Lexical analysis
@lo 12.5.1.3 12.5.1.4

:::definition Lexical analysis
The first stage of compilation. The **lexical analyser (lexer / scanner)** reads the source code character by character, **removes white space and comments**, and groups the characters into **lexemes**, which it converts into **tokens**. Identifiers are entered into the **symbol table**.
:::

:::cards
### Lexeme
The actual sequence of characters in the source code, e.g. `total`, `=`, `10`.
### Token
The **category** of a lexeme, sometimes with a value or a pointer to the symbol table, e.g. *Identifier (total)*, *Operator (=)*, *Number (10)*.
### Token types
**Keyword** (`if`, `while`, `int`), **Identifier** (`x`, `total`), **Operator** (`+`, `==`, `=`), **Number / literal** (`10`, `"Hi"`), **Separator / punctuation** (`(`, `)`, `;`, `{`).
:::

```c | Source code
if (x == 10)   // check the counter
    y = y + 1;
```

:::compare Tokens produced by the lexical analyser (the comment and spaces are removed)
| Lexeme | Token |
|---|---|
| `if` | Keyword |
| `(` | Bracket / separator |
| `x` | Identifier |
| `==` | Operator |
| `10` | Number |
| `)` | Bracket / separator |
| `y` | Identifier |
| `=` | Operator (assignment) |
| `y` | Identifier |
| `+` | Operator |
| `1` | Number |
| `;` | Separator |
:::

:::compare Symbol table after lexical analysis
| Index | Identifier | Kind | Data type | Address |
|---|---|---|---|---|
| 1 | `x` | variable | integer | (filled in later) |
| 2 | `y` | variable | integer | (filled in later) |
:::

:::warning Lexical errors
The lexer reports a **lexical error** when a sequence of characters does not form any valid token: an **illegal character** (`total = 5 @ 3`), an identifier that **starts with a digit** (`2price`), or an **unterminated string** (`"Hello`). It does **not** check whether the tokens are in a sensible order — that is syntax analysis.
:::

# Syntax analysis
@lo 12.5.1.3 12.5.1.4

:::definition Syntax analysis (parsing)
The second stage. The **syntax analyser (parser)** receives the **tokens** and checks that they are arranged according to the **grammar rules** (syntax) of the language. It builds a **parse tree** (or **abstract syntax tree**) showing the structure of each statement, and reports **syntax errors**.
:::

:::steps What happens during syntax analysis
- The parser receives its input in the form of **tokens** from the lexical analyser.
- It analyses each statement to make sure it **conforms to the rules of grammar** of the language (often written in **BNF**).
- It builds a **parse tree / syntax tree** that represents the structure of the statement.
- If a statement breaks the rules, it reports a **syntax error** with the line number.
:::

:::example A grammar rule in BNF
```text
<assignment> ::= <identifier> = <expression> ;
<expression> ::= <term> | <expression> + <term>
<term>       ::= <identifier> | <number>
```
`y = y + 1 ;` follows the rule, so it is accepted. `y = + 1 y ;` breaks it, so a **syntax error** is reported.
:::

:::mermaid Abstract syntax tree for y = a + b * c
flowchart TB
  A["="] --> Y[y]
  A --> P["+"]
  P --> AA[a]
  P --> M["*"]
  M --> B[b]
  M --> C[c]
:::

The tree shows the **order of operations**: `b * c` is lower in the tree, so it is calculated first, then added to `a`.

:::compare Lexical errors vs syntax errors
| | Lexical error | Syntax error |
|---|---|---|
| Found by | Lexical analyser | Syntax analyser |
| Problem | Characters do not form a valid token | Tokens are valid but in the **wrong order / structure** |
| Examples | `2total`, `x = 5 # 2`, `"text` | Missing `)` or `;`, `if x == 10` without brackets in C, `y = + 1 y;` |
:::

# Code generation
@lo 12.5.1.3 12.5.1.5

:::definition Code generation
The stage in which the compiler uses the parse tree and the symbol table to produce **intermediate code** and then **object code** — machine-code (or assembly) instructions for the target processor. Memory **addresses** are allocated to variables.
:::

:::compare From one statement to machine instructions
| Source code | Intermediate (three-address) code | Assembly / object code |
|---|---|---|
| `y = a + b * c` | `t1 = b * c` | `LDA b` |
| | `t2 = a + t1` | `MUL c` |
| | `y = t2` | `ADD a` |
| | | `STA y` |
:::

:::cards
### What the code generator does
- Translates each node of the parse tree into **instructions** of the target machine.
- **Allocates memory locations / registers** to variables and temporary values (using the symbol table).
- Chooses which **machine instructions** to use (e.g. `ADD`, `MUL`, `JMP`).
- Produces **object code**; a **linker** may later join it with library code into an executable.
### Intermediate code
- A simple, machine-independent form (e.g. three-address code: at most one operator per line).
- Makes it easier to **optimise** and to produce code for **different processors** from the same front end.
:::

```text | An IF statement after code generation
Source:        if (x == 10) y = y + 1;

Assembly:      LDA x        ; load x into the accumulator
               CMP #10      ; compare with 10
               BNE END      ; if not equal, skip the assignment
               LDA y
               ADD #1
               STA y        ; y = y + 1
       END:    ...
```

# Code optimisation
@lo 12.5.1.3 12.5.1.6

:::definition Code optimisation
The stage that **improves the generated code** so that it **runs faster** and/or **uses fewer resources (memory, storage)** — **without changing the result** of the program.
:::

:::compare Common optimisation techniques
| Technique | What it does | Before | After |
|---|---|---|---|
| **Constant folding** | Calculates constant expressions at compile time | `x = 60 * 60 * 24` | `x = 86400` |
| **Constant propagation** | Replaces a variable that holds a known constant with the value | `n = 5; y = n * 2` | `y = 10` |
| **Dead code elimination** | Removes code that can **never run** or whose result is **never used** | `if (false) { print("x") }` | *(removed)* |
| **Common sub-expression elimination** | Calculates a repeated expression once | `a = b*c + d; e = b*c + f` | `t = b*c; a = t + d; e = t + f` |
| **Loop-invariant code motion** | Moves a calculation that does not change out of a loop | `for i…: k = w * h; s = s + k*i` | `k = w * h; for i…: s = s + k*i` |
| **Strength reduction** | Replaces a slow operation with a faster one | `x * 2` | `x + x` / shift left |
| **Removing redundant instructions** | Deletes loads and stores that are not needed | `STA y` then `LDA y` | `STA y` |
:::

```c | Dead code elimination — the compiler removes the lines that can never run or have no effect
int a = 5;
int b = 10;          // b is never used afterwards → removed
return a * 2;
printf("Done");      // after return → never executed → removed
```

:::cards
### Advantages of optimisation
- The program **runs faster** — fewer instructions are executed.
- The object code is **smaller** — uses less memory and storage.
- Uses **less power** — important for mobile and embedded devices.
### Disadvantages
- Compilation takes **longer**.
- Optimised code is **harder to debug** — it no longer matches the source line by line.
- An incorrect optimisation could introduce errors (rare).
:::

:::tip Name the technique
In questions that show a code fragment, look for: **code after `return`** or an **`if` that is always false** → *dead code elimination*; **arithmetic on constants** → *constant folding*; the **same expression twice** → *common sub-expression elimination*; something **inside a loop that never changes** → *loop-invariant code motion*.
:::

# Exam practice and summary
@lo 12.5.1.3 12.5.1.4 12.5.1.5 12.5.1.6

:::example Exam-style answers
**Q: Name and describe compilation stage A (between source code and syntax analysis). [2]**
Name: **Lexical analysis** (1). Description: the stream of characters is converted into a sequence of **tokens** / white space and comments are removed (1).

**Q: Name and describe stage B (after code generation). [2]**
Name: **Code optimisation** (1). Description: the code is improved to **consume fewer resources and increase execution speed** (1).

**Q: Name the compilation stage that produces the table *Keyword – if, Bracket – (, Identifier – x, Operator – ==, Number – 10*. [1]**
**Lexical analysis.**

**Q: Describe what happens at the stage of syntax analysis. [2]**
The syntax analyser receives its input in the form of **tokens** (1) and analyses the statements to ensure they **conform to the rules of grammar** of the language, building a parse tree / reporting syntax errors (1).

**Q: Name the optimisation used when statements after `return` are removed. [1]**
**Dead code elimination.**
:::

:::warning Common mistakes
- Putting the stages in the wrong order — it is **lexical → syntax → code generation → optimisation**.
- Saying lexical analysis "checks the grammar" — it only makes **tokens**; grammar is checked in **syntax analysis**.
- Saying optimisation "removes errors" — it makes **correct** code faster or smaller.
- Confusing the **lexeme** (the characters) with the **token** (its category).
- Forgetting the **symbol table** when describing lexical analysis.
:::

:::steps Check yourself
- List the four stages of compilation in order and the output of each.
- What is the difference between a lexeme and a token?
- Tokenise `while (count < 5) count = count + 1;` and name each token type.
- What is stored in the symbol table?
- Give one example of a lexical error and one of a syntax error.
- Write three-address code for `z = (a + b) * (a + b)` and optimise it.
- Name and explain four optimisation techniques.
:::
