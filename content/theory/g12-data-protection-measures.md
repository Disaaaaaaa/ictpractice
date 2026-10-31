---
summary: Measures that protect data and computer systems — protection against physical risks, firewalls (inter-network screens), encryption, biometrics and anti-virus countermeasures — and using data backup and disk mirroring (RAID 1) to keep data safe.
---
# Threats and protection measures
@lo 12.1.2.1

Data and computer systems are at risk from **people** (hackers, thieves, careless users), **malicious software** and **physical events** (fire, flood, power cuts, hardware failure). No single measure protects against everything, so organisations use **several layers of protection** ("defence in depth").

:::compare Threats and the measures that protect against them
| Threat | Main protection measures |
|---|---|
| Fire, flood, power cut, theft of hardware | **Physical security**, UPS, fire-suppression systems, **backup** stored off-site |
| Hard disk failure | **Disk mirroring (RAID)**, **backup** |
| Hacking / unauthorised network access | **Firewall**, strong passwords, **two-factor authentication**, access rights |
| Interception of data in transit, stolen laptops | **Encryption** |
| Someone using another person's account | **Biometrics**, two-factor authentication |
| Viruses, worms, Trojans, ransomware | **Anti-virus** software, updates, user training, backup |
| Accidental deletion | **Backup**, access rights, version history |
:::

## What we are protecting: confidentiality, integrity, availability

:::cards
### Confidentiality
Only **authorised** people can **read** the data. Broken when a hacker reads pupils' marks or a laptop with customers' data is stolen. Protected by **access rights, passwords, encryption**.
### Integrity
The data is **correct and complete** and is changed only by authorised people. Broken when a virus corrupts files or a pupil changes marks. Protected by **access rights, validation, anti-virus, backups**.
### Availability
The data and the system can be **used when they are needed**. Broken by a power cut, a failed disk or ransomware. Protected by **UPS, disk mirroring, backups**.
:::

:::example Layers of protection for a school server
1. **Physical:** the server is in a locked, air-conditioned room with a UPS.
2. **Network:** a firewall between the school network and the Internet.
3. **Access:** every user has their own account, a strong password and only the rights they need.
4. **Data:** sensitive data is encrypted; anti-virus scans every file.
5. **Recovery:** disks are mirrored and a backup is made every night and kept off-site.

If one layer fails — for example a teacher's password is stolen — the other layers still protect the data.
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
- Can **block access** to certain websites or applications.
- **Logs** attempts to connect, so attacks can be investigated.
- Can hide the internal addresses of the network from outsiders.
### Limitations
- Cannot stop malware that arrives through **allowed** channels (e-mail attachments, USB sticks).
- Does not protect against **insiders** already inside the network.
- Must be **configured correctly** — bad rules either block useful traffic or let attacks through.
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

:::compare Symmetric and asymmetric encryption
| | Symmetric | Asymmetric (public-key) |
|---|---|---|
| Keys | The **same key** encrypts and decrypts | A **public key** encrypts, a **private key** decrypts |
| Speed | Fast | Slower |
| Problem | The key must be shared **securely** | Solves key sharing — the public key can be given to anyone |
| Example use | Encrypting a hard disk (BitLocker), files | HTTPS, secure e-mail, digital signatures |
:::

:::cards
### Where encryption is used
- **HTTPS / SSL / TLS** — web pages, online banking, payments.
- **Full-disk encryption** on laptops and phones, encrypted USB drives.
- **Wi-Fi** (WPA2 / WPA3).
- Messaging apps with end-to-end encryption.
- Storing **passwords** as hashes (one-way) rather than plain text.
### Advantages and disadvantages
- ✔ Stolen or intercepted data cannot be read.
- ✔ Protects data on lost devices.
- ✘ If the **key is lost**, the data is lost too.
- ✘ Takes processing time; does not stop deletion or ransomware.
:::

## A simple cipher: the Caesar cipher

:::example Shift each letter 3 places forward
| Plain | A | B | C | … | X | Y | Z |
|---|---|---|---|---|---|---|---|
| Cipher | D | E | F | … | A | B | C |

`CAT` → `FDW`; `HELLO` → `KHOOR`. The **algorithm** is "shift the letters"; the **key** is **3**. To decrypt, shift back by 3. With only 25 possible keys it is broken in seconds by trying all of them (**brute force**) — real encryption uses keys with billions of billions of possibilities.
:::

:::steps How HTTPS uses both kinds of encryption
- The browser connects to `https://` and receives the website's **public key** (in its digital certificate).
- The browser creates a **session key** and sends it **encrypted with the public key** — only the website's **private key** can decrypt it (**asymmetric**).
- From then on, all data is encrypted with the fast **symmetric** session key.
- Result: the key is shared safely **and** the data travels quickly.
:::

# Exam practice: threats, firewalls and encryption
@lo 12.1.2.1

:::example Exam-style answers
**Q: State one threat that a firewall cannot protect against. [1]**
Malware in an e-mail attachment or on a USB stick / an insider already in the network / weak passwords.

**Q: Explain how encryption protects pupils' marks if a teacher's laptop is stolen. [2]**
The data is stored as **ciphertext** (1); the thief cannot read it without the **key / password** (1).

**Q: Explain why a server is connected to a UPS. [2]**
If the power fails, the UPS **battery keeps the server running** (1) so data can be saved and the server **shut down safely** — no corruption or data loss (1).
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
