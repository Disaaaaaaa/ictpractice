---
summary: The seven layers of the OSI reference model — the function of each layer, its data unit, typical protocols and devices — how data is encapsulated and decapsulated on its way through the layers, a worked example of a web request, the TCP/IP model compared with OSI, and the benefits of a layered model.
---
# The OSI reference model
@lo 12.6.1.2

:::definition OSI model (Open Systems Interconnection)
A **reference model with seven layers**, published by the ISO, that describes how data is sent from one device to another across a network. Each layer has a **specific function**, **provides services to the layer above** and **uses the services of the layer below**, so that hardware and software from different manufacturers can work together.
:::

:::compare The seven layers (from top to bottom)
| No. | Layer | Function | Examples |
|---|---|---|---|
| 7 | **Application** | Network services for user applications; the interface between the user's program and the network | HTTP, HTTPS, FTP, SMTP, POP3, IMAP, DNS |
| 6 | **Presentation** | Translates data formats, **encryption / decryption**, **compression** | SSL/TLS encryption, JPEG, MP3, ASCII / Unicode |
| 5 | **Session** | Opens, manages and **closes sessions** (connections) between applications; synchronisation and checkpoints | NetBIOS, RPC, session tokens |
| 4 | **Transport** | **End-to-end** delivery between programs; splits data into **segments**, numbers them, error and flow control, retransmission | **TCP**, **UDP**; **port numbers** (80, 443) |
| 3 | **Network** | **Logical addressing** (IP addresses) and **routing** of **packets** between networks | **IP**, ICMP (ping); **routers** |
| 2 | **Data link** | **Physical (MAC) addressing**, organising bits into **frames**, error detection on one link, access to the medium | Ethernet, Wi-Fi (802.11); **switches**, bridges, NICs |
| 1 | **Physical** | Transmits raw **bits** as electrical, light or radio signals; cables, connectors, voltages, frequencies | Copper, fibre, radio; **hubs**, **repeaters**, modems |
:::

:::tip Remembering the order
From layer **7 down**: "**A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing" — Application, Presentation, Session, Transport, Network, Data link, Physical. From layer **1 up**: "**P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way".
:::

:::cards
### Upper layers (7–5) — "the software"
- Deal with the **meaning** of the data for the user's application.
- Implemented in **software** on the end devices.
### Transport layer (4) — "the link between"
- Makes sure the data from one **program** reaches the right **program** on the other device, complete and in order.
### Lower layers (3–1) — "the network"
- Move the data **across the network**: routing, local delivery, signals.
- Implemented in network **hardware** and drivers.
:::

# Each layer in more detail
@lo 12.6.1.2

:::cards
### 7 Application layer
- Provides **network services** to applications: web browsing (HTTP), e-mail (SMTP, POP3, IMAP), file transfer (FTP), name lookup (DNS).
- It is **not** the application itself (the browser) but the protocols the application uses.
### 6 Presentation layer
- Makes data understandable to the receiver: **converts formats** (character codes, image and video formats).
- **Encrypts** and **decrypts** data (TLS in HTTPS) and **compresses** it.
### 5 Session layer
- **Establishes, maintains and ends** a session (dialogue) between two applications.
- Adds **checkpoints**, so a long transfer can restart from the last checkpoint instead of from the beginning.
### 4 Transport layer
- Splits data into **segments** and adds **port numbers** so the data reaches the right application.
- **TCP**: reliable — acknowledgements, retransmission of lost segments, correct order, flow control. **UDP**: fast, no checks (video calls, games).
### 3 Network layer
- Adds **source and destination IP addresses** → **packets**.
- **Routers** choose the **best route** between networks.
### 2 Data link layer
- Adds **source and destination MAC addresses** and an error-checking **trailer** → **frames**.
- Controls access to the shared medium; **switches** forward frames inside a LAN.
### 1 Physical layer
- Converts frames into **bits** and sends them as **signals** — voltages on copper, light pulses in fibre, radio waves.
- Defines cables, connectors, pin layouts and transmission speed.
:::

:::compare Data units, addresses and devices
| Layer | Data unit (PDU) | Address used | Devices |
|---|---|---|---|
| 7–5 Application, Presentation, Session | **Data** (message) | — (URLs, user names) | Hosts, gateways |
| 4 Transport | **Segment** (TCP) / datagram (UDP) | **Port number** | — (end devices) |
| 3 Network | **Packet** | **IP address** | **Router**, layer-3 switch |
| 2 Data link | **Frame** | **MAC address** | **Switch**, bridge, NIC, wireless access point |
| 1 Physical | **Bits** | — | **Hub**, **repeater**, cables, modem |
:::

# Encapsulation and decapsulation
@lo 12.6.1.2

