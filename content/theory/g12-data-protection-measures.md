---
summary: Measures that protect data and computer systems — protection against physical risks, firewalls (inter-network screens), encryption, biometrics and anti-virus countermeasures — and using data backup and disk mirroring (RAID 1) to keep data safe.
---
# Threats and protection measures
@lo 12.1.2.1

Data and computer systems are at risk from **people** (hackers, thieves, careless users), **malicious software** and **physical events** (fire, flood, power cuts, hardware failure). No single measure protects against everything, so organisations use **several layers of protection** ("defence in depth").

## Types of threats

:::compare Common threats to data
| Threat | What happens | Example |
|---|---|---|
| **Hacking** | Someone gains **unauthorised access** to a computer or network | A pupil guesses the teacher's password and changes marks |
| **Malware** | Malicious software (virus, worm, Trojan, spyware, ransomware) damages, steals or locks data | Ransomware encrypts the school's files and demands payment |
| **Phishing** | Fake e-mails or websites trick users into giving passwords or bank details | An e-mail "from the bank" asks the user to "confirm" their card number |
| **Pharming** | Malicious code redirects the user from a real website to a fake one | Typing the bank's address opens a copy of the site that records the password |
| **Interception (eavesdropping)** | Data is read or changed while it travels over a network | A hacker on public Wi-Fi reads unencrypted messages |
| **Denial of service (DoS)** | A server is flooded with requests until it cannot answer real users | The school website stops working on the day of exam results |
| **Social engineering** | People are manipulated into breaking security rules | A caller pretends to be IT support and asks for a password |
| **Human error** | Data is lost or leaked by mistake | A teacher deletes a folder or e-mails pupils' data to the wrong address |
| **Physical threats** | Hardware or storage media is damaged or stolen | A fire in the server room; a laptop stolen from a car |
:::

:::cards
### Internal and external threats
**External** threats come from outside the organisation: hackers, malware from the Internet, thieves. **Internal** threats come from people **inside**: employees who misuse their access, careless users, a disgruntled worker. A firewall stops many external attacks but not internal ones — those need **access rights** and an **audit trail**.
### Accidental and deliberate threats
**Accidental:** deleting a file, spilling coffee on a laptop, a power cut, a failed disk. **Deliberate:** hacking, malware, theft, sabotage. Backups and UPSs protect against accidents; firewalls, passwords and encryption protect mostly against deliberate attacks.
:::

:::compare Threats and the measures that protect against them
| Threat | Main protection measures |
|---|---|
| Fire, flood, power cut, theft of hardware | **Physical security**, UPS, fire-suppression systems, **backup** stored off-site |
| Hard disk failure | **Disk mirroring (RAID)**, **backup** |
| Hacking / unauthorised network access | **Firewall**, strong passwords, **two-factor authentication**, access rights |
| Interception of data in transit, stolen laptops | **Encryption** |
| Someone using another person's account | **Biometrics**, two-factor authentication |
| Viruses, worms, Trojans, ransomware | **Anti-virus** software, updates, user training, backup |
| Phishing, social engineering | **User training**, e-mail filters, two-factor authentication |
| Accidental deletion | **Backup**, access rights, version history |
:::

## What we are protecting: confidentiality, integrity, availability

:::cards
### Confidentiality
Only **authorised** people can **read** the data. Broken when a hacker reads pupils' marks or a laptop with customers' data is stolen. Protected by **access rights, passwords, encryption**.
### Integrity
The data is **correct and complete** and is changed only by authorised people. Broken when a virus corrupts files or a pupil changes marks. Protected by **access rights, validation, anti-virus, backups, hashes and digital signatures**.
### Availability
The data and the system can be **used when they are needed**. Broken by a power cut, a failed disk, a DoS attack or ransomware. Protected by **UPS, disk mirroring, backups, firewalls**.
:::

:::example Layers of protection for a school server
1. **Physical:** the server is in a locked, air-conditioned room with a UPS.
2. **Network:** a firewall between the school network and the Internet.
3. **Access:** every user has their own account, a strong password and only the rights they need.
4. **Data:** sensitive data is encrypted; anti-virus scans every file.
5. **Recovery:** disks are mirrored and a backup is made every night and kept off-site.

If one layer fails — for example a teacher's password is stolen — the other layers still protect the data.
:::

:::tip
In the exam, always **link the measure to the threat** in the scenario: not just "use a firewall", but "a firewall blocks unauthorised connections from the Internet to the school's server".
:::

# Protection against physical risks
@lo 12.1.2.1

:::compare Physical risks and countermeasures
| Physical risk | Countermeasures |
|---|---|
| **Theft** of computers or storage devices | Locked server rooms, security guards, CCTV, cable locks, entry by key card or biometrics, visitor logs |
| **Fire** | Smoke detectors, gas-based fire-suppression systems (no water near computers), fireproof safes for backups |
| **Flood / water damage** | Servers not in basements, raised floors, water sensors |
| **Power cut / power surge** | **Uninterruptible power supply (UPS)**, surge protectors, back-up generators |
| **Overheating** | Air conditioning, temperature monitoring in server rooms |
| **Hardware failure** | Disk mirroring (RAID), spare parts, regular maintenance |
| **Accidental damage** (spilled drinks, dropped laptops) | No food or drink near computers, protective cases, user training |
:::

