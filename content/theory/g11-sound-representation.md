---
summary: How sound is digitised by sampling, what sampling rate, sample resolution and channels mean and how they affect quality and file size, why analogue sound must be converted to binary (ADC and DAC), and how to calculate the size of an audio file.
---
# Analogue sound and why it must be converted
@lo 11.1.1.10

## What sound is

Sound is a **vibration**. When a guitar string, a loudspeaker cone or your vocal cords move back and forth, they push and pull the air molecules next to them. These molecules push the next ones, and a pattern of **high and low pressure** travels through the air as a **wave**. When the wave reaches your ear, it makes your eardrum vibrate in the same pattern, and your brain hears a sound.

A sound wave is usually drawn as a smooth curve on a graph: **time** goes along the horizontal axis, and the **amplitude** — how far the air pressure (or the voltage from a microphone) moves away from the middle — goes up the vertical axis. Two properties of the wave matter for this topic:

- The **amplitude** (the height of the wave) decides how **loud** the sound is. A bigger amplitude means a louder sound.
- The **frequency** (how many complete waves, or cycles, pass in one second) decides the **pitch**. It is measured in **hertz (Hz)**. A low note on a dombra may be about 100 Hz; a whistle may be 3 000 Hz. Humans can hear roughly from **20 Hz to 20 000 Hz** (20 kHz).

:::definition Amplitude
The **height of a sound wave** — how far it moves from its middle (rest) position at a moment in time. A larger amplitude means a **louder** sound. In digital sound, the amplitude is the value that is **measured and stored** in each sample.
:::

:::definition Frequency
The **number of complete cycles of a wave per second**, measured in **hertz (Hz)**. A higher frequency means a **higher pitch**. It must not be confused with the **sampling rate**, which is how often the computer measures the wave.
:::

## Analogue and digital signals

A real sound wave is **analogue**. At every instant — not just once a second, but at every tiny fraction of a second — the wave has some value, and that value can be **anything** within a range: 0.5, 0.51, 0.5137… There are no gaps and no steps. When a **microphone** picks up the sound, its diaphragm vibrates and produces an **electrical voltage** that copies the shape of the wave. This voltage is also analogue: it changes **continuously** and smoothly.

A computer, however, is a **digital** device. Its memory and processor are made of billions of tiny switches (transistors) that are either **on (1)** or **off (0)**. Everything a computer stores — numbers, text, images and sound — must be a **finite list of binary numbers**. A computer has no way to store "a smooth curve with infinitely many values"; it can only store **separate values**, each one a binary number of a fixed number of bits.

:::definition Analogue signal
A signal that varies **continuously** over time and can take **any value** within a range — for example a real sound wave or the voltage produced by a microphone.
:::

:::definition Digital signal
A signal made of **discrete (separate) values**, each stored as a **binary number** (0s and 1s). Between two stored values there is nothing — the signal jumps from one value to the next.
:::

:::compare Analogue and digital sound
| | Analogue sound | Digital sound |
|---|---|---|
| Values | **Continuous** — any value at any instant | **Discrete** — a fixed set of values, measured at fixed times |
| Example | Sound wave in air, voltage from a microphone, vinyl record groove | WAV, MP3, FLAC file; sound stored on a phone or CD |
| Can a computer store it directly? | **No** | **Yes** — it is already binary |
| Copying | Each copy adds noise and loses quality | Copies are **identical** to the original |
| Editing | Difficult (cut tape, re-record) | Easy — cut, paste, filter, change volume with software |
| Accuracy | Exact shape of the wave | An **approximation**; accuracy depends on sampling rate and resolution |
:::

## Why analogue sound must be converted into binary digits

This is learning objective 11.1.1.10, and examiners expect a full chain of reasoning, not just "because computers use binary". The argument has four links:

1. **A computer can only store and process binary data.** All storage (RAM, SSD, flash card) and all processing in the CPU work with bits. An analogue voltage has no binary form, so it cannot be put into memory as it is.
2. **An analogue signal has infinitely many values.** Even one second of sound contains an unlimited number of instants, each with a value of unlimited precision. To store it, the computer must reduce it to a **finite** number of values — by measuring it at regular intervals (sampling) and rounding each measurement to one of a limited set of levels (quantisation).
3. **Once the sound is binary, the computer can work with it.** It can be **edited** (cut, joined, made louder, have echo or noise removal applied), **compressed** to save space, **stored** on any storage device, **searched** and **analysed** (for example by voice recognition), and **transmitted** over a network or streamed.
4. **Digital data keeps its quality.** A binary file can be **copied** thousands of times and sent across the world, and every copy is bit-for-bit identical. An analogue copy (for example copying a cassette tape) always adds noise and loses quality.

## How the conversion happens: ADC and DAC

The conversion is done by a piece of hardware called an **analogue-to-digital converter (ADC)**. In a computer it is part of the **sound card** (or a chip on the motherboard); in a phone it is inside the audio chip; a USB microphone has its own ADC built in. To play sound back, the reverse is needed: the speaker or headphones can only move with an **analogue** voltage, so a **digital-to-analogue converter (DAC)** turns the stored binary values back into a continuously changing voltage, which is **amplified** and sent to the speaker.

