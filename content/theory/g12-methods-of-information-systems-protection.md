---
summary: The ethical and legal problems caused by cracking (hacking) computer systems, how to protect data from unauthorised access (authentication, authorisation, encryption, hashing and more), the problems caused by different types of malware, and what privacy policies are, what they contain and why they matter.
---
# Computer system cracking
@lo 12.1.3.1

:::definition Hacking / cracking
**Gaining unauthorised access** to a computer system, network or data — by guessing or stealing passwords, exploiting software weaknesses or tricking people. **Cracking** usually means breaking into systems or breaking software protection **with malicious intent**.
:::

:::definition Unauthorised access
Using a computer system, account or data **without the permission of its owner** — even if nothing is changed, copied or damaged.
:::

:::definition Vulnerability
A **weakness** in software, hardware, a network or a procedure (for example an unpatched bug or a weak password) that an attacker can **exploit** to get in.
:::

:::cards
### Black-hat hackers (crackers)
Break into systems **illegally** for personal gain or to cause harm: stealing money or data, blackmail, sabotage.
### White-hat (ethical) hackers
Security experts who test systems **with the owner's permission** (penetration testing) to find weaknesses and fix them before criminals exploit them.
### Grey-hat hackers
Break in **without permission** but without criminal intent — e.g. to report a weakness. Still **illegal** and ethically questionable.
:::

:::compare Common cracking methods
| Method | How it works | Main countermeasure |
|---|---|---|
| **Brute-force attack** | A program tries **every possible password** until one works | Long, complex passwords; limit login attempts |
| **Dictionary attack** | Tries common words and leaked passwords | Passwords that are not words or names; 2FA |
| **Phishing / social engineering** | Tricks people into **revealing passwords** with fake e-mails, websites or phone calls | User training; 2FA; check the address of links |
| **Exploiting vulnerabilities** | Uses **bugs in unpatched software** to get in | Install updates / patches |
| **SQL injection** | Types SQL code into a web form to read or change the database | Validate input; parameterised queries |
| **Interception (man-in-the-middle)** | Captures data sent over an **unencrypted** network, e.g. public Wi-Fi | Encryption — HTTPS (SSL/TLS), VPN |
| **Keylogger / spyware** | Records the keys a user types, including passwords | Anti-malware software; 2FA |
:::