## Controlling physical access

:::cards
### Keeping people out
- **Locks** on server rooms and network cabinets; keys only for IT staff.
- **Key cards** (RFID / smart cards) or **PIN pads** on doors — each entry is logged.
- **Biometric** door locks (fingerprint, face) — a card can be lent, a finger cannot.
- **Security guards**, reception desk and a **visitor log**; visitors are accompanied.
### Watching and recording
- **CCTV** cameras deter thieves and record who entered.
- **Alarms** and motion sensors outside working hours.
- **Door logs** from key cards show who was in the room and when.
### Protecting the devices themselves
- **Cable locks** for laptops and PCs in classrooms.
- Laptops and USB drives **encrypted**, so a stolen device does not expose data.
- Old disks **securely wiped or shredded** before they are thrown away.
:::

:::definition Uninterruptible power supply (UPS)
A device with a **battery** that keeps computers running for a short time when the mains power fails, so that work can be **saved** and the system **shut down safely** (or a generator started).
:::

:::steps What happens in a power cut
- The mains power fails — the **UPS battery** takes over at once, so the server does not switch off.
- The UPS tells the server that it is running on battery.
- Users have a few minutes to **save** their work; the server **shuts down safely** if the power does not return (or a **generator** starts).
- Without a UPS, files being written could be **corrupted** and unsaved work **lost**.
:::

:::definition Surge protector
A device that stops a sudden **spike in voltage** (for example from lightning) from reaching and damaging the computer. Unlike a UPS, it does **not** keep the computer running when the power fails.
:::

:::compare UPS, surge protector and generator
| | UPS | Surge protector | Back-up generator |
|---|---|---|---|
| Protects against | Power cut, short dips in voltage | Voltage spikes (lightning, faults) | Long power cuts |
| How long | Minutes (battery) | — | Hours or days (fuel) |
| Starts | **Instantly** — no break in power | Always on | After a few seconds, so a UPS is needed until it starts |
| Typical use | Servers, network equipment | Every PC, printer, TV | Hospitals, data centres |
:::

:::warning
Water must never be used to put out a fire in a server room: it damages the equipment and can cause electric shocks. Server rooms use **gas-based** fire suppression (e.g. CO₂ or inert gas), which removes oxygen without harming the hardware.
:::

:::example Protecting a school's server room — a model answer
- The room is **locked** and opened only with IT staff **key cards**; entries are **logged** and watched by **CCTV** (theft, unauthorised access).
- A **UPS** keeps the servers running in a power cut so they can shut down safely; **surge protectors** stop voltage spikes (power).
- **Air conditioning** and temperature sensors prevent overheating.
- **Smoke detectors** and **gas fire suppression**; backups are kept in a **fireproof safe or off-site** (fire).
- Servers are on **racks above the floor**, not in the basement (flood).
:::

# Firewalls (inter-network screens)
@lo 12.1.2.1

:::definition Firewall
Hardware or software that **monitors all data packets passing between a private network (or computer) and the outside network (Internet)** and **allows or blocks** them according to a set of **security rules**. It is the "screen" between two networks.
:::

:::mermaid A firewall sits between the internal network and the Internet
flowchart TB
  I[Internet] <--> F{Firewall: check each packet against the rules}
  F <--> N[School network: servers and PCs]
  F -. blocked .-> X[Unauthorised connection]
:::

:::cards
### What a firewall does
- Checks the **source and destination IP address**, **port number** and protocol of every packet.
- **Blocks** packets that do not match the rules (e.g. connections to unused ports, known bad addresses).
- Checks traffic in **both directions**: **inbound** (from the Internet) and **outbound** (e.g. stops spyware sending data out).
- Can **block access** to certain websites or applications.
- **Logs** attempts to connect, so attacks can be investigated.
- Can hide the internal addresses of the network from outsiders.
### Limitations
- Cannot stop malware that arrives through **allowed** channels (e-mail attachments, USB sticks).
- Does not protect against **insiders** already inside the network.
- Does not stop **phishing** — the user opens the fake page through allowed web traffic.
- Must be **configured correctly** — bad rules either block useful traffic or let attacks through.
:::

## How a firewall decides

:::compare Three ways a firewall can check traffic
| Method | What it checks | Strength | Weakness |
|---|---|---|---|
| **Packet filtering** | Each packet on its own: IP addresses, port, protocol | Fast and simple | Does not look inside the data; can be fooled by faked addresses |
| **Stateful inspection** | Also remembers open connections and lets in only replies to requests made from inside | Blocks packets that do not belong to any connection | Needs more memory and processing |
| **Proxy (application-level) firewall** | Stands between users and the Internet, receives the request and fetches the page itself; can check the **content** | Hides internal computers; can block websites, files and viruses in web traffic | Slower; each application needs its own rules |
:::

:::steps Rules are checked from the top
- A packet arrives at the firewall.
- The firewall compares it with **rule 1**, then rule 2, and so on.
- The **first rule that matches** decides: the packet is allowed or blocked; later rules are not checked.
- The **last rule** usually blocks everything that no rule allowed — "**deny by default**".
:::

