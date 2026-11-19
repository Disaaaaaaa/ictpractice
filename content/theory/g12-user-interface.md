---
summary: The advantages and disadvantages of graphical, command line, natural-language and gesture-recognition user interfaces — what each one is, how it works, why each advantage or disadvantage matters and for whom, and how to choose and justify the best interface for a given user, task and environment.
---
# Graphical user interfaces (GUI)
@lo 12.3.1.4

Every computer system needs a way for people to tell it what to do and for it to show people the results. That "meeting point" between the human and the machine is the **user interface**. The same computer can be operated through very different interfaces: a school server can be managed by typing commands, the same files can be opened by double-clicking icons, and a phone can be asked a question out loud or unlocked by a swipe. None of these interfaces is "the best" in general. Each one has **advantages and disadvantages**, and in the exam you will be asked to **define** them, to **explain** why they matter, and to **choose and justify** an interface for a scenario.

:::definition User interface
The means by which a **user and a computer system communicate**: how the user **gives commands and data** to the system and how the system **presents information and feedback** to the user.
:::

When you evaluate any interface, think about three factors. The **user**: are they an expert or a beginner, young or elderly, do they have a visual, hearing or motor impairment, which language do they speak? The **task**: is it simple or complex, done once or repeated hundreds of times, does it need precision, is it visual? The **environment**: is it noisy or quiet, are the user's hands busy, dirty or sterile, how big is the screen, is there a keyboard at all? An advantage of an interface is only an advantage **for a particular user doing a particular task in a particular place**. A good exam answer always links the point to the scenario.

:::compare Choosing an interface: user, task, environment
| Factor | Questions to ask | Example |
|---|---|---|
| **User** | Expert or beginner? Age? Disabilities? Language? | A system administrator vs a 7-year-old pupil |
| **Task** | Simple or complex? Repetitive? Precise? Visual? | Configuring 100 servers vs browsing holiday photos |
| **Environment** | Noisy or quiet? Hands free? Clean / sterile? Screen size? | A car, an operating theatre, a market stall |
:::

## What a GUI is and how it works

:::definition Graphical user interface (GUI)
An interface based on **windows, icons, menus and a pointer (WIMP)** — or touch — in which users interact by **pointing, clicking, dragging and tapping** visual objects on the screen instead of typing commands.
:::

The letters **WIMP** describe the four building blocks of a desktop GUI. **Windows** are rectangular areas of the screen, each showing one program or document, which can be moved, resized, overlapped and closed. **Icons** are small pictures that stand for programs, files, folders or actions (a bin for "delete", a floppy disk for "save"). **Menus** are lists of options that drop down or pop up, so the user chooses a command instead of remembering it. The **pointer** is the arrow moved by a mouse or touchpad; on a touchscreen the finger itself is the pointer. Behind the pictures, the operating system constantly redraws the screen, tracks the pointer position, works out which object is under it when the user clicks, and sends that "event" to the right program. Windows, macOS, Android, iOS and the desktop of most Linux systems are all GUIs.

:::svg The four parts of a WIMP graphical user interface
<svg class="uix" viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A screen with a window, a row of icons, an open menu and a mouse pointer, each labelled: window, icon, menu, pointer">
  <style>
    svg.uix .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.uix .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.uix .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.uix .m{font:13px ui-monospace,monospace;fill:var(--foreground)}
    svg.uix .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.uix .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.uix .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.uix .wa{fill:var(--warning);stroke:none}
    svg.uix .ln{stroke:var(--muted);stroke-width:1.5;stroke-dasharray:4 3;fill:none}
    svg.uix .pt{fill:var(--foreground)}
  </style>
  <rect class="bx" x="20" y="20" width="470" height="290" rx="10"/>
  <rect class="on" x="40" y="40" width="54" height="44" rx="6"/><text class="s" x="67" y="100" text-anchor="middle">Files</text>
  <rect class="on" x="40" y="112" width="54" height="44" rx="6"/><text class="s" x="67" y="172" text-anchor="middle">Browser</text>
  <rect class="on" x="40" y="184" width="54" height="44" rx="6"/><text class="s" x="67" y="244" text-anchor="middle">Bin</text>
  <rect class="ok" x="130" y="50" width="330" height="230" rx="8"/>
  <rect class="bx" x="130" y="50" width="330" height="28" rx="8"/><text class="t" x="145" y="69">report.docx — Word processor</text>
  <text class="t" x="145" y="100">File   Edit   View   Insert</text>
  <rect class="bx" x="140" y="108" width="130" height="96" rx="4"/>
  <text class="t" x="150" y="128">New</text><text class="t" x="150" y="150">Open…</text><text class="t" x="150" y="172">Save</text><text class="t" x="150" y="194">Print…</text>
  <path class="pt" d="M232,162 l0,26 l7,-7 l6,13 l5,-2 l-6,-13 l10,0 z"/>
  <text class="h" x="520" y="52">Window</text><text class="s" x="520" y="70">a program or document in its own frame</text>
  <text class="h" x="520" y="122">Icon</text><text class="s" x="520" y="140">a picture that stands for a file, program, action</text>
  <text class="h" x="520" y="192">Menu</text><text class="s" x="520" y="210">a list of options to choose from</text>
  <text class="h" x="520" y="262">Pointer</text><text class="s" x="520" y="280">moved by mouse, touchpad or finger</text>
  <path class="ln" d="M460,60 L512,48"/><path class="ln" d="M94,134 L512,118"/><path class="ln" d="M270,150 L512,188"/><path class="ln" d="M255,190 L512,258"/>
