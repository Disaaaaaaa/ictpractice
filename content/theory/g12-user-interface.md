---
summary: Evaluating user interfaces — the advantages and disadvantages of graphical, command line, natural-language and gesture-recognition interfaces, how they work, human–computer interaction principles, accessibility, and choosing the best interface for a user, task and environment.
---
# Human–computer interaction
@lo 12.3.1.4 12.3.1.5 12.3.1.6

:::definition User interface
The means by which a **user and a computer system communicate**: how the user **gives commands and data** and how the system **presents information and feedback**.
:::

A good interface depends on **three factors**:

:::compare Choosing an interface: user, task, environment
| Factor | Questions to ask | Example |
|---|---|---|
| **User** | Expert or beginner? Age? Disabilities? Language? | A system administrator vs a 7-year-old |
| **Task** | Simple or complex? Repetitive? Precise? Visual? | Configuring 100 servers vs browsing photos |
| **Environment** | Noisy or quiet? Hands free? Clean / sterile? Screen size? | A car, an operating theatre, a factory floor |
:::

:::cards
### Principles of good interface design
- **Consistency** — same layout, words and actions everywhere.
- **Feedback** — the system shows what is happening (progress bars, confirmations).
- **Error prevention and recovery** — confirmations, undo, clear error messages.
- **Recognition rather than recall** — show options instead of making users remember them.
- **Efficiency for experts** — shortcuts, commands, scripts.
- **Accessibility** — usable by people with visual, hearing or motor impairments.
### Measuring usability
- **Learnability** — how quickly a new user learns it.
- **Efficiency** — how fast an experienced user works.
- **Error rate** — how many mistakes users make.
- **Satisfaction** — how pleasant it is to use.
:::

# Graphical user interface (GUI)
@lo 12.3.1.4

:::definition GUI
An interface based on **windows, icons, menus and a pointer (WIMP)** — or touch — in which users interact by **pointing, clicking, dragging and tapping** visual objects.
:::

:::compare GUI — advantages and disadvantages
| Advantages | Disadvantages |
|---|---|
| **Intuitive / easy to learn** — users recognise icons; no commands to remember | Uses a lot of **memory, processing power and storage** for graphics |
| Suitable for **beginners** and non-technical users | **Slower for experts** — many clicks through menus |
| **Fewer errors** — choose from options; **undo** available | **Hard to automate** repetitive tasks |
| **WYSIWYG** — the result is visible while working | Some advanced settings are **hidden** |
| **Multitasking** with several windows; drag-and-drop | Needs a good screen and pointing device / touchscreen |
| Can display **images, video, charts** | Can be cluttered; icons may be unclear without labels |
:::

# Command line interface (CLI)
@lo 12.3.1.5

:::definition CLI
An interface in which the user **types text commands** with exact **syntax** at a **prompt**, and the system replies in **text**.
:::

```bash | Managing a server with a CLI
$ sudo systemctl restart nginx          # restart the web server
$ df -h                                 # show free disk space
$ for u in $(cat users.txt); do sudo useradd -m "$u"; done   # create 200 accounts in one line
```

:::compare CLI — advantages and disadvantages
| Advantages | Disadvantages |
|---|---|
| The server **does not need a complex OS / graphics**, so it does not use unnecessary computing resources | Commands and syntax must be **learnt and remembered** |
| Can run **complex commands** and **scripts** that automate many tasks at once | **Typing errors** can cause serious damage (deleting files); often no undo |
| **Fast for expert users** | **Not intuitive** for beginners; error messages hard to understand |
| **Full control** of the system and all settings | **Text only** — unsuitable for graphics |
| Works well for **remote access** over slow connections | Hard to discover what commands exist |
:::

# Natural-language interface (NLI)
@lo 12.3.1.6

:::definition Natural-language interface
An interface that lets users communicate in **ordinary human language — spoken or typed** — instead of commands or menus. Examples: voice assistants, chatbots, voice control in cars and smart homes.
:::

:::steps How a spoken request is processed
- **Speech recognition** turns sound into text (acoustic and language models).
- **Natural-language processing (NLP)** analyses the words to find the **intent** ("book a taxi") and the **entities** ("to the airport", "at 7 am").
- The system performs the action or searches for the answer.
- The reply is generated and spoken with **speech synthesis**.
:::

:::compare NLI — advantages and disadvantages
| Advantages | Disadvantages |
|---|---|
| **No need to learn commands** — speak naturally | Language is **ambiguous**, leading to **misinterpretation** of user input |
| **Hands-free and eyes-free** — while driving, cooking | May struggle with **colloquial language, homophones** or **context-based** queries |
| **Accessible** for blind users, people with motor impairments, young children | Users may need to **learn specific phrases** to be understood reliably |
| Fast for simple requests | **Accents, dialects, background noise** reduce accuracy |
| Works on devices with **no screen or keyboard** | **Privacy** — microphones always listening; recordings stored |
| Can understand **many ways** of asking the same thing | Limited support for some **languages**; needs processing power / Internet |
:::