## Types of firewall

:::compare Hardware and software firewalls
| | Hardware (network) firewall | Software (personal / host) firewall |
|---|---|---|
| Where | A separate device (often in the router) between the network and the Internet | A program on each computer, e.g. Windows Defender Firewall |
| Protects | **The whole network** | **One computer** |
| Can control | Traffic in and out of the network | Which **programs** on that computer may use the network |
| Typical user | Schools, companies | Home users, laptops used on public Wi-Fi |
:::

:::example Firewall rules for a school web server
| Rule | Port / service | Source | Action |
|---|---|---|---|
| 1 | 443 (HTTPS — the school website) | Any | **Allow** |
| 2 | 22 (SSH — remote administration) | Only the IT office's IP address | **Allow** |
| 3 | 3306 (MySQL database) | Any address outside the school | **Block** |
| 4 | Everything else | Any | **Block** |

A visitor opening the website is allowed (rule 1). A hacker trying to log in to the database from outside is blocked (rule 3). The last rule blocks everything that is not allowed — "deny by default".
:::

:::widget firewall_rules Test the school firewall
:::

:::warning
A firewall is **not** anti-virus software. It decides which connections may pass; it does not scan files for viruses. A school needs **both**.
:::

# Encryption
@lo 12.1.2.1

:::definition Encryption
Converting data (**plaintext**) into an unreadable form (**ciphertext**) using an **algorithm** and a **key**, so that only someone with the correct key can **decrypt** it and read it. Encryption does **not** stop data being stolen, but makes stolen data **useless** to the thief.
:::

