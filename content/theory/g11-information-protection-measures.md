---
summary: Data availability, privacy and integrity, and why data and computer systems must be protected.
---
# Availability, privacy and integrity
@lo 11.1.2.1

Information security aims to protect three properties of data, often called the **CIA triad** (confidentiality, integrity, availability).

:::cards
### Data privacy (confidentiality)
Data can be **seen only by authorised people**. *A student's medical record must not be readable by other students.* Protected by passwords, access rights, encryption.
### Data integrity
Data is **accurate, complete and unchanged** except by authorised, valid changes. *A bank balance must not be altered by an error or an attacker.* Protected by validation, verification, access rights, checksums, backups.
### Data availability
Data and systems are **accessible to authorised users when they need them**. *The online exam system must work during the exam.* Protected by backups, disk mirroring, redundant hardware, protection against DoS attacks.
:::

:::compare Threats to each property
| Property | Example threat | Protection |
|---|---|---|
| Privacy | Hacker reads personal data; shoulder-surfing a password | Encryption, strong passwords, 2FA, access levels |
| Integrity | Virus corrupts files; operator types the wrong value; unauthorised edit | Validation/verification, permissions, audit logs, backups |
| Availability | Hardware failure, power cut, DDoS attack, ransomware | Backups, RAID mirroring, UPS, firewalls, anti-malware |
:::

:::tip
Keep the three apart: **privacy** = who can **see** it; **integrity** = is it **correct**; **availability** = can it be **used when needed**.
:::

# Why data and systems must be protected
@lo 11.1.2.2@paper

- **Legal duty:** data protection laws (e.g. the Law of the Republic of Kazakhstan "On personal data and its protection") require organisations to keep personal data secure; breaking them leads to fines.
- **Privacy of individuals:** leaked personal data can lead to identity theft, fraud, blackmail or discrimination.
- **Financial loss:** stolen money, ransom payments, cost of recovering systems, lost sales while systems are down.
- **Reputation and trust:** customers leave an organisation that loses their data.
- **Business continuity:** without data (orders, accounts, medical records) the organisation cannot work.
- **Safety:** attacks on hospitals, transport or power systems can endanger lives.
- **Intellectual property:** designs, source code and research must not be stolen by competitors.

:::example Arguments in context — a school
The school stores students' names, addresses, grades and medical data. If the system is not protected, an attacker could **publish personal data** (privacy), **change grades** (integrity) or **lock the system with ransomware before exams** (availability). The school would break the law and lose the trust of parents.
:::
