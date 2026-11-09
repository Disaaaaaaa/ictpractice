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

:::cards
### Physical biometrics
Based on **what your body is like**: fingerprint, face, iris, retina, palm vein pattern, hand geometry. They change very little over a lifetime and are hard to copy.
### Behavioural biometrics
Based on **how you do something**: voice, signature dynamics (speed and pressure of signing), typing rhythm (keystroke dynamics), the way you walk (gait). They are easier to collect but change with mood, illness or age, so errors are more common.
:::

:::steps How biometric authentication works
- **Enrolment:** the user's fingerprint (face, iris…) is scanned several times; the important features are turned into a **template** and stored — the image itself is usually not kept.
- **Log-in:** a new scan is made and turned into features in the same way.
- **Matching:** the new features are **compared** with the template and a **similarity score** is calculated.
- **Decision:** if the score is above a **threshold**, access is allowed; otherwise it is refused.
:::

:::definition Template
A set of numbers describing the key features of a biometric sample (e.g. the positions of ridge endings and splits in a fingerprint). Two scans of the same finger are never identical, so the system looks for a **close enough** match, not an exact one.
:::

:::compare False rejection and false acceptance
| | False rejection | False acceptance |
|---|---|---|
| What happens | An **authorised** user is **refused** | An **unauthorised** person is **let in** |
| Example | Your phone does not recognise your wet finger | Someone else's face unlocks your phone |
| Result | Annoying — the user tries again | **Dangerous** — a security breach |
| If the threshold is made **stricter** | Happens **more** often | Happens **less** often |
:::

## The threshold: security or convenience

The threshold decides how similar a new scan must be to the template. A **strict** (high) threshold lets almost no strangers in, but refuses the right person more often. A **relaxed** (low) threshold is convenient but less secure. A bank vault uses a strict threshold; a phone uses a more relaxed one and adds a PIN as a backup.

:::widget biometric_threshold Move the threshold of a fingerprint reader
:::

:::warning Fake fingers and photos
A criminal may try to fool a reader with a **copy** of a biometric — a fingerprint made of gelatine or a photo of a face. Good systems use **liveness detection**: they check for blood flow, warmth, blinking or 3D depth, so only a live person is accepted.
:::

:::compare Biometric methods
| Method | How it works | Notes |
|---|---|---|
| Fingerprint | Sensor reads the ridges of a finger | Cheap, fast; dirty or cut fingers can fail |
| Face recognition | Camera compares facial features | Contactless; lighting, glasses or masks can affect it |
| Iris / retina scan | Camera scans the pattern of the eye | Very accurate; expensive; some users dislike it |
| Palm vein | Infrared light shows the pattern of veins under the skin | Very hard to copy because the veins are inside the hand |
| Voice recognition | Microphone analyses the voice | A cold or background noise can cause rejection |
| Signature / keystroke dynamics | Measures how a person signs or types | No extra hardware for typing; less accurate |
:::

:::cards
### Where biometrics are used
- **Phones and laptops** — fingerprint or face unlock.
- **Airports** — e-passports contain a photo template; e-gates compare it with the traveller's face.
- **Banks** — confirming payments in a banking app.
- **Schools and offices** — entry to buildings, attendance, paying in the canteen.
### Keeping biometric data safe
- Only the **template** is stored, not the image.
- On phones it stays **encrypted on the device** in a secure chip and is never sent to the company.
- A central database of fingerprints is a big target: if it is stolen, people **cannot change** their fingerprints like a password.
- Biometric data is **personal data**, so laws require consent and protection.
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
Combining **two different types** of evidence — something you **know** (password), something you **have** (phone, card) and something you **are** (biometric) — makes unauthorised access much harder. Example: a password plus a code sent to your phone. Using two or more factors is called **multi-factor authentication (MFA)**.
:::

:::compare The three authentication factors
| Factor | Examples | Weakness on its own |
|---|---|---|
| Something you **know** | Password, PIN, answer to a security question | Can be guessed, stolen by phishing, forgotten |
| Something you **have** | Phone (SMS code, app), bank card, key card, USB token | Can be lost or stolen |
| Something you **are** | Fingerprint, face, iris, voice | False acceptance / rejection; cannot be changed if leaked |
:::

:::example Two-factor authentication in everyday life
- **Bank card at a cash machine:** the card (*have*) + the PIN (*know*).
- **Online banking:** the password (*know*) + a code sent by SMS or shown in an app (*have*).
- **Phone payment:** the phone (*have*) + a fingerprint or face (*are*).
- **School server room:** a key card (*have*) + a fingerprint (*are*).
:::

:::warning Two passwords are not two factors
A password **and** a PIN are both "something you know" — this is **not** two-factor authentication. 2FA needs factors of **different types**.
:::

# Passwords and access control
@lo 12.1.2.1

Biometrics prove **who** a user is, but most systems still rely on **passwords** — and on giving each user only the access they need.

