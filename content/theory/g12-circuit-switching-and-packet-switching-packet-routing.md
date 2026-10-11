---
summary: How networks move data by switching — circuit switching (set-up, transfer, release) and packet switching (packets, headers, independent routes, reassembly) compared with their advantages, disadvantages and problems for live video; the role of MAC and IP addresses at each hop and ARP; the format of a MAC address and ways to find the MAC address of a computer.
---
# Switching in networks
@lo 12.6.1.1

A large network such as the telephone system or the Internet does not have a direct cable between every pair of devices. Data passes through many **switching nodes** (exchanges, switches, routers). **Switching** is the method used to decide **how** data is passed through these nodes from the sender to the receiver.

:::cards
### Circuit switching
A **dedicated path (circuit)** is set up between sender and receiver **before** communication starts and is **reserved** for the whole session. All data follows the **same route**, in order. *Example: the traditional landline telephone network.*
### Packet switching
Data is split into **packets**, each with a **header** (source and destination addresses, sequence number). Packets travel **independently**, possibly by **different routes**, and are **reassembled** in order at the destination. *Example: the Internet.*
:::

# Circuit switching
@lo 12.6.1.1

:::steps The three phases of circuit switching
- **Circuit establishment** — the sender requests a connection; each exchange on the way reserves a channel until a complete path to the receiver exists (the phone rings).
- **Data transfer** — all data travels along the reserved path, **in order**, with a **constant delay**. The full bandwidth of the circuit belongs to this connection, even during silence.
- **Circuit release (disconnection)** — when the call ends the path is released and the channels can be used by others.
:::

:::ascii Circuit switching: one reserved path for the whole call
  Phone A ══ Exchange 1 ══ Exchange 3 ══ Exchange 4 ══ Phone B     ← reserved circuit
                 │              │
             Exchange 2 ── Exchange 5                              ← not used by this call
:::

:::cards
### Advantages
- **Guaranteed bandwidth** — the line is not shared during the call.
- **Constant, low delay** after set-up — ideal for real-time voice.
- Data always arrives **in order**; no reassembly needed.
- Addresses are needed **only** when the connection is set up.
### Disadvantages
- **Set-up time** before any data can be sent.
- **Wastes bandwidth** — the circuit is reserved even when nobody speaks.
- If any link on the path **fails**, the connection is **lost**.
- Fewer users can be served at once — expensive for long distances.
:::

# Packet switching
@lo 12.6.1.1

:::compare Structure of a packet
| Part | Contents |
|---|---|
| **Header** | **Source** and **destination IP addresses**, **sequence (packet) number**, total number of packets, protocol, time to live |
| **Payload (body)** | A piece of the actual data (e.g. 1500 bytes) |
| **Trailer** | Error-checking data (checksum) and end-of-packet marker |
:::

:::steps Packet switching step by step
- The message is split into **packets**; each gets a **header** with source IP, destination IP, **sequence number**, packet count and a **checksum**.
- Each packet is sent to the first **router**. Every router reads the **destination IP** and forwards the packet along the **best route available at that moment** (a **hop**).
- Packets of the same message may take **different routes** and arrive **out of order**; some may be delayed, lost or damaged.
- The receiver checks each packet with the checksum, **reorders** them using the sequence numbers and requests **missing or damaged** packets again.
- When all packets have arrived, the original message is **reassembled**.
:::

:::ascii Packet switching: packets of one message take different routes
            ┌── R2 ── R4 ──┐
  Sender ── R1             R6 ── Receiver     packet 1: R1 → R2 → R4 → R6
            └── R3 ── R5 ──┘                  packet 2: R1 → R3 → R5 → R6
                                              packet 3: R1 → R2 → R5 → R6
  Arrival order: 2, 1, 3 → reassembled as 1, 2, 3 using the sequence numbers
:::

:::cards
### Advantages
- **Efficient** — links are **shared** by many users; no capacity is wasted during silence.
- **Reliable** — if a router or link fails, packets are **rerouted** around it.
- No set-up time — data can be sent **immediately**.
- Lost or damaged packets are **resent individually**, not the whole message.
- Suitable for **many simultaneous users** — cheaper.
### Disadvantages
- **Variable delay** (packets queue at busy routers) — **jitter**.
- Packets can **arrive out of order** and must be reassembled — extra processing.
- Packets can be **lost** during congestion.
- Every packet carries a header — **overhead**.
- Data travels over shared networks — **encryption** needed for security.
:::

:::warning Problems for live video and voice
In a **video lesson** sent by packet switching: picture and sound may be **not synchronised**, the video may **freeze or stutter** (packets delayed or lost), and quality may **drop** when other traffic competes for the same links. Streaming services use **buffering** and protocols that skip late packets to reduce these effects.
:::

:::compare Circuit switching vs packet switching
| | Circuit switching | Packet switching |
|---|---|---|
| **Connection** | Dedicated path set up first | No dedicated path |
| **Addresses** | Needed only to set up the connection | **Every packet** carries source and destination addresses |
| **Route** | Same for all data | Each packet routed separately |
| **Order of arrival** | In order | May arrive out of order — reassembled using sequence numbers |
| **Use of bandwidth** | Reserved even when silent — wasteful | Shared by many users — efficient |
| **Delay** | Constant, low after set-up — good for real-time voice | Variable (packets queue at routers) |
| **Effect of a failure** | Connection is lost | Packets are rerouted around the failure |
| **Security** | Harder to intercept | Packets cross shared networks — encryption needed |
| **Example** | Landline telephone calls | Internet, e-mail, web, VoIP |
:::

