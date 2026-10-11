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

# Biometrics
@lo 12.1.2.1

:::definition Biometrics
Authentication using **unique physical or behavioural characteristics** of a person, which are compared with a stored **template**. Examples: **fingerprint**, **face recognition**, **iris / retina scan**, **voice recognition**, **hand geometry**, **signature dynamics**.
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

# Computer virus countermeasures
@lo 12.1.2.1

:::definition Anti-virus software
A utility program that **scans** files, e-mails, downloads and memory to **detect, quarantine and remove malware** (viruses, worms, Trojans, spyware, ransomware).
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