:::compare Authentication and authorisation
| | Authentication | Authorisation |
|---|---|---|
| Question | **Who are you?** | **What are you allowed to do?** |
| How | Password, card, biometric, 2FA | Access rights (permissions) set by the administrator |
| When | At log-in | Every time a file, folder or table is opened |
| Example | A teacher logs in with a password and a code | The teacher may change the marks of their own classes only |
:::

## How passwords are attacked

:::compare Common attacks on passwords and how to defend against them
| Attack | What the attacker does | Defence |
|---|---|---|
| **Brute force** | Tries every possible combination | Long passwords; **account lockout** after a few wrong attempts |
| **Dictionary attack** | Tries common words and passwords (`password`, `qwerty`, names) | No dictionary words; passphrases with unusual words |
| **Credential stuffing** | Uses passwords leaked from another website | A **different password** for every account; 2FA |
| **Phishing** | Tricks the user into typing the password on a fake page | User training; 2FA; check the address of the site |
| **Shoulder surfing** | Watches the user type the password | Cover the keyboard; screen privacy filters |
| **Keylogger** | Malware records every key pressed | Anti-virus software; 2FA; on-screen PIN pads |
:::

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

:::example A passphrase
Four or more unrelated words are long and easy to remember: `Kite-Trombone-47-river!` is about 23 characters long. It is much harder to crack than `P@ssw0rd1`, which looks complex but is in every attacker's dictionary.
:::

:::widget password_strength How long would a brute-force attack take?
:::

:::cards
### Password managers
A program that **generates** a strong, different password for each account and **stores them encrypted**, unlocked by one master password (and often a fingerprint). ✔ The user remembers only one password. ✘ The master password must be very strong — if it is lost, all the passwords are lost.
### How a system stores passwords
The password is never stored as typed. A random value — the **salt** — is added and the result is **hashed**. At log-in the typed password is salted and hashed in the same way and the two hashes are compared. If the database is stolen, the attacker gets only hashes, and the salt stops them from looking the hashes up in a ready-made table.
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
### User groups (roles)
Rights are given to **groups** — *Pupils*, *Teachers*, *Accountants* — not to each person separately. A new teacher is simply added to the *Teachers* group and gets the right access at once; fewer mistakes are made.
### Principle of least privilege
Every user gets **only the access needed for their job** — no more. If an account is stolen or a user makes a mistake, the damage is limited to that small area.
### Audit trail (log)
The system **records who did what and when** (logged in, opened, changed, deleted). Logs help to find the cause of a problem and discourage misuse.
### Smart cards and tokens
A **smart card** or USB **security key** contains a chip that proves the user has it ("something you have"). A **one-time password (OTP)** from an app or SMS changes every 30–60 seconds, so a stolen code is soon useless.
:::

:::steps Good account management
- Every person has their **own account** — no shared logins, so the audit trail shows who did what.
- Administrators use a **normal account** for everyday work and the administrator account only when needed.
- Accounts of people who **leave** are **disabled at once**.
- The screen **locks automatically** after a few minutes without activity.
- Rights are **reviewed** regularly and removed when a job changes.
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
| **Keylogger** | A kind of spyware that records every key pressed | Trojans, infected downloads |
| **Ransomware** | Encrypts files and demands payment | Phishing e-mails, security holes |
| **Adware** | Shows unwanted adverts, may track browsing | Bundled with free programs |
:::

:::cards
### Signs that a computer may be infected
- It becomes **slow** or crashes often.
- **Pop-ups** and adverts appear; the browser home page changes.
- Files are **missing, changed or encrypted** with a ransom message.
- Unknown programs start; anti-virus software is switched off.
- Friends receive strange e-mails "from you"; network traffic is unusually high.
### Why malware is dangerous
- **Data loss** — files are deleted, corrupted or encrypted.
- **Data theft** — passwords, bank details and personal data are stolen.
- **Downtime** — computers or the whole network stop working.
- **Spreading** — one infected computer infects others in the network.
:::

:::steps How anti-virus software works
- **Signature-based detection** — compares files with a database of known malware **signatures**; the database must be **updated** regularly.
- **Heuristic / behaviour analysis** — detects **suspicious behaviour** (e.g. a program trying to change many system files), so it can catch new malware.
- **Real-time (on-access) scanning** checks files as they are opened or downloaded.
- Infected files are **quarantined** (isolated) or **deleted**; the user is warned.
:::

:::compare Signature-based vs heuristic detection
| | Signature-based | Heuristic / behaviour-based |
|---|---|---|
| How | Compares files with a database of **known** malware signatures | Looks for **suspicious code or behaviour** |
| Detects new malware? | **No** — only malware already in the database | **Yes** — can catch new ("zero-day") malware |
| False alarms | Very few | More — a normal program may look suspicious |
| Needs | **Regular updates** of the signature database | Good rules; more processing |
:::