:::mermaid Encrypting and decrypting a message
flowchart TB
  P[Plaintext: Exam on Monday] -->|encrypt with key| C[Ciphertext: Q8#k2!zP...]
  C -->|send over the Internet| C2[Ciphertext received]
  C2 -->|decrypt with key| P2[Plaintext: Exam on Monday]
:::

:::cards
### Plaintext and ciphertext
**Plaintext** is the original, readable data. **Ciphertext** is the scrambled result of encryption.
### Algorithm (cipher)
The **method** used to encrypt, e.g. "shift every letter" or AES. Algorithms are usually **public**; the security comes from the key.
### Key
A **secret value** (a number or string of bits) used by the algorithm. Different keys give different ciphertext from the same plaintext.
### Key length
The number of **bits** in the key. Each extra bit **doubles** the number of possible keys, so longer keys are much harder to break by **brute force** (trying every key).
:::

## Key length and brute force

:::compare How many keys an attacker must try
| Cipher | Key length | Possible keys | Time to try them all at 10¹² keys per second |
|---|---|---|---|
| Caesar cipher | — | 25 | Instantly |
| DES (1977) | 56 bits | 2⁵⁶ ≈ 7.2 × 10¹⁶ | About 20 hours — DES is **no longer safe** |
| AES-128 | 128 bits | 2¹²⁸ ≈ 3.4 × 10³⁸ | About 10¹⁹ years |
| AES-256 | 256 bits | 2²⁵⁶ ≈ 1.2 × 10⁷⁷ | Far longer than the age of the universe |
:::

## Encryption at rest and in transit

:::compare Where the data is when it is encrypted
| | Data at rest | Data in transit |
|---|---|---|
| Meaning | Data **stored** on a disk, USB drive, phone or server | Data **travelling** over a network |
| Threat | Theft or loss of the device | **Interception** (eavesdropping) on the network |
| Examples | Full-disk encryption (BitLocker, FileVault), encrypted USB drives, encrypted databases | HTTPS (TLS), WPA2 / WPA3 Wi-Fi, VPN, end-to-end encrypted messaging |
:::

:::definition End-to-end encryption
The message is encrypted on the **sender's device** and decrypted only on the **receiver's device**. Even the company that runs the service (e.g. a messaging app) cannot read it on its servers.
:::

:::cards
### Where encryption is used
- **HTTPS / SSL / TLS** — web pages, online banking, payments.
- **Full-disk encryption** on laptops and phones, encrypted USB drives.
- **Wi-Fi** (WPA2 / WPA3) and **VPNs** for working from home.
- Messaging apps with **end-to-end** encryption.
- Storing **passwords** as hashes (one-way) rather than plain text.
### Advantages and disadvantages
- ✔ Stolen or intercepted data cannot be read.
- ✔ Protects data on lost devices.
- ✔ Helps an organisation follow data-protection laws.
- ✘ If the **key is lost**, the data is lost too.
- ✘ Takes processing time; does not stop deletion or ransomware.
- ✘ Criminals use it too — ransomware **encrypts** the victim's files.
:::

## A simple cipher: the Caesar cipher

The oldest ciphers are **substitution ciphers** (each letter is replaced by another) and **transposition ciphers** (the letters stay the same but their **order** is changed, e.g. writing the message in rows and reading it in columns). The Caesar cipher is a substitution cipher.

:::example Shift each letter 3 places forward
| Plain | A | B | C | … | X | Y | Z |
|---|---|---|---|---|---|---|---|
| Cipher | D | E | F | … | A | B | C |

`CAT` → `FDW`; `HELLO` → `KHOOR`. The **algorithm** is "shift the letters"; the **key** is **3**. To decrypt, shift back by 3. With only 25 possible keys it is broken in seconds by trying all of them (**brute force**) — real encryption uses keys with billions of billions of possibilities.
:::

:::widget caesar_cipher Encrypt, decrypt and break a Caesar cipher
:::

# Symmetric and asymmetric encryption
@lo 12.1.2.1

There are two main **types of encryption**, which differ in **how many keys** are used and **who holds them**.

## Symmetric encryption

:::definition Symmetric encryption
Encryption in which the **same secret key** is used to **encrypt and decrypt** the data. The sender and the receiver must both have this key, and it must be kept secret.
:::

:::steps Sending a message with symmetric encryption
- Alice and Bob agree on **one secret key** in advance.
- Alice encrypts the message with the key and sends the ciphertext.
- Anyone who intercepts the ciphertext cannot read it without the key.
- Bob decrypts it with **the same key**.
:::

:::mermaid Symmetric: one shared key
flowchart LR
  A[Alice: plaintext] -->|encrypt with the shared key| C[Ciphertext]
  C -->|decrypt with the same key| B[Bob: plaintext]
:::

:::cards
### Algorithms
- **AES** (Advanced Encryption Standard) — today's standard, 128-, 192- or 256-bit keys.
- **DES** — older, 56-bit key, now broken by brute force; **3DES** applies it three times.
### Advantages
- **Fast** — suitable for large amounts of data (whole disks, video calls).
- Uses short keys for the same security.
### Disadvantages
- **Key distribution problem:** the key has to reach the receiver **securely** — if it is sent by e-mail and intercepted, all messages can be read.
- Each pair of people needs its own key: 100 people need **4 950** different keys (n(n − 1) / 2).
### Typical uses
Encrypting hard disks and USB drives (BitLocker), files and databases, Wi-Fi (WPA2 / WPA3), the data part of an HTTPS connection.
:::

## Asymmetric (public-key) encryption

:::definition Asymmetric encryption
Encryption that uses a **pair of keys**: a **public key**, which anyone may have and which is used to **encrypt**, and a **private key**, which only the owner keeps and which is used to **decrypt**. Data encrypted with the public key can be decrypted **only** with the matching private key.
:::

:::steps Sending a message with asymmetric encryption
- Bob creates a **key pair** and publishes his **public key**; he keeps the **private key** secret.
- Alice encrypts her message with **Bob's public key**.
- Even Alice — and any hacker who has the public key — **cannot** decrypt the ciphertext.
- Only Bob can decrypt it, with **his private key**.
:::

:::mermaid Asymmetric: the receiver's key pair
flowchart LR
  A[Alice: plaintext] -->|encrypt with Bob's PUBLIC key| C[Ciphertext]
  C -->|decrypt with Bob's PRIVATE key| B[Bob: plaintext]
:::

:::cards
### Algorithms
- **RSA** — keys of 2048 bits or more; based on how hard it is to find the two prime factors of a very large number.
- **ECC** (elliptic-curve cryptography) — the same security with shorter keys; used on phones.
### Advantages
- **Solves the key distribution problem:** the public key can be sent openly; the private key never leaves its owner.
- 100 people need only **100 key pairs**.
- Makes **digital signatures** possible.
### Disadvantages
- Much **slower** than symmetric encryption — not used for large files.
- Needs very long keys; if the private key is stolen, the security is lost.
### Typical uses
Exchanging keys in **HTTPS**, secure e-mail, **digital signatures** and **digital certificates**, SSH logins, cryptocurrency wallets.
:::

:::compare Symmetric and asymmetric encryption
| | Symmetric | Asymmetric (public-key) |
|---|---|---|
| Keys | **One** shared secret key | A **pair**: public key and private key |
| Encrypt with | The secret key | The **receiver's public** key |
| Decrypt with | The **same** secret key | The **receiver's private** key |
| Speed | **Fast** | **Slower** |
| Typical key length | 128–256 bits (AES) | 2048–4096 bits (RSA) |
| Key sharing | The key must be shared **securely** in advance | The public key can be given to **anyone** |
| Example algorithms | AES, DES, 3DES | RSA, ECC |
| Example use | Encrypting a hard disk, files, Wi-Fi | HTTPS key exchange, secure e-mail, digital signatures |
:::

:::widget encryption_keys Try symmetric, asymmetric and hashing
:::

## Digital signatures and certificates

:::definition Digital signature
Data attached to a message or file to prove **who sent it** (authentication) and that it **has not been changed** (integrity). The sender creates it with their **private key**; anyone can check it with the sender's **public key**.
:::

:::steps Signing and checking a document
- The sender calculates a **hash** of the document.
- The hash is encrypted with the **sender's private key** — this is the digital signature.
- The receiver decrypts the signature with the **sender's public key** and calculates the hash of the document again.
- If the two hashes are the same, the document really came from the sender and was **not changed** on the way.
:::

:::definition Digital certificate
An electronic document issued by a trusted **certificate authority (CA)** that links a **public key** to its owner (e.g. a website's domain name). The browser checks the certificate before trusting the website's public key — this is what the **padlock** in the address bar shows.
:::

:::warning
The keys are used **the other way round** for the two jobs. For **secrecy**, encrypt with the **receiver's public key** (only the receiver's private key decrypts). For a **signature**, sign with the **sender's private key** (anyone checks it with the sender's public key). The padlock means the connection is encrypted — **not** that the website is honest.
:::

