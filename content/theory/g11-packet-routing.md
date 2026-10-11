---
summary: The purpose and format of IP addresses (IPv4 and IPv6, static and dynamic, public and private), MAC addresses and how IP and MAC addresses work together to deliver packets, the structure of a packet and how routers forward it, and the roles of the protocols TCP/IP, HTTP, HTTPS, FTP, FTPS, SMTP, POP3 and IMAP.
---
# IP addresses
@lo 11.6.2.1

:::definition IP address (Internet Protocol address)
A **unique logical address** given to every device on a network (and on the Internet). It **identifies and locates** the device so that data packets can be **sent to and received from** it. It can change when the device joins a different network.
:::

:::compare IPv4 and IPv6
| | IPv4 | IPv6 |
|---|---|---|
| Size | **32 bits** (4 bytes) | **128 bits** (16 bytes) |
| Written as | **4 denary numbers 0–255** (octets) separated by **dots** | **8 groups of 4 hex digits** separated by **colons** |
| Example | `192.168.1.25` | `2001:0db8:85a3:0000:0000:8a2e:0370:7334` |
| Short form | — | Leading zeros and one run of zero groups can be dropped: `2001:db8:85a3::8a2e:370:7334` |
| Number of addresses | 2³² ≈ **4.3 billion** — not enough for all devices | 2¹²⁸ — practically unlimited |
:::

:::example An IPv4 address in binary
`192.168.1.25` = **11000000.10101000.00000001.00011001** — each octet is one byte, so each number is between **0 and 255**. An address such as `192.168.300.1` is **invalid**.
:::

:::compare Static and dynamic IP addresses
| | Static | Dynamic |
|---|---|---|
| Set by | The administrator, **fixed** | Given automatically by a **DHCP** server, can change |
| Used for | Servers, printers, routers — must always be found at the same address | Laptops, phones, home computers |
| Advantage | Always the same — easy to find | No manual setup; addresses reused |
:::

:::compare Public and private IP addresses
| | Public | Private |
|---|---|---|
| Where | Unique on the **whole Internet** | Unique only **inside one LAN**; the same addresses are reused in millions of LANs |
| Given by | The ISP | The LAN's router (DHCP) |
| Ranges | All others | `10.x.x.x`, `172.16.x.x – 172.31.x.x`, `192.168.x.x` |
| Reachable from the Internet | **Yes** — can be attacked directly | **No** — hidden behind the router (**NAT**) |
| Security | Needs a firewall | Safer: outsiders cannot start a connection directly |
:::

:::callout info NAT
The router has **one public** IP address. Using **Network Address Translation**, it swaps the **private** addresses of the devices inside the LAN for its public address when packets go out, and passes the replies back to the right device. This saves public IPv4 addresses and **hides** the inside devices.
:::

# MAC addresses
@lo 11.6.2.2

:::definition MAC address (Media Access Control)
A **physical, unique 48-bit address** burned into a device's **network interface card** by the manufacturer, written as **6 pairs of hexadecimal digits**, e.g. `3C:52:82:1A:9F:04`. The first half identifies the **manufacturer**, the second half the **individual card**.
:::

:::compare IP vs MAC
| | IP address | MAC address |
|---|---|---|
| Type | **Logical** — network address | **Physical** — hardware address |
| Assigned by | The network (DHCP) or administrator | The **manufacturer** |
| Can change? | **Yes**, depends on the network | Normally **fixed** |
| Used by | **Routers** — to deliver packets **between networks** | **Switches** — to deliver frames to the right device **within a LAN** |
| Size / format | 32 bits denary (IPv4) or 128 bits hex (IPv6) | 48 bits hex |
| OSI layer | Network layer (3) | Data link layer (2) |
:::

:::callout info Finding your MAC address
Windows: `ipconfig /all` (Physical Address); macOS / Linux: `ifconfig` or `ip link` (ether); phones: Settings → About → Wi-Fi MAC address.
:::

# How packets are routed
@lo 11.6.2.1 11.6.2.2

:::definition Packet
A small **unit of data** sent over a network. Large files and messages are split into many packets.
:::

:::compare Structure of a packet
| Part | Contains |
|---|---|
| **Header** | **Source IP** and **destination IP** addresses, **packet (sequence) number**, total number of packets, protocol, time to live (hop limit) |
| **Payload (body)** | The actual piece of **data** |
| **Trailer** | **Error-checking** data (e.g. a checksum) and an end-of-packet marker |
:::

:::steps How a packet reaches a device
- The data is split into **packets**; each header gets the **source and destination IP addresses** and a **sequence number**.
- The packet is sent to the local **router** (default gateway).
- Each **router** reads the **destination IP** and uses its **routing table** to forward the packet to the next router (a **hop**) on the best available route; packets may take **different routes**.
- When the packet reaches the destination network, the router finds the **MAC address** of the device with that IP (using **ARP**, Address Resolution Protocol).
- The **switch** uses the **MAC address** to send the frame to the correct port.
- The receiving device checks for errors, requests missing or damaged packets again, and **reassembles** the packets in order using the sequence numbers.
:::