:::cards
### Quarantine
A suspicious file is moved to a **protected, isolated folder** where it cannot run. If it was a false alarm, it can be restored; if not, it is deleted.
### Sandbox
An unknown program is run in a **closed test area** cut off from the real files and network. The anti-virus watches what it does; if it behaves like malware, it is blocked before it can do damage.
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

:::example Ransomware at a small company
An employee opens an attachment called `Invoice.pdf.exe`. Ransomware encrypts every file on the shared server and demands payment. Paying does not guarantee the files will be returned. The company recovers because it keeps a **backup that is not connected** to the network: it cleans the server, restores yesterday's backup and loses only one day of work. **Disk mirroring would not have helped** — it copies the encrypted files to the second disk at once.
:::

:::steps What to do if a computer is infected
- **Disconnect** it from the network so the malware cannot spread.
- Run a **full scan** with updated anti-virus software; **quarantine / delete** infected files.
- **Change passwords** that may have been stolen (from a clean computer).
- **Restore** damaged files from a clean **backup**.
- Find out **how** it got in (attachment, USB, missing update) and fix the cause.
:::

# Phishing and social engineering
@lo 12.1.2.1

Many attacks do not break the technology — they trick the **people** who use it. Firewalls and anti-virus software cannot stop a user who types their password into a fake website.

:::definition Phishing
Sending **fake e-mails or messages** that look as if they come from a trusted organisation (a bank, the school, a delivery company) to trick people into **revealing passwords or bank details**, opening an infected attachment or clicking a link to a fake website.
:::

:::cards
### How to recognise a phishing e-mail
- **Urgency or threats:** "Your account will be closed in 24 hours!"
- A **generic greeting** ("Dear customer") instead of your name.
- The **sender's address** does not match the organisation (`support@citybank-security.xyz`).
- A **link** whose real address (seen by hovering over it) is different from the text.
- A request for a **password, PIN or card number** — real banks never ask for these by e-mail.
- Spelling mistakes; an unexpected attachment.
### What to do
- Do **not** click the link or open the attachment.
- Go to the website by **typing its address** yourself, or phone the organisation.
- **Report** the e-mail to the IT department and delete it.
- If you already typed a password, **change it at once** and tell IT.
:::

:::compare Other social-engineering attacks
| Attack | What happens | Defence |
|---|---|---|
| **Spear phishing** | A phishing message written for one person, using their name and job | Training; check requests through another channel |
| **Smishing / vishing** | Phishing by **SMS** or by **phone call** ("This is your bank…") | Never give codes or passwords; call back on the official number |
| **Pharming** | Malicious code or a changed DNS setting sends the user to a fake website even when they type the correct address | Anti-virus software; check the padlock and certificate; keep software updated |
| **Pretexting** | The attacker invents a story ("I'm from IT support, I need your password to fix your account") | A rule that staff **never** share passwords, even with IT |
| **Shoulder surfing** | Watching someone type a PIN or password | Cover the keypad; privacy screens |
| **Baiting** | An infected USB stick is left where someone will find it and plug it in | Never use unknown USB drives; disable autorun |
:::

:::tip
In an exam answer about phishing, say what the user is **tricked** into doing (typing a password on a fake site, opening an attachment) and give a **measure that targets people**: user training, 2FA, checking the sender and the link.
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

**Q: A bank makes its fingerprint readers stricter. Explain the effect on false acceptance and false rejection. [2]**
Fewer **false acceptances** — strangers are let in less often, so it is more secure (1); more **false rejections** — genuine customers are refused more often, which is inconvenient (1).

**Q: Explain the difference between authentication and authorisation. [2]**
**Authentication** checks **who** the user is, e.g. with a password or fingerprint (1); **authorisation** decides **what** that user is allowed to do, using access rights (1).

**Q: Explain why passwords are stored as salted hashes. [2]**
A hash cannot be turned back into the password, so a stolen database does not reveal the passwords (1); the **salt** makes every hash different, so attackers cannot look them up in a table of common passwords' hashes (1).

**Q: Describe two features of a phishing e-mail. [2]**
Any two: urgent or threatening message; generic greeting; sender's address does not match the organisation; link to a fake website; asks for a password or bank details; unexpected attachment.

**Q: Explain why anti-virus software must be updated regularly. [2]**
New malware appears every day (1); signature-based detection only finds malware whose **signature is in the database**, so without updates new viruses are not detected (1).

**Q: State the difference between a virus and a worm. [2]**
A **virus** attaches itself to a file and spreads when the file is opened / needs a user action (1); a **worm** copies itself across a network **by itself**, through security holes (1).
:::

# Data backup
@lo 12.1.2.2

:::definition Backup
A **copy of data** stored on a **separate medium**, preferably in a **different location**, so that the original can be **restored** if it is lost, damaged, deleted, stolen or encrypted by ransomware.
:::

