---
summary: How sound is digitised by sampling, the meaning of sampling rate and sample resolution, why analogue sound must be converted to binary, and calculating audio file sizes.
---
# Digital representation of sound
@lo 11.1.1.9

Sound is a **wave** — a continuous (analogue) vibration of air. To store it, a computer measures the wave many times per second and stores each measurement as a binary number.

:::cards
### Sampling
Measuring the **amplitude** (height) of the sound wave at **regular intervals**.
### Sampling rate
The **number of samples taken per second**, measured in hertz (Hz). CD quality = 44 100 Hz (44.1 kHz).
### Sample resolution (bit depth)
The **number of bits used to store each sample**. More bits → more possible amplitude levels (2ⁿ levels). CD quality = 16 bits.
:::

:::ascii Sampling a wave: each | is one sample, its height is stored as a number
amplitude
   7 |        *  *
   6 |      *      *
   5 |    *          *
   4 |  *              *
   3 |*                  *              *
   2 |                     *          *
   1 |                       *  *  *
     +--|--|--|--|--|--|--|--|--|--|--|--|-- time
:::

:::compare Effect of sampling rate and resolution
| Increase | Quality | File size |
|---|---|---|
| Sampling rate | Closer to the original wave; high frequencies captured | Larger |
| Sample resolution | More accurate amplitude, less "noise", greater dynamic range | Larger |
:::

# Why analogue sound must be converted to binary
@lo 11.1.1.10

- Computers can only store and process **digital (binary) data**; sound in the real world is **analogue** (continuous).
- An **ADC** (analogue-to-digital converter), e.g. in a microphone input or sound card, samples the signal and converts each sample to binary.
- To play the sound, a **DAC** (digital-to-analogue converter) turns the binary values back into an analogue signal for the speakers.
- Digital sound can be **edited, compressed, copied without loss of quality** and transmitted over networks.

:::mermaid From voice to file and back
flowchart LR
  M[Microphone: analogue signal] --> A[ADC: sample + quantise] --> F[(Binary audio file)] --> D[DAC] --> S[Speaker]
:::

# Calculating the size of an audio file
@lo 11.1.1.11

$$\text{File size (bits)} = \text{sampling rate} \times \text{resolution} \times \text{duration (s)} \times \text{channels}$$ | Stereo = 2 channels, mono = 1

:::example 3-minute song, CD quality (44 100 Hz, 16 bits, stereo)
- Duration: 3 × 60 = 180 s
- Bits: 44 100 × 16 × 180 × 2 = 254 016 000 bits
- Bytes: ÷ 8 = 31 752 000 bytes
- MiB: ÷ 1024 ÷ 1024 ≈ **30.3 MiB**
:::

:::example Voice recording
A 10-second mono recording at 8 kHz with 8-bit samples:
8000 × 8 × 10 × 1 = 640 000 bits = 80 000 bytes ≈ **78.1 KiB**
:::

:::tip
Convert the **duration to seconds** first and remember the **number of channels**. Show each step — method marks are usually available even if the final answer is wrong.
:::