</svg>
:::

## Advantages of a GUI

**Intuitive and easy to learn.** A GUI relies on **recognition rather than recall**: the user does not have to remember a command, because every option is visible as an icon or menu item. Icons are often based on real objects (a folder, a bin, a printer), so a new user can guess what they do. This matters because training costs time and money: a new receptionist in a clinic can start booking appointments on the first day after a short demonstration. It also makes computers usable by people who are not technical at all — young children, elderly people, shop assistants.

**Fewer errors and easy recovery.** Because the user chooses from options that the program offers, they cannot type a command that does not exist or misspell a file name. Dangerous actions ask for confirmation ("Are you sure you want to delete 3 files?"), deleted files go to a recycle bin, and most programs have **Undo**. For an inexperienced user this safety net is very important: a mistake can be reversed instead of destroying data.

**WYSIWYG and visual feedback.** "What you see is what you get": a document looks on screen as it will look when printed, and a change (bold, a new picture) appears immediately. Progress bars, highlighted buttons and pop-up messages give constant **feedback**, so the user always knows what the system is doing. A GUI can also display **images, video, charts and maps**, which a text interface cannot.

**Multitasking and direct manipulation.** Several windows can be open at once, so a pupil can copy a chart from a spreadsheet and drag it into a presentation. Drag-and-drop, resizing and scrolling feel like handling real objects, which is faster than describing the action in words.

## Disadvantages of a GUI

**Uses more memory, processing power and storage.** Drawing windows, icons, animations and high-resolution images needs a powerful processor, a graphics card, more RAM and more disk space for the graphical components of the OS. On a server whose job is to deliver web pages or store files, all these resources are wasted, because nobody sits in front of its screen. This is why many servers are installed **without** a GUI.

**Slower for expert users.** An expert who knows exactly what they want must still move the pointer, open a menu, open a sub-menu, tick boxes and press OK. Doing the same action for 200 files or 200 user accounts means repeating the same clicks 200 times. Keyboard shortcuts help, but the GUI is still slower than one typed command for many tasks.

**Hard to automate and less control.** A sequence of clicks is difficult to record and repeat exactly, so repetitive tasks cannot easily be **automated**. Also, to keep the screen simple, designers **hide advanced settings** or leave them out completely, so an expert may not be able to reach every option of the system through the GUI.

**Accessibility limits.** A GUI depends heavily on **seeing** the screen and on **precise pointing**. A blind user needs a screen reader that converts the visual objects into speech, and a user with a hand tremor may find small icons and drag-and-drop difficult. Cluttered screens and icons without labels can confuse even sighted users.

:::example Worked example: a GUI for a new pharmacy assistant
**Scenario.** A pharmacy in Shymkent hires part-time students to work at the till. The manager must decide whether the sales system should have a GUI.
1. **User:** beginners, many different staff, little time for training → a GUI is intuitive; staff recognise product pictures and buttons instead of remembering codes.
2. **Task:** scan or select products, take payment — mostly choosing from options → menus and large buttons reduce input **errors**, and Undo / "void item" lets staff correct mistakes.
3. **Environment:** a counter with a touchscreen → touch GUI, no mouse needed.
4. **Disadvantage to mention:** the till needs a more powerful computer and screen than a text system, and a fast experienced worker may find the menus slow — so the designers add **barcode scanning and shortcut keys**.
**Conclusion (exam style):** a GUI is suitable because it is **easy to learn for new staff (1)** and **reduces errors by offering choices (1)**, although it **needs more processing power and memory (1)**.
:::

# Command line interfaces (CLI)
@lo 12.3.1.5

