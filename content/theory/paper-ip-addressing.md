---
summary: The format of IPv4 and IPv6 addresses, network and host parts, subnet masks, how an address is assigned to a device, and public versus private addresses.
---
# Format of an IP address and how it is assigned
@lo 11.6.3.2@paper

:::compare IPv4
| Feature | Detail |
|---|---|
| Size | **32 bits** = 4 bytes |
| Notation | 4 denary numbers 0–255 separated by dots: `188.10.52.2` |
| Each number | 8 bits (an **octet**) — 188 = 10111100 |
| Number of addresses | 2³² ≈ 4.3 billion |
:::

:::compare IPv6
| Feature | Detail |
|---|---|
| Size | **128 bits** |
| Notation | 8 groups of 4 hex digits separated by colons: `2001:0db8:0000:0000:0000:ff00:0042:8329` |
| Shortening | Leading zeros dropped and one run of zero groups written `::` → `2001:db8::ff00:42:8329` |
| Why | IPv4 addresses ran out; IPv6 gives 2¹²⁸ addresses, simpler headers, built-in security |
:::

## Network part, host part and the subnet mask

An IP address has a **network ID** (which network) and a **host ID** (which device on that network). The **subnet mask** shows which bits are which: 1-bits = network, 0-bits = host.

:::example 188.10.52.2 with mask 255.255.0.0
- Mask 255.255.0.0 → first **two** octets are the network.
- Network address: **188.10.0.0**
- Host part: **0.0.52.2**
- First octet 188 is in 128–191 → **class B**.
:::

:::compare Address classes (classful addressing)
| Class | First octet | Default mask | Network / host octets |
|---|---|---|---|
| A | 1–126 | 255.0.0.0 | N.H.H.H |
| B | 128–191 | 255.255.0.0 | N.N.H.H |
| C | 192–223 | 255.255.255.0 | N.N.N.H |
:::

## How a device gets an IP address

:::cards
### Dynamic (DHCP)
A **DHCP server** (often the router) automatically **leases** an address from a pool when the device joins the network; it may change next time.
### Static
The address is **set manually** and does not change. Used for **servers, printers, routers** that others must always find at the same address.
:::

:::steps DHCP in brief
- The device broadcasts "I need an address" (**Discover**).
- The DHCP server **offers** a free address.
- The device **requests** it; the server **acknowledges** and records the lease (with the subnet mask, gateway and DNS server).
:::

# Public and private IP addresses
@lo 11.6.3.3@paper

:::compare
| | Public IP address | Private IP address |
|---|---|---|
| Used on | The **Internet** — globally unique | A **local network** only — reused in millions of LANs |
| Assigned by | The ISP (from regional registries) | The local router (DHCP) or the administrator |
| Reachable from the Internet? | Yes | **No** — not routed on the Internet |
| Ranges | All others | `10.0.0.0–10.255.255.255`, `172.16.0.0–172.31.255.255`, `192.168.0.0–192.168.255.255` |
:::

:::callout info NAT (Network Address Translation)
The router has **one public address** and gives devices private addresses. It **translates** between them, so many devices share one public IP.
:::

:::compare Implications for security
| Private addresses | Public addresses |
|---|---|
| Devices are **hidden** behind the router/NAT — attackers on the Internet cannot connect to them directly | Devices are **directly reachable** — open to scanning and attacks; need a firewall and updates |
| Outgoing connections are still possible, so malware can still "call home" | Servers need public addresses but should expose only required ports |
:::
