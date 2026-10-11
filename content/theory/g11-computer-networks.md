---
summary: What a computer network is and why networks are used, LAN, WAN and other network sizes, the Internet, intranets and extranets, client-server and peer-to-peer models, wired and wireless transmission media, and the advantages and disadvantages of bus, ring, star, mesh and mixed topologies.
---
# What is a computer network?
@lo 11.6.1.1

:::definition Computer network
Two or more computers or devices **connected together** so that they can **communicate** and **share resources** — data, files, printers, software and an Internet connection.
:::

:::cards
### Advantages of networking
- **Share resources** — one printer, scanner or Internet connection for many users.
- **Share files and data** — work on the same documents; central databases.
- **Communication** — e-mail, messaging, video calls.
- **Central management** — software installed, updated and backed up from one place.
- **Users can log on from any computer** and see their own files.
### Disadvantages of networking
- **Cost** of cables, switches, servers and a network manager.
- **Security risks** — viruses and hackers can spread through the network.
- If a **server or key device fails**, many users are affected.
- Needs specialist **maintenance**; the network can become **slow** with heavy traffic.
:::

:::definition Node
Any device connected to a network that can send or receive data — a computer, printer, phone, server, switch or router.
:::

# LAN and WAN
@lo 11.6.1.1

:::compare LAN vs WAN
| | LAN — Local Area Network | WAN — Wide Area Network |
|---|---|---|
| **Geographical area** | **Small**: one building or site (school, office, home) | **Large**: cities, countries, the whole world |
| **Ownership** | Usually owned and managed by **one organisation** | Uses infrastructure **rented** from telecom companies (leased lines, satellites) |
| **Speed (bandwidth)** | **High** (100 Mbit/s – 10 Gbit/s) | Usually **lower**, more **delay** (latency) |
| **Errors** | Few | More errors over long distances |
| **Cost** | Low to set up | **Expensive** to set up and rent |
| **Media** | Ethernet cable, Wi-Fi | Fibre-optic cables, telephone lines, satellite, microwave |
| **Example** | School computer network | The **Internet**; a bank linking all its branches across Kazakhstan |
:::

:::compare Other network sizes
| Network | Area | Example |
|---|---|---|
| **PAN** — Personal Area Network | A few metres around one person | Phone + wireless earbuds + smartwatch by Bluetooth |
| **LAN** | A building or site | School network |
| **WLAN** — Wireless LAN | A building, without cables | Home Wi-Fi |
| **MAN** — Metropolitan Area Network | A city | A city-wide network of libraries or CCTV |
| **WAN** | Countries / the world | The Internet |
:::

:::tip Comparing in an exam
"Compare" needs a point that mentions **both** sides: "A LAN covers a **small geographical area** such as one building, **whereas** a WAN covers a **large area** such as several countries."
:::

# The Internet, intranets and extranets
@lo 11.6.1.2

:::definition Internet
A **global public network of interconnected networks** (a WAN) that communicate using the **TCP/IP** protocols. Services that run on it include the **World Wide Web**, e-mail, file transfer, online games and video calls.
:::

:::definition Intranet
A **private network** belonging to **one organisation**, which uses **Internet technologies** (web pages, browsers, TCP/IP) but can only be accessed by **authorised members** — for example a school portal with timetables and homework.
:::

:::compare Internet vs intranet
| | Internet | Intranet |
|---|---|---|
| Access | **Public** — anyone with a connection | **Private** — only employees / students with a login, often only inside the organisation |
| Size | Global | One organisation |
| Content | Public information from millions of sources | **Internal** information: timetables, policies, forms, news, staff directory |
| Security | Lower — content and users not controlled | **Higher** — behind a **firewall**, logins required |
| Reliability of information | Varies; anyone can publish | Controlled by the organisation, usually reliable and up to date |
| Speed | Depends on the connection | Usually fast (on the local network) |
:::

:::callout info Extranet
Part of an intranet made available to **selected outsiders** — for example parents, suppliers or partner schools — through a **secure login**. Parents checking marks in an e-journal use an extranet.
:::

# Client-server and peer-to-peer networks
@lo 11.6.1.3

