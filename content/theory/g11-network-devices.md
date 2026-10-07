---
summary: The purpose of network devices — repeater, hub, switch, router and gateway — and how they differ.
---
# Network devices
@lo 11.6.1.6

:::cards
### Network interface card (NIC)
Connects a computer to a network; has a unique **MAC address**.
### Repeater
**Regenerates (amplifies)** a weakened signal so that it can travel further along a cable or a wireless link. Does not look at the data.
### Hub
Connects devices in a LAN (star). Sends every incoming packet to **all** ports — wastes bandwidth and causes collisions; less secure.
### Switch
Connects devices in a LAN. Reads the **destination MAC address** and sends the packet **only to the right device** — faster and more secure than a hub.
### Router
Connects **different networks** (e.g. a LAN to the Internet). Reads the **destination IP address** and chooses the best route for each packet; often also does NAT, firewall and DHCP.
### Gateway
Connects networks that use **different protocols**, translating data between them (e.g. a LAN and a mobile network, or an email system and SMS).
:::

:::compare Comparing the devices
| Device | Works with | Connects | Intelligence |
|---|---|---|---|
| Repeater | Electrical / radio signal | Two segments of the same network | None — just boosts the signal |
| Hub | Packets (no addresses read) | Devices in one LAN | Broadcasts to all ports |
| Switch | **MAC** addresses | Devices in one LAN | Sends to the correct port only; learns MAC addresses |
| Router | **IP** addresses | Different networks (LAN ↔ WAN) | Chooses routes using routing tables |
| Gateway | Protocols | Networks with different protocols | Converts between protocols |
:::

:::mermaid A typical school network
flowchart LR
  PC1[PC] --- SW[Switch]
  PC2[PC] --- SW
  PR[Printer] --- SW
  AP[Wi-Fi access point] --- SW
  SW --- R[Router + firewall]
  R --- ISP((Internet))
:::

:::tip
**Hub vs switch** is a favourite question: a hub sends data to **every** device, a switch sends it **only to the destination device** using its MAC address, so there is less traffic and better security.
:::

:::warning
Do not confuse a **router** (between networks, uses IP addresses) with a **switch** (inside one network, uses MAC addresses). A home "router" box usually contains a router, a switch and a wireless access point together.
:::
