---
summary: How sound is digitised by sampling, what sampling rate, sample resolution and channels mean and how they affect quality and file size, why analogue sound must be converted to binary (ADC and DAC), and how to calculate the size of an audio file.
---
# Analogue and digital sound
@lo 11.1.1.10

Sound is a **vibration** that travels through the air as a **wave**. A microphone turns these vibrations into a **continuously changing electrical voltage** — an **analogue signal**.

:::definition Analogue signal
A signal that varies **continuously** and can take **any value** within a range — for example a real sound wave or the voltage from a microphone.
:::

:::definition Digital signal
A signal made of **discrete (separate) values**, stored as **binary numbers** (0s and 1s).
:::

:::cards
### Why sound must be converted to binary
- A computer can **only store and process binary data** (0s and 1s); it cannot store a continuous wave.
- Digital sound can be **edited, copied, compressed and transmitted** without losing quality.
- It can be **stored** on storage devices and **streamed** over networks.
### How it is converted
- A **microphone** converts the sound wave into an analogue electrical signal.
- An **ADC (analogue-to-digital converter)**, usually on the **sound card**, measures the signal and converts it into **binary numbers**.
- To play the sound back, a **DAC (digital-to-analogue converter)** turns the binary values back into an analogue signal for the **speaker**.
:::

:::mermaid From sound wave to file and back
flowchart TB
  A[Sound wave] --> B[Microphone - analogue signal]
  B --> C[ADC - sampling and quantisation]
  C --> D[Binary data stored in a file]
  D --> E[DAC - binary to analogue]
  E --> F[Speaker - sound wave]
:::

# Sampling
@lo 11.1.1.9

:::definition Sampling
Measuring the **amplitude (height) of the sound wave** at **regular time intervals** and storing each measurement as a **binary number**. Each measurement is called a **sample**.
:::

:::ascii Sampling a sound wave (each | is one sample; the value is rounded to the nearest level)
Level
  7 |            *  *
  6 |         *        *
  5 |      *              *
  4 |   *                    *
  3 |*                          *                    *
  2 |                              *              *
  1 |                                 *        *
  0 |                                    *  *
    +--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--> time
Samples: 3 4 5 6 7 7 6 5 4 3 2 1 0 0 1 2 3   (3-bit values 0–7)
:::

:::definition Sampling rate (sampling frequency)
The **number of samples taken per second**, measured in **hertz (Hz)**. CD-quality audio uses **44 100 Hz (44.1 kHz)** — 44 100 samples every second.
:::

:::definition Sample resolution (bit depth)
The **number of bits used to store each sample**. With *n* bits, **2ⁿ different amplitude levels** can be represented. CD audio uses **16 bits** (65 536 levels).
:::

:::cards
### Channels
- **Mono** — **1** channel; the same sound from every speaker.
- **Stereo** — **2** channels (left and right), so the file stores **twice** as many samples.
- Surround sound — 6 or more channels.
### Quantisation
- Each measured amplitude is **rounded** to the **nearest available level**.
- The difference between the real value and the stored value is the **quantisation error** — it is smaller when the sample resolution is higher.
:::

# Effect on quality and file size
@lo 11.1.1.9

:::compare Sampling rate and sample resolution
| | Higher sampling rate | Higher sample resolution |
|---|---|---|
| What changes | **More samples per second** | **More bits per sample** → more amplitude levels |
| Effect on quality | The digital wave follows the original **more closely in time**; higher frequencies can be recorded | Each sample is **more accurate** (less rounding); **wider dynamic range**, less noise |
| Effect on file size | **Increases** (in proportion) | **Increases** (in proportion) |
:::

:::compare Typical audio settings
| Use | Sampling rate | Sample resolution | Channels |
|---|---|---|---|
| Telephone / voice call | 8 000 Hz | 8 bits | Mono |
| Voice recording / podcast | 22 050 Hz | 16 bits | Mono |
| CD audio | 44 100 Hz | 16 bits | Stereo |
| Studio / film | 48 000 – 96 000 Hz | 24 bits | Stereo or more |
:::

:::tip Why 44 100 Hz?
Humans hear up to about **20 000 Hz**. To record a frequency accurately, you need **at least two samples per wave cycle** (the Nyquist rule), so the sampling rate must be more than **2 × 20 000 = 40 000 Hz**. 44 100 Hz is enough for all frequencies people can hear.
:::

:::callout warning The trade-off
Better quality always means a **bigger file**: it needs more **storage**, more **bandwidth** to stream and **longer download** times. Choose settings that are **good enough** for the purpose — a voice message does not need CD quality.
:::