:::example IP and MAC on the journey
A laptop in Astana sends a request to a server in Almaty. The **IP addresses** (laptop → server) stay the **same** for the whole journey. The **MAC addresses** change at **every hop**: each frame is addressed to the MAC of the **next** device (router to router), until the last router addresses it to the **server's** MAC.
:::

:::tip IP vs MAC in one sentence
**IP** says **which device on which network** (the final destination); **MAC** says **which device on this local link** (the next stop).
:::

# Network protocols
@lo 11.6.2.3

:::definition Protocol
A set of **rules** that devices must follow to communicate: the **format** of the data, how it is **addressed, sent and received**, and how **errors** are detected and corrected. Devices from different manufacturers can communicate because they follow the same protocols.
:::

:::compare TCP/IP — the protocols of the Internet
| Protocol | Role |
|---|---|
| **IP** (Internet Protocol) | **Addresses** packets and **routes** them across networks |
| **TCP** (Transmission Control Protocol) | Sets up a **connection**, splits data into packets, checks every packet arrives, **resends** lost ones and puts them in **order** — reliable |
| **UDP** (User Datagram Protocol) | Sends packets **without** checking or resending — **fast**, used for live video, voice calls, games |
:::

:::compare Application-layer protocols
| Protocol | Full name | Role | Port |
|---|---|---|---|
| **HTTP** | HyperText Transfer Protocol | Transfers **web pages** (HTML, images, video) from a web server to a browser | 80 |
| **HTTPS** | HTTP Secure | HTTP **encrypted** with SSL/TLS — protects passwords and payment data; the server is **authenticated** with a digital certificate | 443 |
| **FTP** | File Transfer Protocol | **Uploads and downloads files** between a client and a server (e.g. uploading a website) | 20 / 21 |
| **FTPS** | FTP Secure | FTP with SSL/TLS **encryption** | 990 |
| **SMTP** | Simple Mail Transfer Protocol | **Sends** e-mail from a client to a mail server and **between mail servers** | 25 / 587 |
| **POP3** | Post Office Protocol 3 | **Downloads** e-mail from the server to **one** device (usually deleting it from the server) | 110 |
| **IMAP** | Internet Message Access Protocol | Reads e-mail **kept on the server**, synchronised across **all** devices | 143 |
:::

:::mermaid Sending and receiving an e-mail
flowchart TB
  A[Sender's e-mail app] -- SMTP --> S1[Sender's mail server]
  S1 -- SMTP --> S2[Recipient's mail server]
  S2 -- POP3 or IMAP --> B[Recipient's e-mail app]
:::

:::compare POP3 vs IMAP
| | POP3 | IMAP |
|---|---|---|
| Where messages are kept | **Downloaded** to one device, usually deleted from the server | **Stay on the server** |
| Several devices | Hard — each device has different mail | Easy — phone, laptop and web show the same folders |
| Offline reading | Yes | Only messages already synced |
| Server storage | Little | More |
:::

:::cards
### Why FTP is not suitable for live video
- FTP (over **TCP**) waits for **lost or damaged packets** to be **resent** and puts packets **back in order** before the file is complete.
- That causes **delays** — live video needs a continuous stream and should **skip** a lost packet rather than wait (UDP-based streaming protocols do this).
### When FTP is convenient
- **Transferring files** between a client and a server: uploading a website to a web server, sharing large files, backups.
:::

:::callout warning HTTP vs HTTPS
With **HTTP**, data travels as **plain text** — anyone who intercepts it can read passwords. **HTTPS** encrypts the data and proves the website's identity with a **certificate** (padlock in the address bar). Always use HTTPS for logins and payments.
:::

# Exam practice and summary
@lo 11.6.2.1 11.6.2.2 11.6.2.3

:::example Exam-style answers
**Q: Explain the purpose of the IP address. [2]**
A **unique address** of a device on the network (1) that is used to **send and receive data** / identify and **locate** the device (1).

**Q: Describe two differences between a MAC address and an IP address. [2]**
A MAC address is a **physical** address set by the **manufacturer**, while an IP address is a **logical** address given by the **network** (1). The MAC address is **fixed**, while the IP address can **change** when the device joins another network (1).

**Q: State what SMTP and HTTP are used for. [2]**
SMTP — **sending** e-mail (1); HTTP — **transferring web pages** over the Internet (1).

**Q: Explain why FTP is not suitable for live video streaming. [2]**
FTP **resends lost or damaged packets** (1) and **reassembles** packets that arrived in a random order before use, which causes **delays** unsuitable for a live stream (1).
:::

:::warning Common mistakes
- Saying a MAC address is used to route packets **across the Internet** — routers use **IP** addresses.
- Saying POP3 **sends** e-mail — SMTP sends; POP3 / IMAP receive.
- Writing IPv4 numbers above **255**.
- Saying HTTPS "makes the page load faster" — it makes it **secure**.
:::

:::steps Check yourself
- Give the size and format of IPv4 and IPv6 addresses.
- Is 192.168.0.12 public or private? Why is that safer?
- Compare IP and MAC addresses in three ways.
- Describe the journey of a packet from a laptop to a web server.
- Match HTTP, HTTPS, FTP, SMTP, POP3 and IMAP to their roles.
- Why does live video use UDP rather than TCP / FTP?
:::
