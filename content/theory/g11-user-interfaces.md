---
summary: Graphical, command-line, natural-language and gesture-recognition user interfaces — how they work, who they suit, and their advantages and disadvantages.
---
# Graphical user interface (GUI)
@lo 11.3.1.11

:::definition Graphical user interface (GUI)
An interface in which the user interacts with the computer through **graphical elements** — windows, icons, menus and a pointer (**WIMP**) — usually with a mouse or touchscreen.
:::

:::compare
| Advantages | Disadvantages |
|---|---|
| Easy to learn and use; no commands to remember | Uses more memory, processing power and storage |
| Suitable for beginners and non-technical users | Slower for experienced users doing repetitive tasks |
| Consistent look between applications | Many clicks/menus may be needed for one action |
| WYSIWYG — see the result while editing | Harder to automate tasks |
| Supports multitasking with several windows | Fewer advanced options than commands |
:::

# Command-line interface (CLI)
@lo 11.3.1.12

:::definition Command-line interface (CLI)
An interface in which the user types **text commands** at a prompt, and the computer replies with text.
:::

```text | Example CLI session (Windows)
C:\Users\student> mkdir Project
C:\Users\student> cd Project
C:\Users\student\Project> copy ..\report.docx .
        1 file(s) copied.
```

:::compare
| Advantages | Disadvantages |
|---|---|
| Fast for experienced users — one command can do a lot | Difficult to learn; commands and syntax must be remembered |
| Needs very little memory and processing power | Typing errors cause commands to fail |
| Commands can be combined into scripts to **automate** tasks | Not user-friendly for beginners |
| Gives full, precise control of the system | No visual feedback; easy to make a destructive mistake |
| Useful for remote administration of servers | |
:::

# Comparing GUI and CLI
@lo 11.3.1.13

:::compare GUI vs CLI
| Criterion | GUI | CLI |
|---|---|---|
| Ease of learning | Easy | Hard |
| Speed for experts | Slower | Faster |
| Resources needed | High (memory, graphics, CPU) | Low |
| Automation | Limited | Easy (scripts) |
| Typical user | General public | Programmers, network administrators |
| Errors | Few typing errors, but slower navigation | Typing/syntax errors common |
:::

:::tip
A comparison answer needs **both sides** in each point: "A GUI is **easier to learn** than a CLI **because** the user does not need to remember commands."
:::

# Natural-language and gesture-recognition interfaces
@lo 11.3.1.14

:::definition Natural language interface (NLI)
The user communicates in **everyday human language**, spoken or typed, and the computer interprets the meaning. *Examples: Siri, Alexa, Google Assistant, chatbots.*
:::

:::compare Natural language interface
| Advantages | Disadvantages |
|---|---|
| Very natural — no special training needed | Accents, dialects and background noise cause misunderstanding |
| Hands-free — useful while driving or for people with disabilities | Language is ambiguous; the system may misinterpret the request |
| Fast for simple requests | Privacy concerns — devices may record conversations |
| | Limited vocabulary and languages; needs internet and processing power |
:::

:::definition Gesture recognition interface (GRI)
The computer recognises **movements of the body** (hands, fingers, head, eyes) using cameras, touchscreens or sensors and turns them into commands. *Examples: swiping on a phone, Microsoft Kinect, VR controllers, smart TV hand gestures.*
:::

:::compare Gesture recognition interface
| Advantages | Disadvantages |
|---|---|
| Intuitive and natural; no keyboard or mouse | Gestures may be misread or performed accidentally |
| Hygienic — no touching (e.g. in hospitals) | Tiring for long use ("gorilla arm") |
| Good for games, VR and accessibility | Needs special hardware (cameras, sensors); expensive |
| | A limited set of gestures; users must learn them |
:::

:::example Choosing an interface
- A surgeon viewing X-rays during an operation → **gesture recognition** (hands are sterile, no touching).
- A network administrator configuring 50 servers → **CLI** (scripts automate the work).
- A child using a learning app → **GUI** (easy, visual).
- A driver who wants directions → **natural language** (hands-free).
:::