:::cards
### What a backup protects against
- **Hardware failure** — a hard disk or SSD stops working.
- **Human error** — a file is deleted or overwritten by mistake.
- **Malware** — ransomware encrypts files; a virus corrupts them.
- **Theft and disasters** — a laptop is stolen; fire or flood destroys the server room (only if a copy is kept **off-site**).
### Restoring
**Restoring** means copying the data from the backup back onto the working system. A backup is only useful if it can really be restored — so restores are **tested** regularly.
:::

## Full, incremental and differential backups

:::compare Types of backup
| Type | What is copied | Backup time / space | Restoring |
|---|---|---|---|
| **Full** | **All** data every time | Slowest, most space | Easiest — one backup needed |
| **Incremental** | Only data changed **since the last backup of any type** | Fastest, least space | Slowest — the full backup **plus every** incremental one |
| **Differential** | Data changed **since the last full** backup | Medium | Full backup **plus the latest** differential |
:::

:::svg What each night's backup copies (full backup on Sunday)
<svg class="dp" viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Incremental and differential backups from Sunday to Wednesday">
  <style>
    svg.dp .t{font:600 15px system-ui,sans-serif;fill:var(--foreground)}
    svg.dp .s{font:13px system-ui,sans-serif;fill:var(--muted)}
    svg.dp .full{fill:var(--primary)} svg.dp .inc{fill:var(--success)} svg.dp .dif{fill:var(--warning)}
    svg.dp .lane{fill:var(--surface-2)}
    svg.dp .lbl{font:600 12px system-ui,sans-serif;fill:#fff}
  </style>
  <text class="t" x="20" y="28">Incremental: only the changes since the previous night</text>
  <rect class="lane" x="20" y="40" width="720" height="90" rx="10"/>
  <g transform="translate(40,55)">
    <rect class="full" width="150" height="60" rx="8"/><text class="lbl" x="75" y="27" text-anchor="middle">Sunday</text><text class="lbl" x="75" y="45" text-anchor="middle">FULL · 50 GB</text>
    <rect class="inc" x="175" y="18" width="70" height="42" rx="8"/><text class="lbl" x="210" y="44" text-anchor="middle">Mon 2 GB</text>
    <rect class="inc" x="270" y="18" width="70" height="42" rx="8"/><text class="lbl" x="305" y="44" text-anchor="middle">Tue 2 GB</text>
    <rect class="inc" x="365" y="18" width="70" height="42" rx="8"/><text class="lbl" x="400" y="44" text-anchor="middle">Wed 2 GB</text>
    <text class="s" x="460" y="30">Restore on Thursday:</text>
    <text class="t" x="460" y="52">Sun + Mon + Tue + Wed</text>
  </g>
  <text class="t" x="20" y="178">Differential: all the changes since Sunday's full backup</text>
  <rect class="lane" x="20" y="190" width="720" height="110" rx="10"/>
  <g transform="translate(40,205)">
    <rect class="full" width="150" height="80" rx="8"/><text class="lbl" x="75" y="37" text-anchor="middle">Sunday</text><text class="lbl" x="75" y="55" text-anchor="middle">FULL · 50 GB</text>
    <rect class="dif" x="175" y="56" width="70" height="24" rx="6"/><text class="lbl" x="210" y="73" text-anchor="middle">Mon 2</text>
    <rect class="dif" x="270" y="38" width="70" height="42" rx="6"/><text class="lbl" x="305" y="64" text-anchor="middle">Tue 4</text>
    <rect class="dif" x="365" y="20" width="70" height="60" rx="6"/><text class="lbl" x="400" y="55" text-anchor="middle">Wed 6</text>
    <text class="s" x="460" y="40">Restore on Thursday:</text>
    <text class="t" x="460" y="62">Sun + Wed only</text>
  </g>
</svg>
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

:::example Calculating the storage needed
The full backup is **50 GB** and about **2 GB** of data changes each day (always different files).

- **Incremental**, Monday–Saturday: 6 × 2 GB = **12 GB** in a week, plus the 50 GB full backup = **62 GB**.
- **Differential**: Monday 2 + Tuesday 4 + Wednesday 6 + Thursday 8 + Friday 10 + Saturday 12 = **42 GB**, plus 50 GB = **92 GB**.
- **Full every night**: 7 × 50 GB = **350 GB**.

Incremental saves the most space, but a restore needs **every** backup in the chain — if one of them is damaged, the later ones are useless.
:::

## How often, and how much may be lost

:::cards
### Recovery point objective (RPO)
The **largest amount of recent data** the organisation can afford to lose, measured in time. A nightly backup gives an RPO of up to **24 hours**; an online shop that cannot lose orders may back up **every 15 minutes**.
### Recovery time objective (RTO)
The **longest time** the system may be unavailable while it is restored. A school may accept a day; a hospital or a bank only minutes — so they also need mirroring or a spare server.
:::

:::svg RPO looks back to the last backup; RTO looks forward to the moment work resumes
<svg class="dp" viewBox="0 0 760 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Timeline showing RPO before an incident and RTO after it">
  <style>
    svg.dp .t{font:600 14px system-ui,sans-serif;fill:var(--foreground)}
    svg.dp .s{font:13px system-ui,sans-serif;fill:var(--muted)}
    svg.dp .line{stroke:var(--border);stroke-width:4}
  </style>
  <line class="line" x1="30" y1="90" x2="730" y2="90"/>
  <rect x="200" y="74" width="230" height="32" style="fill:var(--danger-soft)"/>
  <rect x="430" y="74" width="230" height="32" style="fill:var(--warning-soft)"/>
  <circle cx="200" cy="90" r="9" style="fill:var(--success)"/>
  <circle cx="430" cy="90" r="11" style="fill:var(--danger)"/>
  <circle cx="660" cy="90" r="9" style="fill:var(--primary)"/>
  <text class="t" x="200" y="50" text-anchor="middle">Last backup</text>
  <text class="t" x="430" y="50" text-anchor="middle">Incident (e.g. ransomware)</text>
  <text class="t" x="660" y="50" text-anchor="middle">Work resumes</text>
  <text class="t" x="315" y="140" text-anchor="middle" style="fill:var(--danger)">RPO — data that may be lost</text>
  <text class="t" x="545" y="140" text-anchor="middle" style="fill:var(--warning)">RTO — time to restore</text>
  <text class="s" x="30" y="160">time →</text>
</svg>
:::

## A good backup strategy

:::svg The 3-2-1 rule
<svg class="dp" viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three copies on two media types with one copy off-site">
  <style>
    svg.dp .n{font:800 46px system-ui,sans-serif}
    svg.dp .t{font:600 15px system-ui,sans-serif;fill:var(--foreground)}
    svg.dp .s{font:13px system-ui,sans-serif;fill:var(--muted)}
    svg.dp .card{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
  </style>
  <rect class="card" x="20" y="20" width="230" height="180" rx="14"/>
  <rect class="card" x="265" y="20" width="230" height="180" rx="14"/>
  <rect class="card" x="510" y="20" width="230" height="180" rx="14"/>
  <text class="n" x="135" y="82" text-anchor="middle" style="fill:var(--primary)">3</text>
  <text class="n" x="380" y="82" text-anchor="middle" style="fill:var(--success)">2</text>
  <text class="n" x="625" y="82" text-anchor="middle" style="fill:var(--warning)">1</text>
  <text class="t" x="135" y="112" text-anchor="middle">copies of the data</text>
  <text class="t" x="380" y="112" text-anchor="middle">different types of media</text>
  <text class="t" x="625" y="112" text-anchor="middle">copy off-site</text>
  <text class="s" x="135" y="140" text-anchor="middle">the original + 2 backups</text>
  <text class="s" x="380" y="140" text-anchor="middle">e.g. a NAS disk and the cloud</text>
  <text class="s" x="625" y="140" text-anchor="middle">another building or the cloud</text>
  <text class="s" x="135" y="165" text-anchor="middle">one failure never loses all</text>
  <text class="s" x="380" y="165" text-anchor="middle">one fault cannot hit both</text>
  <text class="s" x="625" y="165" text-anchor="middle">survives fire, flood, theft</text>
</svg>
:::

:::cards
### Rules for backups
- Back up **regularly** and **automatically** (e.g. every night), at a time when the system is not busy.
- Follow the **3-2-1 rule**; keep at least one copy **offline** (not connected), so ransomware cannot encrypt it.
- **Encrypt** backups and keep them physically secure — a stolen backup is a data leak.
- **Label** and **log** every backup; keep several generations, not just the latest.
- **Test** restoring from the backup regularly.
### Versions and snapshots
Many systems keep **versions** of files (e.g. the cloud keeps the last 30 days) or take **snapshots** — a read-only picture of a disk at one moment. A file deleted or encrypted today can be brought back from yesterday's version.
:::

:::compare Backup media compared
| Medium | Capacity | Speed | Cost per GB | Notes |
|---|---|---|---|---|
| **External hard disk** | Large (1–20 TB) | Fast | Low | Easy to carry off-site; can be dropped or fail |
| **External SSD / USB flash drive** | Small to medium | Very fast | Higher | Robust, small; easily lost |
| **Magnetic tape** | Very large | Slow to restore (sequential access) | Lowest | Used by companies for long-term and offline copies |
| **NAS** (network-attached storage) | Large | Fast on the local network | Medium | Automatic backups for all computers; often uses RAID; must be protected from ransomware |
| **Cloud storage** | Practically unlimited | Depends on the Internet | Monthly fee | Automatically off-site; keeps versions |
:::

:::example Grandfather–father–son rotation
A school keeps three generations of backups so that it can go back weeks or months:
- **Son** — a backup every **day** (Monday–Thursday), each kept for a week.
- **Father** — a **weekly** full backup on Friday, kept for a month.
- **Grandfather** — a **monthly** full backup, kept for a year and stored off-site.

If a mistake is noticed three weeks later, the father backup from before the mistake can still be restored.
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
- **Once a month**: a full backup to an external disk that is then **disconnected** and taken home (offline copy).
- **Once a month**: test that a file can really be restored.
- The NAS is not shared with ordinary users, so ransomware on a till computer cannot reach it.
:::

# Disk mirroring (RAID 1)
@lo 12.1.2.2

:::definition Disk mirroring (RAID 1)
Data is written to **two (or more) disks at the same time**, so that every disk holds an **identical copy**. If one disk **fails**, the system **continues working** from the other disk **without losing data or stopping**.
:::

:::definition RAID
**Redundant Array of Independent Disks** — several physical disks used together by a **RAID controller** (hardware or software) so that the computer sees them as **one drive**. Depending on the level, RAID gives speed, protection against a disk failure, or both.
:::

:::svg Disk mirroring: every write goes to both disks
<svg class="dp" viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A write goes through the RAID controller to two identical disks; when disk 1 fails the server keeps running from disk 2">
  <defs>
    <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker>
  </defs>
  <style>
    svg.dp .t{font:600 15px system-ui,sans-serif;fill:var(--foreground)}
    svg.dp .s{font:13px system-ui,sans-serif;fill:var(--muted)}
    svg.dp .box{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.dp .ln{stroke:var(--muted);stroke-width:2;fill:none}
  </style>
  <rect class="box" x="290" y="14" width="180" height="46" rx="10"/>
  <text class="t" x="380" y="43" text-anchor="middle">Save "marks.xlsx"</text>
  <path class="ln" d="M380,60 V88" marker-end="url(#arr)"/>
  <rect x="280" y="92" width="200" height="46" rx="10" style="fill:var(--primary-soft);stroke:var(--primary);stroke-width:1.5"/>
  <text class="t" x="380" y="121" text-anchor="middle" style="fill:var(--primary)">RAID controller</text>
  <path class="ln" d="M330,138 C330,170 200,165 200,196" marker-end="url(#arr)"/>
  <path class="ln" d="M430,138 C430,170 560,165 560,196" marker-end="url(#arr)"/>
  <g transform="translate(110,200)">
    <rect width="180" height="96" rx="14" style="fill:var(--danger-soft);stroke:var(--danger);stroke-width:2"/>
    <ellipse cx="90" cy="22" rx="62" ry="10" style="fill:none;stroke:var(--danger);stroke-width:1.5"/>
    <path d="M20,10 L160,86 M160,10 L20,86" style="stroke:var(--danger);stroke-width:4;stroke-linecap:round;opacity:.3"/>
    <rect x="45" y="38" width="90" height="48" rx="6" style="fill:var(--danger-soft)"/>
    <text class="t" x="90" y="56" text-anchor="middle">Disk 1</text>
    <text class="s" x="90" y="78" text-anchor="middle">marks.xlsx</text>
  </g>
  <g transform="translate(470,200)">
    <rect width="180" height="96" rx="14" style="fill:var(--success-soft);stroke:var(--success);stroke-width:2"/>
    <ellipse cx="90" cy="22" rx="62" ry="10" style="fill:none;stroke:var(--success);stroke-width:1.5"/>
    <text class="t" x="90" y="56" text-anchor="middle">Disk 2</text>
    <text class="s" x="90" y="78" text-anchor="middle">marks.xlsx (identical)</text>
  </g>
  <text class="t" x="200" y="318" text-anchor="middle" style="fill:var(--danger)">fails</text>
  <text class="t" x="560" y="318" text-anchor="middle" style="fill:var(--success)">server keeps running — no data lost</text>
</svg>
:::

:::steps What happens when a mirrored disk fails
- Both disks hold the same data; every change is written to **both** at once.
- Disk 1 fails — the controller **notices** and carries on using **Disk 2** alone; users do not notice anything.
- The administrator is **warned** (e-mail, red light on the server).
- The failed disk is **replaced**, often while the server keeps running (**hot-swap**).
- The controller **rebuilds** the mirror by copying everything from Disk 2 onto the new disk.
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
If a file is **deleted**, **corrupted** or **encrypted by ransomware**, the change is mirrored to **both** disks at once. A fire or a theft also takes **both** disks. Organisations therefore use **both**: mirroring for **availability** (no downtime) and backups for **recovery** (old, undamaged copies).
:::

## Other RAID levels

:::svg RAID 0, RAID 1 and RAID 5 with the same file (blocks A, B, C, D)
<svg class="dp" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="How RAID 0 stripes, RAID 1 mirrors and RAID 5 stripes with parity">
  <style>
    svg.dp .t{font:700 16px system-ui,sans-serif;fill:var(--foreground)}
    svg.dp .s{font:13px system-ui,sans-serif;fill:var(--muted)}
    svg.dp .d{fill:var(--surface-2);stroke:var(--border);stroke-width:1.5}
    svg.dp .b{fill:var(--primary)} svg.dp .p{fill:var(--warning)}
    svg.dp .w{font:700 13px system-ui,sans-serif;fill:#fff}
  </style>
  <text class="t" x="20" y="30">RAID 0 — striping</text>
  <text class="s" x="20" y="50">fast, no protection</text>
  <g transform="translate(20,64)">
    <rect class="d" width="90" height="150" rx="10"/><rect class="d" x="110" width="90" height="150" rx="10"/>
    <rect class="b" x="15" y="20" width="60" height="30" rx="5"/><text class="w" x="45" y="40" text-anchor="middle">A</text>
    <rect class="b" x="15" y="62" width="60" height="30" rx="5"/><text class="w" x="45" y="82" text-anchor="middle">C</text>
    <rect class="b" x="125" y="20" width="60" height="30" rx="5"/><text class="w" x="155" y="40" text-anchor="middle">B</text>
    <rect class="b" x="125" y="62" width="60" height="30" rx="5"/><text class="w" x="155" y="82" text-anchor="middle">D</text>
  </g>
  <text class="s" x="20" y="240">One disk fails →</text>
  <text class="t" x="20" y="262" style="fill:var(--danger)">all data lost</text>

  <text class="t" x="270" y="30">RAID 1 — mirroring</text>
  <text class="s" x="270" y="50">safe, half the space</text>
  <g transform="translate(270,64)">
    <rect class="d" width="90" height="150" rx="10"/><rect class="d" x="110" width="90" height="150" rx="10"/>
    <g><rect class="b" x="15" y="20" width="60" height="22" rx="4"/><text class="w" x="45" y="36" text-anchor="middle">A</text>
    <rect class="b" x="15" y="48" width="60" height="22" rx="4"/><text class="w" x="45" y="64" text-anchor="middle">B</text>
    <rect class="b" x="15" y="76" width="60" height="22" rx="4"/><text class="w" x="45" y="92" text-anchor="middle">C</text>
    <rect class="b" x="15" y="104" width="60" height="22" rx="4"/><text class="w" x="45" y="120" text-anchor="middle">D</text></g>
    <g transform="translate(110,0)"><rect class="b" x="15" y="20" width="60" height="22" rx="4"/><text class="w" x="45" y="36" text-anchor="middle">A</text>
    <rect class="b" x="15" y="48" width="60" height="22" rx="4"/><text class="w" x="45" y="64" text-anchor="middle">B</text>
    <rect class="b" x="15" y="76" width="60" height="22" rx="4"/><text class="w" x="45" y="92" text-anchor="middle">C</text>
    <rect class="b" x="15" y="104" width="60" height="22" rx="4"/><text class="w" x="45" y="120" text-anchor="middle">D</text></g>
  </g>
  <text class="s" x="270" y="240">One disk fails →</text>
  <text class="t" x="270" y="262" style="fill:var(--success)">works from the other</text>

  <text class="t" x="520" y="30">RAID 5 — striping + parity</text>
  <text class="s" x="520" y="50">3+ disks, one may fail</text>
  <g transform="translate(520,64)">
    <rect class="d" width="68" height="150" rx="10"/><rect class="d" x="78" width="68" height="150" rx="10"/><rect class="d" x="156" width="68" height="150" rx="10"/>
    <rect class="b" x="9" y="20" width="50" height="28" rx="4"/><text class="w" x="34" y="39" text-anchor="middle">A</text>
    <rect class="b" x="87" y="20" width="50" height="28" rx="4"/><text class="w" x="112" y="39" text-anchor="middle">B</text>
    <rect class="p" x="165" y="20" width="50" height="28" rx="4"/><text class="w" x="190" y="39" text-anchor="middle">P</text>
    <rect class="b" x="9" y="60" width="50" height="28" rx="4"/><text class="w" x="34" y="79" text-anchor="middle">C</text>
    <rect class="p" x="87" y="60" width="50" height="28" rx="4"/><text class="w" x="112" y="79" text-anchor="middle">P</text>
    <rect class="b" x="165" y="60" width="50" height="28" rx="4"/><text class="w" x="190" y="79" text-anchor="middle">D</text>
  </g>
  <text class="s" x="520" y="240">One disk fails → its blocks are</text>
  <text class="t" x="520" y="262" style="fill:var(--success)">rebuilt from parity (P)</text>
</svg>
:::

:::compare RAID levels you may meet
| Level | How it works | If one disk fails | Usable space |
|---|---|---|---|
| **RAID 0** (striping) | Data is split across disks for **speed** | **All data is lost** — no protection | All disks |
| **RAID 1** (mirroring) | Every disk holds an identical copy | Work continues from the other disk | Half |
| **RAID 5** (striping with parity) | Data and **parity** information are spread over 3 or more disks | The lost disk's data is **rebuilt** from the others | All but one disk |
| **RAID 10** (mirroring + striping) | Pairs of mirrored disks, striped together | Survives a failure in each pair; fast | Half |
:::

:::callout info Hot-swapping and hot spares
In servers the failed disk can often be **replaced while the system keeps running** (hot-swap). Some servers also keep a **hot spare** — an extra disk that the controller uses automatically the moment another disk fails.
:::

:::example Choosing for a clinic
A clinic's patient system must keep running all day (short RTO), and losing even an hour of records is unacceptable (small RPO). The server uses **RAID 1** so a failed disk does not stop the clinic, **plus** an hourly backup to a NAS and a nightly encrypted copy to the cloud — because mirroring alone would copy a deletion or ransomware to both disks.
:::

# Disaster recovery and archiving
@lo 12.1.2.2

:::definition Disaster recovery plan
A written plan of **how an organisation will restore its systems and data and continue working** after a serious incident — fire, flood, ransomware, a failed server or a long power cut. It is part of the wider **business continuity** plan: how the organisation keeps working at all.
:::

:::cards
### What the plan contains
- A list of the **critical systems and data**, in order of importance.
- **Where the backups are** and **how to restore** them, step by step.
- **Who is responsible** for each task, with contact details.
- The **RTO** (how long each system may be unavailable) and the **RPO** (how much recent data may be lost, e.g. "at most one day of sales").
- **Alternative arrangements**: spare equipment, a second site, working on paper.
- How and when the plan is **tested** and **updated**.
### Why it matters
- Decisions are made **in advance**, calmly, not during the crisis.
- Systems come back **faster**, so less money and trust are lost.
- Staff know **exactly what to do** and who to call.
- A plan that is **never tested** may fail when it is needed.
:::

:::steps Recovering from an incident
- **Detect and report** — staff notice the problem and tell the responsible person.
- **Contain** — disconnect infected or damaged systems so the problem cannot spread.
- **Assess** — find out what is affected and decide what must be restored first.
- **Restore** — rebuild or replace the systems and restore data from clean backups.
- **Check and resume** — test that the systems and data are correct, then let users back in.
- **Review** — find the cause, fix it and improve the plan.
:::

:::compare Testing a disaster recovery plan
| Test | What happens | Disruption |
|---|---|---|
| **Walk-through** | The team reads the plan together and checks each step | None |
| **Simulation** | A pretend incident ("the server room is flooded") is acted out | Little |
| **Full test** | Systems are really switched over to backups or a second site | Most — but proves the plan works |
:::

:::compare Backup vs archive
| | Backup | Archive |
|---|---|---|
| Purpose | **Restore** data after it is lost or damaged | **Keep old data** that is no longer used every day, for the long term |
| Data | A **copy** — the original stays in use | The data is **moved** off the working system |
| How long kept | Replaced regularly (e.g. kept for a few weeks) | Kept for **years** (e.g. pupils' records after they leave, old accounts by law) |
| Example | Last night's copy of the school database | Records of pupils who left school five years ago |
:::

:::cards
### Why archive
- The working system stays **smaller and faster**; backups take less time.
- Laws often require records to be kept for years (financial, medical, school records).
- Archives can go on **cheap, slow media** (tape, cold cloud storage), because they are rarely needed.
### Looking after an archive
- Store it securely and **off-site**; protect it from being changed (**read-only / write-once** media).
- **Index** it so a record can be found again.
- Move it to new media or formats over time, so it can still be **read** in ten years.
- **Delete** personal data when the law no longer allows it to be kept.
:::

:::example Ransomware at a college — recovery in practice
1. Staff see that files will not open and a ransom note appears.
2. The IT team **disconnects** the infected computers and the server from the network.
3. They follow the **disaster recovery plan**: the server is wiped and the system reinstalled.
4. Data is restored from the **offline backup** made the night before; mirroring did not help, because the encrypted files were copied to both disks.
5. Lessons continue the next day; only half a day of work is lost. **No ransom is paid.**
6. The cause (a phishing e-mail) is found; staff get training and the plan is updated.
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

**Q: A full backup is made on Sunday and incremental backups on the other nights. The disk fails on Friday morning. State the backups needed to restore the data. [2]**
Sunday's full backup (1) and the Monday, Tuesday, Wednesday and Thursday incremental backups, in order (1).

**Q: Explain the difference between RPO and RTO. [2]**
RPO is how much recent data (measured in time) may be lost, back to the last backup (1); RTO is how long the system may be unavailable while it is restored (1).

**Q: Explain why a backup should be kept offline. [2]**
Ransomware can encrypt any storage that is connected to the network (1), so a disconnected copy stays undamaged and can be restored (1).

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
