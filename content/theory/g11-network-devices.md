---
summary: The purpose of network hardware — network interface cards and MAC addresses, repeaters, hubs, switches (and how they learn MAC addresses), bridges, wireless access points, routers (routing tables, NAT, DHCP), gateways and modems — how they differ, and choosing devices for a network.
---
# Connecting a device to a network
@lo 11.6.1.6

Every network needs **hardware** to connect devices, move data between them and link the network to other networks. Each device has a different **job** and works with a different kind of information — signals, MAC addresses, IP addresses or protocols.

:::definition Network interface card (NIC)
The hardware inside a device that **connects it to a network** (by cable or wirelessly — a wireless NIC). Every NIC has a unique, permanent **MAC address** set by the manufacturer.
:::

:::definition MAC address (Media Access Control address)
A **unique 48-bit physical address** of a network interface, written as **12 hexadecimal digits**, e.g. `3C:52:82:1A:9F:04`. The first half identifies the **manufacturer**, the second half the **individual card**. Switches use MAC addresses to deliver data inside a LAN.
:::

:::compare MAC address vs IP address
| | MAC address | IP address |
|---|---|---|
| Identifies | The **network card** (hardware) | The device's **location** on a network |
| Set by | The **manufacturer** — normally does not change | The **network** (DHCP) or administrator — can change |
| Format | 48 bits, hexadecimal: `3C:52:82:1A:9F:04` | IPv4: 32 bits, denary: `192.168.1.25` |
| Used by | **Switches** inside a LAN | **Routers** between networks |
:::

# Repeaters, hubs and switches
@lo 11.6.1.6

:::cards
### Repeater
- **Regenerates (amplifies)** a weakened signal so that it can travel **further** along a cable or a wireless link.
- Does **not** read the data or addresses — it only boosts the signal.
- Used when a cable is longer than ~100 m, or as a Wi-Fi **range extender**.
### Hub
- Connects devices in a **star** LAN.
- Sends every incoming packet to **all ports** (broadcasts) — every device receives it, and only the addressed device keeps it.
- Wastes **bandwidth**, causes **collisions**, and is **less secure**. Now mostly replaced by switches.
### Switch
- Connects devices in a **LAN**.
- Reads the **destination MAC address** of each frame and sends it **only to the port** of the correct device.
- Less traffic, **no collisions**, **faster** and **more secure** than a hub.
:::

:::steps How a switch learns MAC addresses
- When a frame arrives, the switch records the **source MAC address** and the **port** it came from in its **MAC address table**.
- It looks up the **destination MAC address** in the table.
- If found, it sends the frame **only to that port**.
- If not yet known, it sends the frame to all ports **once** (flooding); the reply teaches it the missing address.
:::

:::example A switch's MAC address table
| Port | MAC address | Device |
|---|---|---|
| 1 | 3C:52:82:1A:9F:04 | PC A |
| 2 | 00:1B:44:11:3A:B7 | PC B |
| 3 | A4:5E:60:C2:7D:10 | Printer |

PC A sends a document to the printer: the switch reads destination **A4:5E:60:C2:7D:10**, finds it on **port 3**, and sends the data **only** to port 3. A hub would have sent it to ports 2 and 3.
:::

:::compare Hub vs switch
| | Hub | Switch |
|---|---|---|
| Sends data to | **All** connected devices | **Only** the destination device |
| Reads addresses | No | Yes — **MAC** addresses |
| Collisions | Yes — shared bandwidth | No — each port has its own bandwidth |
| Security | Every device can see all data | Data reaches only the intended device |
| Speed with many devices | Slow | Fast |
| Cost | Cheaper | More expensive (but now cheap) |
:::

:::definition Bridge
Connects **two segments** of the same LAN (or two LANs using the same protocol) and passes data across only if its destination is on the other side — like a switch with two ports.
:::

:::definition Wireless access point (WAP)
Lets **wireless devices** (laptops, phones) join a **wired LAN** using Wi-Fi. It is usually connected to a switch by cable.
:::

# Routers
@lo 11.6.1.6

:::definition Router
A device that **connects different networks** (e.g. a school LAN to the Internet) and **forwards data packets** between them. It reads the **destination IP address** of each packet and uses its **routing table** to choose the **best route** to the next network.
:::