:::definition Command line interface (CLI)
An interface in which the user **types text commands** with an exact **syntax** at a **prompt**, and the system replies in **text**. Examples: the Linux terminal (bash), Windows Command Prompt and PowerShell, the console of a network router.
:::

A CLI is the oldest kind of interactive interface, but it is far from obsolete: almost every web server, cloud computer and network device in the world is managed through one. The system shows a **prompt** (for example `admin@server:~$`) to say it is ready. The user types a **command**, often followed by **options** (also called switches or flags) that change how it works and **arguments** that say what it works on, and presses Enter. The **command interpreter** (the shell) checks the syntax, runs the program, and prints the result or an error message. Nothing happens until the whole command is typed correctly, which explains both the power and the difficulty of a CLI.

:::svg Anatomy of a command typed at a CLI
<svg class="uix" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The command line admin@server dollar sign cp -r homework backup, split into prompt, command, option and arguments, then the shell checks syntax, runs it and prints text output">
  <style>
    svg.uix .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.uix .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.uix .m{font:700 18px ui-monospace,monospace;fill:var(--foreground)}
    svg.uix .mp{font:700 18px ui-monospace,monospace;fill:var(--primary)}
    svg.uix .ms{font:700 18px ui-monospace,monospace;fill:var(--success)}
    svg.uix .mw{font:700 18px ui-monospace,monospace;fill:var(--warning)}
    svg.uix .mm{font:700 18px ui-monospace,monospace;fill:var(--muted)}
    svg.uix .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.uix .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.uix .ar{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <rect class="bx" x="20" y="20" width="720" height="60" rx="8"/>
  <text class="mm" x="40" y="58">admin@server:~$</text>
  <text class="mp" x="235" y="58">cp</text>
  <text class="mw" x="275" y="58">-r</text>
  <text class="ms" x="315" y="58">homework  backup</text>
  <text class="h" x="40" y="108">Prompt</text><text class="s" x="40" y="126">"ready for a command"</text>
  <text class="h" x="230" y="108">Command</text><text class="s" x="230" y="126">copy</text>
  <text class="h" x="300" y="146">Option</text><text class="s" x="300" y="164">-r = include sub-folders</text>
  <text class="h" x="470" y="108">Arguments</text><text class="s" x="470" y="126">what to copy, where to</text>
  <rect class="on" x="40" y="186" width="200" height="48" rx="8"/><text class="h" x="140" y="215" text-anchor="middle">Shell checks syntax</text>
  <rect class="on" x="280" y="186" width="200" height="48" rx="8"/><text class="h" x="380" y="215" text-anchor="middle">Program runs</text>
  <rect class="bx" x="520" y="186" width="220" height="48" rx="8"/><text class="h" x="630" y="208" text-anchor="middle">Text output</text><text class="s" x="630" y="225" text-anchor="middle">or an error message</text>
  <path class="ar" d="M240,210 L276,210"/><path class="ar" d="M480,210 L516,210"/>
</svg>
:::

```bash | Managing a school server with a CLI
$ sudo systemctl restart nginx          # restart the web server
$ df -h                                 # show free disk space in human-readable units
$ for u in $(cat grade12.txt); do sudo useradd -m "$u"; done   # create one account per name in the file
$ ssh admin@10.0.0.5                    # log in to another server over the network
```

## Advantages of a CLI

**Uses very few resources.** A CLI shows only text, so the computer does not need a graphics card, a desktop environment or large graphical libraries. A server can run its OS **without a GUI**, so it does **not use unnecessary computing resources**: more RAM and processor time are left for its real work (web pages, databases), there is less software to update, and fewer programs means fewer security weaknesses. This is the classic exam answer for why administrators use a CLI on servers.

**Fast for experts.** Someone who knows the commands can do in one short line what takes many clicks in a GUI. Typing `rm *.tmp` deletes every temporary file in a folder at once; in a GUI the user would have to find and select them. Commands can be recalled with the Up arrow and edited, and file names can be completed with the Tab key.

**Scripting and automation.** Commands can be saved in a text file called a **script** and run again whenever needed, or scheduled to run automatically at night. The loop in the example above creates an account for every pupil in a list of 200 names in a few seconds; it can be reused next year with a new list. Automation saves time, and because the computer repeats exactly the same steps, it also removes the human errors that creep in when the same thing is done 200 times by hand.

**Full, precise control.** Every option of the system can be reached from the command line, including settings that a GUI hides. The user states exactly what should happen — which file, which option, which value — so there is no doubt about what was done. The commands can also be kept as a record (a log) of every change.

**Remote administration.** Text needs very little bandwidth, so a CLI works well over a slow or distant network connection. With **SSH** (Secure Shell) an administrator in Almaty can manage a server in a data centre in Astana, or a router on the other side of the school, as if sitting in front of it. Sending a full graphical desktop over the same link would be slow or impossible.

## Disadvantages of a CLI

**Commands must be learnt and remembered.** The user must know the command names, their options and the exact **syntax** (order, spaces, capital letters). This relies on **recall** rather than recognition, so a CLI takes a long time to learn and is **not intuitive** for beginners. It is also hard to **discover** what commands exist — there is nothing on the screen to suggest them.

**Typing errors can be serious.** One wrong character may make the command fail with a cryptic error message, or, worse, do something different from what was intended. A space in the wrong place in a delete command can remove a whole folder. Most commands have **no undo** and do not ask for confirmation, so the consequences of an error are much more serious than in a GUI.

**Text only.** A CLI cannot show pictures, video or a preview of a document, so it is unsuitable for graphic design, video editing or browsing photos. Output such as long lists can be hard to read.

**Unfriendly error messages and accessibility for beginners.** Messages like `Permission denied (publickey)` mean something to an expert but nothing to a new user, who may not know how to recover.

:::compare GUI vs CLI — the same features seen from both sides
| Criterion | GUI | CLI |
|---|---|---|
| How the user gives commands | Pointing, clicking, tapping visual objects | Typing text commands with exact syntax |
| Learning | **Easy** — recognition of icons and menus | **Hard** — recall of commands and options |
| Speed for an expert | Slower — many clicks | **Faster** — one line, scripts |
| Automation of repeated tasks | Difficult | **Easy** with scripts |
| Resources (RAM, CPU, storage) | **High** — graphics | **Low** — text only |
| Errors | Fewer; Undo and confirmations | Typing errors; often no Undo |
| Control | Advanced settings may be hidden | **Full control** of every setting |
| Remote use over slow links | Poor | **Good** (SSH) |
| Multimedia | Images, video, WYSIWYG | Text only |
:::

:::example Worked example: why the school server uses a CLI
**Scenario.** The IT technician of a school in Kyzylorda manages a file server and must create accounts for 180 new grade 10 pupils every September. Justify a CLI.
1. **Resources:** the server has no monitor and runs Linux without a GUI → no RAM or CPU is wasted on graphics, so the server is faster for pupils' file requests (1).
2. **Automation:** one script reads `grade10.txt` and creates all 180 accounts with the correct group and home folder → minutes instead of hours of clicking, and no forgotten pupils (1).
3. **Remote access:** the technician uses SSH from the staff room or from home, which works even over a slow connection (1).
4. **Drawback:** the technician must know the commands; a typing mistake in a script could create wrong accounts for everyone, so the script is first **tested on two names** (1).
:::

# Natural-language and gesture-recognition interfaces
@lo 12.3.1.6

GUIs and CLIs both make people adapt to the computer: we learn where the icons are or what the commands are. Natural-language and gesture interfaces try to make the computer adapt to people, by understanding the ways in which humans already communicate with each other — **speech, written language and body movement**.

## Natural-language interfaces (NLI)

:::definition Natural-language interface (NLI)
An interface that lets users communicate with the computer in **ordinary human language — spoken or typed** — instead of commands or menus. Examples: voice assistants (Siri, Google Assistant, Alice), chatbots, voice control in cars and smart homes.
:::

When you say "What is the weather in Turkistan tomorrow?", several things happen. **Speech recognition** converts the sound waves recorded by the microphone into words, using models trained on many hours of recorded speech. **Natural-language processing (NLP)** then analyses the words to find the **intent** (the user wants a weather forecast) and the **entities** — the details: the place "Turkistan" and the time "tomorrow". The system carries out the action (it looks up the forecast), builds a reply, and **speech synthesis** reads it aloud. Much of this processing usually happens on powerful servers on the Internet, not on the phone itself.

:::svg How a spoken request is processed by a natural-language interface
<svg class="uix" viewBox="0 0 760 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Five stages in a row: speech, speech recognition to text, natural-language processing finds intent and entities, action performed, reply spoken by speech synthesis">
  <defs><marker id="uixA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <style>
    svg.uix .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.uix .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.uix .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.uix .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.uix .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.uix .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
  </style>
  <rect class="bx" x="10" y="40" width="130" height="90" rx="10"/><text class="h" x="75" y="66" text-anchor="middle">User speaks</text><text class="s" x="75" y="88" text-anchor="middle">"Weather in</text><text class="s" x="75" y="104" text-anchor="middle">Turkistan</text><text class="s" x="75" y="120" text-anchor="middle">tomorrow?"</text>
  <rect class="on" x="160" y="40" width="130" height="90" rx="10"/><text class="h" x="225" y="66" text-anchor="middle">Speech</text><text class="h" x="225" y="84" text-anchor="middle">recognition</text><text class="s" x="225" y="106" text-anchor="middle">sound → text</text>
  <rect class="on" x="310" y="40" width="140" height="90" rx="10"/><text class="h" x="380" y="66" text-anchor="middle">NLP</text><text class="s" x="380" y="88" text-anchor="middle">intent: forecast</text><text class="s" x="380" y="104" text-anchor="middle">place: Turkistan</text><text class="s" x="380" y="120" text-anchor="middle">time: tomorrow</text>
  <rect class="ok" x="470" y="40" width="130" height="90" rx="10"/><text class="h" x="535" y="66" text-anchor="middle">Action</text><text class="s" x="535" y="88" text-anchor="middle">look up the</text><text class="s" x="535" y="104" text-anchor="middle">forecast</text>
  <rect class="ok" x="620" y="40" width="130" height="90" rx="10"/><text class="h" x="685" y="66" text-anchor="middle">Speech</text><text class="h" x="685" y="84" text-anchor="middle">synthesis</text><text class="s" x="685" y="106" text-anchor="middle">reply read aloud</text>
  <path d="M140,85 L156,85" style="stroke:var(--muted);stroke-width:2" marker-end="url(#uixA)"/><path d="M290,85 L306,85" style="stroke:var(--muted);stroke-width:2" marker-end="url(#uixA)"/><path d="M450,85 L466,85" style="stroke:var(--muted);stroke-width:2" marker-end="url(#uixA)"/><path d="M600,85 L616,85" style="stroke:var(--muted);stroke-width:2" marker-end="url(#uixA)"/>
  <rect class="no" x="160" y="150" width="290" height="46" rx="8"/><text class="s" x="305" y="170" text-anchor="middle">Errors enter here: noise, accents, homophones,</text><text class="s" x="305" y="186" text-anchor="middle">ambiguous or colloquial wording</text>
</svg>
:::

### Advantages of an NLI

**No commands to learn.** The user simply says or types what they want, in their own words. There is nothing to memorise and no menus to search, so even a first-time user or a young child can use it. A good NLI accepts **many ways of asking the same thing** — "set an alarm for seven", "wake me up at 7 am" — because NLP looks for the intent, not for exact words.

**Hands-free and eyes-free.** Speech leaves the hands and eyes free for something else. A driver can send a message or start navigation without taking their hands off the wheel or eyes off the road, which is much safer; a cook with flour on their hands can set a timer; a warehouse worker can confirm a picked item while carrying boxes.

**Accessibility.** For a **blind** or partially sighted person, who cannot see icons, speaking and listening is a natural way to use a computer. People with **motor impairments** who cannot use a keyboard or mouse, people with dyslexia who find typing hard, and elderly people who are uncomfortable with technology can all benefit.

**Works without a screen or keyboard, and is fast for simple requests.** Smart speakers, smart watches and car systems have little or no screen, so voice is the main way of controlling them. Saying "call Mum" is quicker than unlocking a phone, finding the contacts app and scrolling.

### Disadvantages of an NLI

**Ambiguity leads to misinterpretation.** Human language is **ambiguous**: one sentence can mean several things, and its meaning often depends on **context**. "Book a table for two at eight" — today or tomorrow, 8 am or 8 pm? **Homophones** (words that sound the same but have different meanings, like "write" and "right") and **colloquial language** (slang, informal phrases) make it worse. The system may confidently do the wrong thing, and the user has to notice and correct it.

**Accents, dialects and background noise.** Recognition accuracy drops when the speaker has an accent the system was not trained on, when people mix languages (many people in Kazakhstan switch between Kazakh and Russian in one sentence), or when there is noise — a busy market, a classroom, a factory. Some languages, including Kazakh, have had less training data than English, so they are supported less well.

**Users may still need to learn phrases.** Because recognition is imperfect, regular users often discover that only certain phrasings work reliably — which partly removes the "no learning" advantage.

**Privacy and security.** Voice assistants listen all the time for a wake word, and recordings are often sent to the company's servers to be processed and sometimes stored. Users may worry that private conversations are recorded. Speaking aloud also means that people nearby hear the request — a problem when entering a PIN or asking about a medical condition in a pharmacy queue.

**Needs processing power and often the Internet.** Accurate speech recognition needs powerful processors, so many systems do not work offline or are slow on a poor connection.

## Gesture-recognition interfaces (GRI)

:::definition Gesture-recognition interface (GRI)
An interface that **detects movements of the body** — hands, fingers, head, eyes — with **touchscreens, cameras, depth sensors or motion sensors** and interprets them as commands.
:::

Gestures can be made **on a surface** (swipe, pinch to zoom, two-finger scroll on a touchscreen or touchpad), **in the air** in front of a camera or depth sensor (wave to skip a song, an open palm to pause a video), or by **moving a device** that contains motion sensors (tilting a phone or a games controller, shaking it to undo). For air gestures, a camera captures many images per second, software finds the hand or body and tracks key points such as fingertips and joints, the movement is **compared with stored gesture patterns** (often using machine learning), and a recognised gesture triggers a command. Before use, some systems must be **calibrated** — told where the user stands, how big their movements are and what the lighting is like.

:::svg How a camera-based gesture-recognition interface works
<svg class="uix" viewBox="0 0 760 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Camera captures frames, software tracks hand key points, the movement is matched with stored gesture patterns, then a command is run; a dashed path shows that unmatched or accidental movements cause errors">
  <defs><marker id="uixB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <style>
    svg.uix .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.uix .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.uix .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.uix .on{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.uix .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.uix .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
  </style>
  <rect class="bx" x="10" y="30" width="160" height="80" rx="10"/><text class="h" x="90" y="58" text-anchor="middle">Camera / sensor</text><text class="s" x="90" y="80" text-anchor="middle">30–60 frames</text><text class="s" x="90" y="96" text-anchor="middle">per second</text>
  <rect class="on" x="200" y="30" width="160" height="80" rx="10"/><text class="h" x="280" y="58" text-anchor="middle">Track the hand</text><text class="s" x="280" y="80" text-anchor="middle">fingertips, joints,</text><text class="s" x="280" y="96" text-anchor="middle">direction, speed</text>
  <rect class="on" x="390" y="30" width="160" height="80" rx="10"/><text class="h" x="470" y="58" text-anchor="middle">Match a pattern</text><text class="s" x="470" y="80" text-anchor="middle">"swipe left"?</text><text class="s" x="470" y="96" text-anchor="middle">"open palm"?</text>
  <rect class="ok" x="580" y="30" width="170" height="80" rx="10"/><text class="h" x="665" y="58" text-anchor="middle">Run the command</text><text class="s" x="665" y="80" text-anchor="middle">next X-ray image,</text><text class="s" x="665" y="96" text-anchor="middle">pause video</text>
  <path d="M170,70 L196,70" style="stroke:var(--muted);stroke-width:2" marker-end="url(#uixB)"/><path d="M360,70 L386,70" style="stroke:var(--muted);stroke-width:2" marker-end="url(#uixB)"/><path d="M550,70 L576,70" style="stroke:var(--muted);stroke-width:2" marker-end="url(#uixB)"/>
  <rect class="no" x="300" y="140" width="350" height="46" rx="8"/><text class="s" x="475" y="160" text-anchor="middle">Wrong match: poor lighting, accidental movement,</text><text class="s" x="475" y="176" text-anchor="middle">a gesture made differently → wrong or no command</text>
  <path d="M470,110 L470,136" style="stroke:var(--danger);stroke-width:2;stroke-dasharray:5 4" marker-end="url(#uixB)"/>
</svg>
:::

### Advantages of a GRI

**Natural and intuitive.** Pointing, swiping and pinching are movements people already make, so simple gestures are learnt in seconds — a two-year-old can swipe through photos on a tablet. No keyboard or mouse is needed, which also saves space.

**Touchless and hygienic.** Air gestures need no physical contact. In an operating theatre a surgeon can move through a patient's X-ray images during surgery without touching a keyboard, so their gloves stay **sterile**. In a kitchen, at a public kiosk or in a clinic waiting room, touchless control reduces the spread of germs.

**Works in noisy places and is immersive.** Unlike voice, gestures are not affected by noise, so they suit factories and busy public spaces. In games, VR and AR, moving the body to control the game feels **immersive** and gives exercise.

**Accessibility for some users.** People who cannot use a keyboard, or who cannot speak, may be able to control a device with head, eye or hand movements.

### Disadvantages of a GRI

**Misinterpreted and accidental gestures.** The system may confuse two similar gestures, or treat an ordinary movement — scratching your head, waving to a friend — as a command. On a touchscreen, a palm resting on the glass can tap a button. Such **unintended commands** are annoying and, in a hospital or a car, could be dangerous.

**Gestures must be learnt; they differ between systems and cultures.** Apart from the most basic ones, gestures are not obvious: which movement means "go back"? Each system uses its own set, and some hand signs mean different things — or are rude — in different cultures. Users must **learn and remember** them, just like commands.

**Limited set of commands and less precision.** There are only so many distinct movements that people can make and the system can tell apart, so a GRI cannot offer hundreds of commands like a CLI or a GUI menu. Hand movements in the air are also **less precise** than a mouse, so they are poor for tasks such as drawing or editing text.

**Fatigue.** Holding the arms up in front of a screen quickly becomes tiring (the "gorilla arm" effect), so air gestures are not suitable for long working sessions.

**Needs sensors, space, good lighting and calibration.** Cameras and depth sensors add cost; the user needs room to move; poor or changing light, other people in view and reflective surfaces reduce accuracy; and the system may need **calibration** for each user or room.

:::compare NLI vs GRI — advantages and disadvantages side by side
| | Natural-language interface | Gesture-recognition interface |
|---|---|---|
| Input | Speech or typed everyday language | Body, hand, finger or device movement |
| Main advantage | **No commands to learn**; hands-free and eyes-free | **Natural, touchless** — hygienic; works in noise |
| Accessibility | Good for **blind** users and people with motor impairments | Good for some users who cannot type or speak |
| Main disadvantage | **Ambiguity** → misinterpretation; homophones, colloquial language | **Misinterpreted or accidental** gestures |
| Affected by | Accents, dialects, **background noise** | **Lighting**, space, other people in view |
| Learning | May need to learn phrases that work | Must learn and remember gestures; differ by system / culture |
| Other problems | **Privacy** (always listening, recordings stored); needs Internet | **Fatigue**; limited set of commands; less precise; calibration |
:::

# Comparing and choosing interfaces
@lo 12.3.1.4 12.3.1.5 12.3.1.6

In real questions you are rarely asked only for a list. You are given a **scenario** and asked which interface is most suitable, or to evaluate one interface for that user. The method is always the same: identify the **user**, the **task** and the **environment** from the text, pick the interface whose advantages match them, and state at least one **disadvantage** and how it is reduced. Remember that one feature can be an advantage for one user and a disadvantage for another: the CLI's exact syntax gives an expert precise control but makes it hard for a beginner.

:::compare The four interfaces compared
| Criterion | GUI | CLI | Natural language | Gesture |
|---|---|---|---|---|
| Ease of learning | **High** | Low | **High** | Medium |
| Speed for experts | Medium | **High** | Medium | Low–medium |
| Precision | High | **High** | Low–medium | Low |
| Resources needed | High | **Low** | High (processing / cloud) | High (sensors) |
| Hands-free | No | No | **Yes** | Partly (touchless) |
| Works in noise | Yes | Yes | **No** | **Yes** |
| Accessibility | Good for most; poor for blind users without a screen reader | Poor for beginners | Good for blind / motor-impaired users | Good for some motor impairments |
:::

:::compare Scenarios and justified choices
| Scenario | Best interface | Justification |
|---|---|---|
| A system administrator controls a remote server | **CLI** | Low resources, scripts, full control, works over SSH |
| A driver sends a message | **Natural language** | Hands stay on the wheel, eyes on the road |
| A surgeon views scans during an operation | **Gesture** | Touchless keeps gloves sterile |
| An elderly person makes video calls | **GUI (touch)** | Large icons, intuitive, visual feedback |
| A noisy factory where workers wear gloves | **Gesture** or large-button **GUI** | Voice fails in noise; gloves block small touch targets |
| A blind student searches the web | **Natural language** + screen reader | Does not depend on seeing the screen |
:::

:::example Worked example: choosing an interface for a hospital ward
**Scenario.** A hospital in Aktobe wants nurses to record patients' temperature and blood pressure at the bedside, and doctors to view scans during operations. Evaluate the interfaces.
1. **Nurses at the bedside:** a **touch GUI** on a tablet — easy to learn for all staff, choosing values from lists reduces errors, and the record is shown immediately (WYSIWYG). An **NLI** would be hands-free, but wards are noisy, medical terms and patient names may be misrecognised, and other patients would **hear** private information — a privacy problem.
2. **Doctors in theatre:** a **GRI** — the surgeon swipes in the air to move through scans without touching anything, so the gloves stay sterile; a voice interface is a possible second option, but the doctor must learn a small set of gestures and the camera must be calibrated for the room's lighting.
3. **IT department:** the hospital's database server is managed through a **CLI** over SSH, so no resources are wasted on graphics and backups can be scripted every night.
**Answer pattern:** interface → advantage linked to the scenario → disadvantage → how it is reduced.
:::

Whatever type is chosen, a good interface follows the same **design principles**. They are useful in an evaluation answer, because a weakness of an interface type can often be reduced by applying them — for example, a CLI becomes less dangerous when destructive commands ask for confirmation.

:::cards
### Principles of good interface design
- **Consistency** — the same layout, words and actions everywhere (the Save button is always in the same place).
- **Feedback** — the system shows what is happening (a progress bar while a file uploads, a beep when a gesture is recognised).
- **Error prevention and recovery** — confirmations, **Undo**, clear error messages.
- **Recognition rather than recall** — show options instead of making users remember them.
- **Efficiency for experts** — shortcuts, commands and scripts alongside menus.
- **Accessibility** — usable by people with visual, hearing or motor impairments (text descriptions of images for screen readers, large targets, captions).
:::

:::callout info Multimodal interfaces
Modern devices **combine** interfaces: a phone has a **touch GUI**, **gestures** (swipe, pinch), **voice** (assistant) and even a **CLI** for developers. Combining them lets each user choose the most suitable way, and one interface can cover another's weakness — for example, if the voice assistant mishears, the user corrects the text on the screen.
:::

:::warning Common mistakes
- Writing "easy to use" for every interface — say **why** it is easy (recognition of icons, no commands to remember) and **for whom**.
- Saying a GUI uses "less" memory than a CLI — it uses **more** (graphics).
- Forgetting that the same feature can be an **advantage for experts** and a **disadvantage for beginners** (CLI syntax and speed).
- Giving disadvantages that apply to every computer ("it can crash", "it is expensive") — give one that is **specific** to the interface (ambiguity for NLI, accidental gestures for GRI).
- Choosing an interface in a scenario without linking it to the **user, task or environment** in the question.
:::

# Exam practice: user interfaces
@lo 12.3.1.4 12.3.1.5 12.3.1.6

:::example Exam-style answers
**Q: A system administrator controls a server using a command line interface. State one advantage and one disadvantage of using a command line interface. [2]**
Advantage: the server **does not need a complex operating system / GUI**, so it does not use **unnecessary computing resources** / can run **complex commands and scripts** that automate tasks (1). Disadvantage: the administrator must **learn and remember many commands and their syntax** / a **typing error** can cause damage with no undo (1).

**Q: Write one disadvantage of each of the following user interfaces. [2]**
*Natural language:* language is **ambiguous**, leading to **misinterpretation** of user input / struggles with accents, background noise, homophones or colloquial language (1).
*Gesture recognition:* gestures may be **misinterpreted or made accidentally**, causing unintended commands / users must **learn** the gestures / **tiring** to use for a long time (1).

**Q: Define two advantages of a GUI for new employees in a bank. [2]**
It is **intuitive / easy to learn** — employees **recognise icons and menus** instead of remembering commands (1). It **reduces errors**, because users choose from options and can **undo** mistakes (1).

**Q: Explain why a natural-language interface is suitable for a visually impaired user. [2]**
The user **does not need to see the screen** / icons (1) because they **speak commands and hear the replies** through speech synthesis (1).

**Q: A surgeon needs to look through X-ray images during an operation. Explain why a gesture-recognition interface is suitable, and give one disadvantage. [3]**
The surgeon can control the images **without touching** a keyboard or screen (1), so their gloves and hands stay **sterile / hygienic** (1). Disadvantage: a movement may be **misinterpreted or made accidentally**, showing the wrong image / the system is affected by lighting / needs calibration (1).

**Q: Compare a GUI and a CLI for a school technician who creates 200 user accounts. [4]**
A CLI lets the technician write a **script** that creates all accounts automatically (1), which is **faster** and avoids repeated manual errors (1). A GUI would need the **same clicks repeated 200 times** (1), although it is **easier to learn** if the technician does not know the commands (1).
:::

:::warning Common mistakes in exam answers
- Answering "define the advantage" with a single word ("fast") — write the advantage **and** the reason (fast **because** one command or script replaces many clicks).
- Mixing up NLI and speech recognition: speech recognition is only the **first step**; the NLI must also **understand the meaning** (NLP).
- Giving "needs a camera" as the only disadvantage of a GRI — better: **accidental / misinterpreted gestures**, **fatigue**, **limited commands**.
:::

:::steps Check yourself
- Define a user interface and name the three factors that affect the choice of interface.
- What does WIMP stand for? Give three advantages and three disadvantages of a GUI.
- Explain why servers are often managed through a CLI. Name the parts of the command `cp -r homework backup`.
- Describe the stages a voice assistant goes through to answer a spoken question.
- Give two advantages and three disadvantages of a natural-language interface.
- Give two advantages and three disadvantages of a gesture-recognition interface, including one about hygiene.
- Which interface would you choose for: a kiosk at an airport, a server room, a smart car, a VR game? Justify each.
:::
