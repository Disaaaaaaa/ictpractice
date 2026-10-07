---
summary: Circuit switching and packet switching compared, the role of MAC addresses in delivering packets, and how to find the MAC address of a computer.
---
# Circuit switching and packet switching
@lo 12.6.1.1

:::cards
### Circuit switching
A **dedicated path (circuit)** is set up between sender and receiver **before** communication starts and is **reserved** for the whole session. All data follows the same route in order. *Traditional telephone network.*
### Packet switching
Data is split into **packets**, each with a header (source and destination addresses, sequence number). Packets travel **independently**, possibly by **different routes**, and are **reassembled** in order at the destination. *The Internet.*
:::

:::compare
| | Circuit switching | Packet switching |
|---|---|---|
| Connection | Dedicated path set up first | No dedicated path |
| Route | Same for all data | Each packet routed separately |
| Order of arrival | In order | May arrive out of order — reassembled using sequence numbers |
| Use of bandwidth | Reserved even when silent — wasteful | Shared by many users — efficient |
| Delay | Constant, low after set-up — good for real-time voice | Variable (packets queue at routers) |
| Effect of a failure | Connection is lost | Packets are rerouted around the failure |
| Security | Harder to intercept | Packets travel over shared networks — encryption needed |
| Example | Landline telephone calls | Internet, email, web, VoIP |
:::

:::steps Packet switching step by step
- The message is split into packets; each gets a **header**: source IP, destination IP, **sequence number**, packet count, error-check (checksum).
- Each **router** reads the destination IP and forwards the packet along the best route available at that moment.
- Packets may take different routes and arrive out of order.
- The receiver checks each packet, **reorders** them using the sequence numbers and requests any **missing or damaged** packets again.
:::

# MAC addresses in packet routing
@lo 12.6.2.2

- **IP addresses** get a packet to the right **network** — routers use them to move packets **between networks**.
- **MAC addresses** get the frame to the right **device** on the **local network** — switches use them.
- At each hop the **frame's MAC addresses change** (next device on the link), but the **packet's source and destination IP addresses stay the same**.
- A device finds the MAC address that belongs to an IP address on its LAN using **ARP** (Address Resolution Protocol).

:::compare MAC address format
| Part | Example (`3C:52:82:1A:9F:04`) |
|---|---|
| First 24 bits — **OUI**, identifies the manufacturer | `3C:52:82` |
| Last 24 bits — unique number of the device | `1A:9F:04` |
| Total size | 48 bits = 6 bytes = 12 hex digits |
:::

# Finding the MAC address of a computer
@lo 12.6.2.3

:::compare
| System | Command / place | Look for |
|---|---|---|
| Windows | `ipconfig /all` in Command Prompt (or `getmac`) | "Physical Address" |
| macOS | `ifconfig en0` in Terminal, or *System Settings → Network → Details* | "ether" |
| Linux | `ip link` or `ifconfig` | "link/ether" |
| Android / iOS | *Settings → About phone → Status* / *Settings → General → About* | "Wi-Fi address" |
:::

```text | Part of the output of ipconfig /all
Wireless LAN adapter Wi-Fi:
   Description . . . . . . . . . . . : Intel(R) Wi-Fi 6 AX201
   Physical Address. . . . . . . . . : 3C-52-82-1A-9F-04
   IPv4 Address. . . . . . . . . . . : 192.168.1.25
```

:::warning
Phones and laptops may use a **randomised (private) MAC address** for each Wi-Fi network to protect privacy, so the address shown for a network can differ from the hardware address.
:::
