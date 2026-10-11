---
summary: The advantages and disadvantages of graphical user interfaces (GUI), command line interfaces (CLI), natural language interfaces (NLI) and gesture recognition interfaces (GRI), and how to compare and choose between them.
---
# What a user interface is
@lo 11.3.1.11 11.3.1.12

:::definition User interface (UI)
The part of a computer system that lets the **user communicate with the computer**: how the user **gives instructions** (input) and how the computer **shows information and results** (output). It is usually provided by the operating system or the application.
:::

A good interface is **easy to learn**, **efficient** to use, gives clear **feedback** and **prevents errors**. The best type depends on **who** the users are, **what** they do and **which device** they use.

:::mermaid Main types of user interface
flowchart LR
  UI[User interfaces] --> CLI[Command line interface]
  UI --> GUI[Graphical user interface]
  UI --> MENU[Menu-driven interface]
  UI --> NLI[Natural language interface]
  UI --> GRI[Gesture recognition interface]
:::

# Command line interface (CLI)
@lo 11.3.1.12

:::definition Command line interface (CLI)
An interface in which the user **types commands** at a **prompt** using the keyboard; the computer executes each command and shows the result as **text**. Examples: Windows **Command Prompt / PowerShell**, the Linux / macOS **terminal (bash)**, router configuration consoles.
:::

```bash | Commands typed in a Linux terminal
$ mkdir reports                 # create a folder
$ cp *.csv reports/             # copy every CSV file into it
$ ls -l reports                 # list the folder in detail
$ rm reports/old_*.csv          # delete all files whose names start with old_
```

:::cards
### Advantages of a CLI
- **Fast** for expert users — one typed command can do a lot of work (e.g. copy hundreds of files).
- Gives **direct, full control** over the OS, including settings not available in a GUI.
- Uses **little memory and processing power** — no graphics; works on old or low-powered computers and servers.
- Commands can be saved as **scripts** to **automate** repetitive tasks.
- Works well for **remote access** over slow network connections (e.g. SSH to a server).
### Disadvantages of a CLI
- **Hard to learn** — the user must **remember** commands and their exact syntax.
- **Easy to make errors** — a typing mistake gives an error or, worse, deletes the wrong files; often no undo.
- **Not intuitive** for beginners; little visual feedback.
- Text only — **unsuitable** for graphics, video or photo editing.
- Confusing error messages.
:::

# Graphical user interface (GUI)
@lo 11.3.1.11

:::definition Graphical user interface (GUI)
An interface in which the user interacts with **graphical objects** — **W**indows, **I**cons, **M**enus and a **P**ointer (**WIMP**) — by **pointing and clicking** with a mouse or **touching** a screen. Examples: Windows, macOS, Android, iOS.
:::

:::compare The WIMP elements
| Element | What it is |
|---|---|
| **Window** | A rectangular area showing one program or document; can be moved, resized, minimised |
| **Icon** | A small picture representing a file, folder, program or action |
| **Menu** | A list of options to choose from (drop-down, pop-up, ribbon) |
| **Pointer** | The arrow moved by a mouse / touchpad to select objects |
:::

:::cards
### Advantages of a GUI
- **Easy to learn and use** — intuitive; users **recognise** icons instead of remembering commands.
- Suitable for **beginners and non-technical users**, children and the elderly.
- **Fewer errors** — users choose from options instead of typing commands; **undo** is usually available.
- **WYSIWYG** (what you see is what you get) — users see the result as they work.
- Easy **multitasking** — several windows can be open; drag-and-drop between them.
- Can display **graphics, images and video**; consistent layout between applications.
### Disadvantages of a GUI
- Uses **more memory, processing power and storage** than a CLI.
- Can be **slower for expert users** — many clicks through menus for one task.
- **Repetitive tasks** are harder to automate.
- Some advanced settings are **hidden** or not available.
- Needs a pointing device / touchscreen and a good display.
:::

# Comparing GUI and CLI
@lo 11.3.1.13