:::svg How crackers get in — and the layer that stops each attack
<svg class="isp" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Four attack routes from a cracker to a school database, each blocked by a different protection layer">
  <style>
    svg.isp .at{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.isp .df{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.isp .db{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.isp .tt{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.isp .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.isp .atk{stroke:var(--danger);stroke-width:2;fill:none;stroke-dasharray:6 4}
    svg.isp .aha{fill:var(--danger)}
  </style>
  <rect class="at" x="10" y="115" width="120" height="70" rx="10"/>
  <text class="tt" x="70" y="145" text-anchor="middle">Cracker</text>
  <text class="ss" x="70" y="165" text-anchor="middle">black-hat</text>
  <path class="atk" d="M130,130 C170,60 200,45 240,45"/><path class="atk" d="M130,143 C180,115 200,110 240,110"/>
  <path class="atk" d="M130,157 C180,185 200,190 240,190"/><path class="atk" d="M130,170 C170,240 200,255 240,255"/>
  <rect class="at" x="240" y="25" width="170" height="40" rx="8"/><text class="tt" x="325" y="50" text-anchor="middle">Phishing e-mail</text>
  <rect class="at" x="240" y="90" width="170" height="40" rx="8"/><text class="tt" x="325" y="115" text-anchor="middle">Brute force</text>
  <rect class="at" x="240" y="170" width="170" height="40" rx="8"/><text class="tt" x="325" y="195" text-anchor="middle">Unpatched bug</text>
  <rect class="at" x="240" y="235" width="170" height="40" rx="8"/><text class="tt" x="325" y="260" text-anchor="middle">Public Wi-Fi sniffing</text>
  <rect class="df" x="440" y="25" width="170" height="40" rx="8"/><text class="tt" x="525" y="50" text-anchor="middle">Training + 2FA</text>
  <rect class="df" x="440" y="90" width="170" height="40" rx="8"/><text class="tt" x="525" y="115" text-anchor="middle">Lockout + strong pw</text>
  <rect class="df" x="440" y="170" width="170" height="40" rx="8"/><text class="tt" x="525" y="195" text-anchor="middle">Updates + firewall</text>
  <rect class="df" x="440" y="235" width="170" height="40" rx="8"/><text class="tt" x="525" y="260" text-anchor="middle">HTTPS encryption</text>
  <path class="aha" d="M412,39 l14,6 l-14,6 z"/><path class="aha" d="M412,104 l14,6 l-14,6 z"/><path class="aha" d="M412,184 l14,6 l-14,6 z"/><path class="aha" d="M412,249 l14,6 l-14,6 z"/>
  <rect class="db" x="640" y="110" width="110" height="80" rx="10"/>
  <text class="tt" x="695" y="145" text-anchor="middle">School</text>
  <text class="tt" x="695" y="165" text-anchor="middle">database</text>
  <text class="ss" x="525" y="295" text-anchor="middle">each defence (green) blocks one route (red) to the data</text>
</svg>
:::

:::example SQL injection in a school login form
A login page builds this query from what the user types:
`SELECT * FROM Users WHERE Name = '` + *name* + `' AND Password = '` + *password* + `'`

A cracker types `' OR '1'='1` as the password. The query becomes `… AND Password = '' OR '1'='1'` — the condition is **always true**, so the cracker is logged in without a password.
**Protection:** validate input and use **parameterised queries**, so typed text is treated as data, never as SQL code.
:::

# Ethical and legal problems of cracking
@lo 12.1.3.1

:::definition Ethics
The **moral principles** that decide whether an action is right or wrong. An action can be legal but unethical, or (as with most cracking) both **illegal and unethical**.
:::

:::compare Problems caused by cracking
| For individuals | For organisations | For society |
|---|---|---|
| **Identity theft** — criminals use stolen personal details | **Financial loss** — stolen money, fines, cost of recovery | Loss of **trust** in online banking, e-government, shopping |
| Theft of money from bank accounts | **Theft of confidential data** — customers' details, trade secrets | Attacks on **critical infrastructure** (power, hospitals, transport) |
| **Invasion of privacy** — private messages, photos published | **Damage to reputation** — customers leave | **Political** misuse — leaked documents, election interference |
| Blackmail and stress | **Downtime** — systems unavailable, work stops | Cost passed to everyone through higher prices and taxes |
:::

:::compare Ethical problems and legal problems
| | Ethical problem | Legal problem |
|---|---|---|
| Question | Is it **morally right**? | Does it **break the law**? |
| Judged by | Society's values, professional codes of conduct | Courts, under laws such as the Criminal Code |
| Examples | Violating privacy, harming innocent people, breaking trust, using leaked data | Unauthorised access, data theft, fraud, failing to protect personal data |
| Consequence | Loss of trust and reputation, harm to people | Fines, correctional work, imprisonment |
:::

:::cards
### Why cracking is unethical
- It **violates privacy** — people have a right to control their personal data.
- It is **theft** of property (data, money, intellectual property) even if nothing physical is taken.
- It **harms innocent people** — customers, patients, employees.
- It **breaks trust** between people and organisations.
- "I only looked, I did not change anything" is still **unauthorised access**.
### Legal consequences
- In Kazakhstan, unauthorised access to computer information is a crime under the **Criminal Code** (fines, correctional work, imprisonment).
- Organisations that fail to protect personal data can be fined under the **Law on Personal Data and its Protection**.
- Most countries have similar laws (e.g. the UK **Computer Misuse Act**, the EU **GDPR**).
:::

:::svg Who is harmed when a hospital system is cracked
<svg class="isp" viewBox="0 0 760 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A cracked hospital system harms patients, the hospital and society in different ways">
  <style>
    svg.isp .ce{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.isp .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.isp .tt{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.isp .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.isp .ln{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <rect class="ce" x="290" y="20" width="180" height="56" rx="12"/>
  <text class="tt" x="380" y="44" text-anchor="middle" style="fill:var(--danger)">Hospital system</text>
  <text class="tt" x="380" y="64" text-anchor="middle" style="fill:var(--danger)">cracked</text>
  <path class="ln" d="M330,76 L130,110"/><path class="ln" d="M380,76 V110"/><path class="ln" d="M430,76 L630,110"/>
  <rect class="bx" x="10" y="110" width="240" height="135" rx="10"/>
  <text class="tt" x="24" y="134">Patients</text>
  <text class="ss" x="24" y="156">medical records exposed or sold</text>
  <text class="ss" x="24" y="174">→ privacy lost, discrimination,</text>
  <text class="ss" x="24" y="192">blackmail</text>
  <text class="ss" x="24" y="214">treatment delayed → health risk</text>
  <rect class="bx" x="260" y="110" width="240" height="135" rx="10"/>
  <text class="tt" x="274" y="134">The hospital</text>
  <text class="ss" x="274" y="156">downtime: operations cancelled</text>
  <text class="ss" x="274" y="174">fines for failing to protect data</text>
  <text class="ss" x="274" y="192">cost of recovery</text>
  <text class="ss" x="274" y="214">reputation damaged</text>
  <rect class="bx" x="510" y="110" width="240" height="135" rx="10"/>
  <text class="tt" x="524" y="134">Society</text>
  <text class="ss" x="524" y="156">less trust in e-health and</text>
  <text class="ss" x="524" y="174">e-government services</text>
  <text class="ss" x="524" y="192">critical services less reliable</text>
  <text class="ss" x="524" y="214">costs passed on through taxes</text>
</svg>
:::

:::example Ethical dilemma — analyse it
*A student discovers that the school's marking website lets anyone see every pupil's marks by changing a number in the address bar. She shows her friends.*

- **Ethical problem:** she accessed other pupils' **private data** without permission and shared it — a breach of their privacy.
- **Legal problem:** this is **unauthorised access**, even though the website was badly designed.
- **The right action:** report the weakness **privately** to the school's IT staff (responsible disclosure) without using or sharing the data.
- **The school's responsibility:** it failed to protect personal data and must fix the vulnerability.
:::

:::tip How to "analyse" an ethical problem in the exam
Use a chain: **what happened → who is harmed → how they are harmed → why it is wrong (privacy, theft, trust)**. One mark is usually for the problem and one for its consequence.
:::

# Protecting data from unauthorised access
@lo 12.1.2.3

:::definition Authentication
Checking **who a user is** before giving access — with something the user **knows** (password, PIN), **has** (phone, smart card) or **is** (fingerprint, face).
:::

:::definition Authorisation (access rights)
Deciding **what an authenticated user is allowed to do** — which files or records they can read, change or delete.
:::

:::definition Encryption
Scrambling data with an algorithm and a **key** so that it can only be read by someone with the correct key. Stolen or intercepted encrypted data is **unreadable**.
:::

:::compare Measures against unauthorised access
| Measure | How it protects |
|---|---|
| **Strong passwords / password complexity** | Long passwords with upper and lower case, digits and symbols are much harder to guess or brute-force |
| **Two-factor (multi-factor) authentication** | A stolen password is not enough — a second factor (phone code, fingerprint) is needed |
| **Limiting login attempts** | The account is locked after several wrong passwords → stops brute-force attacks |
| **Access rights / authorisation** | Each user can only read or change the data needed for their job (**principle of least privilege**) |
| **Encryption** | Stolen or intercepted data cannot be read; **SSL/TLS (HTTPS)** protects data in transit |
| **Hashing passwords** | The database stores only a hash, so stolen password files do not reveal the passwords |
| **Firewall** | Blocks unauthorised network connections |
| **Software updates / patches** | Close the vulnerabilities that crackers exploit |
| **Logs and audit trails** | Record who accessed what and when, so misuse is detected |
| **Blocking access from certain locations / IP addresses** | Only allows log-in from trusted networks or countries |
| **User training** | Staff recognise phishing and do not share passwords |
| **Physical security** | Locked server rooms, screen locks when staff leave their desks |
:::

:::svg Two-factor authentication: a stolen password alone is not enough
<svg class="isp" viewBox="0 0 760 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The user enters a password and then a one-time code from their phone; both must be correct before access is given">
  <style>
    svg.isp .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.isp .f1{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.isp .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.isp .no{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.isp .tt{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.isp .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.isp .ln{stroke:var(--muted);stroke-width:2;fill:none}
    svg.isp .ah{fill:var(--muted)}
  </style>
  <rect class="bx" x="10" y="60" width="110" height="60" rx="10"/><text class="tt" x="65" y="95" text-anchor="middle">User</text>
  <path class="ln" d="M120,90 H150"/><path class="ah" d="M150,84 l12,6 l-12,6 z"/>
  <rect class="f1" x="164" y="40" width="170" height="100" rx="10"/>
  <text class="tt" x="249" y="66" text-anchor="middle">Factor 1</text>
  <text class="ss" x="249" y="88" text-anchor="middle">something you KNOW</text>
  <text class="ss" x="249" y="108" text-anchor="middle">password ••••••••</text>
  <path class="ln" d="M334,90 H364"/><path class="ah" d="M364,84 l12,6 l-12,6 z"/>
  <rect class="f1" x="378" y="40" width="170" height="100" rx="10"/>
  <text class="tt" x="463" y="66" text-anchor="middle">Factor 2</text>
  <text class="ss" x="463" y="88" text-anchor="middle">something you HAVE</text>
  <text class="ss" x="463" y="108" text-anchor="middle">code 482 913 on phone</text>
  <path class="ln" d="M548,90 H578"/><path class="ah" d="M578,84 l12,6 l-12,6 z"/>
  <rect class="ok" x="592" y="55" width="158" height="70" rx="10"/>
  <text class="tt" x="671" y="86" text-anchor="middle" style="fill:var(--success)">Access</text>
  <text class="tt" x="671" y="106" text-anchor="middle" style="fill:var(--success)">granted</text>
  <rect class="no" x="164" y="165" width="384" height="50" rx="10"/>
  <text class="tt" x="356" y="186" text-anchor="middle" style="fill:var(--danger)">Cracker with a stolen password</text>
  <text class="ss" x="356" y="204" text-anchor="middle">has factor 1 but not the phone → access refused</text>
</svg>
:::

:::svg Hashing: the database never stores the real password
<svg class="isp" viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A password goes through a one-way hash function; only the hash is stored; at login the hash of the typed password is compared">
  <style>
    svg.isp .bx{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.isp .fn{fill:var(--warning);fill-opacity:.15;stroke:var(--warning);stroke-width:2}
    svg.isp .db{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.isp .tt{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.isp .mo{font:12px ui-monospace,monospace;fill:var(--foreground)}
    svg.isp .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.isp .ln{stroke:var(--muted);stroke-width:2;fill:none}
    svg.isp .ah{fill:var(--muted)}
  </style>
  <rect class="bx" x="10" y="40" width="170" height="60" rx="10"/>
  <text class="tt" x="95" y="64" text-anchor="middle">Password typed</text>
  <text class="mo" x="95" y="86" text-anchor="middle">Almaty2026!</text>
  <path class="ln" d="M180,70 H215"/><path class="ah" d="M215,64 l12,6 l-12,6 z"/>
  <rect class="fn" x="229" y="35" width="170" height="70" rx="35"/>
  <text class="tt" x="314" y="66" text-anchor="middle">Hash function</text>
  <text class="ss" x="314" y="86" text-anchor="middle">one-way</text>
  <path class="ln" d="M399,70 H434"/><path class="ah" d="M434,64 l12,6 l-12,6 z"/>
  <rect class="db" x="448" y="30" width="302" height="80" rx="10"/>
  <text class="tt" x="599" y="56" text-anchor="middle">Users table stores only</text>
  <text class="mo" x="599" y="80" text-anchor="middle">9f2c…a71e (hash)</text>
  <text class="ss" x="599" y="100" text-anchor="middle">cannot be turned back into the password</text>
  <text class="tt" x="10" y="150">At login:</text>
  <text class="ss" x="10" y="172">the typed password is hashed again and the two hashes are compared — equal hashes → correct password.</text>
  <text class="ss" x="10" y="194">If crackers steal the Users table they get hashes, not passwords.</text>
</svg>
:::

:::compare Authentication vs authorisation
| | Authentication | Authorisation |
|---|---|---|
| Question | **Who are you?** | **What are you allowed to do?** |
| How | Password, biometrics, 2FA, smart card | Access rights: read, write, delete, execute |
| Example | A teacher logs in with a password and code | The teacher can edit marks, a pupil can only view their own |
:::

:::compare Encryption vs hashing
| | Encryption | Hashing |
|---|---|---|
| Direction | **Two-way** — can be decrypted with the key | **One-way** — cannot be reversed |
| Used for | Data that must be read again: files, messages, data in transit (HTTPS) | Checking passwords without storing them |
| If stolen | Unreadable without the key | Attacker gets hashes, not the passwords |
:::

:::steps How to protect a school database against cracking
- **Authenticate** every user: strong passwords plus **two-factor authentication** for staff.
- **Limit login attempts** and lock accounts after repeated failures.
- **Authorise** carefully: pupils read only their own marks, teachers edit only their classes (least privilege).
- **Encrypt** data in transit (HTTPS / SSL-TLS) and stored data; **hash** passwords.
- Keep software **updated**, use a **firewall**, and keep **logs** of who accessed what.
- **Train** staff to recognise phishing.
:::

:::warning Common mistakes
- Mixing up **authentication** (who you are) and **authorisation** (what you can do).
- Saying encryption **stops** data being stolen — it stops stolen data being **read**.
- Writing "use a password" — exam answers need the **feature** (complexity, 2FA, lockout) and **how it helps**.
- Saying a firewall removes viruses — a firewall **filters network traffic**.
:::

# Exam practice: cracking and protection
@lo 12.1.3.1 12.1.2.3

:::example Exam-style answers
**Q: Define the term cracking. [1]**
Gaining unauthorised access to a computer system or data, usually with malicious intent / to cause harm or for gain (1).

**Q: The school database is always at risk of system cracking. Describe two ways to protect it. [4]**
Two-factor authentication (1): a code from the user's phone is needed as well as the password, so a stolen password alone does not give access (1). Limit login attempts (1): the account is locked after a few wrong passwords, which stops brute-force attacks (1). *(Also: complex passwords, SSL/TLS, encryption, hashing, access rights.)*

**Q: Give two measures that a company can take to protect confidential data from being stolen. [2]**
Encrypting data (1); granting limited access rights (1). *(Also: blocking access from certain locations, keeping logs of user entries.)*

**Q: Analyse one ethical problem that arises when a hacker cracks a hospital system. [2]**
Patients' confidential medical records may be exposed or sold, violating their privacy (1), which can lead to discrimination or blackmail / treatment may be delayed, putting lives at risk (1).

**Q: Explain the difference between authentication and authorisation. [2]**
Authentication checks who the user is, e.g. password or fingerprint (1); authorisation decides what that user may access or do, e.g. read-only rights (1).
:::

:::warning Common mistakes in answers
- Listing measures without saying **how** each one protects the data (the second mark).
- Giving a consequence that is not **ethical** when asked for an ethical problem — talk about privacy, harm, trust.
- Writing "hackers are bad" — name the **type** of hacker and what makes the action illegal (no permission).
:::

:::steps Check yourself
- Define cracking, unauthorised access and vulnerability.
- Compare black-hat, white-hat and grey-hat hackers.
- Name five cracking methods and a countermeasure for each.
- Analyse one ethical and one legal problem caused by cracking a hospital or bank.
- Explain authentication vs authorisation, and encryption vs hashing.
- Describe how 2FA and limiting login attempts protect an account.
:::

# Problems caused by malware
@lo 12.1.3.2

:::definition Malware (malicious software)
Software designed to **damage, disrupt or gain unauthorised access** to a computer system or data.
:::

:::definition Payload
The **harmful action** that malware carries out once it is on a computer — deleting files, encrypting data, stealing passwords, opening a back door.
:::

:::compare Types of malware and their effects
| Type | How it spreads / works | Problems caused |
|---|---|---|
| **Virus** | Attaches to a program or file; spreads when the infected file is run or shared | Corrupts or deletes files, slows the computer |
| **Worm** | **Spreads by itself** across networks, without user action | Uses bandwidth, slows or crashes networks, carries other malware |
| **Trojan horse** | Disguised as **useful software**; the user installs it | Opens a **back door** for crackers, steals data |
| **Spyware / keylogger** | Secretly monitors the user | **Steals passwords**, bank details, browsing history |
| **Ransomware** | Encrypts the user's files | Demands **payment** for the key; data loss, downtime |
| **Adware** | Shows unwanted adverts | Annoying, slows the computer, may lead to dangerous sites |
| **Botnet bot** | Lets a criminal control many infected computers | Used for spam and **denial-of-service (DDoS)** attacks |
| **Rootkit** | Hides deep in the OS | Hides other malware, gives full control to the attacker |
:::

:::svg Virus, worm and Trojan horse spread in different ways
<svg class="isp" viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three panels: a virus needs a host file and a user, a worm copies itself across the network, a Trojan is installed by the user as fake useful software">
  <style>
    svg.isp .pn{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.isp .pc{fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.5}
    svg.isp .bd{fill:var(--danger-soft);stroke:var(--danger);stroke-width:1.5}
    svg.isp .tt{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.isp .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.isp .wl{stroke:var(--danger);stroke-width:2;fill:none}
    svg.isp .ahv{fill:var(--danger)}
  </style>
  <rect class="pn" x="10" y="10" width="240" height="250" rx="12"/>
  <text class="tt" x="130" y="36" text-anchor="middle">Virus</text>
  <rect class="bd" x="30" y="56" width="90" height="44" rx="6"/><text class="ss" x="75" y="83" text-anchor="middle" style="fill:var(--danger)">game.exe</text>
  <path class="wl" d="M120,78 H150"/><path class="ahv" d="M150,72 l10,6 l-10,6 z"/>
  <rect class="pc" x="160" y="56" width="74" height="44" rx="6"/><text class="ss" x="197" y="83" text-anchor="middle">USB</text>
  <text class="ss" x="30" y="130">attaches to a host file</text>
  <text class="ss" x="30" y="150">spreads only when a user</text>
  <text class="ss" x="30" y="170">runs or shares the file</text>
  <text class="ss" x="30" y="200" style="fill:var(--danger)">needs: host + user action</text>
  <rect class="pn" x="260" y="10" width="240" height="250" rx="12"/>
  <text class="tt" x="380" y="36" text-anchor="middle">Worm</text>
  <rect class="bd" x="280" y="56" width="60" height="36" rx="6"/>
  <rect class="bd" x="420" y="56" width="60" height="36" rx="6"/>
  <rect class="bd" x="350" y="110" width="60" height="36" rx="6"/>
  <path class="wl" d="M340,74 H418"/><path class="wl" d="M310,92 L350,126"/><path class="wl" d="M450,92 L410,126"/>
  <text class="ss" x="280" y="176">copies itself across the</text>
  <text class="ss" x="280" y="196">network by itself</text>
  <text class="ss" x="280" y="226" style="fill:var(--danger)">needs: no user action</text>
  <rect class="pn" x="510" y="10" width="240" height="250" rx="12"/>
  <text class="tt" x="630" y="36" text-anchor="middle">Trojan horse</text>
  <rect class="pc" x="540" y="56" width="180" height="44" rx="6"/><text class="ss" x="630" y="83" text-anchor="middle">"Free PDF converter"</text>
  <rect class="bd" x="580" y="112" width="100" height="30" rx="6"/><text class="ss" x="630" y="132" text-anchor="middle" style="fill:var(--danger)">back door</text>
  <text class="ss" x="530" y="176">looks useful; the user</text>
  <text class="ss" x="530" y="196">installs it willingly</text>
  <text class="ss" x="530" y="226" style="fill:var(--danger)">does not self-replicate</text>
</svg>
:::

:::cards
### Problems for individuals
- **Loss of data** (photos, documents) and money (ransom, stolen bank details).
- **Identity theft** and invasion of privacy.
- Slow or unusable computer; cost of repair.
### Problems for organisations and society
- **Downtime** — hospitals, airlines or factories stop working (e.g. the WannaCry ransomware attack on hospitals in 2017).
- **Financial loss** — ransom, recovery, lost business, fines for leaked data.
- **Reputation damage** and loss of customer trust.
- Attacks on **critical infrastructure**; spread of spam and fake news through botnets.
:::

:::svg A ransomware attack on a clinic — and the way out
<svg class="isp" viewBox="0 0 760 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Timeline: phishing e-mail, files encrypted, ransom demanded; recovery from an offline backup instead of paying">
  <style>
    svg.isp .st{fill:var(--danger-soft);stroke:var(--danger);stroke-width:2}
    svg.isp .ok{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.isp .wn{fill:var(--surface-2);stroke:var(--warning);stroke-width:2}
    svg.isp .tt{font:700 13px system-ui,sans-serif;fill:var(--foreground)}
    svg.isp .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.isp .ah{fill:var(--muted)}
    svg.isp .ln{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <rect class="st" x="10" y="30" width="165" height="74" rx="10"/><text class="tt" x="92" y="58" text-anchor="middle">1 Phishing e-mail</text><text class="ss" x="92" y="80" text-anchor="middle">"Invoice.zip" opened</text>
  <path class="ah" d="M180,61 l12,6 l-12,6 z"/>
  <rect class="st" x="197" y="30" width="165" height="74" rx="10"/><text class="tt" x="279" y="58" text-anchor="middle">2 Files encrypted</text><text class="ss" x="279" y="80" text-anchor="middle">patient records locked</text>
  <path class="ah" d="M367,61 l12,6 l-12,6 z"/>
  <rect class="st" x="384" y="30" width="165" height="74" rx="10"/><text class="tt" x="466" y="58" text-anchor="middle">3 Ransom note</text><text class="ss" x="466" y="80" text-anchor="middle">pay for the key</text>
  <path class="ah" d="M554,61 l12,6 l-12,6 z"/>
  <rect class="wn" x="571" y="30" width="179" height="74" rx="10"/><text class="tt" x="660" y="58" text-anchor="middle">4 Downtime</text><text class="ss" x="660" y="80" text-anchor="middle">appointments cancelled</text>
  <path class="ln" d="M466,104 V140 H250 V160"/><path class="ln" d="M466,140 H600 V160"/>
  <rect class="ok" x="130" y="160" width="250" height="66" rx="10"/><text class="tt" x="255" y="186" text-anchor="middle" style="fill:var(--success)">Restore from offline backup</text><text class="ss" x="255" y="208" text-anchor="middle">clean the system, data back</text>
  <rect class="st" x="480" y="160" width="250" height="66" rx="10"/><text class="tt" x="605" y="186" text-anchor="middle">Pay the ransom</text><text class="ss" x="605" y="208" text-anchor="middle">no guarantee; funds criminals</text>
</svg>
:::

:::example Analysing a malware problem — a clinic
*A clinic's receptionist opens an e-mail attachment. Overnight, ransomware encrypts every patient record and demands payment.*
- **Problem for the clinic:** **downtime** — appointments cancelled, staff cannot see medical histories; cost of recovery and possible **fines** if data leaked.
- **Problem for patients:** treatment **delayed**; their personal data may be **published** if the ransom is not paid (privacy).
- **Ethical problem:** paying the ransom **funds criminals** and encourages further attacks, but not paying may harm patients.
- **Prevention:** staff training on phishing, anti-malware with updated signatures, patches, limited user rights, **regular offline backups**.
:::

:::callout info Countermeasures
Anti-virus software with up-to-date signatures, firewalls, software updates, not opening unknown attachments or links, downloading only from trusted sources, limited user rights and **regular offline backups** (see **Data protection measures**).
:::

:::warning Common mistakes
- Confusing a **virus** (needs a host file and user action) with a **worm** (spreads on its own).
- Calling every piece of malware a "virus" — name the **type** that fits the scenario.
- Saying **anti-virus** blocks hackers or a **firewall** removes viruses.
- Listing problems without saying **who** is affected and **how**.
:::

# Privacy policies
@lo 12.1.3.3

:::definition Privacy policy
A **legal document** published by an organisation (on its website or app) that **explains what personal data it collects, why it collects it, how it is used, stored and protected, who it is shared with, and what rights the user has**.
:::

:::definition Personal data
Any information that **identifies a living person**, directly or indirectly — name, IIN, phone, address, photo, location, IP address.
:::

:::definition Consent
The user's **clear agreement** to the collection and use of their personal data for a stated purpose. It should be **informed** (the user knows what they agree to) and can be **withdrawn**.
:::

:::compare What a privacy policy contains
| Section | Explains |
|---|---|
| **Data collected** | Which personal data is collected: name, e-mail, phone, location, IP address, cookies, payment details |
| **Purpose** | **Why** the data is collected: providing the service, processing orders, improving the website, advertising |
| **Use and sharing** | Whether data is **shared with or sold to third parties** (advertisers, partners, government) |
| **Storage and security** | **How long** data is kept, **where** it is stored (country), how it is **protected** (encryption) |
| **Cookies** | Which cookies are used and how to switch them off |
| **User rights** | The right to **access, correct, delete** the data, to withdraw **consent**, to complain |
| **Children** | Special rules for users under a certain age |
| **Contact and changes** | Who to contact about data, and how users are told about changes to the policy |
:::

:::svg The life of personal data — what the privacy policy must explain at each step
<svg class="isp" viewBox="0 0 760 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Five steps: collect, use, share, store and protect, delete; each with the question the privacy policy answers">
  <style>
    svg.isp .sp{fill:var(--primary-soft);stroke:var(--primary);stroke-width:2}
    svg.isp .ur{fill:var(--success-soft);stroke:var(--success);stroke-width:2}
    svg.isp .tt{font:700 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.isp .ss{font:12px system-ui,sans-serif;fill:var(--muted)}
    svg.isp .ah{fill:var(--muted)}
  </style>
  <rect class="sp" x="10" y="30" width="134" height="90" rx="10"/><text class="tt" x="77" y="58" text-anchor="middle">Collect</text><text class="ss" x="77" y="82" text-anchor="middle">what data?</text><text class="ss" x="77" y="100" text-anchor="middle">with consent?</text>
  <path class="ah" d="M148,69 l10,6 l-10,6 z"/>
  <rect class="sp" x="162" y="30" width="134" height="90" rx="10"/><text class="tt" x="229" y="58" text-anchor="middle">Use</text><text class="ss" x="229" y="82" text-anchor="middle">for what</text><text class="ss" x="229" y="100" text-anchor="middle">purpose?</text>
  <path class="ah" d="M300,69 l10,6 l-10,6 z"/>
  <rect class="sp" x="314" y="30" width="134" height="90" rx="10"/><text class="tt" x="381" y="58" text-anchor="middle">Share</text><text class="ss" x="381" y="82" text-anchor="middle">with which</text><text class="ss" x="381" y="100" text-anchor="middle">third parties?</text>
  <path class="ah" d="M452,69 l10,6 l-10,6 z"/>
  <rect class="sp" x="466" y="30" width="134" height="90" rx="10"/><text class="tt" x="533" y="58" text-anchor="middle">Store</text><text class="ss" x="533" y="82" text-anchor="middle">where, how long,</text><text class="ss" x="533" y="100" text-anchor="middle">how protected?</text>
  <path class="ah" d="M604,69 l10,6 l-10,6 z"/>
  <rect class="sp" x="618" y="30" width="132" height="90" rx="10"/><text class="tt" x="684" y="58" text-anchor="middle">Delete</text><text class="ss" x="684" y="82" text-anchor="middle">when and</text><text class="ss" x="684" y="100" text-anchor="middle">on request?</text>
  <rect class="ur" x="10" y="145" width="740" height="50" rx="10"/>
  <text class="tt" x="380" y="167" text-anchor="middle" style="fill:var(--success)">User rights at every step</text>
  <text class="ss" x="380" y="186" text-anchor="middle">access · correct · delete · withdraw consent · complain — and who to contact</text>
</svg>
:::

:::cards
### Why privacy policies are needed
- **Laws require them** — e.g. the Kazakhstan Law on Personal Data and its Protection, the EU GDPR.
- Users can make an **informed decision** before giving their data (**consent**).
- They make organisations **accountable** for how they use data.
- They build **trust** between users and the organisation.
### Problems with privacy policies
- Often **very long and written in legal language**, so most people do not read them.
- Users must often accept them to use the service ("take it or leave it").
- Policies can **change**, and data already given may be used in new ways.
- A policy does not guarantee the data is actually secure.
:::

:::example Reading a privacy policy (exam style)
An app's policy says: *"We collect your location to show nearby shops. We share anonymised location data with advertising partners. Data is kept for 12 months. You can delete your account at any time."*
- **Data collected:** location.
- **Purpose:** to show nearby shops.
- **Sharing:** anonymised data given to advertisers.
- **Storage period:** 12 months.
- **User right:** to delete the account.
:::

:::steps How to evaluate a privacy policy before you sign up
- Find **what data** is collected — is it more than the service needs?
- Find the **purpose** — is every item of data really needed for it?
- Check **sharing** — is data sold to advertisers or sent abroad?
- Check **storage** — how long, where, and is it encrypted?
- Check your **rights** — can you see, correct and delete your data and withdraw consent?
:::

:::warning Common mistakes
- Describing a privacy policy as "a policy about privacy" — say **what it contains**.
- Thinking a privacy policy **protects** data by itself — it **explains** how data is handled; security measures protect it.
- Forgetting **user rights** and **sharing with third parties** — the two items examiners look for most.
:::

# Exam practice and summary
@lo 12.1.3.2 12.1.3.3

:::example Exam-style answers
**Q: Explain the difference between a virus and a worm. [2]**
A virus attaches to a host file and spreads only when the user runs or shares the file (1); a worm is standalone and copies itself across a network without any user action (1).

**Q: A company's computers are infected with ransomware. Analyse two problems this causes for the company. [4]**
Files are encrypted so staff cannot work / downtime (1), so orders are lost and customers go elsewhere (1). The company may pay a ransom or recovery costs (1), and if customer data is leaked it may be fined and lose its reputation (1).

**Q: Describe how a Trojan horse gets onto a computer. [2]**
It is disguised as useful / legitimate software (1), so the user downloads and installs it themselves (1).

**Q: Explain the purpose of a privacy policy. [2]**
It tells users what personal data is collected and how it is used, stored and shared (1), so that they can give informed consent and know their rights (1).

**Q: State three items of information that a privacy policy should contain. [3]**
Any three: data collected; purpose; sharing with third parties; how long it is stored; how it is protected; cookies; user rights; contact details.
:::

:::warning Common mistakes
- Saying a **firewall** removes viruses, or that **anti-virus** blocks hackers — say what each one actually does.
- Confusing a **virus** (needs a host file and user action) with a **worm** (spreads on its own).
- Describing a privacy policy as "a policy about privacy" — say **what it contains**.
- Giving consequences without **analysing** them: *who* is harmed and *how*.
:::

:::steps Check yourself
- Define malware and payload.
- Describe virus, worm, Trojan, spyware, ransomware, adware, botnet and rootkit, and the problems each causes.
- Analyse the problems a ransomware attack causes for a hospital and its patients.
- Give five countermeasures against malware.
- Define privacy policy, personal data and consent.
- List six things a privacy policy should explain, and two problems with privacy policies.
:::