# MAC addresses in packet routing
@lo 12.6.2.2

:::cards
### Two kinds of address work together
- **IP addresses** get a packet to the right **network** — **routers** use them to move packets **between networks**.
- **MAC addresses** get the frame to the right **device** on the **local link** — **switches** and network cards use them.
### What changes at each hop
- The **packet's** source and destination **IP addresses stay the same** for the whole journey.
- The **frame's MAC addresses change** at every hop: the source is the device sending on this link, the destination is the **next** device (a router, or finally the receiver).
:::

:::example A packet from a laptop to a web server
| Hop | Source MAC → destination MAC | Source IP → destination IP |
|---|---|---|
| Laptop → school router | Laptop → **school router** | 192.168.1.25 → 185.22.66.10 |
| School router → ISP router | School router → **ISP router** | (public address after NAT) → 185.22.66.10 |
| Last router → web server | Last router → **web server** | … → 185.22.66.10 |

The destination **IP** never changes; the destination **MAC** is always the **next stop**.
:::

:::steps ARP — finding the MAC address for an IP address
- A device knows the **IP address** it wants to reach on its LAN (the router or another computer) but not its **MAC address**.
- It sends an **ARP request** to **all** devices on the LAN (broadcast): "Who has 192.168.1.1? Tell 192.168.1.25."
- The device with that IP replies with its **MAC address** (ARP reply).
- The sender stores the pair in its **ARP cache** and uses the MAC address in the frame header.
:::

:::compare MAC address format
| Part | Example (`3C:52:82:1A:9F:04`) |
|---|---|
| First 24 bits — **OUI**, identifies the **manufacturer** | `3C:52:82` |
| Last 24 bits — unique number of the **network card** | `1A:9F:04` |
| Total size | **48 bits** = 6 bytes = **12 hexadecimal digits** |
| Written as | Pairs separated by colons `3C:52:82:1A:9F:04` or hyphens `3C-52-82-1A-9F-04` |
:::

# Finding the MAC address of a computer
@lo 12.6.2.3

:::compare Ways to find the MAC address
| Method | Steps | Look for |
|---|---|---|
| **Command prompt (Windows)** | Open **cmd** and type `ipconfig /all` (or `getmac`) | "Physical Address" |
| **Settings / Control Panel (Windows)** | *Control Panel → Network and Internet → Network and Sharing Center → View network status and tasks →* adapter → **Details** | "Physical Address" |
| **Network adapter properties** | *Device Manager → Network adapters →* properties of the NIC | Network address / MAC |
| **macOS** | `ifconfig en0` in Terminal, or *System Settings → Network → Details* | "ether" |
| **Linux** | `ip link` or `ifconfig` | "link/ether" |
| **Android / iOS** | *Settings → About phone → Status* / *Settings → General → About* | "Wi-Fi address" |
| **Router admin page / special software** | List of connected devices | MAC of each device |
:::

```text | Part of the output of ipconfig /all
Wireless LAN adapter Wi-Fi:
   Description . . . . . . . . . . . : Intel(R) Wi-Fi 6 AX201
   Physical Address. . . . . . . . . : 3C-52-82-1A-9F-04
   IPv4 Address. . . . . . . . . . . : 192.168.1.25
   Default Gateway . . . . . . . . . : 192.168.1.1
```

:::warning Randomised MAC addresses
Phones and laptops may use a **randomised (private) MAC address** for each Wi-Fi network to protect privacy, so the address shown for a network can differ from the hardware address. A computer with both Wi-Fi and Ethernet has **two** MAC addresses — one per network card.
:::

# Exam practice and summary
@lo 12.6.1.1 12.6.2.2 12.6.2.3

:::example Exam-style answers
**Q: Explain two differences between packet switching and circuit switching. [2]**
In circuit switching the addresses are only needed when the connection is **set up**, whereas in packet switching **each packet** carries the sender and receiver addresses (1). Circuit switching delivers data **in order along one reserved channel**, whereas in packet switching packets can take **different routes** and are reassembled (1).

**Q: State two problems that can arise when an online class uses packet switching. [2]**
Picture and sound may be **not synchronised** (1); the video may be **interrupted / not continuous** or degraded by competing traffic (1).

**Q: Write two ways to identify the MAC address of a computer. [2]**
Using the **command prompt** with `ipconfig /all` (1); through **Control Panel → Network and Internet → View network status → adapter Details** / NIC properties (1).

**Q: Describe the role of MAC addresses in packet routing. [2]**
MAC addresses identify the **next device on the local link** so frames reach the right router or computer (1); they **change at each hop**, while the IP addresses stay the same (1).
:::

:::warning Common mistakes
- Saying packet switching "sets up a route first" — that is **circuit switching**.
- Saying packets always arrive in order — they can arrive **out of order**.
- Saying MAC addresses are used to route across the Internet — routers use **IP** addresses; MAC is for the **local link**.
- Giving one-sided differences — mention **both** methods.
:::

:::steps Check yourself
- Describe the three phases of circuit switching.
- List the contents of a packet header.
- Give two advantages and two disadvantages of each switching method.
- Why can a video call stutter on a packet-switched network?
- Which addresses change at each hop and which stay the same?
- Describe how ARP finds a MAC address, and two ways to find your own MAC address.
:::