:::compare GUI vs CLI
| Criterion | GUI | CLI |
|---|---|---|
| How the user gives instructions | Points and clicks / touches icons, menus, windows | Types text commands at a prompt |
| Ease of learning | **Easy**, intuitive — recognition | **Hard** — commands must be remembered |
| Suitable users | Beginners, general users | Expert users, programmers, network administrators |
| Speed for experts | Slower — many clicks | **Faster** — one command can do a lot |
| Errors | Fewer — options are chosen | More — typing errors, wrong syntax |
| Memory and CPU use | **High** — graphics | **Low** |
| Control of the system | Limited to what the menus offer | **Full** control, all settings |
| Automation | Difficult | Easy with **scripts** |
| Multimedia | Can show images, video | Text only |
| Example | Windows desktop, Android home screen | Command Prompt, Linux terminal |
:::

:::example The same task in both interfaces — copy all photos into a new folder
**GUI:** open File Explorer → right-click → *New folder* → type the name → select all photos with the mouse → drag them into the folder. Easy to see what is happening, but many steps.

**CLI:** `mkdir photos` then `cp *.jpg photos/` — two short commands, but the user must know them exactly.
:::

:::compare Which interface?
| User / situation | Best interface | Reason |
|---|---|---|
| A primary-school pupil using a learning app | **GUI** | Intuitive icons; no commands to learn |
| A network administrator configuring 50 servers remotely | **CLI** | Fast, scripts can automate it, low bandwidth |
| An old computer with very little RAM | **CLI** | Uses few resources |
| A graphic designer editing photos | **GUI** | Needs to see and manipulate images |
| A ticket machine at a railway station | **Menu-driven / touch GUI** | Limited set of options; no training needed |
:::

:::callout info Menu-driven interfaces
A **menu-driven interface** presents a **series of menus** from which the user selects options (ATMs, ticket machines, a TV settings menu). It is very easy to use and prevents invalid choices, but it is **limited** to the options offered and can be **slow** if there are many levels of menus.
:::

# Natural language interface (NLI)
@lo 11.3.1.14

:::definition Natural language interface (NLI)
An interface that lets the user communicate with the computer in **ordinary human language** — **spoken** or **typed** — instead of commands or menus. Examples: voice assistants (**Siri, Alexa, Google Assistant**), chatbots, voice control in cars, voice search.
:::

:::steps How a spoken NLI works
- **Speech recognition** converts the sound of the voice into **text**.
- **Natural language processing (NLP)** analyses the words and grammar to work out the **meaning / intent** ("set an alarm", "for 7 am").
- The system carries out the request.
- The reply is given as text or by **speech synthesis** (text-to-speech).
:::

:::cards
### Advantages of an NLI
- **No need to learn** commands — users speak or type naturally.
- **Hands-free** and eyes-free — useful while driving, cooking or for people with **physical or visual disabilities**.
- **Fast** for simple requests — speaking is quicker than typing.
- Suitable for people who **cannot read or type well** and for young children.
- Can be used on devices with **no keyboard or screen** (smart speakers).
### Disadvantages of an NLI
- Human language is **ambiguous** — the system may **misinterpret** the request (homophones, slang, context).
- Problems with **accents, dialects**, speech impairments and **background noise**.
- Users may need to learn **specific phrases** for the system to understand reliably.
- Limited support for some **languages** (e.g. Kazakh).
- **Privacy** concerns — devices are always listening; voice recordings may be stored.
- Needs a lot of **processing power** / an Internet connection; not suitable in quiet places (library) or noisy ones.
:::

# Gesture recognition interface (GRI)
@lo 11.3.1.14

:::definition Gesture recognition interface (GRI)
An interface that **recognises movements of the user's body** — hands, fingers, head, eyes or whole body — and interprets them as commands. Input comes from **touchscreens**, **cameras** and **motion / depth sensors**. Examples: swipe and pinch-to-zoom on a phone, **Xbox Kinect**, VR hand controllers, smart TV hand gestures, car controls that change volume with a twirl of the finger.
:::

:::compare Types of gesture input
| Type | Sensor | Example |
|---|---|---|
| Touch gestures | Touchscreen / touchpad | Swipe, pinch to zoom, two-finger scroll |
| Motion gestures | Camera, infrared depth sensor | Waving a hand to skip a song, Kinect games |
| Device movement | Accelerometer, gyroscope | Shaking a phone to undo; tilting to steer in a game |
| Eye / head tracking | Camera in a headset | Selecting an item by looking at it in VR |
:::

