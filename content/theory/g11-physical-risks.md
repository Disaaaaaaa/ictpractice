---
summary: Physical and environmental risks that cause data loss (hardware failure, power problems, fire, flood, theft, accidental damage, human error) and how to prevent them; backups — full, incremental and differential, media, the 3-2-1 rule, schedules and off-site storage; disk mirroring (RAID 1) and other RAID levels; a detailed comparison of backup and mirroring, and the consequences of not using them.
---
# Physical risks of data loss
@lo 11.1.2.2

Data can be lost not only through hackers and viruses but also through **physical** events that damage or destroy the **hardware** where it is stored. These are **physical risks**.

:::compare Physical risks and how to prevent them
| Risk | Example | Prevention |
|---|---|---|
| **Hardware failure** | Hard disk crash, overheating, worn-out SSD, failed power supply | Backups, RAID mirroring, cooling, replacing old hardware, monitoring disk health |
| **Power cut / surge** | Data in RAM lost; files corrupted while being saved | **UPS** (uninterruptible power supply), surge protectors, autosave |
| **Fire, flood, natural disaster** | Server room destroyed | **Off-site / cloud backups**, fire-proof safes, smoke detectors and gas fire suppression, servers above ground level |
| **Theft** | Laptop, server or USB drive stolen | Locks, CCTV, security staff, alarm systems, **encryption** of portable devices |
| **Accidental damage** | Coffee spilt on a laptop, device dropped | Careful handling, protective cases, backups |
| **Human error** | Deleting or overwriting files, formatting the wrong disk | Training, access rights, backups, "recycle bin", confirmation messages |
| **Unauthorised physical access** | Someone plugs a USB into a server | Locked server rooms, ID cards, **biometric** doors, visitor logs |
:::

:::cards
### Environmental risks
- **Heat** — computers overheat and fail; server rooms need **air conditioning**.
- **Humidity and water** — corrosion and short circuits; keep away from pipes and windows.
- **Dust** — blocks fans and causes overheating; regular cleaning.
- **Magnetic fields** — can damage data on magnetic disks and tapes.
### Effects of losing data
- Work must be **redone**; orders, records and history may be **lost for ever**.
- The organisation may **stop working** (downtime) and lose **money** and **customers**.
- Personal data on a stolen device can lead to **identity theft** and **legal** consequences.
:::

:::callout info UPS — uninterruptible power supply
A **battery unit** between the mains and the computer. When the power fails it supplies electricity for a few minutes, so the computer can **save the data** and **shut down safely**. It also protects against **surges** and **spikes**.
:::

# Backup
@lo 11.1.2.3

:::definition Backup
A **copy of data** made at regular times and stored **separately** (another disk, tape, cloud, another building) so that the data can be **restored** after loss.
:::

:::cards
### Full backup
Copies **all** data every time. Easy to restore; slow and uses most storage.
### Incremental backup
Copies only data **changed since the last backup** (of any kind). Fast, small; restoring needs the full backup plus every increment.
### Differential backup
Copies everything changed **since the last full backup**. Restoring needs only the full backup and the latest differential.
:::

:::example Restoring after a crash on Thursday
A full backup is made on **Sunday**; the disk fails on **Thursday morning**.
| Strategy | Backups made | What is needed to restore |
|---|---|---|
| Full every day | Full Sun, Mon, Tue, Wed | Only **Wednesday's** full backup |
| Full + incremental | Full Sun; incremental Mon, Tue, Wed | Sunday full **+ Mon + Tue + Wed** incrementals (in order) |
| Full + differential | Full Sun; differential Mon, Tue, Wed | Sunday full **+ Wednesday's** differential |

In every case the work done **on Thursday before the crash** is lost — it was not yet backed up.
:::

:::compare Backup media and locations
| Medium | Advantages | Disadvantages |
|---|---|---|
| **External HDD / SSD** | Cheap, large, fast | Can be lost, stolen or damaged with the computer if kept nearby |
| **Network storage (NAS / server)** | Automatic backups of many computers | In the same building — fire or theft affects both |
| **Cloud backup** | **Off-site**, automatic, accessible from anywhere | Needs Internet; monthly cost; data held by a third party (security) |
| **Magnetic tape** | Very large and cheap per GB, long life | Slow, **sequential** access — restoring takes time |
| **USB flash drive / optical disc** | Portable, cheap for small amounts | Small capacity, easy to lose |
:::

:::cards
### Good backup practice
- **Regular schedule** — daily, or after every **critical change**; automatic where possible.
- **3-2-1 rule** — keep **3** copies of the data, on **2** different media, with **1** copy **off-site** (another building or the cloud).
- Store backups **in a location separate from the original** — so a fire or flood does not destroy both.
- **Encrypt** backups and keep them **secure**.
- **Test** restoring regularly — a backup that cannot be restored is useless.
- Keep **several older versions** (e.g. grandfather–father–son rotation) to recover from viruses or mistakes found later.
:::

