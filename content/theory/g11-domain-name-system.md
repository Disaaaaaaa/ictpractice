---
summary: Why the Domain Name System is needed, the relationship between domain names and IP addresses, the hierarchy of domain names and DNS servers, how a domain name is resolved step by step (with caching), common DNS records and risks, and the structure of a URL.
---
# Why we need DNS
@lo 11.6.2.4

Every device on the Internet is identified by an **IP address** such as `185.22.66.10`. Computers use these numbers to send data, but people find them **hard to remember**. Instead we type **domain names** such as `nis.edu.kz`.

:::definition Domain name
An **easy-to-remember text name** that represents the **IP address** of a server (or group of servers), e.g. `nis.edu.kz`, `google.com`.
:::

:::definition Domain Name System (DNS)
A **distributed, hierarchical** system of **servers** that **translates domain names into IP addresses** (this is called **name resolution**), so that people can use names while computers use numbers.
:::

:::cards
### Relationship between IP address and domain name
- The IP address is the **numerical identifier** behind the domain name.
- One domain name can point to **several** IP addresses (large sites use many servers), and one server IP can host **many** domain names.
- If a website moves to a new server, only the **DNS record** changes — users keep typing the same name.
### Why DNS is distributed
- No single server could store **billions** of names or answer every request.
- Data is spread across **millions** of servers worldwide, so the system is **fast** and has **no single point of failure**.
- Each organisation manages the records for **its own** domain.
:::

:::example IP address vs domain name
| Domain name | Example IP address |
|---|---|
| `nis.edu.kz` | 185.22.66.10 (example) |
| `google.com` | 142.250.74.46 |
| `localhost` | 127.0.0.1 (your own computer) |
:::

# Organisation of domain names
@lo 11.6.2.4

Domain names are **hierarchical** and are read **from right to left**, from the most **general** level to the most **specific**, separated by dots.

:::compare www.sk.nis.edu.kz
| Part | Level | Meaning |
|---|---|---|
| `kz` | **Top-level domain (TLD)** — 1st level | Country: Kazakhstan |
| `edu` | **Second-level domain** | Education |
| `nis` | Third level | The organisation (Nazarbayev Intellectual Schools) |
| `sk` | Fourth level (subdomain) | A particular school of the network |
| `www` | **Host name** | The web server |
:::

:::ascii The domain name hierarchy (a tree)
                         . (root)
          ┌───────────┬────┴─────┬───────────┐
         com         org         kz          ru        ← top-level domains
          │                  ┌────┴────┐
        google              edu       gov              ← second level
                             │
                            nis                         ← third level
                        ┌────┴────┐
                        sk       ast                    ← subdomains
                        │
                       www                              ← host
:::

:::compare Types of top-level domains
| Type | Examples | Meaning |
|---|---|---|
| **Generic (gTLD)** | `.com`, `.org`, `.net`, `.edu`, `.gov`, `.info` | Type of organisation |
| **Country code (ccTLD)** | `.kz`, `.қаз`, `.ru`, `.uk`, `.de`, `.jp` | Country or territory |
| **New gTLDs** | `.app`, `.shop`, `.online` | Introduced since 2013 |
:::

:::callout info Who manages names?
**ICANN** coordinates the root and the TLDs worldwide. Names in `.kz` are registered through accredited **registrars**; the owner pays to register a name for a period (usually a year) and chooses which **DNS servers** hold its records.
:::

:::tip Counting levels
"State the **second-level** domain of www.sk.nis.edu.kz" → **edu**. Count from the **right**: kz = top (1st) level, edu = 2nd, nis = 3rd.
:::

# How a domain name is resolved
@lo 11.6.2.4

:::cards
### Types of DNS server
- **Resolver (recursive DNS server)** — usually run by the **ISP** or the school; does the searching for the user's computer.
- **Root servers** — know the servers of every **TLD**.
- **TLD servers** — e.g. the `.kz` server knows which servers hold each `.kz` domain.
- **Authoritative server** — stores the actual **records** for one domain, e.g. `nis.edu.kz`.
### Caching
- Answers are **stored (cached)** for a time (the **TTL**, time to live) by the browser, the operating system and the resolver.
- Repeat visits are **much faster** and DNS traffic is reduced.
:::

:::ascii Resolving www.nis.edu.kz
  Browser ──1──► Resolver (ISP)          1  "What is the IP of www.nis.edu.kz?"
                   │  ▲
                   2  3                  2/3 Root server: "ask the .kz TLD server"
                   │  │
                   ├──┴──► Root server
                   4  5                  4/5 .kz server: "ask the nis.edu.kz server"
                   ├──┴──► .kz TLD server
                   6  7                  6/7 Authoritative server: "185.22.66.10"
                   └──┴──► nis.edu.kz authoritative server
  Browser ◄──8── Resolver                8  IP address returned (and cached)
  Browser ──9──► Web server 185.22.66.10 9  Page requested with HTTP/HTTPS
:::