:::cards
### Advantages of a GRI
- **Natural and intuitive** — gestures are like real-world movements; easy for children.
- **No physical contact** needed (for camera-based systems) — **hygienic** in hospitals, kitchens, public kiosks.
- Useful for people who **cannot use a keyboard or mouse**.
- Allows **immersive** interaction in games, VR and AR.
- Fast for simple commands; frees the hands from holding a device.
### Disadvantages of a GRI
- Gestures may be **misinterpreted** or made **accidentally** (unintended commands).
- Users must **learn and remember** the gestures; gestures differ between systems and **cultures**.
- Only a **limited number** of commands can be given by gestures.
- **Tiring** for long periods ("gorilla arm").
- Needs **expensive sensors / cameras**; affected by **lighting** and space; less **precise** than a mouse.
- Not suitable for users with some physical disabilities.
:::

:::compare NLI vs GRI
| | Natural language interface | Gesture recognition interface |
|---|---|---|
| Input | Spoken or typed words | Body movements |
| Main sensors | Microphone / keyboard | Camera, touchscreen, motion sensors |
| Best for | Hands-free requests, searches, accessibility for visually impaired users | Games, VR, touchless control, accessibility for users who cannot speak |
| Main problem | Ambiguity, accents, noise, privacy | Misread or accidental gestures, tiring, limited commands |
:::

# Choosing an interface and exam practice
@lo 11.3.1.11 11.3.1.12 11.3.1.13 11.3.1.14

:::compare Matching the interface to the scenario
| Scenario | Interface | Justification |
|---|---|---|
| A surgeon looking at X-rays during an operation | **Gesture** (touchless) | Hands must stay sterile |
| A driver changing the music | **Natural language** | Hands on the wheel, eyes on the road |
| An elderly person using a tablet for video calls | **GUI (touch)** | Large icons, intuitive, no commands |
| A system administrator managing a web server | **CLI** | Full control, scripting, remote access |
| A blind user searching the web | **Natural language** with speech output | Does not need to see the screen |
:::

:::example Exam-style answers
**Q: Give one advantage and one disadvantage of a command line interface. [2]**
Advantage: an expert can work **faster** because one command can do a complex task / it uses **less memory** (1). Disadvantage: the user must **remember the commands and syntax**, so it is hard to learn (1).

**Q: Compare a GUI and a CLI. [2]**
A GUI is **easier to learn** because users select icons and menus, **whereas** a CLI requires users to **remember commands** (1). A GUI uses **more memory and processing power**, **whereas** a CLI uses **few resources** (1).

**Q: Write one disadvantage of each of the following user interfaces. [2]**
*Natural language:* language is **ambiguous**, so the system may **misinterpret** the user's request / problems with accents and noise (1).
*Gesture recognition:* gestures may be **misread or made by accident**, causing unintended commands / users must learn the gestures (1).

**Q: Explain why a gesture recognition interface is suitable for a surgeon. [2]**
The surgeon can control the computer **without touching it** (1), so their hands **stay sterile** during the operation (1).
:::

:::warning Common mistakes
- Saying a CLI is "bad" or "old" — it is **faster and more powerful for experts**.
- Writing "a GUI is easy" without saying **why** (icons, recognition instead of recall, no commands to remember).
- Confusing a **natural language interface** with a **CLI** — typing ordinary sentences to a chatbot is NLI; typing exact commands is CLI.
- Forgetting that a touchscreen GUI uses **gestures** (swipe, pinch), so phones combine GUI and GRI.
- Giving the same point twice (e.g. "easy to use" and "user-friendly").
:::

:::steps Check yourself
- What do the letters WIMP stand for?
- Give two advantages and two disadvantages of a GUI and of a CLI.
- Compare a GUI and a CLI in three ways.
- Explain how a voice assistant understands a spoken request.
- Give two advantages and two disadvantages of a natural language interface.
- Give two advantages and two disadvantages of a gesture recognition interface.
- Which interface would you recommend for a smart kitchen, and why?
:::