## Hashing — one-way, not encryption

:::definition Hashing
A **hash function** turns any data into a **fixed-length** value (the hash, or digest). It uses **no key** and is **one-way**: the original data cannot be worked out from the hash. A tiny change in the data gives a completely different hash. Examples: **SHA-256**, SHA-3 (MD5 is old and unsafe).
:::

:::compare Encryption and hashing
| | Encryption | Hashing |
|---|---|---|
| Can it be reversed? | **Yes** — decrypt with the key | **No** — one-way |
| Key | Needed | Not used |
| Output length | About the same as the data | Always the same (e.g. 256 bits for SHA-256) |
| Used for | Keeping data **secret** | Storing **passwords**, checking **integrity** (files not changed), digital signatures |
:::

:::steps How a website checks a password without storing it
- At sign-up, the website stores only the **hash** of the password.
- At login, it hashes the password the user types.
- If the two hashes match, the password is correct.
- If hackers steal the database, they get only hashes — not the passwords.
:::

## Using both: how HTTPS works

:::steps How HTTPS uses both kinds of encryption
- The browser connects to `https://` and receives the website's **public key** in its **digital certificate**; it checks the certificate.
- The browser creates a random **session key** and sends it **encrypted with the website's public key** — only the website's **private key** can decrypt it (**asymmetric**).
- From then on, all data is encrypted with the fast **symmetric** session key (e.g. AES).
- Result: the key is shared safely **and** the data travels quickly.
:::

:::tip
"Explain why HTTPS uses both" is a common question: **asymmetric** solves the problem of **sharing the key** safely; **symmetric** is used for the data because it is **faster**.
:::

# Exam practice: threats, firewalls and encryption
@lo 12.1.2.1

:::example Exam-style answers
**Q: State one threat that a firewall cannot protect against. [1]**
Malware in an e-mail attachment or on a USB stick / an insider already in the network / phishing / weak passwords.

**Q: Explain how encryption protects pupils' marks if a teacher's laptop is stolen. [2]**
The data is stored as **ciphertext** (1); the thief cannot read it without the **key / password** (1).

**Q: Explain why a server is connected to a UPS. [2]**
If the power fails, the UPS **battery keeps the server running** (1) so data can be saved and the server **shut down safely** — no corruption or data loss (1).

**Q: Describe how a firewall uses packet filtering. [2]**
It checks each packet's **IP address / port number / protocol** against a list of **rules** (1); packets that are not allowed by the rules are **blocked** (1).

**Q: Describe two differences between symmetric and asymmetric encryption. [2]**
Symmetric uses **one shared key** to encrypt and decrypt; asymmetric uses a **public key** to encrypt and a **private key** to decrypt (1). Symmetric is **faster** / asymmetric does not need the key to be shared secretly (1).

**Q: Alice wants to send Bob a confidential message using asymmetric encryption. Describe how the keys are used. [3]**
Alice encrypts the message with **Bob's public key** (1); the ciphertext is sent (1); only **Bob's private key** can decrypt it, so only Bob can read it (1).

**Q: Explain why passwords are stored as hashes. [2]**
A hash is **one-way** / cannot be turned back into the password (1), so if the database is stolen the hackers do not get the passwords (1).

**Q: State three measures that protect a server room against theft. [3]**
Locked door with key cards / biometric lock (1); CCTV / alarms (1); security guard / visitor log / cable locks (1).
:::

# Biometrics
@lo 12.1.2.1

:::definition Biometrics
Authentication using **unique physical or behavioural characteristics** of a person, which are compared with a stored **template**. Examples: **fingerprint**, **face recognition**, **iris / retina scan**, **voice recognition**, **hand geometry**, **signature dynamics**.
:::

:::steps How biometric authentication works
- **Enrolment:** the user's fingerprint (face, iris…) is scanned several times; the important features are turned into a **template** and stored — the image itself is usually not kept.
- **Log-in:** a new scan is made and turned into features in the same way.
- **Matching:** the new features are **compared** with the template and a **similarity score** is calculated.
- **Decision:** if the score is above a **threshold**, access is allowed; otherwise it is refused.
:::

:::compare False rejection and false acceptance
| | False rejection | False acceptance |
|---|---|---|
| What happens | An **authorised** user is **refused** | An **unauthorised** person is **let in** |
| Example | Your phone does not recognise your wet finger | Someone else's face unlocks your phone |
| Result | Annoying — the user tries again | **Dangerous** — a security breach |
| If the threshold is made **stricter** | Happens **more** often | Happens **less** often |
:::

