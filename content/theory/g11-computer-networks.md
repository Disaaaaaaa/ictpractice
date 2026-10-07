---
summary: LAN and WAN, intranet and Internet, client-server and peer-to-peer models, wired and wireless connections, and bus, ring, star and mesh topologies.
---
# LAN and WAN
@lo 11.6.1.1

:::compare
| | LAN — Local Area Network | WAN — Wide Area Network |
|---|---|---|
| Area | Small: one building or site (school, office, home) | Large: cities, countries, the whole world |
| Ownership | Usually owned by one organisation | Uses infrastructure of telecom companies (leased lines, satellites) |
| Speed | High (100 Mbit/s – 10 Gbit/s) | Usually lower, more delay (latency) |
| Errors | Few | More errors over long distances |
| Cost | Low to set up | Expensive |
| Media | Ethernet cable, Wi-Fi | Fibre-optic cables, telephone lines, satellite, microwave |
| Example | School computer network | The Internet; a bank linking all its branches |
:::

:::tip
"Compare" needs a point that mentions both: "A LAN covers a **small geographical area** such as one building, **whereas** a WAN covers a **large area** such as several countries."
:::

# Intranet and Internet
@lo 11.6.1.2

:::compare
| | Internet | Intranet |
|---|---|---|
| Definition | Global public network of interconnected networks | Private network of one organisation using Internet technologies (web pages, browsers, TCP/IP) |
| Access | Anyone with a connection | Only authorised members (employees, students), often only inside the organisation |
| Content | Public information from millions of sources | Internal information: timetables, policies, forms, news |
| Security | Lower — content not controlled | Higher — behind a firewall, logins required |
| Reliability of information | Varies | Controlled by the organisation, usually reliable |
:::

:::callout info Extranet
Part of an intranet made available to **selected outsiders** (e.g. parents or suppliers) through a secure login.
:::

# Client-server and peer-to-peer networks
@lo 11.6.1.3

:::cards
### Client-server
One or more powerful **servers** provide services (files, email, web, printing, logins); **clients** request them. Management, security and backup are **central**.
### Peer-to-peer (P2P)
All computers are **equal**: each can share its own files and resources and use those of others. No central server.
:::

:::compare
| | Client-server | Peer-to-peer |
|---|---|---|
| Control and security | Central — accounts, permissions, antivirus managed on the server | Each user manages their own computer; weaker security |
| Backup | Central, automatic | Each computer separately |
| Cost | Expensive (servers, network manager) | Cheap, easy to set up |
| Reliability | Server failure stops services | No single point of failure |
| Performance | Good for many users | Slows down as more users share resources |
| Suitable for | Schools, companies, websites | Homes, small offices, file sharing (torrents) |
:::

# Wired and wireless connections
@lo 11.6.1.4

:::compare
| | Wired (Ethernet, fibre) | Wireless (Wi-Fi, Bluetooth, mobile data) |
|---|---|---|
| Speed | Faster and constant | Slower; varies with distance and obstacles |
| Reliability | Stable, little interference | Interference from walls and other devices |
| Security | Harder to intercept — physical access needed | Signals can be intercepted — needs encryption (WPA2/WPA3) |
| Mobility | Devices fixed to a socket | Users move freely; phones and tablets connect |
| Installation | Cables are costly to lay; trip hazard | Easy to add devices, no cables |
| Range | Up to ~100 m per copper cable (fibre much more) | Limited by router range (~30–50 m indoors) |
:::

# Network topologies
@lo 11.6.1.5

:::definition Topology
The **layout** of how the devices (nodes) of a network are connected.
:::

:::ascii The four basic topologies
 BUS                      RING                 STAR                    MESH
 [A]  [B]  [C]           [A]───[B]          [A]   [B]            [A]─────[B]
  │    │    │             │     │              ╲   ╱              │ ╲   ╱ │
 ═╧════╧════╧═  backbone  │     │             [SWITCH]            │   ╳   │
  │    │                 [D]───[C]             ╱   ╲              │ ╱   ╲ │
 [D]  [E]                                   [C]   [D]            [D]─────[C]
:::

:::compare Advantages and disadvantages
| Topology | Advantages | Disadvantages |
|---|---|---|
| **Bus** — all devices on one backbone cable with terminators | Cheap, little cable, easy to add a device | Backbone failure stops the whole network; collisions → slow with many devices; hard to find faults |
| **Ring** — each device connected to two others in a loop; data travels in one direction | No collisions; performs well under heavy load; order of access is fair | One broken link or device can stop the network; adding devices disrupts it |
| **Star** — every device connected to a central switch/hub | A failed cable affects only one device; easy to add devices; fast with a switch; easy to find faults | Central switch is a single point of failure; more cable; switch costs money |
| **Mesh** — devices connected to many/all others | Very reliable — many routes; no single point of failure; can carry a lot of traffic | Expensive — lots of cables/links; complex to set up and manage |
:::

:::tip
The Internet is a **mesh** of networks (many routes between routers). Most school and home LANs are **star** networks.
:::