:::definition Encapsulation
As data moves **down** the layers of the sender, each layer **adds its own header** (the data link layer also adds a **trailer**) containing the control information it needs. At the receiver, the data moves **up** the layers and each layer **removes** its header — **decapsulation**.
:::

:::ascii Encapsulation going down the layers
Application / Presentation / Session:                          [ DATA ]
Transport (segment):                                 [TCP header][ DATA ]
Network (packet):                          [IP header][TCP header][ DATA ]
Data link (frame):           [MAC header][IP header][TCP header][ DATA ][trailer]
Physical:                    0110100101010111010010110100101001011101010…
:::

:::definition Peer-to-peer communication between layers
Each layer communicates **logically** with the **same layer** on the other device: the transport layer of the sender talks to the transport layer of the receiver through the TCP header, while physically the data goes down to layer 1, across the medium and back up.
:::

:::steps Example — a browser requests a web page
- **7 Application**: the browser creates an **HTTP GET** request for `/index.html`.
- **6 Presentation**: the request is **encrypted** with TLS (HTTPS) and encoded as text.
- **5 Session**: a **session** with the web server is opened and kept for the following requests.
- **4 Transport**: TCP splits the data into **segments**, adds **port 443** and sequence numbers.
- **3 Network**: IP adds the source and destination **IP addresses** → **packets**; routers forward them.
- **2 Data link**: Ethernet / Wi-Fi adds the **MAC address** of the next device (the router) and a checksum → **frames**.
- **1 Physical**: the frames are sent as **electrical or radio signals**.
- At the server the layers work **in reverse**: bits → frames → packets → segments → the HTTP request is given to the web server software.
:::

:::compare Where common problems occur
| Problem | Layer |
|---|---|
| Unplugged or damaged cable, weak Wi-Fi signal | 1 Physical |
| Switch port fault, MAC address conflict | 2 Data link |
| Wrong IP address, router down, no route | 3 Network |
| Port blocked by a firewall, lost segments | 4 Transport |
| Certificate (encryption) error | 6 Presentation |
| Wrong URL, DNS error, web server error 404 | 7 Application |
:::

# OSI and TCP/IP
@lo 12.6.1.2

:::compare OSI model vs TCP/IP model
| OSI layers | TCP/IP layer | Protocols |
|---|---|---|
| 7 Application, 6 Presentation, 5 Session | **Application** | HTTP, HTTPS, FTP, SMTP, POP3, DNS |
| 4 Transport | **Transport** | TCP, UDP |
| 3 Network | **Internet** | IP, ICMP |
| 2 Data link, 1 Physical | **Network access (link)** | Ethernet, Wi-Fi |
:::

:::cards
### OSI model
- **7** layers; a **reference / teaching** model.
- Separates presentation and session clearly.
- Designed before the protocols — general.
### TCP/IP model
- **4** layers; the **practical** model the Internet actually uses.
- Upper three OSI layers are combined into one application layer.
- Designed around existing protocols (TCP and IP).
:::

:::cards
### Benefits of a layered model
- Each layer can be **designed, changed and tested independently** — e.g. Wi-Fi replaced Ethernet cable without changing HTTP.
- **Standards** let equipment and software from **different manufacturers** work together.
- Easier **troubleshooting** — a problem can be located in one layer.
- Easier to **learn and teach** networking; complex communication is broken into smaller tasks.
### Drawbacks
- Extra **headers** at each layer add overhead (more data to send).
- Some functions are **repeated** in several layers (e.g. error checking).
:::

# Exam practice and summary
@lo 12.6.1.2

:::example Exam-style answers
**Q: Name the OSI layer that uses IP addresses. [1]**
**Network layer** (layer 3) (1).

**Q: Describe the functions of the transport layer. [2]**
Splits data into **segments** and adds **port numbers** / sequence numbers (1); ensures **reliable end-to-end delivery** — error checking, retransmission of lost segments, correct order (1).

**Q: State the layer responsible for encryption and data compression. [1]**
**Presentation layer** (1).

**Q: Explain what is meant by encapsulation. [2]**
Each layer **adds a header** (and the data link layer a trailer) with its control information as data passes **down** the layers (1); the receiver **removes** them in reverse order as data passes **up** (1).
:::

:::warning Common mistakes
- Putting the layers in the wrong order — Physical is layer **1**, Application layer **7**.
- Saying the application layer **is** the browser — it is the **protocols** used by the application.
- Mixing up **IP** (network layer, routers) and **MAC** (data link layer, switches).
- Calling a layer-2 unit a "packet" — it is a **frame**; layer 4 is a **segment**.
:::

:::steps Check yourself
- List the seven layers in order with one function of each.
- Which layer adds port numbers? IP addresses? MAC addresses?
- Name a device that works at layers 1, 2 and 3.
- Describe the encapsulation of an e-mail sent with SMTP.
- Compare the OSI model with the TCP/IP model.
- Give three benefits of a layered network model.
:::