:::cards
### Client-server
- One or more powerful **servers** provide **services** — files, e-mail, web pages, printing, logins, databases.
- **Clients** (users' computers) **request** these services.
- Management, **security** and **backup** are **central**.
### Peer-to-peer (P2P)
- All computers are **equal** (peers): each can share its own files and resources and use those of others.
- There is **no central server**; each peer is both client and server.
:::

:::mermaid Client-server: clients send requests, the server sends responses
flowchart TB
  S[Server: files, logins, backup]
  C1[Client 1] -- request --> S
  C2[Client 2] -- request --> S
  C3[Client 3] -- request --> S
  S -. response .-> C1
  S -. response .-> C2
  S -. response .-> C3
:::

:::compare Client-server vs peer-to-peer
| | Client-server | Peer-to-peer |
|---|---|---|
| Control and security | **Central** — accounts, permissions and antivirus managed on the server | Each user manages their own computer; **weaker** security |
| Backup | **Central**, automatic | Each computer separately — data can be lost |
| Cost | **Expensive** — servers and a network manager | **Cheap**, easy to set up |
| Reliability | **Server failure** stops services for everyone | No single point of failure, but a peer that is switched off cannot share its files |
| Performance | Good for **many** users | Slows down as more users share resources |
| Finding files | Files stored in one place | Files spread over many computers |
| Suitable for | Schools, companies, websites, online games | Homes, small offices, file sharing (torrents), some video calls |
:::

# Wired and wireless connections
@lo 11.6.1.4

:::compare Wired transmission media
| Medium | How it works | Features |
|---|---|---|
| **Twisted-pair copper** (Ethernet, Cat5e/Cat6) | Electrical signals in pairs of twisted wires | Cheap, common in LANs, up to 100 m, 1–10 Gbit/s |
| **Coaxial cable** | Copper core with a metal shield | Better shielding; cable TV / old networks |
| **Fibre-optic cable** | **Pulses of light** in glass fibres | **Very fast**, very long distances (km), no electrical interference, hard to tap; more expensive |
:::

:::compare Wireless transmission
| Technology | Range | Use |
|---|---|---|
| **Wi-Fi** (radio waves) | ~30–50 m indoors | Wireless LANs at home, school, cafés |
| **Bluetooth** | ~10 m | PANs — headphones, keyboards, smartwatches |
| **Mobile data** (4G / 5G) | Kilometres from a mast | Phones and tablets on the move |
| **Satellite** | Global | Remote areas, ships, aircraft |
| **Microwave / infrared** | Line of sight | Links between buildings; remote controls |
:::

:::compare Wired vs wireless
| | Wired (Ethernet, fibre) | Wireless (Wi-Fi, Bluetooth, mobile data) |
|---|---|---|
| **Speed** | **Faster** and constant | Slower; varies with **distance** and **obstacles** |
| **Reliability** | Stable, little **interference** | **Interference** from walls, microwaves and other networks |
| **Security** | Harder to intercept — **physical access** needed | Signals can be **intercepted** from outside — needs encryption (**WPA2/WPA3**) and strong passwords |
| **Mobility** | Devices fixed to a socket | Users **move freely**; phones and tablets connect |
| **Installation and cost** | Cables are costly to lay and hard to move; **trip hazard** | **Easy** to add devices, no cables; cheaper in old buildings |
| **Range** | Up to ~100 m per copper cable (fibre much more) | Limited by router range; needs extra access points |
| **Number of devices** | Limited by switch ports | Many devices, but each gets less bandwidth |
:::

# Network topologies
@lo 11.6.1.5

:::definition Topology
The **layout** of a network — how its **nodes** are **connected** to each other and how data travels between them.
:::

:::html The basic topologies | 520
<div class="g"><figure><svg viewBox="0 0 200 150" width="100%" style="max-width:240px"><line x1="15" y1="75" x2="185" y2="75" stroke="#1f2937" stroke-width="4"/><rect x="8" y="68" width="7" height="14" fill="#ef4444"/><rect x="185" y="68" width="7" height="14" fill="#ef4444"/><line x1="40" y1="75" x2="40" y2="45" stroke="#1f2937" stroke-width="2" /><rect x="26" y="25" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="40" y="39" font-size="11" text-anchor="middle">A</text><line x1="80" y1="75" x2="80" y2="105" stroke="#1f2937" stroke-width="2" /><rect x="66" y="105" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="80" y="119" font-size="11" text-anchor="middle">B</text><line x1="120" y1="75" x2="120" y2="45" stroke="#1f2937" stroke-width="2" /><rect x="106" y="25" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="120" y="39" font-size="11" text-anchor="middle">C</text><line x1="160" y1="75" x2="160" y2="105" stroke="#1f2937" stroke-width="2" /><rect x="146" y="105" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="160" y="119" font-size="11" text-anchor="middle">D</text><text x="120" y="92" font-size="10" text-anchor="middle">backbone</text><text x="100" y="145" font-size="9" text-anchor="middle" fill="#b91c1c">■ terminators</text></svg><figcaption>Bus</figcaption></figure><figure><svg viewBox="0 0 200 150" width="100%" style="max-width:240px"><line x1="100.0" y1="25.0" x2="152.30810839623345" y2="59.54915028125263" stroke="#1f2937" stroke-width="2" /><line x1="152.30810839623345" y1="59.54915028125263" x2="132.32818887608602" y2="115.45084971874738" stroke="#1f2937" stroke-width="2" /><line x1="132.32818887608602" y1="115.45084971874738" x2="67.67181112391398" y2="115.45084971874738" stroke="#1f2937" stroke-width="2" /><line x1="67.67181112391398" y1="115.45084971874738" x2="47.69189160376655" y2="59.549150281252636" stroke="#1f2937" stroke-width="2" /><line x1="47.69189160376655" y1="59.549150281252636" x2="100.0" y2="25.0" stroke="#1f2937" stroke-width="2" /><rect x="86.0" y="15.0" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="100.0" y="29.0" font-size="11" text-anchor="middle">A</text><rect x="138.30810839623345" y="49.54915028125263" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="152.30810839623345" y="63.54915028125263" font-size="11" text-anchor="middle">B</text><rect x="118.32818887608602" y="105.45084971874738" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="132.32818887608602" y="119.45084971874738" font-size="11" text-anchor="middle">C</text><rect x="53.67181112391398" y="105.45084971874738" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="67.67181112391398" y="119.45084971874738" font-size="11" text-anchor="middle">D</text><rect x="33.69189160376655" y="49.549150281252636" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="47.69189160376655" y="63.549150281252636" font-size="11" text-anchor="middle">E</text></svg><figcaption>Ring</figcaption></figure><figure><svg viewBox="0 0 200 150" width="100%" style="max-width:240px"><line x1="100" y1="75" x2="100.0" y2="23.0" stroke="#1f2937" stroke-width="2" /><line x1="100" y1="75" x2="157.06339097770922" y2="58.931116292502736" stroke="#1f2937" stroke-width="2" /><line x1="100" y1="75" x2="135.2671151375484" y2="117.06888370749726" stroke="#1f2937" stroke-width="2" /><line x1="100" y1="75" x2="64.73288486245161" y2="117.06888370749726" stroke="#1f2937" stroke-width="2" /><line x1="100" y1="75" x2="42.93660902229078" y2="58.931116292502736" stroke="#1f2937" stroke-width="2" /><rect x="76" y="64" width="48" height="22" rx="4" fill="#fde68a" stroke="#1f2937" stroke-width="2"/><text x="100" y="79" font-size="10" text-anchor="middle">Switch</text><rect x="86.0" y="13.0" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="100.0" y="27.0" font-size="11" text-anchor="middle">A</text><rect x="143.06339097770922" y="48.931116292502736" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="157.06339097770922" y="62.931116292502736" font-size="11" text-anchor="middle">B</text><rect x="121.26711513754839" y="107.06888370749726" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="135.2671151375484" y="121.06888370749726" font-size="11" text-anchor="middle">C</text><rect x="50.73288486245161" y="107.06888370749726" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="64.73288486245161" y="121.06888370749726" font-size="11" text-anchor="middle">D</text><rect x="28.93660902229078" y="48.931116292502736" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="42.93660902229078" y="62.931116292502736" font-size="11" text-anchor="middle">E</text></svg><figcaption>Star</figcaption></figure><figure><svg viewBox="0 0 200 150" width="100%" style="max-width:240px"><line x1="100.0" y1="23.0" x2="157.06339097770922" y2="58.931116292502736" stroke="#1f2937" stroke-width="2" /><line x1="100.0" y1="23.0" x2="135.2671151375484" y2="117.06888370749726" stroke="#1f2937" stroke-width="2" /><line x1="100.0" y1="23.0" x2="64.73288486245161" y2="117.06888370749726" stroke="#1f2937" stroke-width="2" /><line x1="100.0" y1="23.0" x2="42.93660902229078" y2="58.931116292502736" stroke="#1f2937" stroke-width="2" /><line x1="157.06339097770922" y1="58.931116292502736" x2="135.2671151375484" y2="117.06888370749726" stroke="#1f2937" stroke-width="2" /><line x1="157.06339097770922" y1="58.931116292502736" x2="64.73288486245161" y2="117.06888370749726" stroke="#1f2937" stroke-width="2" /><line x1="157.06339097770922" y1="58.931116292502736" x2="42.93660902229078" y2="58.931116292502736" stroke="#1f2937" stroke-width="2" /><line x1="135.2671151375484" y1="117.06888370749726" x2="64.73288486245161" y2="117.06888370749726" stroke="#1f2937" stroke-width="2" /><line x1="135.2671151375484" y1="117.06888370749726" x2="42.93660902229078" y2="58.931116292502736" stroke="#1f2937" stroke-width="2" /><line x1="64.73288486245161" y1="117.06888370749726" x2="42.93660902229078" y2="58.931116292502736" stroke="#1f2937" stroke-width="2" /><rect x="86.0" y="13.0" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="100.0" y="27.0" font-size="11" text-anchor="middle">A</text><rect x="143.06339097770922" y="48.931116292502736" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="157.06339097770922" y="62.931116292502736" font-size="11" text-anchor="middle">B</text><rect x="121.26711513754839" y="107.06888370749726" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="135.2671151375484" y="121.06888370749726" font-size="11" text-anchor="middle">C</text><rect x="50.73288486245161" y="107.06888370749726" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="64.73288486245161" y="121.06888370749726" font-size="11" text-anchor="middle">D</text><rect x="28.93660902229078" y="48.931116292502736" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="42.93660902229078" y="62.931116292502736" font-size="11" text-anchor="middle">E</text></svg><figcaption>Mesh (full)</figcaption></figure><figure><svg viewBox="0 0 300 150" width="100%" style="max-width:340px"><line x1="20" y1="40" x2="280" y2="40" stroke="#1f2937" stroke-width="4"/><line x1="70" y1="40" x2="70" y2="75" stroke="#1f2937" stroke-width="2" /><line x1="70" y1="75" x2="25" y2="125" stroke="#1f2937" stroke-width="2" /><line x1="70" y1="75" x2="70" y2="125" stroke="#1f2937" stroke-width="2" /><line x1="70" y1="75" x2="115" y2="125" stroke="#1f2937" stroke-width="2" /><rect x="46" y="64" width="48" height="22" rx="4" fill="#fde68a" stroke="#1f2937" stroke-width="2"/><text x="70" y="79" font-size="10" text-anchor="middle">Switch</text><rect x="11" y="115" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="25" y="129" font-size="11" text-anchor="middle"></text><rect x="56" y="115" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="70" y="129" font-size="11" text-anchor="middle"></text><rect x="101" y="115" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="115" y="129" font-size="11" text-anchor="middle"></text><line x1="230" y1="40" x2="230" y2="75" stroke="#1f2937" stroke-width="2" /><line x1="230" y1="75" x2="185" y2="125" stroke="#1f2937" stroke-width="2" /><line x1="230" y1="75" x2="230" y2="125" stroke="#1f2937" stroke-width="2" /><line x1="230" y1="75" x2="275" y2="125" stroke="#1f2937" stroke-width="2" /><rect x="206" y="64" width="48" height="22" rx="4" fill="#fde68a" stroke="#1f2937" stroke-width="2"/><text x="230" y="79" font-size="10" text-anchor="middle">Switch</text><rect x="171" y="115" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="185" y="129" font-size="11" text-anchor="middle"></text><rect x="216" y="115" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="230" y="129" font-size="11" text-anchor="middle"></text><rect x="261" y="115" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="275" y="129" font-size="11" text-anchor="middle"></text><rect x="136" y="5" width="28" height="20" rx="3" fill="#dbeafe" stroke="#1f2937" stroke-width="2"/><text x="150" y="19" font-size="11" text-anchor="middle">Srv</text><line x1="150" y1="25" x2="150" y2="40" stroke="#1f2937" stroke-width="2" /><text x="150" y="58" font-size="10" text-anchor="middle">bus backbone</text></svg><figcaption>Mixed (hybrid): stars on a bus</figcaption></figure></div>
---css---
body { font-family: Arial, sans-serif; margin: 0; padding: 6px; background: #fff; }
.g { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; }
figure { margin: 0; text-align: center; }
figcaption { font-weight: bold; font-size: 14px; margin-top: 2px; }
:::

:::cards
### Bus
- All devices are connected to **one main cable (backbone)** with a **terminator** at each end.
- Data is sent along the backbone and **every** device receives it; only the addressed device keeps it.
- Two devices sending at once cause a **collision**.
### Ring
- Each device is connected to **exactly two others**, forming a **loop**.
- Data travels **in one direction**, passing through each device until it reaches the destination (often using a **token** that gives permission to send).
### Star
- Every device has its **own cable** to a **central switch** (or hub).
- The switch sends data **only to the destination** device.
- The most common topology for school and home LANs.
### Mesh
- Devices are connected to **many** (partial mesh) or **all** (full mesh) other devices.
- Data can take **several routes**; if one link fails, another is used.
- The **Internet** is a partial mesh of routers.
### Mixed (hybrid)
- A combination of two or more topologies — e.g. several **star** networks in different classrooms joined by a **bus** or **mesh** backbone.
:::

:::compare Advantages and disadvantages
| Topology | Advantages | Disadvantages |
|---|---|---|
| **Bus** | **Cheap** — needs the least cable; easy to add a device; no central device needed | If the **backbone fails**, the whole network stops; **collisions** → slow with many devices; hard to find faults; low security (all devices see the data) |
| **Ring** | **No collisions** — one device sends at a time; performs well under heavy load; **equal (fair) access** for every device | One broken link or device can **stop the whole network**; adding or removing a device **disrupts** the network; data passes through other devices |
| **Star** | A failed cable or device affects **only that device**; **easy to add** devices; fast and secure with a **switch** (no collisions); easy to find faults | **Central switch** is a **single point of failure**; needs **more cable** than bus; the switch costs money |
| **Mesh** | **Very reliable** — many routes, no single point of failure; can carry a lot of traffic; data can be rerouted | **Expensive** — many cables / links; **complex** to set up and manage; much redundant cabling |
| **Mixed** | Flexible — combines the strengths of each part; easy to **expand** | Complex to design and manage; a failure in the backbone affects several parts |
:::

:::example Choosing a topology
- A **small school computer room** of 30 PCs → **star**: if one cable breaks only one PC is affected, and new PCs are easy to add.
- A **bank's data centres** that must never go offline → **mesh**: many routes, so one failed link does not stop transactions.
- A **school with several buildings** → **mixed**: a star in each building, connected by a fibre backbone.
:::

# Exam practice and summary
@lo 11.6.1.1 11.6.1.2 11.6.1.3 11.6.1.4 11.6.1.5

:::example Exam-style answers
**Q: Compare a LAN and a WAN. [2]**
A LAN covers a **small area** such as a school, **whereas** a WAN covers a **large area** such as a country (1). A LAN is usually **owned** by one organisation, **whereas** a WAN uses **rented** telecom links (1).

**Q: Give two differences between an intranet and the Internet. [2]**
An intranet is **private** to one organisation and needs a **login**, whereas the Internet is **public** (1); intranet content is **controlled** by the organisation, whereas Internet content comes from anyone (1).

**Q: Give one advantage of a star topology and one disadvantage of a bus topology. [2]**
Star: if one cable fails, **only that device** is affected (1). Bus: if the **backbone** fails, the **whole network** stops (1).

**Q: Explain why a school uses a client-server network rather than peer-to-peer. [2]**
Security and backup are **managed centrally** on the server (1), so student files are backed up automatically and access can be controlled with **user accounts** (1).
:::

:::warning Common mistakes
- Saying a LAN is "small" and a WAN is "big" without saying **area**.
- Confusing the **Internet** (the network) with the **World Wide Web** (web pages that use it).
- Saying star "has no single point of failure" — the **switch** is one.
- Writing an advantage that is only the opposite of a disadvantage you already gave.
:::

:::steps Check yourself
- Give three advantages and two disadvantages of networking.
- Compare LAN and WAN in three ways.
- What is an intranet? An extranet?
- Compare client-server and peer-to-peer in terms of security, cost and backup.
- Give two advantages of wired and two of wireless connections.
- Draw bus, ring, star and mesh topologies and give one advantage and one disadvantage of each.
:::
