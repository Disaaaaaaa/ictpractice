---
summary: What an expert system is, its components and how it reasons, and how to create a simple expert system in Prolog with facts, rules (AND, OR, NOT), variables, queries and recursion.
---
# What an expert system is
@lo 12.5.1.2

:::definition Expert system
A computer program that **stores the knowledge of human experts** in a particular field and uses **reasoning** to give advice, make a diagnosis or reach a decision, in the way a human expert would.
:::

Expert systems are used where expert knowledge is **rare, expensive or needed quickly**: medical diagnosis, fault-finding in cars and machines, mineral prospecting, financial advice, credit approval, plant and animal identification, chess.

:::mermaid Components of an expert system
flowchart LR
  U[User] <--> UI[User interface]
  UI <--> IE[Inference engine]
  IE <--> KB[Knowledge base: facts and rules]
  IE --> EX[Explanation system]
  EX --> UI
  KE[Knowledge engineer and experts] --> ED[Knowledge-base editor]
  ED --> KB
:::

:::compare The parts of an expert system
| Component | Purpose |
|---|---|
| **Knowledge base** | Stores the **facts** and **rules** collected from experts (e.g. *IF fever AND rash THEN measles*) |
| **Inference engine** | The reasoning part: **applies the rules to the facts** to reach conclusions and decides which question to ask next |
| **User interface** | Asks the user questions and shows the results (often yes/no or menu answers) |
| **Explanation system** | Shows **how** a conclusion was reached — which rules were used and why a question was asked |
| **Knowledge-base editor** | Lets experts / the knowledge engineer **add, change or delete** facts and rules |
:::

:::steps How an expert system is created
- A **knowledge engineer** interviews **experts** and studies documents to collect their knowledge.
- The knowledge is written as **facts and rules** in the knowledge base (e.g. in Prolog).
- The **inference engine** and **user interface** are built or an **expert system shell** is used (an empty system that only needs a knowledge base).
- The system is **tested** with real cases whose answers the experts know, and the rules are refined.
:::

:::compare Forward and backward chaining — how the inference engine reasons
| | Forward chaining | Backward chaining |
|---|---|---|
| Starts from | The **known facts** | A **goal** (hypothesis) to prove |
| Works | Applies rules to the facts to derive **new facts** until a conclusion is reached | Looks for rules that would prove the goal, then tries to prove their conditions |
| Question it answers | "What can I conclude from these facts?" | "Is this conclusion true?" |
| Typical use | Monitoring, planning, control | Diagnosis — **Prolog uses backward chaining** |
:::

:::cards
### Advantages of expert systems
- Give **consistent** answers — not affected by tiredness or emotion.
- Available **24/7** and in many places at once; expert knowledge is not lost when an expert retires.
- **Fast** — can consider many rules in seconds.
- **Cheaper** than employing many human experts; can **explain** their reasoning.
### Disadvantages
- Have **no common sense** — cannot handle situations outside the rules.
- Expensive and slow to **build**; knowledge must be kept **up to date**.
- Depend on the **quality of the rules** — a wrong rule gives wrong advice.
- Cannot learn by themselves (unlike machine learning); users may trust them too much.
:::

# Facts in Prolog
@lo 12.5.1.2

Prolog (**PRO**gramming in **LOG**ic) is a **declarative** language that is ideal for building expert systems: the knowledge base is written directly as facts and rules, and Prolog's built-in inference engine answers queries.

:::definition Fact
A statement that is **always true**. It has a **predicate** (relation) name and **arguments** in brackets, and ends with a **full stop**.
:::

```prolog | A knowledge base of flights (facts)
1  direct(almaty, astana).
2  direct(almaty, shymkent).
3  direct(astana, aktau).
4  direct(shymkent, turkestan).
5  direct(astana, pavlodar).
6  flies(astana, air_astana).
7  flies(aktau, scat).
8  flies(pavlodar, fly_jet).
9  flies(aktau, fly_jet).
```

:::compare Rules for writing facts
| Rule | Example |
|---|---|
| Predicate names and **constants** start with a **lower-case** letter | `direct`, `almaty`, `air_astana` |
| Words in a constant are joined with `_` | `fly_jet`, `kaz_air` |
| Each fact ends with a **full stop** | `direct(almaty, astana).` |
| The **order** of arguments matters and must be used consistently | `direct(From, To)` — always from first |
| Numbers can be arguments | `age(dana, 17).` |
:::

:::warning Capital letters
In Prolog a word starting with a **capital letter** is a **variable**. `direct(Turkestan, kokshetau).` does **not** store the city Turkestan — it means "anything has a direct flight to kokshetau". Write constants in **lower case**: `direct(turkestan, kokshetau).`
:::

# Queries and variables
@lo 12.5.1.2

:::definition Query (goal)
A question asked of the knowledge base, written after `?-`. Prolog answers **true / false**, or gives the **values of the variables** that make the query true.
:::

