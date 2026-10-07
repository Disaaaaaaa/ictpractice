---
summary: The seven layers of the OSI reference model, the function of each layer, typical protocols and devices, and how data is encapsulated.
---
# The OSI model
@lo 12.6.1.2

:::definition OSI model (Open Systems Interconnection)
A **reference model with seven layers** that describes how data is sent across a network. Each layer has a specific function, **provides services to the layer above** and uses the layer below, so that hardware and software from different makers can work together.
:::

:::compare The seven layers (from top to bottom)
| No. | Layer | Function | Examples |
|---|---|---|---|
| 7 | **Application** | Network services for user applications; interface between the user's program and the network | HTTP, HTTPS, FTP, SMTP, POP3, DNS |
| 6 | **Presentation** | Translates data formats, **encryption/decryption**, **compression** | SSL/TLS, JPEG, ASCII/Unicode |
| 5 | **Session** | Opens, manages and **closes sessions** (connections) between applications; synchronisation | NetBIOS, RPC |
| 4 | **Transport** | **End-to-end** delivery; splits data into **segments**, numbers them, error control, flow control, retransmission | **TCP**, UDP; port numbers |
| 3 | **Network** | **Logical addressing** (IP) and **routing** of **packets** between networks | **IP**, ICMP; **routers** |
| 2 | **Data link** | **Physical (MAC) addressing**, organising bits into **frames**, error detection on one link | Ethernet, Wi-Fi (802.11); **switches**, NICs |
| 1 | **Physical** | Transmits raw **bits** as electrical, light or radio signals; cables, connectors, voltages | Cables, fibre, radio; **hubs**, **repeaters** |
:::

:::tip
Memory aid from layer 7 down: "**A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing" — Application, Presentation, Session, Transport, Network, Data link, Physical.
:::

## Encapsulation

When data is sent, each layer **adds its own header** (the data link layer also adds a trailer); the receiver removes them in reverse order.

:::ascii Encapsulation going down the layers
Application / Presentation / Session:                          [ DATA ]
Transport (segment):                                 [TCP header][ DATA ]
Network (packet):                          [IP header][TCP header][ DATA ]
Data link (frame):           [MAC header][IP header][TCP header][ DATA ][trailer]
Physical:                    0110100101010111010010110100101001011101010…
:::

:::compare OSI model vs TCP/IP model
| OSI layers | TCP/IP layer |
|---|---|
| Application, Presentation, Session | Application |
| Transport | Transport |
| Network | Internet |
| Data link, Physical | Network access (link) |
:::

## Benefits of a layered model

- Each layer can be **designed, changed and tested independently**.
- **Standards** let equipment from different manufacturers work together.
- Easier **troubleshooting** — a problem can be located in one layer.
- Easier to learn and teach networking.
