---
summary: The Internet as a global network of networks and how it is organised, the World Wide Web as a service that runs on it (web pages, HTML, URLs, HTTP, browsers, web servers and hyperlinks), how a web page is delivered, other Internet services, and how the Internet, the WWW, intranets and extranets differ.
---
# The Internet
@lo 12.6.2.1

:::definition Internet
A **global network of interconnected computer networks** (a WAN of WANs). It is the physical **infrastructure** — cables, fibre-optic and undersea links, satellites, routers and servers — together with the **TCP/IP** protocols that move data between billions of devices.
:::

:::cards
### How it is organised
- No single organisation **owns** the Internet; it is a **mesh** of networks run by **ISPs**, companies, universities and governments.
- Large **backbone** networks (high-speed fibre) connect countries and continents; ISPs connect homes and schools to them.
- Every connected device has an **IP address**; **routers** forward packets between networks.
### A short history
- **1969** — ARPANET links four US universities.
- **1983** — ARPANET adopts **TCP/IP**: the start of the modern Internet.
- **1990s** — commercial ISPs bring the Internet to homes.
- Today — over **5 billion** users and tens of billions of connected devices (including the **Internet of Things**).
:::

:::compare Services that use the Internet
| Service | Protocols |
|---|---|
| **World Wide Web** | HTTP, HTTPS |
| **E-mail** | SMTP, POP3, IMAP |
| **File transfer** | FTP, FTPS, SFTP |
| **Instant messaging, voice and video calls** | XMPP, WebRTC, VoIP (SIP) |
| **Online games and streaming** | Game-specific protocols and streaming protocols over TCP / UDP |
| **Remote login / administration** | SSH |
| **Domain name lookup** | DNS |
| **Cloud storage, IoT devices** | HTTPS and other protocols |
:::

# The World Wide Web
@lo 12.6.2.1

:::definition World Wide Web (WWW)
A **service that runs on the Internet**: a huge **information system** of **web pages and other resources** linked by **hyperlinks**, each identified by a **URL**, transferred using **HTTP / HTTPS** and viewed in a **web browser**. It was invented by **Tim Berners-Lee** at **CERN** in **1989–1991**.
:::

:::compare Components of the web
| Component | Role |
|---|---|
| **Web page** | A document written in **HTML** (with CSS and JavaScript) |
| **Website** | A collection of related web pages under one domain |
| **Hyperlink** | A link from one page or resource to another — what makes it a "web" |
| **URL** | The unique **address** of each page or resource |
| **HTTP / HTTPS** | The **protocol** used to request and send pages |
| **Web server** | A computer that **stores** websites and **sends** pages when requested |
| **Web browser** | **Client software** (Chrome, Safari, Firefox) that requests pages and **renders** HTML |
| **Search engine** | A website that indexes pages so users can find them (Google, Yandex) |
:::

:::steps How a web page reaches you
- The user types a **URL** or clicks a **hyperlink** in the **browser**.
- **DNS** translates the domain name into the web server's **IP address**.
- The browser sends an **HTTP(S) request** across the **Internet** (through routers) to the **web server**.
- The server sends back the **HTML**, CSS, images and scripts in packets.
- The browser **reassembles** the packets and **renders** the page; each image or file may need further requests.
:::

:::mermaid The web runs on top of the Internet
flowchart TB
  U[User and web browser] -->|HTTP request for a URL| I[The Internet: routers, cables, TCP/IP]
  I --> S[Web server storing HTML pages]
  S -->|HTTP response with the page| I
  I --> U
:::

:::cards
### Static and dynamic pages
- **Static** — the same HTML file is sent to everyone (e.g. a school's "About us" page).
- **Dynamic** — the page is **generated** by a server-side script for each request, often from a **database** (e.g. your timetable, search results, an online shop).
### Web 1.0 → Web 2.0
- Early web: mostly **read-only** pages.
- Web 2.0: users **create content** — social networks, wikis, blogs, video sharing, comments.
:::

# Internet, WWW and intranet
@lo 12.6.2.1

:::compare Internet vs World Wide Web
| | Internet | World Wide Web |
|---|---|---|
| **What it is** | A **network of networks** — hardware and protocols | An **information system** of linked documents |
| **Consists of** | Routers, cables, satellites, servers, devices | Web pages, websites, multimedia, hyperlinks |
| **Protocols** | TCP/IP (plus many others) | HTTP, HTTPS; documents in HTML |
| **Accessed with** | Any networked device and application | A **web browser** |
| **Addresses** | **IP addresses** | **URLs** |
| **Created** | 1960s–1980s (ARPANET, TCP/IP) | 1989–1991 (Tim Berners-Lee, CERN) |
| **Relationship** | The **infrastructure** | One of the **services** that uses the Internet |
:::

:::compare Internet vs intranet vs extranet
| | Internet | Intranet | Extranet |
|---|---|---|---|
| **Who can access** | **Anyone** with a connection | Only **members** of one organisation | **Selected outsiders** (parents, partners, suppliers) as well as members |
| **Scope** | Global, public | **Private** network of one organisation | Part of an intranet opened to outsiders |
| **Content** | Public information from everywhere | Internal news, policies, forms, timetables | Shared information, e.g. marks for parents, orders for suppliers |
| **Security** | Lowest — content and users not controlled | **High** — firewall, logins | High — secure logins, limited access |
| **Technology** | TCP/IP, web, e-mail … | The **same web technologies** (browsers, HTTP) | The same web technologies |
| **Example** | Wikipedia | School staff portal | Parents' e-journal |
:::

:::callout info The web is not only "the Internet"
E-mail, online games, video calls and file transfer all use the **Internet** but are **not** the **web**. A web page in an **intranet** is part of the organisation's private web, not the public World Wide Web.
:::

:::callout warning Deep web and dark web
The **deep web** is the large part of the web that search engines do not index — online banking, school portals, private e-mail. The **dark web** is a small part reachable only with special software (e.g. Tor) and often used for illegal activity. They are different things.
:::

# Exam practice and summary
@lo 12.6.2.1

:::example Exam-style answers
**Q: Explain the difference between the Internet and the World Wide Web. [2]**
The **Internet** is a global **network of interconnected networks** — the infrastructure (1); the **WWW** is a collection of **web pages / resources** linked by hyperlinks that is **accessed over the Internet** using **HTTP** and a **browser** (1).

**Q: Give two features of an intranet that are different from the Internet. [2]**
An intranet is **private** to one organisation and needs a **login** (1); its content is **internal** and **controlled** by the organisation (1).

**Q: Name two Internet services that are not part of the WWW. [2]**
**E-mail** (1); **file transfer (FTP)** / video calls / online games (1).
:::

:::warning Common mistakes
- Using "Internet" and "web" as the **same** thing.
- Saying the web uses **IP addresses** to identify pages — pages are identified by **URLs** (DNS then finds the IP).
- Saying an intranet does **not** use web technology — it uses the **same** technology, privately.
- Giving only one side in a "difference" question.
:::

:::steps Check yourself
- Define the Internet and the World Wide Web.
- Who invented the web, and when?
- List five components of the web and their roles.
- Describe how a web page is delivered to a browser.
- Compare the Internet, an intranet and an extranet in three ways.
- Name four Internet services that are not the web.
:::
