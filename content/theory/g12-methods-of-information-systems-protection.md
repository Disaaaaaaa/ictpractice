---
summary: The ethical and legal problems caused by cracking (hacking) computer systems, how to protect data from unauthorised access, the problems caused by different types of malware, and what privacy policies are and what they contain.
---
# Computer system cracking
@lo 12.1.3.1

:::definition Hacking / cracking
**Gaining unauthorised access** to a computer system, network or data — by guessing or stealing passwords, exploiting software weaknesses or tricking people. **Cracking** usually means breaking into systems or breaking software protection **with malicious intent**.
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
| Method | How it works |
|---|---|
| **Brute-force attack** | A program tries **every possible password** until one works |
| **Dictionary attack** | Tries common words and leaked passwords |
| **Phishing / social engineering** | Tricks people into **revealing passwords** with fake e-mails, websites or phone calls |
| **Exploiting vulnerabilities** | Uses **bugs in unpatched software** to get in |
| **SQL injection** | Types SQL code into a web form to read or change the database |
| **Interception (man-in-the-middle)** | Captures data sent over an **unencrypted** network, e.g. public Wi-Fi |
| **Keylogger / spyware** | Records the keys a user types, including passwords |
:::

# Ethical and legal problems of cracking
@lo 12.1.3.1

:::compare Problems caused by cracking
| For individuals | For organisations | For society |
|---|---|---|
| **Identity theft** — criminals use stolen personal details | **Financial loss** — stolen money, fines, cost of recovery | Loss of **trust** in online banking, e-government, shopping |
| Theft of money from bank accounts | **Theft of confidential data** — customers' details, trade secrets | Attacks on **critical infrastructure** (power, hospitals, transport) |
| **Invasion of privacy** — private messages, photos published | **Damage to reputation** — customers leave | **Political** misuse — leaked documents, election interference |
| Blackmail and stress | **Downtime** — systems unavailable, work stops | Cost passed to everyone through higher prices and taxes |
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

:::example Ethical dilemma — analyse it
*A student discovers that the school's marking website lets anyone see every pupil's marks by changing a number in the address bar. She shows her friends.*

- **Ethical problem:** she accessed other pupils' **private data** without permission and shared it — a breach of their privacy.
- **Legal problem:** this is **unauthorised access**, even though the website was badly designed.
- **The right action:** report the weakness **privately** to the school's IT staff (responsible disclosure) without using or sharing the data.
- **The school's responsibility:** it failed to protect personal data and must fix the vulnerability.
:::

# Protecting data from unauthorised access
@lo 12.1.2.3

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

:::compare Authentication vs authorisation
| | Authentication | Authorisation |
|---|---|---|
| Question | **Who are you?** | **What are you allowed to do?** |
| How | Password, biometrics, 2FA, smart card | Access rights: read, write, delete, execute |
| Example | A teacher logs in with a password and code | The teacher can edit marks, a pupil can only view their own |
:::

:::example Protecting a school database against cracking (exam style)
- Enable **two-factor authentication** for staff.
- Increase **password complexity** and limit **login attempts**.
- Use the **SSL / TLS protocol** (HTTPS) so data is encrypted in transit.
- **Encrypt** stored data and **hash** passwords.
- Give pupils and teachers **different access rights**.
:::

# Problems caused by malware
@lo 12.1.3.2

:::definition Malware (malicious software)
Software designed to **damage, disrupt or gain unauthorised access** to a computer system or data.
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

:::callout info Countermeasures
Anti-virus software with up-to-date signatures, firewalls, software updates, not opening unknown attachments or links, downloading only from trusted sources, limited user rights and **regular offline backups** (see **Data protection measures**).
:::

# Privacy policies
@lo 12.1.3.3

:::definition Privacy policy
A **legal document** published by an organisation (on its website or app) that **explains what personal data it collects, why it collects it, how it is used, stored and protected, who it is shared with, and what rights the user has**.
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

# Exam practice and summary
@lo 12.1.3.1 12.1.2.3 12.1.3.2 12.1.3.3

:::example Exam-style answers
**Q: The school database is always at risk of system cracking. Write ways to protect against cracking. [2]**
Enable **two-factor authentication** (1); increase **password complexity** / limit login **attempts** / use the **SSL protocol** / **encrypt** the data / **hash** passwords (1).

**Q: Give two measures that the company can take to protect confidential data from being stolen. [2]**
**Encrypting** data (1); granting **limited access rights** (1). *(Also: blocking access from certain locations, keeping logs of user entries.)*

**Q: Analyse one ethical problem that arises when a hacker cracks a hospital system. [2]**
Patients' **confidential medical records** may be exposed or sold (1), violating their **privacy** and possibly causing discrimination or blackmail; treatment may also be **delayed** if systems stop working, putting lives at risk (1).

**Q: Explain the purpose of a privacy policy. [2]**
It **tells users what personal data is collected and how it is used, stored and shared** (1), so that they can give **informed consent** and know their **rights** (1).
:::

:::warning Common mistakes
- Saying a **firewall** removes viruses, or that **anti-virus** blocks hackers — say what each one actually does.
- Confusing a **virus** (needs a host file and user action) with a **worm** (spreads on its own).
- Describing a privacy policy as "a policy about privacy" — say **what it contains**.
- Giving consequences without **analysing** them: *who* is harmed and *how*.
:::

:::steps Check yourself
- What is the difference between black-hat, white-hat and grey-hat hackers?
- Name four cracking methods and a countermeasure for each.
- Give two ethical and two legal problems caused by cracking.
- Explain the difference between authentication and authorisation.
- Describe five types of malware and the problems each causes.
- List six things a privacy policy should explain.
:::
