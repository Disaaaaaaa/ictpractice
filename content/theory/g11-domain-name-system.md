---
summary: What the Domain Name System does, how domain names are organised and resolved into IP addresses, and the structure of a URL.
---
# The Domain Name System (DNS)
@lo 11.6.2.4

:::definition Domain Name System (DNS)
A distributed, hierarchical system of servers that **translates domain names** (e.g. `nis.edu.kz`) **into IP addresses** (e.g. `185.22.66.10` — an example address), so that people can use easy-to-remember names instead of numbers.
:::

## Organisation of domain names

Domain names are read **from right to left**, from the most general level to the most specific.

:::compare www.sk.nis.edu.kz
| Part | Level | Meaning |
|---|---|---|
| `kz` | Top-level domain (TLD) | Country: Kazakhstan |
| `edu` | Second-level domain | Education |
| `nis` | Third level | The organisation (Nazarbayev Intellectual Schools) |
| `sk` | Fourth level (subdomain) | A particular school of the network |
| `www` | Host name | The web server |
:::

:::compare Types of top-level domains
| Type | Examples |
|---|---|
| Generic (gTLD) | `.com`, `.org`, `.net`, `.edu`, `.gov` |
| Country code (ccTLD) | `.kz`, `.ru`, `.uk`, `.de` |
:::

:::mermaid How a domain name is resolved
sequenceDiagram
  participant B as Browser
  participant R as Resolver (ISP DNS)
  participant Root as Root server
  participant T as .kz TLD server
  participant A as Authoritative server (nis.edu.kz)
  B->>R: IP of www.nis.edu.kz?
  R->>Root: www.nis.edu.kz?
  Root-->>R: ask the .kz server
  R->>T: www.nis.edu.kz?
  T-->>R: ask nis.edu.kz's server
  R->>A: www.nis.edu.kz?
  A-->>R: 185.22.66.10
  R-->>B: 185.22.66.10 (and caches it)
:::

:::steps DNS lookup in words
- The user types a URL; the browser first checks its own **cache**.
- If not found, it asks the **DNS resolver** of the ISP.
- The resolver asks a **root server**, which refers it to the **TLD server** (`.kz`).
- The TLD server refers it to the **authoritative server** for the domain.
- That server returns the **IP address**; the resolver **caches** it and sends it to the browser.
- The browser connects to the web server using the IP address.
:::

:::tip
"State a second-level domain name of www.sk.nis.edu.kz" → **edu** (count from the right: kz = 1st/top level, edu = 2nd).
:::

# The structure of a URL
@lo 11.6.2.5

:::definition URL (Uniform Resource Locator)
The full **address of a resource** (page, file, image) on the web.
:::

```text | Parts of a URL
https://www.nis.edu.kz:443/en/students/timetable.html?class=11A#monday
└─┬─┘   └──────┬──────┘└┬┘└───────────┬───────────────┘└───┬───┘└──┬──┘
protocol    domain    port         path / file            query   fragment
```

:::compare
| Part | Example | Purpose |
|---|---|---|
| Protocol (scheme) | `https` | How to transfer the resource (HTTP, HTTPS, FTP) |
| Domain name | `www.nis.edu.kz` | Which server; converted to an IP address by DNS |
| Port (optional) | `443` | Service on the server (80 = HTTP, 443 = HTTPS) |
| Path | `/en/students/` | Folders on the server |
| File name | `timetable.html` | The resource itself |
| Query string | `?class=11A` | Parameters sent to the server |
| Fragment | `#monday` | A position inside the page |
:::