# Gesture-recognition interface (GRI)
@lo 12.3.1.6

:::definition Gesture-recognition interface
An interface that **detects movements of the body** — hands, fingers, head, eyes — with **touchscreens, cameras, depth sensors or motion sensors** and interprets them as commands.
:::

:::steps How camera-based gesture recognition works
- A **camera / depth sensor** captures images of the user many times per second.
- Software detects the **hand or body** and tracks key points (fingertips, joints).
- The movement is **compared with known gesture patterns** (often using machine learning).
- A recognised gesture triggers a **command** (swipe → next page; open palm → pause).
:::

:::compare GRI — advantages and disadvantages
| Advantages | Disadvantages |
|---|---|
| **Natural and intuitive**; no keyboard or mouse | Gestures can be **misinterpreted** or made **accidentally** (unintended commands) |
| **Touchless** — **hygienic** in hospitals, kitchens, public kiosks | Users must **learn and remember** gestures; they differ between systems and **cultures** |
| **Immersive** for games, VR and AR | Only a **limited number** of commands |
| Helps users who cannot use traditional input devices | **Tiring** over long periods ("gorilla arm") |
| Works in **noisy** places where voice fails | Needs **cameras / sensors**; affected by **lighting** and space; less **precise** |
:::

# Comparing and choosing interfaces
@lo 12.3.1.4 12.3.1.5 12.3.1.6

:::compare The four interfaces compared
| Criterion | GUI | CLI | Natural language | Gesture |
|---|---|---|---|---|
| Ease of learning | **High** | Low | **High** | Medium |
| Speed for experts | Medium | **High** | Medium | Low–medium |
| Precision | High | **High** | Low–medium | Low |
| Resources needed | High | **Low** | High (processing / cloud) | High (sensors) |
| Hands-free | No | No | **Yes** | Partly (touchless) |
| Works in noise | Yes | Yes | **No** | **Yes** |
| Accessibility | Good for most; poor for blind users | Poor for beginners | Good for blind / motor impaired | Good for some motor impairments |
:::

:::compare Scenarios
| Scenario | Best interface | Justification |
|---|---|---|
| A system administrator controls a remote server | **CLI** | Low resources, scripts, full control, remote access |
| A driver sends a message | **Natural language** | Hands on the wheel, eyes on the road |
| A surgeon views scans during an operation | **Gesture** | Touchless keeps hands sterile |
| An elderly person makes video calls | **GUI (touch)** | Large icons, intuitive, visual |
| A noisy factory where workers wear gloves | **Gesture** or large-button **GUI** | Voice fails in noise; gloves block small touch targets |
| A blind student searches the web | **Natural language** + screen reader | Does not rely on seeing the screen |
:::

:::callout info Multimodal interfaces
Modern devices **combine** interfaces: a phone has a **touch GUI**, **gestures** (swipe, pinch), **voice** (assistant) and even a **CLI** for developers. Combining them lets each user choose the most suitable way.
:::

# Exam practice and summary
@lo 12.3.1.4 12.3.1.5 12.3.1.6

:::example Exam-style answers
**Q: A system administrator controls a server using a command line interface. State one advantage and one disadvantage of using a command line interface. [2]**
Advantage: the server **does not need a complex operating system**, so it does not use **unnecessary computing resources** / can run **complex commands and scripts** (1). Disadvantage: the administrator must **remember many commands** / a **typing error** can cause damage (1).

**Q: Write one disadvantage of each of the following user interfaces. [2]**
*Natural language:* **ambiguous**, leading to **misinterpretation** of user input / struggles with colloquial language, homophones or context (1).
*Gesture recognition:* gestures may be **misinterpreted or accidental** / users must **learn** the gestures / **tiring** (1).

**Q: Define one advantage of a GUI for a new employee. [1]**
It is **intuitive** — the employee **recognises icons and menus** instead of remembering commands.
:::

:::warning Common mistakes
- Writing "easy to use" for every interface — say **why** it is easy and **for whom**.
- Forgetting that the same feature can be an **advantage for experts** and a **disadvantage for beginners** (CLI speed vs learning).
- Saying a GUI uses "less" memory than a CLI — it uses **more**.
- Listing disadvantages of NLI that also apply to all interfaces (e.g. "it can crash").
:::

:::steps Check yourself
- Name three factors that affect the choice of interface.
- Give three advantages and three disadvantages of GUI, CLI, NLI and GRI.
- Explain how a voice assistant and a gesture system each recognise input.
- Which interface would you choose for: a kiosk at an airport, a server room, a smart car, a VR game? Justify each.
:::