:::steps DNS lookup in words
- The user types a **URL**; the browser first checks its own **cache** (and the computer's **hosts file**) for the IP address.
- If it is not found, the computer sends the request to the **DNS resolver** of the ISP.
- The resolver checks **its** cache; if not found, it asks a **root server**, which refers it to the **TLD server** (`.kz`).
- The TLD server refers it to the **authoritative server** for the domain.
- That server returns the **IP address**; the resolver **caches** it and sends it to the browser.
- The browser connects to the **web server** using the IP address and requests the page.
- If the name does not exist, an **error** is returned ("server not found").
:::

:::compare Common DNS records
| Record | Holds | Example |
|---|---|---|
| **A** | IPv4 address of a name | `nis.edu.kz → 185.22.66.10` |
| **AAAA** | IPv6 address | `→ 2001:db8::10` |
| **MX** | Mail server for the domain | `mail.nis.edu.kz` |
| **CNAME** | Alias of another name | `www → nis.edu.kz` |
| **NS** | Name servers that are authoritative | `ns1.nis.edu.kz` |
:::

:::warning DNS risks
- **DNS spoofing / cache poisoning** — an attacker puts a **false IP address** into a DNS cache, sending users to a **fake website** (pharming).
- If DNS servers **fail** or are attacked (DDoS), websites cannot be reached by name even though they are working.
- Protection: **DNSSEC** (digitally signed records), HTTPS certificates, using trusted resolvers.
:::

# The structure of a URL
@lo 11.6.2.5

:::definition URL (Uniform Resource Locator)
The full **address of a resource** (web page, file, image, video) on the Internet. It tells the browser **which protocol** to use, **which server** to contact and **where the resource is** on that server.
:::

```text | Parts of a URL
https://www.nis.edu.kz:443/en/students/timetable.html?class=11A#monday
└─┬─┘   └──────┬──────┘└┬┘└───────────┬───────────────┘└───┬───┘└──┬──┘
protocol    domain    port         path / file            query   fragment
```

:::compare Parts of a URL
| Part | Example | Purpose |
|---|---|---|
| **Protocol (scheme)** | `https` | **How** to transfer the resource (HTTP, HTTPS, FTP) |
| **Domain name (host name)** | `www.nis.edu.kz` | **Which server**; converted to an IP address by **DNS** |
| Port (optional) | `443` | Service on the server (80 = HTTP, 443 = HTTPS) — usually omitted |
| **Path** | `/en/students/` | **Folders** on the server |
| **File name** | `timetable.html` | The resource itself |
| Query string | `?class=11A` | Parameters sent to the server (`name=value`, joined with `&`) |
| Fragment | `#monday` | A position inside the page |
:::

:::example More URLs
- `http://commons.wikimedia.org/wiki/George.jpg` — protocol **http**, host name **commons.wikimedia.org**, file location **/wiki/George.jpg**.
- `ftp://files.school.kz/homework/task1.pdf` — protocol **ftp** (file transfer).
- `https://www.google.com/search?q=binary+tree` — query **q=binary+tree**.
:::

:::compare URL vs domain name vs IP address
| | Example | What it identifies |
|---|---|---|
| IP address | `185.22.66.10` | A device on the network (numbers) |
| Domain name | `nis.edu.kz` | A server, by an easy name |
| URL | `https://nis.edu.kz/en/news.html` | One **resource** on that server, with the protocol |
:::

# Exam practice and summary
@lo 11.6.2.4 11.6.2.5

:::example Exam-style answers
**Q: Explain how the domain name is used to access a website, including the role of DNS servers. [5]**
The user types the URL / domain name into the browser (1). The browser checks its **cache** for the IP address (1). If not found, a request is sent to the **DNS server (resolver)**, which holds / looks up a list of domain names and their **IP addresses** (1). If that server does not know it, the request is passed to **other DNS servers** up the hierarchy — root, TLD, authoritative (1). The **IP address is returned** to the browser (and cached), which uses it to **connect to the web server** and request the page (1).

**Q: Describe the relationship between the IP address and the domain name. [1]**
The IP address is the **numerical identifier** of the server that the domain name stands for (1).

**Q: Give one example of a URL indicating protocol, host name and file location. [1]**
`https://www.nis.edu.kz/en/timetable.html` (1).

**Q: State a second-level domain name of www.sk.nis.edu.kz. [1]**
**edu** (1).
:::

:::warning Common mistakes
- Saying DNS "stores websites" — it stores **names and IP addresses**, not pages.
- Reading domain levels from the **left** — read from the **right**.
- Confusing a **URL** (full address of a resource) with a **domain name** (one part of it).
- Forgetting the **cache** step in a DNS explanation.
:::

:::steps Check yourself
- Why do we use domain names instead of IP addresses?
- Name the levels of www.ast.nis.edu.kz.
- Describe the steps of a DNS lookup, including caching.
- What do A and MX records store?
- Label every part of https://shop.kz:8080/catalog/phones.php?brand=x#top.
- What is DNS cache poisoning?
:::
