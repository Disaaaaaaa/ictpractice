---
summary: The purpose of virtual and augmented reality — how VR and AR work, the hardware they use, the difference between them and mixed reality, their uses in education, medicine, industry, retail and entertainment, and their benefits and drawbacks.
---
# Virtual reality and augmented reality
@lo 12.4.3.2

:::definition Virtual reality (VR)
A **computer-generated, three-dimensional environment** that **completely replaces** the user's view of the real world. Using a headset, the user feels **immersed** (present) in the virtual world and can **interact** with it in real time.
:::

:::definition Augmented reality (AR)
Technology that **overlays computer-generated content** — text, images, 3D models, sound — **onto the user's view of the real world in real time**. The real world remains visible; it is **enhanced (augmented)** with digital information.
:::

:::definition Mixed reality (MR)
A combination in which **virtual objects are anchored in the real world and interact with it** — for example, a virtual ball that bounces off a real table and can be hidden behind a real chair. Example device: Microsoft HoloLens, Apple Vision Pro.
:::

:::ascii The reality–virtuality continuum
REAL WORLD ------- AUGMENTED REALITY ------- MIXED REALITY ------- VIRTUAL REALITY
everything real    digital layer on top      digital objects      everything is
                   of the real view          interact with        computer-generated
                   (phone, AR glasses)       real ones            (VR headset)
:::

:::compare VR vs AR
| Criterion | Virtual reality | Augmented reality |
|---|---|---|
| Real world | **Completely replaced** — the user cannot see it | **Still visible**, with digital content added |
| Immersion | **Full** immersion | **Partial** |
| Hardware | VR headset (head-mounted display), controllers, sensors | Smartphone / tablet camera, AR glasses, head-up display |
| Movement | Limited to a safe play area; risk of bumping into objects | User moves around the real world normally |
| Main purpose | Experience places and situations that are **impossible, dangerous or expensive** in reality | **Add useful information** to what the user is already looking at |
| Examples | Flight simulators, VR games, virtual tours | Pokémon GO, Google Lens translation, IKEA Place, car head-up displays |
:::

:::tip One-sentence difference
**Virtual reality replaces your vision; augmented reality adds to it.**
:::

# How virtual reality works
@lo 12.4.3.2

:::cards
### Head-mounted display (HMD)
Two small screens (one for each eye) show slightly different images, creating **stereoscopic 3D** depth. Lenses make the image fill the field of view.
### Tracking
**Gyroscopes, accelerometers** and cameras track the position and rotation of the head (**six degrees of freedom**), so the view changes instantly when the user looks around or walks.
### Controllers and gloves
Hand-held controllers or data gloves track the hands, so the user can **pick up, push and point** at virtual objects.
### Haptic feedback
Vibrations (and in advanced systems, force feedback) let the user **feel** contact with virtual objects.
### Spatial audio
Sound changes with the direction of the user's head, adding to the feeling of presence.
### Powerful processing
A computer, console or the headset itself must render **two high-resolution images at 90+ frames per second** with **very low latency**; otherwise users feel **motion sickness**.
:::

:::mermaid The VR loop runs many times per second
flowchart TB
  S[Sensors track head and hands] --> C[Computer updates the virtual scene]
  C --> R[Renders an image for each eye]
  R --> D[Headset displays the images]
  D --> S
:::

# How augmented reality works
@lo 12.4.3.2

:::steps How an AR app places a virtual sofa in your room
- The **camera** captures live video of the room.
- **Sensors** (gyroscope, accelerometer, depth sensor, GPS) and **computer vision** detect the floor, walls and the device's position (this mapping is called **SLAM**).
- The app **anchors** a 3D model of the sofa to the floor at the chosen spot.
- The model is **drawn on top of the live video** at the correct size and angle; as the user moves, it stays in place.
:::

:::compare Types of AR
| Type | How it decides where to show content | Example |
|---|---|---|
| **Marker-based** | Recognises a printed image / QR code | Pointing a tablet at a textbook page shows a 3D heart |
| **Markerless** | Detects surfaces (floors, tables) with computer vision | Furniture-placement apps |
| **Location-based** | Uses **GPS** and compass | Pokémon GO; arrows for walking directions; information about a building |
| **Projection-based** | Projects light onto real surfaces | Projected keyboards; assembly instructions projected onto a workbench |
| **Head-up display (HUD)** | Information shown on a transparent screen / windscreen | Speed and navigation on a car windscreen; pilots' HUD |
:::