:::compare Biometric methods
| Method | How it works | Notes |
|---|---|---|
| Fingerprint | Sensor reads the ridges of a finger | Cheap, fast; dirty or cut fingers can fail |
| Face recognition | Camera compares facial features | Contactless; lighting, glasses or masks can affect it |
| Iris / retina scan | Camera scans the pattern of the eye | Very accurate; expensive; some users dislike it |
| Voice recognition | Microphone analyses the voice | A cold or background noise can cause rejection |
:::

:::cards
### Advantages
- Characteristics are **unique** and hard to **copy or guess**.
- **Cannot be forgotten, lost or shared** like a password or card.
- Fast and convenient to use.
- Gives an **audit trail** of exactly who entered.
### Disadvantages
- **Expensive** hardware.
- **False rejections** (an authorised user is refused) and **false acceptances**.
- **Privacy** concerns — biometric data is personal; if stolen it **cannot be changed** like a password.
- Some characteristics change (injury, age).
:::

:::callout info Two-factor authentication (2FA)
Combining **two different types** of evidence — something you **know** (password), something you **have** (phone, card) and something you **are** (biometric) — makes unauthorised access much harder. Example: a password plus a code sent to your phone.
:::

:::compare The three authentication factors
| Factor | Examples | Weakness on its own |
|---|---|---|
| Something you **know** | Password, PIN, answer to a security question | Can be guessed, stolen by phishing, forgotten |
| Something you **have** | Phone (SMS code, app), bank card, key card, USB token | Can be lost or stolen |
| Something you **are** | Fingerprint, face, iris, voice | False acceptance / rejection; cannot be changed if leaked |
:::

:::warning Two passwords are not two factors
A password **and** a PIN are both "something you know" — this is **not** two-factor authentication. 2FA needs factors of **different types**.
:::

# Passwords and access control
@lo 12.1.2.1

Biometrics prove **who** a user is, but most systems still rely on **passwords** — and on giving each user only the access they need.

:::cards
### A strong password
- **Long** — at least 12 characters; length matters most.
- Mixes **upper and lower case, digits and symbols**.
- **Not** a dictionary word, name, date of birth or keyboard pattern (`qwerty`, `123456`).
- **Different** for every account, so one leak does not open the others.
- Kept in a **password manager**, not on a sticky note.
### A password policy (set by the organisation)
- Minimum length and required character types.
- **Account lockout** after a few wrong attempts (e.g. 5), which stops brute-force attacks.
- Passwords are stored as **hashes**, never as plain text.
- Passwords are changed **at once** if they may have leaked.
- **Two-factor authentication** for important accounts (e-mail, banking, administrators).
:::

:::widget password_strength How long would a brute-force attack take?
:::

:::definition Access rights (permissions)
Rules set by the administrator that decide **what each user may do** with each file, folder or table: **no access**, **read only**, **read and write (change)**, or **full control** (also delete and change permissions).
:::

:::example Access rights in a school information system
| User | Pupils' marks | Pupils' personal data | Staff salaries |
|---|---|---|---|
| Pupil | Read **own** marks only | Read **own** data only | No access |
| Teacher | Read and write for **their classes** | Read for their classes | No access |
| Accountant | No access | No access | Read and write |
| Administrator | Full control | Full control | Full control |
:::

:::cards
### Principle of least privilege
Every user gets **only the access needed for their job** — no more. If an account is stolen or a user makes a mistake, the damage is limited to that small area.
### Audit trail (log)
The system **records who did what and when** (logged in, opened, changed, deleted). Logs help to find the cause of a problem and discourage misuse.
### Smart cards and tokens
A **smart card** or USB **security key** contains a chip that proves the user has it ("something you have"). A **one-time password (OTP)** from an app or SMS changes every 30–60 seconds, so a stolen code is soon useless.
:::

# Computer virus countermeasures
@lo 12.1.2.1

:::definition Anti-virus software
A utility program that **scans** files, e-mails, downloads and memory to **detect, quarantine and remove malware** (viruses, worms, Trojans, spyware, ransomware).
:::

:::compare Malware and how it spreads
| Type | What it does | How it usually spreads |
|---|---|---|
| **Virus** | Attaches itself to files or programs and damages data | Runs when the infected file is opened; USB drives, e-mail |
| **Worm** | Copies itself across a network by itself | Network security holes — no user action needed |
| **Trojan** | Pretends to be useful software but harms the computer | The user downloads and installs it |
| **Spyware** | Secretly records keystrokes, passwords, activity | Bundled with free software, Trojans |
| **Ransomware** | Encrypts files and demands payment | Phishing e-mails, security holes |
:::

:::steps How anti-virus software works
- **Signature-based detection** — compares files with a database of known malware **signatures**; the database must be **updated** regularly.
- **Heuristic / behaviour analysis** — detects **suspicious behaviour** (e.g. a program trying to change many system files), so it can catch new malware.
- **Real-time (on-access) scanning** checks files as they are opened or downloaded.
- Infected files are **quarantined** (isolated) or **deleted**; the user is warned.
:::

