---
summary: Advantages and disadvantages of graphical, command-line, natural-language and gesture-recognition user interfaces, and choosing the right interface for a user and a task.
---
# Graphical user interface (GUI)
@lo 12.3.1.4

A GUI uses **windows, icons, menus and a pointer (WIMP)**, or touch controls, to interact with the computer.

:::compare
| Advantages | Disadvantages |
|---|---|
| Intuitive — little training needed; suitable for beginners and children | Needs more RAM, CPU, graphics and storage |
| Actions are visible — less to remember (recognition rather than recall) | Slower for expert users; many clicks for repeated tasks |
| WYSIWYG editing; drag and drop; several windows at once | Difficult to automate or to repeat exactly |
| Consistent across applications | Not available on simple embedded devices or many servers |
:::

# Command-line interface (CLI)
@lo 12.3.1.5

The user types **commands with parameters** at a prompt.

```bash | Linux commands
ls -l /home/student          # list files with details
cp report.txt backup/        # copy a file
grep "error" log.txt | wc -l # count lines containing "error"
```

:::compare
| Advantages | Disadvantages |
|---|---|
| Very fast for experts; powerful commands with options | Commands and syntax must be learned and remembered |
| **Scripts** automate repetitive tasks | Typing mistakes cause errors; no visual hints |
| Uses very few resources; works over slow remote connections | Intimidating for novices |
| Full control, access to all system functions | A wrong command can cause serious damage |
:::

# Natural-language and gesture-recognition interfaces
@lo 12.3.1.6

:::compare Natural language interface (spoken or typed)
| Advantages | Disadvantages |
|---|---|
| No need to learn commands — speak or type normally | Misunderstands accents, slang, ambiguous phrases, noise |
| Hands-free and eyes-free (driving, cooking, disabilities) | Limited understanding of complex requests |
| Fast for simple queries ("Set a timer for 10 minutes") | Privacy: the device listens and may store recordings |
| Accessible for visually impaired users | Needs processing power and often an Internet connection |
:::

:::compare Gesture recognition interface
| Advantages | Disadvantages |
|---|---|
| Natural, intuitive movements (swipe, pinch, wave) | Gestures may be misinterpreted or triggered accidentally |
| Contact-free — hygienic in hospitals and kitchens | Physically tiring for long periods |
| Immersive for games and VR | Needs cameras or sensors; affected by lighting |
| Useful when a keyboard is impractical | Limited set of gestures; not suitable for entering text |
:::

:::compare Choosing an interface
| User / task | Interface | Reason |
|---|---|---|
| Server administrator managing 100 servers | CLI | Scripts, low resources, remote access |
| Primary-school pupils | GUI / touch | Easy and visual |
| Driver changing music or getting directions | Natural language | Hands stay on the wheel |
| Surgeon looking at scans during an operation | Gesture | No touching — sterile |
| Person with limited hand movement | Natural language | No keyboard/mouse needed |
:::