# Disk mirroring
@lo 11.1.2.3

:::definition Disk mirroring (RAID 1)
Data is written to **two (or more) disks at the same time**, so the disks are identical copies. If one disk fails, the system continues using the other **without interruption**.
:::

:::ascii Disk mirroring: every write goes to both disks
             write "Order 1052"
   Computer ─────────┬─────────────
                     │             │
                ┌────▼────┐   ┌────▼────┐
                │ Disk 1  │   │ Disk 2  │     identical copies
                │ Order…  │   │ Order…  │
                └─────────┘   └─────────┘
   Disk 1 fails → the system keeps running from Disk 2; the failed disk is replaced
   and the mirror is rebuilt.
:::

:::cards
### Advantages of mirroring
- **Instant data recovery** if one disk fails — no restore needed.
- The system keeps **working without interruption** — business continuity.
- **No data is lost** — every change is on both disks in **real time**.
- Reading can be faster (data read from either disk).
### Disadvantages of mirroring
- **Storage capacity is halved** — two disks hold one copy of data; extra cost.
- Copies **mistakes** too: deleted files, viruses and ransomware are written to both disks immediately.
- Both disks are in the **same place** — no protection against fire, flood or theft.
- If the **controller** fails, both disks may be affected; a failed disk must be replaced quickly.
:::

:::compare RAID levels (Redundant Array of Independent Disks)
| Level | How it works | Protects data? |
|---|---|---|
| **RAID 0** (striping) | Data split across disks for speed | **No** — one failed disk loses everything |
| **RAID 1** (mirroring) | Identical copy on each disk | **Yes** — survives one disk failure |
| **RAID 5** (striping with parity) | Data and parity spread over 3+ disks | **Yes** — survives one disk failure; uses less extra space than mirroring |
:::

# Backup vs disk mirroring
@lo 11.1.2.3

:::compare Backup vs disk mirroring
| | Backup | Disk mirroring |
|---|---|---|
| **When copied** | At **intervals** (daily, weekly) | **Continuously**, in real time |
| **Location** | Can be **off-site / cloud** | Usually in the **same** computer or server |
| **Protects against hardware failure** | Yes, but data since the last backup is **lost** and restoring takes **time** | Yes — **no data lost**, **no downtime** |
| **Protects against deletion, viruses, ransomware** | **Yes** — older versions can be restored | **No** — the deletion or corruption is copied to the mirror immediately |
| **Protects against fire / theft** | Yes, if stored **off-site** | **No** — both disks are lost together |
| **Recovery speed** | Slow — data must be restored | **Instant** |
| **Cost** | Cheaper storage media | Needs a second identical disk for every disk |
:::

:::tip
The key comparison: **mirroring gives continuous availability** but copies mistakes too; a **backup can restore earlier versions** but is only as recent as the last backup. Organisations usually use **both**.
:::

:::compare Consequences of not using these measures
| Missing measure | Possible consequences |
|---|---|
| **No (or poor) backup** | **Data loss** — critical data lost for ever after hardware failure, human error, fire or malware; work must be redone |
| **No disk mirroring** | **Downtime** while data is recovered or reconstructed; **operational disruption**; transactions lost since the last backup |
| **Poorly implemented mirroring** | Storage capacity reduced by the copies; a failed drive left unreplaced means the next failure loses data |
| **Backups kept next to the server** | Fire, flood or theft destroys the original and the backup together |
:::

# Exam practice and summary
@lo 11.1.2.2 11.1.2.3

:::example Exam-style answers
**Q: Describe how backup helps prevent data loss in the event of a fire. [1]**
If the original data is destroyed in the fire, the **backup** (stored elsewhere / in the cloud) can be used to **restore** it (1).

**Q: Suggest one recommendation to ensure that the latest data is not lost in the event of a fire. [1]**
Perform backups **after every critical change** / store a copy **in a location separate from the fire area** (1).

**Q: Describe one advantage of disk mirroring over backup. [1]**
**Instant recovery** — if one disk fails the system **continues without interruption** with up-to-date data on the second disk (1).

**Q: Give one consequence of not using data backup. [1]**
**Loss of critical data** after hardware failure, human error or malware (1).
:::

:::warning Common mistakes
- Saying mirroring protects against **viruses** or **deletion** — it **copies** them to the second disk.
- Saying a backup is "a second disk that is always up to date" — that is **mirroring**.
- Keeping backups in the **same room** as the original and claiming they protect against fire.
- Confusing **incremental** (since the last backup) and **differential** (since the last full backup).
:::

:::steps Check yourself
- List six physical risks and one prevention for each.
- What does a UPS do?
- Compare full, incremental and differential backups; which backups are needed to restore on Thursday?
- What is the 3-2-1 rule?
- Explain how disk mirroring works and give two disadvantages.
- Give three differences between backup and disk mirroring.
:::