```prolog | Queries on the flight knowledge base
?- direct(almaty, astana).       % true
?- direct(aktau, almaty).        % false (no such fact)
?- direct(almaty, X).            % X = astana ; X = shymkent
?- direct(X, aktau).             % X = astana
?- flies(X, fly_jet).            % X = pavlodar ; X = aktau
?- direct(astana, Y), flies(Y, fly_jet).   % Y = aktau ; Y = pavlodar
```

:::cards
### Variables
- Start with a **capital letter** or `_`: `X`, `City`, `Who`.
- Prolog finds **every value** that makes the query true (press `;` for the next answer).
- The **same variable** in one query or rule must have the **same value** everywhere in it.
### The anonymous variable `_`
- Means "any value — I don't care what it is".
- `?- direct(almaty, _).` → true (Almaty has at least one direct flight).
- Each `_` is independent of every other `_`.
:::

:::steps How Prolog answers ?- direct(almaty, X).
- Searches the facts **from top to bottom** for `direct(almaty, …)`.
- Line 1 matches → **X = astana** (first answer).
- On `;` it **backtracks** and continues searching → line 2 → **X = shymkent**.
- No more matches → `false` / no more answers.
:::

# Rules: AND, OR and NOT
@lo 12.5.1.2

:::definition Rule
A statement that is true **if** its conditions are true: `head :- body.` The symbol `:-` means **"if"**.
:::

:::compare Logical operators in Prolog
| Operator | Meaning | Example |
|---|---|---|
| `,` | **AND** — all conditions must be true | `connection(X, Y) :- direct(X, Z), direct(Z, Y).` |
| `;` | **OR** — at least one condition must be true | `family(X, Y) :- spouse(X, Y) ; parent_child(X, Y).` |
| `\+` | **NOT** — true if the condition **cannot** be proved | `no_flights(X) :- city(X), \+ direct(X, _).` |
| `\=` | not equal (cannot be matched) | `X \= Y` |
| `=`, `==` | equal / identical | `X = almaty` |
| `>`, `<`, `>=`, `=<` | numeric comparison | `adult(X) :- age(X, A), A >= 18.` |
:::

```prolog | Rules for the flight knowledge base
% X to Y with one change: a direct flight from X to Z AND from Z to Y
connection(X, Y) :- direct(X, Z), direct(Z, Y).

% you can travel from X to Y directly OR with one change
can_travel(X, Y) :- direct(X, Y) ; connection(X, Y).

% a city served by fly_jet that has a direct flight from astana
cheap_from_astana(Y) :- direct(astana, Y), flies(Y, fly_jet).
```

```prolog | Queries using the rules
?- connection(almaty, aktau).     % true  (almaty → astana → aktau)
?- connection(almaty, Where).     % Where = aktau ; Where = pavlodar ; Where = turkestan
?- cheap_from_astana(C).          % C = aktau ; C = pavlodar
```

:::example A family knowledge base (exam style)
```prolog
1  parent_child(aibek, bolat).
2  parent_child(aibek, dana).
3  parent_child(saule, bolat).
4  parent_child(saule, dana).
5  parent_child(bolat, erlan).
6  spouse(aibek, saule).
7  male(aibek).
8  male(bolat).
9  female(saule).
10 female(dana).
11 father(X, Y) :- parent_child(X, Y), male(X).
12 sibling(X, Y) :- parent_child(Z, X), parent_child(Z, Y), X \= Y.
13 grandparent(X, Y) :- parent_child(X, Z), parent_child(Z, Y).
14 family(X, Y) :- spouse(X, Y) ; parent_child(X, Y) ; parent_child(Y, X).
```
- **Facts** are on lines **1–10**; **rules** on lines **11–14**.
- `?- father(aibek, Y).` → `Y = bolat ; Y = dana`.
- `?- sibling(dana, Y).` → `Y = bolat` (twice — once through each parent).
- `?- grandparent(saule, Y).` → `Y = erlan`.
:::

:::tip Writing a rule in the exam
1. Write the **head** exactly as given: `sibling(X, Y) :-`
2. Translate each condition in the question into a fact pattern, sharing a variable to **link** them (`Z` is the common parent).
3. Join with `,` for AND or `;` for OR, add `X \= Y` if the two must be different, and finish with a **full stop**.
:::

# Recursion
@lo 12.5.1.2

A rule can call **itself**. Recursion lets Prolog follow a chain of any length, e.g. routes with many changes or ancestors over many generations. A recursive definition needs a **base case** (stops the recursion) and a **recursive case**.

```prolog | Recursive rules
% base case: a direct flight is a route
route(X, Y) :- direct(X, Y).
% recursive case: fly direct to Z, then find a route from Z to Y
route(X, Y) :- direct(X, Z), route(Z, Y).

% ancestors over any number of generations
ancestor(X, Y) :- parent_child(X, Y).
ancestor(X, Y) :- parent_child(X, Z), ancestor(Z, Y).
```

