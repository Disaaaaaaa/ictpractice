---
summary: Analysing the benefits and restrictions of a new system, and the characteristics of software development frameworks.
---
# Advantages of a new system
@lo 11.2.2.1@paper

When proposing a new system, the analyst explains how it will improve on the current one. Benefits should be **specific to the scenario** and, where possible, **measurable**.

:::compare Typical benefits
| Benefit | Example (food store price-calculator app) |
|---|---|
| Faster processing | Selling prices calculated instantly instead of by hand |
| Fewer errors | Automatic calculation and validation — fewer mistakes in prices |
| Better information | Daily profit reports produced automatically |
| Saves time and money | Staff spend less time on paperwork |
| Better access | Data available on any device, anytime |
| Improved customer service | Shorter queues, accurate bills |
| Security and backup | Data protected by passwords and backed up, unlike paper records |
:::

:::tip
"Describe three benefits" → each answer needs the **benefit + how it helps in this scenario**: "**Auto-calculation of the price** means staff **no longer make arithmetic mistakes** when adding the 30% mark-up."
:::

# Restrictions of a new system
@lo 11.2.2.2@paper

:::compare Constraints that limit a new system
| Restriction | Example |
|---|---|
| Budget | The school can spend only 2 million tenge on hardware and software |
| Time | The system must be ready before the new academic year |
| Hardware | Must run on existing computers / older phones |
| Software and compatibility | Must work with the current database and operating system |
| Skills of users | Staff have little IT experience → training needed; interface must be simple |
| Legal | Must follow personal data protection law |
| Security | Sensitive data limits what can be stored in the cloud |
| Scope | Some features are left for a later version |
:::

# Development frameworks
@lo 11.2.2.3@paper

:::definition Development framework
A **ready-made platform of reusable code, libraries, tools and rules** on which developers build applications, instead of writing everything from scratch.
:::

:::cards
### Characteristics
- Provides a **structure** (architecture, e.g. Model–View–Controller) that the code must follow.
- **Reusable components and libraries** (forms, database access, authentication).
- Built-in **security** features (input sanitising, CSRF protection).
- **Tools**: code generators, testing tools, package managers, debuggers.
- **Documentation** and a community.
- "**Inversion of control**" — the framework calls your code, not the other way round.
### Examples
- Web: **Laravel** (PHP), **Django**/Flask (Python), **React**, **Angular**, Vue (JavaScript), ASP.NET.
- Mobile: **Flutter**, React Native, Android SDK, SwiftUI.
- Desktop/games: .NET, Qt, Unity.
:::

:::compare Using a framework
| Advantages | Disadvantages |
|---|---|
| Faster development — common features already written | Time to **learn** the framework |
| Code is more **consistent and maintainable** | Must follow its rules — less flexibility |
| Tested, secure components | Extra code may make the app larger or slower |
| Large community and documentation | Dependence on the framework's updates and lifespan |
:::