:::definition Analogue-to-digital converter (ADC)
A hardware device that **measures an analogue signal at regular intervals** and converts each measurement into a **binary number**. It is needed to **record** sound into a computer.
:::

:::definition Digital-to-analogue converter (DAC)
A hardware device that converts **binary (digital) values back into an analogue signal** (a changing voltage) that can drive a **speaker** or headphones. It is needed to **play** digital sound.
:::

:::svg The full journey of a sound: recorded through an ADC, stored as binary, played back through a DAC
<svg class="snd" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A voice makes a sound wave; a microphone turns it into an analogue voltage; the ADC on the sound card samples and quantises it into binary numbers that are stored in a file; for playback the DAC turns the binary back into an analogue voltage, an amplifier strengthens it and the speaker produces a sound wave">
  <style>
    svg.snd .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.snd .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.snd .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.snd .m{font:700 13px ui-monospace,monospace;fill:var(--primary)}
    svg.snd .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.snd .pb{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.snd .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.snd .wv{fill:none;stroke:var(--primary);stroke-width:2.5}
    svg.snd .ln{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <defs><marker id="sndA1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>
  <text class="h" x="20" y="24">Recording (analogue → digital)</text>
  <rect class="bx" x="20" y="40" width="120" height="80" rx="8"/><text class="t" x="80" y="62" text-anchor="middle">Sound wave</text>
  <path class="wv" d="M30,95 C45,65 60,65 75,95 S105,125 120,95 S130,80 132,88"/>
  <line class="ln" x1="140" y1="80" x2="175" y2="80" marker-end="url(#sndA1)"/>
  <rect class="bx" x="175" y="40" width="130" height="80" rx="8"/><text class="t" x="240" y="66" text-anchor="middle">Microphone</text><text class="s" x="240" y="86" text-anchor="middle">wave → analogue</text><text class="s" x="240" y="102" text-anchor="middle">voltage</text>
  <line class="ln" x1="305" y1="80" x2="340" y2="80" marker-end="url(#sndA1)"/>
  <rect class="pb" x="340" y="40" width="170" height="80" rx="8"/><text class="h" x="425" y="64" text-anchor="middle">ADC (sound card)</text><text class="s" x="425" y="84" text-anchor="middle">samples the voltage and</text><text class="s" x="425" y="102" text-anchor="middle">rounds each to a level</text>
  <line class="ln" x1="510" y1="80" x2="545" y2="80" marker-end="url(#sndA1)"/>
  <rect class="ok" x="545" y="40" width="195" height="80" rx="8"/><text class="t" x="642" y="64" text-anchor="middle">Binary samples in a file</text><text class="m" x="642" y="86" text-anchor="middle">0101 0110 0111 0111</text><text class="m" x="642" y="106" text-anchor="middle">0110 0100 0010 …</text>
  <line class="ln" x1="642" y1="120" x2="642" y2="170" marker-end="url(#sndA1)"/>
  <text class="h" x="20" y="164">Playback (digital → analogue)</text>
  <rect class="pb" x="520" y="172" width="220" height="80" rx="8"/><text class="h" x="630" y="196" text-anchor="middle">DAC</text><text class="s" x="630" y="216" text-anchor="middle">turns each binary value back</text><text class="s" x="630" y="234" text-anchor="middle">into a voltage</text>
  <line class="ln" x1="520" y1="212" x2="485" y2="212" marker-end="url(#sndA1)"/>
  <rect class="bx" x="345" y="172" width="140" height="80" rx="8"/><text class="t" x="415" y="200" text-anchor="middle">Amplifier</text><text class="s" x="415" y="220" text-anchor="middle">makes the signal</text><text class="s" x="415" y="236" text-anchor="middle">strong enough</text>
  <line class="ln" x1="345" y1="212" x2="310" y2="212" marker-end="url(#sndA1)"/>
  <rect class="bx" x="180" y="172" width="130" height="80" rx="8"/><text class="t" x="245" y="200" text-anchor="middle">Speaker</text><text class="s" x="245" y="220" text-anchor="middle">voltage → moving</text><text class="s" x="245" y="236" text-anchor="middle">cone → sound wave</text>
  <line class="ln" x1="180" y1="212" x2="145" y2="212" marker-end="url(#sndA1)"/>
  <rect class="bx" x="20" y="172" width="125" height="80" rx="8"/><text class="t" x="82" y="194" text-anchor="middle">You hear it</text>
  <path class="wv" d="M30,230 C45,200 60,200 75,230 S105,260 120,230 S130,215 135,222"/>
  <text class="s" x="20" y="285">The file in the middle is the only part the computer stores, edits, compresses or sends over a network.</text>
</svg>
:::

:::example Worked example — recording a voice message on a phone
Aigerim records a 10-second voice message in a messenger app and sends it to her friend.
1. Her voice makes the air vibrate — an **analogue** sound wave.
2. The phone's **microphone** turns the vibrations into an **analogue voltage** that has the same shape as the wave.
3. The phone's **ADC** measures this voltage, for example **16 000 times a second**, and rounds each measurement to a **16-bit binary number**. That gives 160 000 samples for 10 seconds.
4. The app **compresses** the samples (so the message uses less mobile data) and **transmits** the binary file over the network. Because it is digital, the friend receives exactly the same bits that were sent.
5. On the friend's phone the app decompresses the file, the **DAC** turns the numbers back into a voltage, and the **speaker** produces sound that is very close to Aigerim's voice.

None of steps 3–5 would be possible with the analogue voltage: it could not be stored in the phone's memory, compressed or sent as data.
:::

# Sampling, sampling rate and sample resolution
@lo 11.1.1.9

## Sampling: measuring the wave at regular intervals

An ADC cannot record "every instant" of the wave. Instead it **samples** it: at **regular, equal time intervals** it measures the **amplitude** of the wave at that moment and stores the measurement as a **binary number**. Each measurement is called a **sample**. Between two samples nothing is recorded — the computer simply does not know what the wave did there.

The measurement itself cannot be infinitely precise either. The ADC has a fixed number of **levels** it can use, and every measurement is **rounded to the nearest available level**. This rounding is called **quantisation**. So digitising sound always has two parts: **sampling** decides **when** to measure (the time axis), and **quantisation** decides **how precisely** each measurement is stored (the amplitude axis).

:::definition Sampling
Measuring the **amplitude of a sound wave** at **regular time intervals** and storing each measurement as a **binary number**. Each measurement is a **sample**.
:::

:::svg Sampling a wave with 3-bit samples: the wave is measured at equal intervals and each value is rounded to one of 8 levels
<svg class="snd" viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A smooth sound wave drawn over a grid of eight amplitude levels 0 to 7. Vertical lines mark sixteen equal sampling intervals. At each line a dot shows the measured value rounded to the nearest level. The sample values are 4 5 6 7 7 6 5 3 2 1 0 0 1 2 3 4, and the stepped digital version follows the wave">
  <style>
    svg.snd .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.snd .t{font:13px system-ui,sans-serif;fill:var(--foreground)}
    svg.snd .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.snd .m{font:700 13px ui-monospace,monospace;fill:var(--primary)}
    svg.snd .gd{stroke:var(--border);stroke-width:1}
    svg.snd .ax{stroke:var(--foreground);stroke-width:1.5}
    svg.snd .wv{fill:none;stroke:var(--muted);stroke-width:2;stroke-dasharray:5 4}
    svg.snd .st{fill:none;stroke:var(--primary);stroke-width:2.5}
    svg.snd .dt{fill:var(--primary)}
    svg.snd .sl{stroke:var(--warning);stroke-width:1;stroke-dasharray:3 3}
  </style>
  <g>
    <line class="gd" x1="70" y1="40" x2="710" y2="40"/><line class="gd" x1="70" y1="70" x2="710" y2="70"/><line class="gd" x1="70" y1="100" x2="710" y2="100"/><line class="gd" x1="70" y1="130" x2="710" y2="130"/><line class="gd" x1="70" y1="160" x2="710" y2="160"/><line class="gd" x1="70" y1="190" x2="710" y2="190"/><line class="gd" x1="70" y1="220" x2="710" y2="220"/><line class="gd" x1="70" y1="250" x2="710" y2="250"/>
    <text class="s" x="58" y="44" text-anchor="end">7</text><text class="s" x="58" y="74" text-anchor="end">6</text><text class="s" x="58" y="104" text-anchor="end">5</text><text class="s" x="58" y="134" text-anchor="end">4</text><text class="s" x="58" y="164" text-anchor="end">3</text><text class="s" x="58" y="194" text-anchor="end">2</text><text class="s" x="58" y="224" text-anchor="end">1</text><text class="s" x="58" y="254" text-anchor="end">0</text>
    <text class="s" x="20" y="150" transform="rotate(-90 20 150)" text-anchor="middle">Amplitude level</text>
  </g>
  <line class="sl" x1="90" y1="34" x2="90" y2="256"/><line class="sl" x1="130" y1="34" x2="130" y2="256"/><line class="sl" x1="170" y1="34" x2="170" y2="256"/><line class="sl" x1="210" y1="34" x2="210" y2="256"/><line class="sl" x1="250" y1="34" x2="250" y2="256"/><line class="sl" x1="290" y1="34" x2="290" y2="256"/><line class="sl" x1="330" y1="34" x2="330" y2="256"/><line class="sl" x1="370" y1="34" x2="370" y2="256"/><line class="sl" x1="410" y1="34" x2="410" y2="256"/><line class="sl" x1="450" y1="34" x2="450" y2="256"/><line class="sl" x1="490" y1="34" x2="490" y2="256"/><line class="sl" x1="530" y1="34" x2="530" y2="256"/><line class="sl" x1="570" y1="34" x2="570" y2="256"/><line class="sl" x1="610" y1="34" x2="610" y2="256"/><line class="sl" x1="650" y1="34" x2="650" y2="256"/><line class="sl" x1="690" y1="34" x2="690" y2="256"/>
  <path class="wv" d="M90,127.0 C96.7,121.5 116.7,104.5 130,94.0 C143.3,83.5 156.7,72.5 170,64.0 C183.3,55.5 196.7,46.0 210,43.0 C223.3,40.0 236.7,42.0 250,46.0 C263.3,50.0 276.7,57.0 290,67.0 C303.3,77.0 316.7,92.5 330,106.0 C343.3,119.5 356.7,134.5 370,148.0 C383.3,161.5 396.7,175.0 410,187.0 C423.3,199.0 436.7,210.5 450,220.0 C463.3,229.5 476.7,239.5 490,244.0 C503.3,248.5 516.7,250.5 530,247.0 C543.3,243.5 556.7,233.5 570,223.0 C583.3,212.5 596.7,195.0 610,184.0 C623.3,173.0 636.7,165.5 650,157.0 C663.3,148.5 683.3,137.0 690,133.0"/>
  <path class="st" d="M90,130 H130 V100 H170 V70 H210 V40 H250 V40 H290 V70 H330 V100 H370 V160 H410 V190 H450 V220 H490 V250 H530 V250 H570 V220 H610 V190 H650 V160 H690 V130 H710"/>
  <circle class="dt" cx="90" cy="130" r="4.5"/><circle class="dt" cx="130" cy="100" r="4.5"/><circle class="dt" cx="170" cy="70" r="4.5"/><circle class="dt" cx="210" cy="40" r="4.5"/><circle class="dt" cx="250" cy="40" r="4.5"/><circle class="dt" cx="290" cy="70" r="4.5"/><circle class="dt" cx="330" cy="100" r="4.5"/><circle class="dt" cx="370" cy="160" r="4.5"/><circle class="dt" cx="410" cy="190" r="4.5"/><circle class="dt" cx="450" cy="220" r="4.5"/><circle class="dt" cx="490" cy="250" r="4.5"/><circle class="dt" cx="530" cy="250" r="4.5"/><circle class="dt" cx="570" cy="220" r="4.5"/><circle class="dt" cx="610" cy="190" r="4.5"/><circle class="dt" cx="650" cy="160" r="4.5"/><circle class="dt" cx="690" cy="130" r="4.5"/>
  <line class="ax" x1="70" y1="256" x2="720" y2="256"/><text class="s" x="715" y="274" text-anchor="end">time →</text>
  <text class="t" x="70" y="296">Samples:</text>
  <text class="m" x="140" y="296">4 5 6 7 7 6 5 3 2 1 0 0 1 2 3 4</text>
  <text class="t" x="70" y="320">Stored as 3-bit binary:</text>
  <text class="m" x="250" y="320">100 101 110 111 111 110 101 011 010 001 000 000 …</text>
  <text class="s" x="460" y="296">dashed = real wave, steps = digital copy</text>
</svg>
:::

## Sampling rate

:::definition Sampling rate (sampling frequency)
The **number of samples taken per second**, measured in **hertz (Hz)**. 44 100 Hz (44.1 kHz) means 44 100 samples every second.
:::

The **time interval** between two samples is 1 ÷ sampling rate. At 8 000 Hz the ADC measures every 1/8 000 = 0.000125 s (0.125 ms); at 44 100 Hz it measures about every 0.0227 ms. A **higher sampling rate** means the samples are **closer together in time**, so the stepped digital copy follows the original wave **more closely**. Quick changes in the wave — which are exactly the **high frequencies** that give cymbals, the letter "s" and the brightness of instruments their sound — are captured instead of being lost between two samples.

There is a rule that tells us how high the rate must be. To record a wave of a given frequency, there must be **at least two samples in every cycle** — one near the top and one near the bottom. This is the **Nyquist rule**: the sampling rate must be **more than twice the highest frequency** in the sound. Humans hear up to about 20 000 Hz, so music needs more than 2 × 20 000 = 40 000 Hz. That is why **CD audio uses 44 100 Hz**. A telephone line only needs to carry speech, whose important frequencies are below about 3 400 Hz, so it uses **8 000 Hz** — enough to understand words, but music sounds dull and "muffled" because everything above 4 000 Hz is lost.

If the sampling rate is too low, the samples miss the peaks and troughs of fast waves and the computer rebuilds a **different, lower** wave from them. This false sound is called **aliasing**. ADCs prevent it by filtering out frequencies that are too high before sampling.

## Sample resolution (bit depth)

:::definition Sample resolution (bit depth)
The **number of bits used to store each sample**. With **n** bits, **2ⁿ** different amplitude levels can be represented. CD audio uses **16 bits**, giving 2¹⁶ = **65 536** levels.
:::

The sample resolution decides **how precisely each measurement is stored**. With 3 bits, as in the diagram above, there are only 2³ = 8 levels (0–7), so a real value of 5.6 must be stored as 6 and a value of 5.4 as 5. With 16 bits there are 65 536 levels and the rounding is tiny. Each extra bit **doubles** the number of levels.

:::compare Sample resolution and the number of amplitude levels
| Sample resolution | Number of levels | Typical use | Sound quality |
|---|---|---|---|
| 1 bit | 2¹ = 2 | Early computer beeps | Only "on/off" — very harsh |
| 4 bits | 2⁴ = 16 | Old game consoles | Strong hiss and distortion |
| 8 bits | 2⁸ = 256 | Telephone, simple voice recording | Noticeable background noise |
| 16 bits | 2¹⁶ = 65 536 | CD audio, most music files | Very clean for listening |
| 24 bits | 2²⁴ = 16 777 216 | Studio recording, film | Professional — room to edit without adding noise |
:::

## Quantisation error

Because each sample is rounded to the nearest level, the stored value is almost never exactly the real value. The difference between them is the **quantisation error**. Played back, the errors sound like a faint **hiss or noise** added to the sound. With **more bits**, the levels are **closer together**, so the largest possible error is **smaller** and the noise is quieter. More bits also give a wider **dynamic range** — the difference between the quietest and the loudest sound that can be recorded: a quiet violin note and a loud drum can both be stored accurately.

:::definition Quantisation
**Rounding each measured amplitude to the nearest level** that can be stored with the chosen sample resolution. The difference between the real and the stored value is the **quantisation error**.
:::

## Channels: mono and stereo

A sound file can store more than one stream of samples. Each stream is a **channel**, and at every sampling moment one sample is stored **for each channel**.

- **Mono** — **1 channel**. Every speaker plays the same sound. Used for voice messages, phone calls, podcasts with one speaker, lecture recordings.
- **Stereo** — **2 channels**, left and right, recorded by two microphones. Instruments can sound as if they are in different places. A stereo file stores **twice as many samples** as a mono one of the same length and settings.
- **Surround sound** — for example **5.1** (six channels: front left, centre, front right, two rear and a bass channel) for films and games.

:::compare Sampling rate, sample resolution and channels
| | Sampling rate | Sample resolution | Number of channels |
|---|---|---|---|
| What it measures | Samples **per second** | **Bits per sample** | Separate streams of samples |
| Unit | Hz (samples per second) | bits | 1 (mono), 2 (stereo), … |
| Which axis of the wave | **Time** (horizontal) | **Amplitude** (vertical) | — |
| When it increases, quality… | Wave followed more closely in time; **higher frequencies** recorded | Each sample **more accurate**; less quantisation noise, wider dynamic range | Sense of **direction / space** |
| When it increases, file size… | Increases **in proportion** | Increases **in proportion** | Increases **in proportion** |
| Typical CD value | 44 100 Hz | 16 bits | 2 |
:::

:::svg Raising the sampling rate (left) and the sample resolution (right) both make the digital copy closer to the real wave
<svg class="snd" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Four small graphs of the same wave. Top left: low sampling rate, only five samples, the steps are wide and miss the shape. Bottom left: high sampling rate, many narrow steps that follow the wave. Top right: low resolution, only four levels, the steps are tall and coarse. Bottom right: high resolution, many levels, the steps are small and close to the wave">
  <style>
    svg.snd .h{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.snd .s{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.snd .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.snd .wv{fill:none;stroke:var(--muted);stroke-width:2;stroke-dasharray:5 4}
    svg.snd .bad{fill:none;stroke:var(--danger);stroke-width:2.5}
    svg.snd .good{fill:none;stroke:var(--success);stroke-width:2.5}
  </style>
  <text class="h" x="190" y="22" text-anchor="middle">Sampling rate (time axis)</text>
  <text class="h" x="570" y="22" text-anchor="middle">Sample resolution (amplitude axis)</text>
  <rect class="bx" x="20" y="32" width="340" height="115" rx="8"/>
  <path class="wv" d="M40,90 C80,40 120,40 160,90 S240,140 280,90 S330,50 345,70"/>
  <path class="bad" d="M40,90 H110 V48 H180 V100 H250 V128 H320 V62 H345"/>
  <text class="s" x="30" y="140">Low rate: few samples, detail between them lost</text>
  <rect class="bx" x="20" y="162" width="340" height="115" rx="8"/>
  <path class="wv" d="M40,220 C80,170 120,170 160,220 S240,270 280,220 S330,180 345,200"/>
  <path class="good" d="M40,220 H55 V204 H70 V190 H85 V181 H100 V176 H115 V176 H130 V183 H145 V196 H160 V214 H175 V232 H190 V246 H205 V256 H220 V262 H235 V262 H250 V255 H265 V242 H280 V224 H295 V207 H310 V194 H325 V188 H345"/>
  <text class="s" x="30" y="270">High rate: samples close together, shape kept</text>
  <rect class="bx" x="400" y="32" width="340" height="115" rx="8"/>
  <path class="wv" d="M420,90 C460,40 500,40 540,90 S620,140 660,90 S710,50 725,70"/>
  <path class="bad" d="M420,90 H440 V62 H500 V45 H520 V62 H540 V90 H560 V118 H620 V135 H640 V118 H660 V90 H690 V62 H725"/>
  <text class="s" x="410" y="140">Low resolution: few levels, big rounding steps</text>
  <rect class="bx" x="400" y="162" width="340" height="115" rx="8"/>
  <path class="wv" d="M420,220 C460,170 500,170 540,220 S620,270 660,220 S710,180 725,200"/>
  <path class="good" d="M420,220 H432 V207 H444 V194 H456 V186 H468 V180 H480 V178 H492 V178 H504 V182 H516 V190 H528 V202 H540 V218 H552 V234 H564 V246 H576 V255 H588 V260 H600 V262 H612 V259 H624 V252 H636 V242 H648 V230 H660 V218 H672 V206 H684 V196 H696 V189 H725"/>
  <text class="s" x="410" y="270">High resolution: many levels, small rounding error</text>
</svg>
:::

:::example Worked example — how many levels, and how big is the error?
A school's old dictaphone records with **4-bit** samples; a new one uses **12-bit** samples. The microphone voltage ranges from 0 V to 3.2 V.
1. Levels: 4 bits → 2⁴ = **16** levels; 12 bits → 2¹² = **4 096** levels.
2. Gap between two levels: old = 3.2 ÷ 16 = **0.2 V**; new = 3.2 ÷ 4 096 ≈ **0.00078 V**.
3. A real value of 1.13 V is rounded by the old device to the nearest step (1.2 V) — an error of 0.07 V. The new device stores it with an error of less than 0.0004 V.
4. Conclusion: the new device has a much **smaller quantisation error**, so recordings have far less hiss — but each sample uses **3 times as many bits** (12 instead of 4), so the files are three times bigger for the same sampling rate and length.
:::

:::cards
### How to describe digital sound in an exam (the four key ideas)
- The **amplitude** of the sound wave is **measured at regular intervals** (sampling).
- Each measurement is **rounded** to the nearest level and stored as a **binary number** (quantisation).
- The **sampling rate** is the number of samples per second.
- The **sample resolution** is the number of bits per sample; it sets how many levels (2ⁿ) are available.
### What "better quality" really means
- Not **louder** and not **faster** — a more **accurate** copy of the original wave.
- Higher rate → more **high-frequency** detail; higher resolution → less **noise**, wider **dynamic range**.
- Above a certain point people **cannot hear** any difference (e.g. beyond 44.1 kHz / 16 bits for most listeners).
:::

# Quality, file size and choosing settings
@lo 11.1.1.9 11.1.1.11

## The trade-off between quality and file size

Every improvement in quality has a cost. **Doubling the sampling rate** doubles the number of samples, so the file is **twice as big**. Going from **8-bit to 16-bit** samples doubles the bits in each sample, so again the file **doubles**. Switching from **mono to stereo** doubles the number of samples. A bigger file needs more **storage space**, more **bandwidth** to stream, a **longer time** to download or upload, and more **mobile data**. A good designer therefore chooses settings that are **good enough for the purpose**, not the highest possible: a voice message does not need studio quality, but a music album does.

:::compare Typical audio settings and why they are chosen
| Use | Sampling rate | Sample resolution | Channels | Reason |
|---|---|---|---|---|
| Telephone call | 8 000 Hz | 8 bits | Mono | Only speech must be understood; uses very little bandwidth |
| Voice message / podcast | 16 000 – 22 050 Hz | 16 bits | Mono | Clear voice, small file, one speaker so no need for stereo |
| CD / music file | 44 100 Hz | 16 bits | Stereo | Covers all frequencies people hear; left/right sound |
| Film and video | 48 000 Hz | 16 – 24 bits | Stereo or 5.1 | Standard for video; surround sound |
| Recording studio | 96 000 Hz | 24 bits | Many tracks | Extra accuracy so that editing and mixing do not add noise |
:::

## Reducing the size of a sound file

There are two families of methods. The first is to **record with lower settings**: lower sampling rate, lower sample resolution, mono instead of stereo, or a shorter recording. Each of these lowers the quality in a predictable way. The second is **compression**, which keeps the settings but stores the data more efficiently.

- **Lossless compression** (for example **FLAC**, ALAC) finds patterns in the data and stores them more compactly. The original samples can be **restored exactly**, bit for bit. Files are usually about **half** the original size. Used for archiving and by music lovers.
- **Lossy compression** (for example **MP3**, **AAC**, Opus) **permanently removes** sound that people can hardly hear — very high frequencies, and quiet sounds that are hidden ("masked") by louder sounds at the same moment. Files become about **10 times smaller**, but the removed data **cannot be restored**. Used for streaming, online music and messenger voice notes.

:::compare Ways to make an audio file smaller
| Method | Effect on size | Effect on quality | Can the original be restored? |
|---|---|---|---|
| Lower the **sampling rate** | Smaller in proportion (44.1 → 22.05 kHz halves it) | High frequencies lost; sounds dull | No |
| Lower the **sample resolution** | Smaller in proportion (16 → 8 bits halves it) | More quantisation noise / hiss | No |
| **Mono** instead of stereo | Half the size | No left/right effect | No |
| **Lossless** compression (FLAC) | About ½ | No change | **Yes**, exactly |
| **Lossy** compression (MP3, AAC) | About 1/10 | Small loss, often not noticed | **No** |
:::

:::example Worked example — choosing settings for a school radio podcast
The school wants to publish a weekly 20-minute podcast in which two students talk about school news. The files will be downloaded by parents on their phones.
1. **Content**: speech only, no music → frequencies up to about 8 kHz matter. By the Nyquist rule a sampling rate of **16 000–22 050 Hz** is enough; 44 100 Hz would double the size with no audible benefit.
2. **Resolution**: **16 bits** — 8 bits would add audible hiss in quiet moments.
3. **Channels**: **mono** — both students speak into one microphone; stereo would double the size for nothing.
4. **Compression**: publish as **MP3/AAC** (lossy) because parents download on mobile data; keep the original uncompressed WAV on the school computer in case it has to be edited later.
5. The choice keeps the speech clear while making the file several times smaller than "CD quality stereo".
:::

:::warning Common mistakes about sound quality
- Saying a higher sampling rate makes the sound **louder**. Loudness is the **amplitude**; the sampling rate only changes how **accurately** the wave is recorded.
- Mixing up **sampling rate** (samples **per second**) and **sample resolution** (bits **per sample**). Remember: rate = time axis, resolution = amplitude axis.
- Confusing the **frequency** of a sound with the **sampling rate**. A 1 000 Hz note can be recorded at 44 100 Hz.
- Writing "the quality improves" without saying **why**: say "the digital copy is **closer to the original** wave because…".
- Forgetting the **cost**: every increase in rate, resolution or channels also **increases the file size**. A 6-mark "explain" answer must mention both sides.
- Thinking 8 bits give 8 levels. **n bits give 2ⁿ levels**: 8 bits → 256.
:::

# Calculating the size of an audio file
@lo 11.1.1.11

## Where the formula comes from

The formula is not something to memorise blindly — it follows from what is stored. In **one second**, the ADC takes *sampling rate* samples **for each channel**, and each sample uses *sample resolution* bits. So one second of sound needs **sampling rate × resolution × channels** bits. For a recording of *t* seconds, multiply by *t*.

$$\text{File size (bits)} = \text{sampling rate (Hz)} \times \text{sample resolution (bits)} \times \text{channels} \times \text{duration (s)}$$ | The basic formula for uncompressed sound (e.g. a WAV file)

:::definition Audio file size
**File size in bits = sampling rate × sample resolution × number of channels × duration in seconds.** Divide by **8** for bytes, then by **1024** for KB, and by **1024** again for MB. This gives the size of the **uncompressed** sound data; real files are slightly bigger because of a small **header** (metadata such as the sampling rate and length).
:::

:::steps How to calculate the size of an audio file
- Write down the four values and **convert the duration to seconds** (2 min 30 s = 150 s).
- Convert kHz to Hz if needed (44.1 kHz = 44 100 Hz).
- Multiply: rate × resolution × channels × seconds = **bits**.
- Divide by 8 to get **bytes**.
- Divide by 1024 to get **KB**, and again by 1024 to get **MB** (only as far as the question asks).
- Write the **unit** and round sensibly (2 decimal places) at the very end, not in the middle.
:::

:::example Worked example 1 — one minute of CD-quality stereo
44 100 Hz, 16 bits, stereo (2 channels), 1 minute = 60 s.
1. Bits: 44 100 × 16 × 2 × 60 = **84 672 000 bits**.
2. Bytes: 84 672 000 ÷ 8 = **10 584 000 bytes**.
3. KB: 10 584 000 ÷ 1024 ≈ **10 335.94 KB**.
4. MB: 10 335.94 ÷ 1024 ≈ **10.09 MB**.

So one minute of CD audio is about 10 MB, and a 4-minute song about 40 MB uncompressed — which is why music is usually sold and streamed as MP3/AAC (about 4 MB).
:::

:::example Worked example 2 — a telephone message
8 000 Hz, 8 bits, mono, 10 s.
8 000 × 8 × 1 × 10 = 640 000 bits → ÷ 8 = **80 000 bytes** → ÷ 1024 = **78.125 KB**.

Compare with worked example 1: per second, the CD file needs 44 100 × 16 × 2 = 1 411 200 bits; the telephone needs 64 000 bits — about **22 times** less.
:::

## Working backwards

Exam questions often give the file size and ask for one of the other values. Rearrange the formula: **divide the size in bits by the product of the values you know**. First convert the size **back to bits** (MB × 1024 × 1024 × 8, or bytes × 8).

:::example Worked example 3 — finding the sampling rate
A **mono** recording uses **16-bit** samples, lasts **10 seconds** and the file is **441 000 bytes**. Find the sampling rate.
1. Size in bits: 441 000 × 8 = **3 528 000 bits**.
2. Known values: 16 × 1 × 10 = 160.
3. Sampling rate = 3 528 000 ÷ 160 = **22 050 Hz** (22.05 kHz).
:::

:::example Worked example 4 — how long can I record?
A voice recorder has **30 MB** free. It records at 16 000 Hz, 16 bits, mono. How many minutes can it record?
1. Free space in bits: 30 × 1024 × 1024 × 8 = **251 658 240 bits**.
2. Bits per second: 16 000 × 16 × 1 = **256 000 bits**.
3. Time: 251 658 240 ÷ 256 000 ≈ **983 s** → 983 ÷ 60 ≈ **16.4 minutes**.
:::

## How changes affect the size

Because the formula is a simple multiplication, every value affects the size **in proportion**. You can often answer "what happens to the file size if…" questions without a calculator.

:::compare Effect of changing the settings on the file size
| Change | Effect on file size | Why |
|---|---|---|
| Double the sampling rate (22.05 → 44.1 kHz) | **× 2** | Twice as many samples each second |
| 8-bit → 16-bit samples | **× 2** | Each sample takes twice as many bits |
| 16-bit → 24-bit samples | **× 1.5** | 24 ÷ 16 = 1.5 |
| Mono → stereo | **× 2** | One sample for each of two channels |
| Halve the duration | **÷ 2** | Half as many samples in total |
| 44.1 kHz → 22.05 kHz **and** stereo → mono | **÷ 4** | ÷ 2 for the rate, ÷ 2 for the channels |
| Lossy compression to MP3 | about **÷ 10** | Inaudible data removed (formula no longer applies) |
:::

:::example Worked example 5 — streaming and download time
A 3-minute stereo song at 44 100 Hz and 16 bits is sent over a connection of **8 Mbps** (8 000 000 bits per second).
1. Size: 44 100 × 16 × 2 × 180 = **254 016 000 bits** (= 31 752 000 bytes ≈ 30.28 MB).
2. Time: 254 016 000 ÷ 8 000 000 ≈ **31.8 seconds**.
3. As a 320 kbps MP3 the same song is 320 000 × 180 = 57 600 000 bits → about **7.2 seconds**. This shows why streaming services use lossy compression.
:::

:::warning Common mistakes in audio calculations
- Leaving the duration in **minutes** — always use **seconds**.
- Forgetting to **multiply by 2 for stereo** (or by the number of channels).
- Forgetting to **divide by 8** to change bits into bytes, or dividing by 8 twice.
- Dividing by **1000** in one step and **1024** in the next — use one convention throughout (this course uses 1024 for KB and MB).
- Using kHz in the formula without converting: 44.1 × 16 × 2 × 60 gives an answer 1000 times too small.
- Rounding in the middle of the calculation — keep the full number and round only the final answer.
:::

# Exam practice: sound representation
@lo 11.1.1.9 11.1.1.10 11.1.1.11

:::example Exam-style questions with model answers
**Q: Explain how sound is represented digitally. [4]**
The amplitude/height of the sound wave is **measured** (sampled) (1) at **regular time intervals** (1); each measurement is **rounded** to the nearest level and stored as a **binary number** (1); the number of samples per second is the **sampling rate** and the number of bits per sample is the **sample resolution** (1).

**Q: Explain why analogue sound must be converted into binary before it can be stored on a computer. [3]**
A computer can only store and process **binary/digital** data (1). Analogue sound is **continuous** and has infinitely many values, so it must be reduced to a finite set of **samples** (1). An **ADC** samples the signal and converts each sample to a binary number (1).

**Q: Describe the effect on the sound quality and on the file size of increasing the sampling rate. [2]**
The digital sound is **closer to the original** wave / higher frequencies can be recorded (1); the file size **increases** in proportion (more samples per second) (1).

**Q: State how many amplitude levels can be stored with a sample resolution of 10 bits. [1]**
2¹⁰ = **1 024** levels (1).

**Q: Calculate the size in MB of a 2-minute stereo recording with a sampling rate of 44.1 kHz and 16-bit resolution. Show your working. [3]**
44 100 × 16 × 2 × 120 = 169 344 000 bits (1); ÷ 8 = 21 168 000 bytes (1); ÷ 1024 ÷ 1024 ≈ **20.19 MB** (1).

**Q: A mono recording lasts 5 seconds, uses 8-bit samples and is 40 000 bytes. Calculate the sampling rate. [2]**
40 000 × 8 = 320 000 bits (1); 320 000 ÷ (8 × 1 × 5) = **8 000 Hz** (1).
:::

:::warning Common mistakes in exam answers
- Writing only the final number in calculations — most marks are for the **working**.
- In "explain" questions, giving only the effect on quality and forgetting the effect on **file size** (or the other way round).
- Saying "a computer understands only 0 and 1" without explaining what the **ADC** does.
:::

:::steps Check yourself
- Define sampling, sampling rate, sample resolution and quantisation.
- Why must a computer convert sound to binary? Which device records it and which plays it back?
- How many amplitude levels are possible with 4-bit, 8-bit and 16-bit samples?
- Why does CD audio use 44 100 Hz and not 20 000 Hz?
- Give the formula for the size of an audio file and calculate the size in KB of a 20-second mono recording at 11 025 Hz with 8-bit samples.
- What happens to the file size if a recording changes from stereo to mono and from 16-bit to 8-bit?
- Explain the difference between lossy and lossless compression of sound.
:::