:::cards
### Purposes of a router
- **Connects** a LAN to other networks / the Internet (a WAN).
- **Directs packets** between networks using **IP addresses**.
- Keeps a **routing table** and chooses the **best (fastest / least busy) path**.
- Often also does **NAT**, **DHCP** and has a **firewall**.
### Extra jobs of a home or school router
- **NAT (Network Address Translation)** — many devices with **private** IP addresses share one **public** IP address.
- **DHCP** — automatically gives each device an IP address.
- **Firewall** — blocks unauthorised traffic from the Internet.
- Often contains a **switch** and a **wireless access point** in the same box.
:::

:::example A simple routing table
| Destination network | Send to (next hop) | Interface |
|---|---|---|
| 192.168.1.0 (school LAN) | Deliver directly | LAN port |
| 10.20.0.0 (other campus) | Router 10.0.0.2 | WAN port 1 |
| Any other address (Internet) | ISP router | WAN port 2 |

A packet for **8.8.8.8** does not match the first two networks, so it is sent to the **ISP router** (the default route).
:::

:::mermaid A typical school network
flowchart TB
  ISP((Internet)) --- R[Router with firewall]
  R --- SW[Switch]
  SW --- PC1[PC]
  SW --- PC2[PC]
  SW --- PR[Printer]
  SW --- AP[Wireless access point]
  AP -. Wi-Fi .- L[Laptop]
:::

# Gateways and modems
@lo 11.6.1.6

:::definition Gateway
A device (or software) that connects **networks that use different protocols**, **translating** (converting) data between them — for example between a LAN and a mobile network, or between an e-mail system and SMS. Every router that leads out of a network is called its **default gateway**.
:::

:::definition Modem (modulator–demodulator)
Converts the computer's **digital** signals into **analogue** signals (or light / radio) for a telephone line, cable TV line or mobile network, and back again. A home Internet box usually combines a **modem**, a **router**, a **switch** and a **WAP**.
:::

:::compare Comparing the devices
| Device | Works with | Connects | What it does |
|---|---|---|---|
| **NIC** | Signals + **MAC** address | A device to the network | Gives the device a network connection and identity |
| **Repeater** | Electrical / radio **signal** | Two parts of the same cable or link | Boosts / regenerates the signal — no intelligence |
| **Hub** | Packets (addresses **not** read) | Devices in one LAN | Broadcasts to all ports |
| **Switch** | **MAC** addresses | Devices in one LAN | Sends to the correct port only; learns MAC addresses |
| **Bridge** | **MAC** addresses | Two LAN segments | Passes data across only when needed |
| **WAP** | Radio + MAC | Wireless devices to a wired LAN | Provides Wi-Fi |
| **Router** | **IP** addresses | **Different networks** (LAN ↔ WAN) | Chooses routes using routing tables; NAT, DHCP |
| **Gateway** | **Protocols** | Networks with **different protocols** | Converts between protocols |
| **Modem** | Digital ↔ analogue signals | A computer / router to a telephone or cable line | Modulates and demodulates |
:::

:::example Choosing devices
- A classroom of 25 PCs, each with a cable → a **switch**.
- Students' laptops and tablets → a **wireless access point** connected to the switch.
- The school must use the Internet → a **router** (with **firewall**) connected to the ISP.
- The sports hall is 180 m away from the switch → a **repeater** (or a fibre link).
- The weather station uses a different protocol from the LAN → a **gateway**.
:::

# Exam practice and summary
@lo 11.6.1.6

:::example Exam-style answers
**Q: Identify two purposes of a router. [2]**
To **direct traffic / route packets between different networks** using the destination **IP address** (1); to decide the **best path** to the destination using the **routing table** (1). (Also: connect a LAN to the Internet; NAT; firewall.)

**Q: Explain the difference between a hub and a switch. [2]**
A hub sends data to **all** devices on the network (1), whereas a switch reads the **MAC address** and sends data **only to the destination** device (1).

**Q: State the purpose of a repeater. [1]**
To **regenerate / boost a weak signal** so it can travel a longer distance (1).

**Q: State the purpose of a gateway. [1]**
To connect networks that use **different protocols**, converting data between them (1).
:::

:::warning Common mistakes
- Saying a **switch** uses IP addresses — it uses **MAC** addresses; a **router** uses **IP** addresses.
- Saying a repeater "sends data to the right computer" — it only **boosts the signal**.
- Confusing a **router** (between networks) with a **modem** (changes the signal type).
- Saying a hub is "faster" — it causes **collisions** and is **slower** with many devices.
:::

:::steps Check yourself
- What is a MAC address and how is it written?
- Explain how a switch builds its MAC address table.
- Give three differences between a hub and a switch.
- State four jobs of a school router.
- When would you use a repeater? A gateway?
- Draw a school network with a router, switch, WAP, PCs and a printer.
:::