# The purpose of VR and AR in different fields
@lo 12.4.3.2

:::compare Purposes by field
| Field | Purpose of VR | Purpose of AR |
|---|---|---|
| **Education** | Virtual field trips (space, ancient Rome, inside a cell); safe science experiments | 3D models on top of textbooks; labelled anatomy; star maps; interactive learning |
| **Training** | **Simulators** for pilots, drivers, surgeons, soldiers, firefighters — practise dangerous situations safely | Step-by-step instructions shown on real equipment during training |
| **Medicine** | Surgery practice; treating **phobias** and PTSD (exposure therapy); pain distraction; rehabilitation | Showing a patient's veins / scans **over the body** during an operation |
| **Engineering / architecture** | Walking through a building or car **before it is built**; testing designs | Seeing a planned building at its real location; maintenance instructions over machines |
| **Retail** | Virtual showrooms and stores | **Try before you buy** — furniture in your room, glasses or make-up on your face |
| **Tourism / culture** | Virtual tours of museums and cities | Information and reconstructions over ruins and exhibits |
| **Entertainment** | Immersive games, virtual concerts, 360° films | Location-based games, camera filters, live sports graphics |
| **Navigation** | — | Directions over the street view; car HUDs |
| **Communication / work** | Virtual meeting rooms | Remote experts draw instructions onto a worker's live view |
:::

:::example Purposes of AR (exam style)
AR provides **real-time access to information** relevant to what the user is looking at in the physical world (e.g. translating a sign, showing the name of a building), and provides **immersive and interactive learning experiences** (e.g. a 3D volcano erupting on the desk).
:::

:::example Purpose of VR in pilot training
Trainee pilots practise take-offs, landings and **emergencies** (engine failure, storms) in a realistic virtual cockpit. There is **no danger** to people or aircraft, it is **cheaper** than real flights, and any situation can be **repeated** as often as needed.
:::

# Benefits and drawbacks
@lo 12.4.3.2

:::cards
### Benefits of VR
- Safe practice of **dangerous** or **rare** situations.
- **Cheaper** than real training (fuel, equipment, travel).
- Experiences that are **impossible** in reality (inside the human body, other planets).
- Very **engaging** — learners remember more.
### Drawbacks of VR
- **Motion sickness**, eye strain and headaches; not suitable for young children for long periods.
- Users are **isolated** from the real world and can **bump into objects**.
- **Expensive** headsets and powerful computers.
- May not feel completely realistic (no real touch, weight).
### Benefits of AR
- Users stay **aware of the real world** — safer, can be used while walking or working.
- Works on **smartphones** that many people already own — cheap and accessible.
- Gives **information at the moment it is needed**, in context.
### Drawbacks of AR
- **Distraction** — dangerous if people look at the screen while walking or driving.
- **Privacy** — the camera constantly records the surroundings.
- Small phone screens; AR glasses are expensive; drains the **battery**.
- Tracking errors make virtual objects drift or appear in the wrong place.
:::

# Exam practice and summary
@lo 12.4.3.2

:::example Exam-style answers
**Q: Explain the difference between virtual and augmented reality. [2]**
A virtual reality **replaces** your vision, augmented reality **adds to** it (1). VR completely covers and replaces the field of vision with a computer-generated world, while AR shows digital objects **on top of the real world**, seen through a screen or glasses (1).

**Q: State two purposes of augmented reality. [2]**
To give **real-time access to information** about the physical world around the user (1); to provide **immersive and interactive learning** experiences (1). *(Also: try products before buying, navigation, maintenance instructions.)*

**Q: Explain one purpose of virtual reality in medicine. [2]**
Surgeons can **practise operations** in a realistic virtual environment (1) **without any risk** to real patients (1).
:::

:::warning Common mistakes
- Saying AR "creates a virtual world" — AR **adds** to the **real** world; only VR creates a whole virtual world.
- Describing VR/AR only by the device ("you wear a headset") without stating its **purpose**.
- Giving a purpose without the **benefit** — say *why* VR training is better (safe, cheaper, repeatable).
- Confusing a **360° video** (you can only look around) with full VR (you can also interact).
:::

:::steps Check yourself
- Define VR, AR and MR.
- Give three differences between VR and AR.
- How does a VR headset create a feeling of depth and presence?
- Describe how an AR app keeps a virtual object in the same place as you move.
- Name four types of AR with an example of each.
- Give one purpose of VR and one purpose of AR in education, medicine and retail.
- Give two drawbacks of each technology.
:::