:::compare Other virus countermeasures
| Measure | How it helps |
|---|---|
| Keep the **OS and software updated** | Fixes security holes that malware uses |
| **Do not open unknown attachments / links** | Many viruses spread by e-mail and phishing |
| Scan **USB drives** before use; disable autorun | Viruses spread on removable media |
| Download software only from **trusted sources** | Avoids Trojans |
| Use **firewall** and **limited user accounts** | Malware cannot easily spread or change the system |
| **Regular backups** (kept offline) | Files can be restored after ransomware |
| **User training** | People recognise phishing and suspicious files |
:::


:::compare Signature-based vs heuristic detection
| | Signature-based | Heuristic / behaviour-based |
|---|---|---|
| How | Compares files with a database of **known** malware signatures | Looks for **suspicious code or behaviour** |
| Detects new malware? | **No** — only malware already in the database | **Yes** — can catch new ("zero-day") malware |
| False alarms | Very few | More — a normal program may look suspicious |
| Needs | **Regular updates** of the signature database | Good rules; more processing |
:::

:::steps What to do if a computer is infected
- **Disconnect** it from the network so the malware cannot spread.
- Run a **full scan** with updated anti-virus software; **quarantine / delete** infected files.
- **Change passwords** that may have been stolen (from a clean computer).
- **Restore** damaged files from a clean **backup**.
- Find out **how** it got in (attachment, USB, missing update) and fix the cause.
:::

# Exam practice: biometrics and malware
@lo 12.1.2.1

:::example Exam-style answers
**Q: State two biometric methods. [2]**
Any two: fingerprint, face recognition, iris / retina scan, voice recognition, hand geometry.

**Q: Explain how two-factor authentication improves security. [2]**
The user must give **two different types** of evidence, e.g. a password **and** a code sent to their phone (1); a criminal who steals the password still **cannot log in without the phone** (1).

**Q: Explain how anti-virus software can detect a new virus that is not in its signature database. [2]**
**Heuristic / behaviour analysis** (1): it watches for suspicious actions, such as a program changing many system files, and blocks it (1).
:::

# Data backup
@lo 12.1.2.2

:::definition Backup
A **copy of data** stored on a **separate medium**, preferably in a **different location**, so that the original can be **restored** if it is lost, damaged, deleted, stolen or encrypted by ransomware.
:::

:::compare Types of backup
| Type | What is copied | Backup time / space | Restoring |
|---|---|---|---|
| **Full** | **All** data every time | Slowest, most space | Easiest — one backup needed |
| **Incremental** | Only data changed **since the last backup of any type** | Fastest, least space | Slowest — the full backup **plus every** incremental one |
| **Differential** | Data changed **since the last full** backup | Medium | Full backup **plus the latest** differential |
:::

:::example Restoring after a failure on Thursday morning
A full backup is made on **Sunday** night; from Monday to Wednesday a backup is made every night. The disk fails on **Thursday** morning.

| Method used Mon–Wed | Backups needed to restore |
|---|---|
| **Incremental** | Sunday full **+ Monday + Tuesday + Wednesday** incrementals (all of them, in order) |
| **Differential** | Sunday full **+ Wednesday** differential only |

Work done on Thursday before the failure is **lost** in both cases — it was never backed up.
:::

:::widget backup_restore Choose the method and the day of the failure
:::

:::cards
### A good backup strategy
- Back up **regularly** and **automatically** (e.g. every night), at a time when the system is not busy.
- **3-2-1 rule:** keep **3** copies of the data, on **2** different types of media, with **1** copy **off-site** (or in the cloud).
- Keep at least one copy **offline**, so ransomware cannot encrypt it.
- **Encrypt** backups and keep them physically secure.
- **Test** restoring from the backup regularly.
### Backup media
- External hard disks / SSDs.
- Magnetic **tape** (cheap for very large amounts, used by companies).
- **Cloud storage** — off-site automatically; needs an Internet connection.
- Network-attached storage (NAS).
:::

:::compare Cloud backup
| Advantages | Disadvantages |
|---|---|
| **Off-site automatically** — safe from fire or theft at school | Needs a fast, reliable **Internet connection** |
| No hardware to buy or look after | **Monthly cost** that grows with the amount of data |
| Can be restored from anywhere | Data is held by **another company** — privacy and law (where are the servers?) |
| Usually keeps **old versions** of files | Restoring a lot of data can be **slow** |
:::

:::example A backup plan for a small shop
- **Every night at 23:00**: incremental backup of the sales database to a NAS in the office.
- **Every Sunday**: full backup to the NAS **and** to cloud storage (the off-site copy).
- **Once a month**: test that a file can really be restored.
- The NAS is not shared with ordinary users, so ransomware on a till computer cannot reach it.
:::

# Disk mirroring (RAID 1)
@lo 12.1.2.2

:::definition Disk mirroring (RAID 1)
Data is written to **two (or more) disks at the same time**, so that every disk holds an **identical copy**. If one disk **fails**, the system **continues working** from the other disk **without losing data or stopping**.
:::

:::ascii Disk mirroring: every write goes to both disks
               write "file.docx"
                      |
              +-------+-------+
              |               |
        +-----------+   +-----------+
        |  Disk 1   |   |  Disk 2   |
        | file.docx |   | file.docx |     identical copies
        +-----------+   +-----------+
   Disk 1 fails  ->  the server keeps running from Disk 2