:::steps How Prolog proves ?- route(almaty, aktau).
- Tries the base case: `direct(almaty, aktau)` — no such fact, so it fails.
- Tries the recursive case: `direct(almaty, Z)` → **Z = astana**; now needs `route(astana, aktau)`.
- Base case: `direct(astana, aktau)` — **true**. So `route(almaty, aktau)` is **true**.
:::

:::warning Order matters in recursion
Put the **base case first** and make sure each recursive call moves **closer** to the base case; otherwise Prolog can loop forever.
:::

# Creating a simple expert system
@lo 12.5.1.2

A small diagnostic expert system: the knowledge base holds the **symptoms** of a patient (facts) and the **rules** that link symptoms to illnesses. The inference engine (Prolog itself) finds the diagnosis.

```prolog | A simple medical expert system
% ---- facts: symptoms of each patient ----
symptom(arman, fever).
symptom(arman, cough).
symptom(arman, sore_throat).
symptom(dana, sneezing).
symptom(dana, runny_nose).
symptom(timur, fever).
symptom(timur, rash).

% ---- rules: the experts' knowledge ----
illness(P, flu)     :- symptom(P, fever), symptom(P, cough).
illness(P, cold)    :- symptom(P, sneezing), symptom(P, runny_nose), \+ symptom(P, fever).
illness(P, measles) :- symptom(P, fever), symptom(P, rash).

advice(P, 'Stay at home and see a doctor') :- illness(P, flu) ; illness(P, measles).
advice(P, 'Rest and drink warm tea')       :- illness(P, cold).
```

```prolog | Using the expert system
?- illness(arman, X).     % X = flu
?- illness(Who, measles). % Who = timur
?- advice(dana, A).       % A = 'Rest and drink warm tea'
```

:::example An interactive version that asks the user
```prolog
diagnose :-
    write('Do you have a fever? (yes/no) '), read(F),
    write('Do you have a cough? (yes/no) '), read(C),
    conclude(F, C).

conclude(yes, yes) :- write('You may have flu.'), nl.
conclude(yes, no)  :- write('You may have another infection - see a doctor.'), nl.
conclude(no, _)    :- write('You probably do not have flu.'), nl.
```
`write` shows text, `read` reads the user's answer (typed as `yes.`), `nl` starts a new line. This is the **user interface**; the `conclude` rules are the **knowledge base**.
:::

:::steps Designing your own expert system
- Choose a **narrow field** (identifying birds, choosing a laptop, diagnosing a bicycle fault).
- List the **conclusions** the system can reach (the possible answers).
- For each conclusion, list the **conditions** (facts) that must be true — these become the **rules**.
- Write the **facts** about the case, then test with **queries** whose answers you know.
- Add rules for missing cases and use `\+` to separate conclusions with similar conditions.
:::

# Exam practice and summary
@lo 12.5.1.2

:::example Exam-style answers (flight knowledge base)
**Q: Write more facts. There is a direct flight from Turkestan to Kokshetau and Kaz Air flies to Kokshetau. [2]**
`direct(turkestan, kokshetau).` (1) `flies(kokshetau, kaz_air).` (1) — lower case, same argument order as the existing facts.

**Q: Use the variable Z to write the goal to find where you can fly direct from Shymkent. [2]**
`?- direct(shymkent, Z).` — predicate `direct` (1), arguments `(shymkent, Z)` (1).

**Q: It is possible to fly from X to Y if there is a direct flight from X to Z and a direct flight from Z to Y. Write a rule. [3]**
`fly(X, Y) :- direct(X, Z), direct(Z, Y).` — `direct(X, Z)` (1), `,` / AND (1), `direct(Z, Y).` (1)

**Q: Identify all line numbers in the code where facts are used. [1]**
Give **all** the lines (e.g. *1–10*); a partial list gets no mark.
:::

:::warning Common mistakes
- Starting constants with a capital letter (they become variables).
- Forgetting the **full stop** at the end of a fact or rule.
- Changing the **order of arguments** — `direct(aktau, astana)` is not the same as `direct(astana, aktau)`.
- Using a different variable where the conditions must be linked: `direct(X, Z), direct(W, Y)` does not join the two flights.
- Forgetting `X \= Y` in a sibling rule, so a person becomes their own sibling.
- Writing `:=` or `=` instead of `:-` for "if".
:::

:::steps Check yourself
- Name the five components of an expert system and describe each.
- What is the difference between forward and backward chaining?
- Give two advantages and two disadvantages of expert systems.
- What is the difference between a fact, a rule and a query?
- How do you write AND, OR and NOT in Prolog?
- Write a rule `grandparent(X, Y)` and a recursive rule `ancestor(X, Y)`.
- Design a five-rule expert system that identifies an animal.
:::
