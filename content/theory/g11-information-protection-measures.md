---
summary: The meaning of data security, data privacy and data integrity and how they differ, the CIA triad (confidentiality, integrity, availability), threats to data — accidental and deliberate, internal and external — with the measures that protect each property, data protection law, and arguments for why data and computer systems must be protected in schools, banks, hospitals and businesses.
---
# Security, privacy and integrity
@lo 11.1.2.1

Three terms are often confused in exam questions: **data security**, **data privacy** and **data integrity**. They are related, but each answers a different question.

:::definition Data security
The **protection of data and computer systems** from **unauthorised access**, **loss**, **damage** or **misuse** — whether accidental or deliberate. It is about the **methods** used: passwords, access rights, encryption, firewalls, backups, physical locks.
:::

:::definition Data privacy
The **right of individuals** to control **who can see and use their personal data**, and the duty of organisations to keep personal data **confidential** and use it only for the purpose it was collected for.
:::

:::definition Data integrity
Data is **accurate, complete, consistent and up to date**, and has **not been changed** except by authorised, valid changes. It is protected by **validation**, **verification**, access controls and backups.
:::

:::compare Security vs privacy vs integrity
| | Data security | Data privacy | Data integrity |
|---|---|---|---|
| **Question it answers** | Is the data **protected**? | **Who** is allowed to see it? | Is the data **correct**? |
| **Focus** | Methods that **prevent unauthorised access**, loss and damage | **Personal** data kept **confidential**; individuals' rights | **Accuracy** and **validity** of data |
| **Threats** | Hacking, malware, theft, fire, hardware failure | Leaks, selling data without consent, shoulder-surfing | **Human error** during entry, corruption, unauthorised changes |
| **Measures** | Passwords, encryption, firewalls, backups, physical security | Access rights, encryption, privacy policies, data protection laws | **Validation**, **verification**, checksums, permissions, audit logs |
| **Example** | A firewall stops an attacker reaching the school server | Only the nurse can read pupils' medical records | A range check stops a mark of 150 being saved |
:::

:::tip Differences the mark scheme accepts
- **Data integrity** deals with the **validity** of data, while **security** deals with the **protection** of data.
- **Data security** avoids **unauthorised access** to data, while **integrity** avoids **human error** when data is entered.
- **Security** is the means; **privacy** is the aim of keeping personal data confidential — data can be secure but used in a way that breaks privacy (e.g. sold to advertisers).
:::

# The CIA triad
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

# Threats and protection measures
@lo 11.1.2.1 11.1.2.2@paper

:::compare Kinds of threat
| | Accidental | Deliberate |
|---|---|---|
| **Internal** (inside the organisation) | Typing errors, deleting a file by mistake, spilling coffee on a laptop, losing a USB drive | An employee copying customer data to sell, changing records for personal gain |
| **External** (outside) | Fire, flood, power cut, hardware failure, lightning | Hacking, malware, phishing, DDoS attacks, theft of equipment |
:::

:::compare Types of protection measure
| Type | Examples | Mainly protects |
|---|---|---|
| **Physical** | Locked server rooms, ID cards, CCTV, fire alarms, UPS, cable locks | Security, availability |
| **Logical (software)** | User names and passwords, two-factor authentication, access rights, encryption, firewalls, anti-malware | Security, privacy |
| **Data checks** | Validation (range, presence, type, format), verification (double entry, visual check), checksums, parity bits | **Integrity** |
| **Recovery** | Regular backups, off-site / cloud copies, disk mirroring (RAID 1) | Availability, integrity |
| **Administrative** | Privacy policies, staff training, audit logs, least-privilege access, disposal procedures | All three |
:::

:::example Validation and verification protect integrity
- **Validation** — the computer checks that data is **reasonable**: a pupil's grade must be 7–12 (range check), the e-mail must contain "@" (format check).
- **Verification** — checks that data was **entered or copied correctly**: the password is typed **twice** (double entry), the operator **compares** the screen with the original form (visual check).
- A **checksum** is calculated before and after data is transmitted; if the values differ, the data was corrupted.
:::

:::callout info Data protection law
The **Law of the Republic of Kazakhstan "On personal data and its protection"** (and the EU's **GDPR**) require organisations to collect personal data only **with consent** and for a **clear purpose**, keep it **accurate** and **secure**, store it no **longer than necessary**, and let people **see and correct** their data. Breaking the law can lead to **fines** and legal action.
:::

# Why data and systems must be protected
@lo 11.1.2.2@paper

:::cards
### Legal and ethical reasons
- **Legal duty:** data protection laws require organisations to keep personal data secure; breaking them leads to **fines** and court cases.
- **Privacy of individuals:** leaked personal data can lead to **identity theft**, **fraud**, **blackmail** or **discrimination**.
### Financial reasons
- **Stolen money**, **ransom** payments, the cost of **recovering** systems and data.
- **Lost sales and productivity** while systems are down.
### Organisational reasons
- **Reputation and trust:** customers, parents and patients leave an organisation that loses their data.
- **Business continuity:** without data (orders, accounts, medical records) the organisation **cannot work**.
- **Intellectual property:** designs, source code and research must not be stolen by competitors.
### Safety reasons
- Attacks on **hospitals**, **transport**, **power** or **water** systems can **endanger lives**.
- Wrong data (integrity) in medical or engineering systems can cause **harm**.
:::

:::example Arguments in context — a school
The school stores students' names, addresses, grades and medical data. If the system is not protected, an attacker could **publish personal data** (privacy), **change grades** (integrity) or **lock the system with ransomware before exams** (availability). The school would break the law and lose the trust of parents.
:::

:::compare Arguments in other contexts
| Organisation | Data | What could happen without protection |
|---|---|---|
| **Bank** | Account numbers, balances, card details | Money stolen; balances altered; customers lose trust; heavy fines |
| **Hospital** | Patient records, test results | Wrong treatment if records are changed; private health data leaked; operations delayed if the system is unavailable |
| **Online shop** | Addresses, orders, payment details | Fraud with card details; orders lost; shop closed during an attack |
| **Government (e-gov)** | ID numbers, tax and property records | Identity theft; fake documents; public services stop |
:::

# Exam practice and summary
@lo 11.1.2.1 11.1.2.2@paper

:::example Exam-style answers
**Q: State two differences between the terms data security and data integrity. [2]**
Data **integrity** deals with the **validity / accuracy** of data, while **security** deals with **protecting** data (1). Data security avoids **unauthorised access** to data, while integrity avoids **human error** when data is entered (1).

**Q: Explain the difference between data privacy and data security. [2]**
**Privacy** is about **who is allowed** to see and use **personal data** (1); **security** is the **methods** (passwords, encryption, firewalls) used to protect the data from unauthorised access and loss (1).

**Q: Give two reasons why a hospital must protect its computer systems. [2]**
Patients' **private health data** could be leaked, breaking the law (1); if records were **changed** or **unavailable**, patients could receive the **wrong treatment** (1).
:::

:::warning Common mistakes
- Using "security" and "privacy" as the same word — **security** is the protection; **privacy** is the right to keep personal data confidential.
- Saying integrity means "data is kept secret" — integrity means data is **correct and unchanged**.
- Giving the same argument twice in different words ("hackers steal data" and "data gets stolen").
- Forgetting **accidental** threats such as human error and hardware failure.
:::

:::steps Check yourself
- Define data security, data privacy and data integrity.
- Give two differences between security and integrity.
- What does each letter of the CIA triad stand for? Give one threat and one measure for each.
- Classify threats as accidental/deliberate and internal/external.
- How do validation and verification protect integrity?
- Give four arguments for protecting the data of a bank.
:::
