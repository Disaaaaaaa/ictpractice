---
summary: What an expert system is, its parts — knowledge base, inference engine, user interface — and how to build a simple expert system with facts and rules in Prolog.
---
# Expert systems
@lo 12.5.1.2

:::definition Expert system
A computer program that **imitates the decision-making of a human expert** in a narrow field, using a **knowledge base** of facts and rules and an **inference engine** that reasons with them.
:::

:::cards
### Knowledge base
Facts and **IF … THEN** rules collected from human experts.
### Inference engine
Applies the rules to the facts and the user's answers to reach a **conclusion** (forward or backward chaining).
### User interface
Asks the user questions and shows conclusions — often with an **explanation** of how the conclusion was reached.
### Explanation system
Shows *why* a question is asked or *how* the result was obtained.
:::

:::mermaid Structure of an expert system
flowchart LR
  U[User] <--> UI[User interface]
  UI <--> IE[Inference engine]
  IE <--> KB[(Knowledge base: facts + rules)]
  IE --> EX[Explanation system] --> UI
:::

:::compare Uses, advantages and disadvantages
| Uses | Advantages | Disadvantages |
|---|---|---|
| Medical diagnosis, car/computer fault finding, financial advice, plant/animal identification, mineral prospecting | Consistent answers; available 24/7; preserves expert knowledge; can be used by non-experts; fast | Only as good as its rules; no common sense or intuition; expensive to build and update; cannot handle situations outside its knowledge |
:::

## Building a simple expert system in Prolog

```prolog | Animal identification expert system
% ---- facts about particular animals ----
has(tweety, feathers).
can(tweety, fly).
has(nemo, fins).
lives_in(nemo, water).
has(rex, fur).
says(rex, woof).

% ---- rules (IF conditions THEN conclusion) ----
bird(X)   :- has(X, feathers).
fish(X)   :- has(X, fins), lives_in(X, water).
mammal(X) :- has(X, fur).
dog(X)    :- mammal(X), says(X, woof).

% ---- queries ----
% ?- bird(tweety).      → true
% ?- dog(rex).          → true
% ?- fish(Who).         → Who = nemo
```

:::compare Prolog terms
| Term | Meaning | Example |
|---|---|---|
| Fact | A statement that is always true | `parent(asel, timur).` |
| Rule | A conclusion that is true IF its conditions are true (`:-` means "if", `,` means "and", `;` means "or") | `grandparent(X,Z) :- parent(X,Y), parent(Y,Z).` |
| Query (goal) | A question to the system | `?- grandparent(asel, Who).` |
| Variable | Starts with a capital letter | `X`, `Who` |
| Constant (atom) | Starts with a lower-case letter | `asel`, `chess` |
:::

```prolog | A family knowledge base and query results
parent(bolat, jiger).
parent(jiger, aliya).
child(X, Y) :- parent(Y, X).

?- child(jiger, Y).      % Y = bolat
?- parent(jiger, Y).     % Y = aliya
```

:::tip
In "identify the line numbers where facts / rules are used" questions: **facts** have no `:-`; **rules** contain `:-`. Variables in a query are answered by **unification** with the facts.
:::