# Calculating the size of an audio file
@lo 11.1.1.11

:::definition Audio file size
**File size (bits) = sampling rate (Hz) × sample resolution (bits) × number of channels × duration (seconds)**

Then: **÷ 8 → bytes**, **÷ 1024 → KB**, **÷ 1024 → MB**. Always convert the duration to **seconds** first (3 minutes = 180 s).
:::

:::example Worked example 1 — 1 minute of CD-quality stereo
44 100 Hz, 16 bits, stereo (2 channels), 60 s.
1. Bits: 44 100 × 16 × 2 × 60 = **84 672 000 bits**
2. Bytes: 84 672 000 ÷ 8 = **10 584 000 bytes**
3. KB: 10 584 000 ÷ 1024 = **10 335.94 KB**
4. MB: 10 335.94 ÷ 1024 ≈ **10.09 MB**
:::

:::example Worked example 2 — a telephone message
8 000 Hz, 8 bits, mono, 10 s: 8 000 × 8 × 1 × 10 = 640 000 bits → ÷ 8 = **80 000 bytes** → ÷ 1024 = **78.125 KB**.
:::

:::example Worked example 3 — working backwards
A **mono** recording uses **16-bit** samples, lasts **10 seconds** and has a file size of **441 000 bytes**. Find the sampling rate.
441 000 × 8 = 3 528 000 bits. 3 528 000 ÷ (16 × 1 × 10) = **22 050 Hz**.
:::

:::example Worked example 4 — a 3-minute song
44 100 Hz, 16 bits, stereo, 3 min = 180 s: 44 100 × 16 × 2 × 180 = 254 016 000 bits = 31 752 000 bytes ≈ **30.28 MB**. That is why music is usually **compressed** (MP3 / AAC) to about 3 MB.
:::

:::compare Effect of changes on file size
| Change | File size |
|---|---|
| Double the sampling rate | **× 2** |
| Change 8-bit to 16-bit samples | **× 2** |
| Change mono to stereo | **× 2** |
| Halve the duration | **÷ 2** |
| 44.1 kHz → 22.05 kHz **and** stereo → mono | **÷ 4** |
:::

# Reducing the size of sound files
@lo 11.1.1.9 11.1.1.11

:::compare Ways to reduce the file size
| Method | Effect |
|---|---|
| Lower the **sampling rate** | Smaller file; high frequencies are lost |
| Lower the **sample resolution** | Smaller file; more quantisation noise |
| Use **mono** instead of stereo | Half the size; no left/right effect |
| **Lossy compression** (MP3, AAC) | About 10 × smaller; removes sounds people can hardly hear — cannot be restored |
| **Lossless compression** (FLAC) | About 2 × smaller; the original can be restored exactly |
:::

# Exam practice and summary
@lo 11.1.1.9 11.1.1.10 11.1.1.11

:::example Exam-style answers
**Q: Explain how sound is represented digitally. [3]**
The amplitude of the sound wave is **measured (sampled)** at **regular intervals** (1); each sample is stored as a **binary number** using a fixed number of bits — the **sample resolution** (1); the number of samples per second is the **sampling rate** (1).

**Q: Explain why analogue sound must be converted before it can be stored on a computer. [2]**
A computer can only store and process **binary / digital** data (1); the sound wave is **continuous**, so an **ADC** must sample it and convert it to binary values (1).

**Q: Calculate the file size in MB of a 2-minute stereo recording with a sampling rate of 44.1 kHz and 16-bit resolution. [3]**
44 100 × 16 × 2 × 120 = 169 344 000 bits (1); ÷ 8 = 21 168 000 bytes (1); ÷ 1024 ÷ 1024 ≈ **20.19 MB** (1).

**Q: Describe the effect of increasing the sample resolution. [2]**
More amplitude levels, so each sample is **closer to the original** / better quality (1); the file size **increases** (1).
:::

:::warning Common mistakes
- Forgetting to **multiply by the number of channels** for stereo.
- Leaving the duration in **minutes**.
- Confusing **sampling rate** (samples per second) with **sample resolution** (bits per sample).
- Forgetting to **divide by 8** to get bytes.
- Saying a higher sampling rate makes the sound "louder" — it makes it **more accurate**.
:::

:::steps Check yourself
- Define sampling, sampling rate and sample resolution.
- Why must a computer convert sound to binary? Which device does it?
- How many amplitude levels are possible with 4-bit and 16-bit samples?
- Give the formula for the size of an audio file.
- Calculate the size in KB of a 20-second mono recording at 11 025 Hz with 8-bit samples.
- What happens to the file size if a recording changes from stereo to mono?
:::
