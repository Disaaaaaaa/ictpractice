---
summary: Copyright law in software development, open-source and closed-source software, restricting access to data on the Internet, and the risks of cloud technologies.
---
# Copyright law and software development
@lo 11.1.3.1@paper

- Program code is protected by **copyright** like a literary work — automatically, from the moment it is written.
- Developers must **not copy** other people's code, images, fonts, music or libraries without permission or a suitable **licence**.
- Read the **licence** of every library and asset used; some (e.g. GPL) require your program to be open-source too.
- **Credit** authors where the licence requires it (attribution).
- Respect **trademarks** (names, logos) and **patents**.
- Employees' code usually belongs to the **employer**; clarify ownership in contracts with clients.
- Do not use **pirated** development tools.

# Open-source software
@lo 11.1.3.2@paper

:::definition Open-source software
Software whose **source code is publicly available**; users may **study, modify and redistribute** it under an open licence (GPL, MIT, Apache). Often free of charge. *Examples: Linux, Firefox, LibreOffice, Python, MySQL, Android (AOSP).*
:::

:::compare Open source
| Advantages | Disadvantages |
|---|---|
| Usually free — no licence fees | Support may rely on the community; no guaranteed help |
| Can be modified to meet exact needs | May need technical skill to install and customise |
| Many developers review the code → bugs and security holes found quickly | Fewer features/polish in some products; compatibility issues |
| Not locked to one vendor | Projects can be abandoned |
:::

# Closed-source (proprietary) software
@lo 11.1.3.3@paper

:::definition Closed-source software
Software whose **source code is kept secret** by the owner; users buy a **licence to use** it but cannot see, modify or redistribute the code. *Examples: Microsoft Windows and Office, Adobe Photoshop, macOS.*
:::

:::compare Closed source
| Advantages | Disadvantages |
|---|---|
| Professional support, documentation and regular updates | Licence costs, often subscriptions |
| Usually well tested and user-friendly | Cannot be modified or checked by users |
| Clear responsibility of the vendor | **Vendor lock-in**; the product may be discontinued |
| Protects the company's investment and income | Users depend on the vendor to fix security problems |
:::

# Restricting access to data on the Internet
@lo 11.1.3.4@paper

:::compare Methods
| Method | How it restricts access |
|---|---|
| Authentication (passwords, 2FA, biometrics) | Only identified users can log in |
| Access rights / roles | Users see or change only what they need (read-only, editor, admin) |
| Encryption (HTTPS, encrypted storage) | Intercepted or stolen data cannot be read |
| Firewalls and IP filtering | Block traffic from unauthorised addresses |
| Privacy settings | Share posts/files only with chosen people; disable public links |
| Expiring or password-protected links | Shared files are available for a limited time |
| CAPTCHA, rate limits | Stop automated bots from collecting data |
| VPN | Access internal data only through an encrypted tunnel |
:::

# Risks of cloud technologies
@lo 11.1.3.5@paper

:::definition Cloud computing
Using **storage, software and processing power provided over the Internet** by a provider's data centres (e.g. Google Drive, Microsoft 365, AWS), instead of the user's own hardware.
:::

:::compare Benefits and risks
| Benefits | Risks |
|---|---|
| Access from anywhere, on any device | **Needs a reliable Internet connection** — no access when offline |
| No hardware to buy or maintain; pay as you go | **Security/privacy**: data stored by a third party; risk of breaches and hacking |
| Easy collaboration and sharing | **Loss of control** — the provider decides where data is stored, possibly abroad (legal issues) |
| Automatic backups and updates | **Provider failure**: outages, the company closes or changes terms |
| Scales easily | **Vendor lock-in** — hard to move data elsewhere; ongoing subscription costs |
| | Account hijacking through weak passwords or phishing |
:::

:::tip
"Evaluate the risks" → state each risk, explain its **consequence**, and suggest how it can be **reduced** (encryption, 2FA, local backup copy, choosing a reliable provider with a clear privacy policy).
:::
