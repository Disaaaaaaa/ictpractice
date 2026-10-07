---
summary: The difference between the Internet and the World Wide Web, how the web works on top of the Internet, and the other services the Internet provides.
---
# The Internet and the World Wide Web
@lo 12.6.2.1

:::cards
### The Internet
A **global network of interconnected computer networks** — the physical **infrastructure** (cables, routers, servers) and the protocols (**TCP/IP**) that move data between devices.
### The World Wide Web (WWW)
A **service that runs on the Internet**: a huge collection of **web pages and resources** linked by **hyperlinks**, identified by **URLs**, transferred using **HTTP/HTTPS** and viewed in a **web browser**.
:::

:::compare Internet vs WWW
| | Internet | World Wide Web |
|---|---|---|
| What it is | Network of networks — hardware and protocols | Information system of linked documents |
| Consists of | Routers, cables, satellites, servers, devices | Web pages, websites, multimedia, hyperlinks |
| Protocols | TCP/IP (plus many others) | HTTP, HTTPS; documents in HTML |
| Accessed with | Any networked device and application | A web browser |
| Addresses | IP addresses | URLs |
| Created | 1960s–1980s (ARPANET) | 1989–1991 by Tim Berners-Lee at CERN |
| Relationship | The infrastructure | One of the services that **uses** the Internet |
:::

:::compare Other Internet services (not the web)
| Service | Protocol |
|---|---|
| Email | SMTP, POP3, IMAP |
| File transfer | FTP, SFTP |
| Instant messaging, video calls | XMPP, WebRTC, VoIP (SIP) |
| Online games | Game-specific protocols over TCP/UDP |
| Remote login | SSH |
| Domain name lookup | DNS |
:::

:::mermaid How a web page reaches you
flowchart LR
  B[Browser: enter URL] --> D[DNS: domain → IP address]
  D --> R[Request travels across the Internet via routers]
  R --> S[Web server]
  S --> H[HTML, CSS, images sent back using HTTP/HTTPS]
  H --> B2[Browser renders the page]
:::

:::tip
A clear one-line answer: "The **Internet** is the global **network infrastructure**; the **WWW** is a collection of **web pages** accessed **over** the Internet using HTTP and a browser."
:::