:::

:::compare Backup vs disk mirroring
| | Backup | Disk mirroring |
|---|---|---|
| When copying happens | At **intervals** (e.g. nightly) | **Continuously** — in real time |
| Protects against | Deletion, corruption, ransomware, fire, theft (if off-site), disk failure | **Disk failure** only |
| Recovery | Data is **restored** — some downtime; changes since the last backup are lost | **No downtime** — work continues immediately |
| Old versions | Yes — you can go back to an earlier copy | No — a deletion or virus is **copied to both disks instantly** |
| Location | Can be off-site | Usually in the **same computer** |
| Cost | Cheaper | Needs at least **double** the disk space |
:::

:::warning Mirroring is not a backup
If a file is **deleted**, **corrupted** or **encrypted by ransomware**, the change is mirrored to **both** disks at once. Organisations therefore use **both**: mirroring for **availability** and backups for **recovery**.
:::

## Other RAID levels

:::compare RAID levels you may meet
| Level | How it works | If one disk fails |
|---|---|---|
| **RAID 0** (striping) | Data is split across disks for **speed** | **All data is lost** — no protection |
| **RAID 1** (mirroring) | Every disk holds an identical copy | Work continues from the other disk |
| **RAID 5** (striping with parity) | Data and **parity** information are spread over 3 or more disks | The lost disk's data is **rebuilt** from the others |
:::

:::callout info Hot-swapping
In servers the failed disk can often be **replaced while the system keeps running** (hot-swap); the RAID controller then copies the data onto the new disk.
:::

# Disaster recovery and archiving
@lo 12.1.2.2

:::definition Disaster recovery plan
A written plan of **how an organisation will restore its systems and data and continue working** after a serious incident — fire, flood, ransomware, a failed server or a long power cut.
:::

:::cards
### What the plan contains
- A list of the **critical systems and data**, in order of importance.
- **Where the backups are** and **how to restore** them, step by step.
- **Who is responsible** for each task, with contact details.
- **How long** each system may be unavailable, and **how much recent data** may be lost (e.g. "at most one day of sales").
- **Alternative arrangements**: spare equipment, a second site, working on paper.
- How and when the plan is **tested**.
### Why it matters
- Decisions are made **in advance**, calmly, not during the crisis.
- Systems come back **faster**, so less money and trust are lost.
- Staff know **exactly what to do**.
- A plan that is **never tested** may fail when it is needed.
:::

:::compare Backup vs archive
| | Backup | Archive |
|---|---|---|
| Purpose | **Restore** data after it is lost or damaged | **Keep old data** that is no longer used every day, for the long term |
| Data | A **copy** — the original stays in use | The data is **moved** off the working system |
| How long kept | Replaced regularly (e.g. kept for a few weeks) | Kept for **years** (e.g. pupils' records after they leave, old accounts by law) |
| Example | Last night's copy of the school database | Records of pupils who left school five years ago |
:::

:::example Ransomware at a college — recovery in practice
1. Staff see that files will not open and a ransom note appears.
2. The IT team **disconnects** the infected computers and the server from the network.
3. They follow the **disaster recovery plan**: the server is wiped and the system reinstalled.
4. Data is restored from the **offline backup** made the night before; mirroring did not help, because the encrypted files were copied to both disks.
5. Lessons continue the next day; only half a day of work is lost. **No ransom is paid.**
:::

# Exam practice and summary
@lo 12.1.2.1 12.1.2.2

:::example Exam-style answers
**Q: List three security measures to prevent hacking. [3]**
Firewall (1); strong passwords / two-factor authentication (1); biometrics / access control / anti-virus / encryption (1).

**Q: Describe how a firewall protects a school network. [2]**
It checks every **data packet** entering and leaving the network against **security rules** (1) and **blocks** packets from unauthorised sources / to unused ports (1).

**Q: Explain why a company should use both disk mirroring and backup. [2]**
Mirroring keeps the system **running without data loss if a disk fails** (1), but a deletion or virus is copied to both disks, so a **backup** is needed to **restore earlier, undamaged copies** (1).

**Q: Give one advantage and one disadvantage of using fingerprints to log in. [2]**
Advantage: fingerprints are **unique** and **cannot be forgotten or shared** (1). Disadvantage: **false rejections** if the finger is dirty or cut / biometric data cannot be changed if stolen (1).
:::

:::warning Common mistakes
- Saying a firewall **removes viruses** — that is anti-virus software; a firewall **filters network traffic**.
- Saying encryption **stops data being stolen** — it makes stolen data **unreadable**.
- Treating disk mirroring as a backup (see above).
- Keeping the backup **in the same room** as the original — a fire destroys both.
- Giving vague answers such as "use security" — name the **specific** measure and **what it does**.
:::

:::steps Check yourself
- Name four physical risks and a countermeasure for each.
- Describe what a firewall checks and what it cannot protect against.
- What is the difference between symmetric and asymmetric encryption?
- Give two advantages and two disadvantages of biometrics.
- Explain signature-based and heuristic virus detection.
- Compare full, incremental and differential backups.
- Explain how disk mirroring works and why it does not replace backups.
:::
