---
summary: Measures that protect data and computer systems — physical security, firewalls, encryption, biometrics and anti-virus protection — and using backups and disk mirroring.
---
# Protection measures for data and computer systems
@lo 12.1.2.1

:::cards
### Protection against physical risks
Locked server rooms, CCTV, ID cards; UPS against power cuts; fire alarms and extinguishers; air conditioning; off-site backups against fire and flood.
### Firewalls (inter-network screens)
Filter traffic between a network and the Internet using rules on IP addresses, ports and protocols; block unauthorised access and suspicious outgoing connections.
### Encryption
Scrambles data with a **key** so that intercepted or stolen data cannot be read without the key. Used for Wi-Fi (WPA3), websites (HTTPS/TLS), disks (BitLocker), messages.
### Biometrics
Identify a person by unique **physical characteristics**: fingerprint, face, iris, voice. Cannot be forgotten or easily shared.
### Anti-virus / anti-malware
Detects, quarantines and removes malicious programs; real-time scanning; must be updated.
:::

## Encryption

:::compare Symmetric vs asymmetric encryption
| | Symmetric | Asymmetric (public-key) |
|---|---|---|
| Keys | **One** secret key encrypts and decrypts | A **public key** encrypts; only the matching **private key** decrypts |
| Speed | Fast | Slower |
| Problem | The key must be shared securely | Solves key sharing — the public key can be given to anyone |
| Example | AES for disk encryption | RSA in HTTPS key exchange, digital signatures |
:::

:::example Caesar cipher — the simplest symmetric cipher (shift 3)
`HELLO` → `KHOOR`. The **key** is the shift. Modern ciphers are far stronger, but the idea is the same: without the key the text is unreadable.
:::

## Biometrics

:::compare
| Advantages | Disadvantages |
|---|---|
| Unique to each person; cannot be forgotten or lost | Expensive equipment |
| Difficult to copy or share | Can be affected by injuries, dirt, lighting, illness |
| Fast access | **Cannot be changed** if the biometric data is stolen |
| | Privacy concerns about storing biometric data |
:::

:::compare Authentication factors
| Factor | Examples |
|---|---|
| Something you **know** | Password, PIN, security question |
| Something you **have** | Phone (SMS code, authenticator app), smart card, key fob |
| Something you **are** | Fingerprint, face, iris |
:::

:::tip
**Two-factor authentication (2FA)** combines two different factors (e.g. password + SMS code), so a stolen password alone is not enough.
:::

# Backup and disk mirroring
@lo 12.1.2.2

:::cards
### Backup
A copy of the data made **at intervals** and stored separately (external disk, NAS, cloud, another site). Can restore **older versions**.
### Disk mirroring (RAID 1)
Every write goes to **two disks at once**; if one disk fails, the other continues **immediately**.
:::

:::compare A backup strategy for a school
| Decision | Example choice | Reason |
|---|---|---|
| What | Student database, documents, website | Data that cannot be recreated |
| How often | Incremental every night, full every Sunday | Little data lost; fast nightly backups |
| Where | Encrypted cloud storage + an external disk off-site | Survives fire/theft at school |
| Retention | Keep 4 weekly full backups | Can go back to before a ransomware attack |
| Testing | Restore a test file every month | A backup that cannot be restored is useless |
| Mirroring | RAID 1 on the server | No downtime if a disk fails |
:::

:::warning
Mirroring **copies mistakes instantly** — a deleted or encrypted (ransomware) file is lost on both disks. Only a **backup** protects against that.
:::
