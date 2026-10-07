---
summary: Physical risks that cause data loss and how backup and disk mirroring protect data, with a comparison of the two.
---
# Physical risks of data loss
@lo 11.1.2.2

:::compare
| Risk | Example | Prevention |
|---|---|---|
| Hardware failure | Hard disk crash, overheating, worn-out SSD | Backups, RAID mirroring, cooling, replacing old hardware |
| Power cut / surge | Data in RAM lost; files corrupted during saving | **UPS** (uninterruptible power supply), surge protectors, autosave |
| Fire, flood, natural disaster | Server room destroyed | Off-site / cloud backups, fire-proof safes, smoke detectors, servers above ground level |
| Theft | Laptop or USB drive stolen | Locks, CCTV, security staff, encryption of portable devices |
| Accidental damage | Coffee spilt on a laptop, device dropped | Careful handling, protective cases, backups |
| Human error | Deleting or overwriting files | Training, access rights, backups, "recycle bin" |
| Unauthorised physical access | Someone plugs a USB into a server | Locked server rooms, ID cards, biometric doors |
:::

# Backup and disk mirroring
@lo 11.1.2.3

:::definition Backup
A **copy of data** made at regular times and stored **separately** (another disk, tape, cloud, another building) so that the data can be **restored** after loss.
:::

:::definition Disk mirroring (RAID 1)
Data is written to **two (or more) disks at the same time**, so the disks are identical copies. If one disk fails, the system continues using the other **without interruption**.
:::

:::cards
### Full backup
Copies **all** data every time. Easy to restore; slow and uses most storage.
### Incremental backup
Copies only data **changed since the last backup** (of any kind). Fast, small; restoring needs the full backup plus every increment.
### Differential backup
Copies everything changed **since the last full backup**. Restoring needs only the full backup and the latest differential.
:::

:::compare Backup vs disk mirroring
| | Backup | Disk mirroring |
|---|---|---|
| When copied | At intervals (daily, weekly) | Continuously, in real time |
| Location | Can be off-site / cloud | Usually in the same computer or server |
| Protects against hardware failure | Yes, but data since the last backup is lost and restoring takes time | Yes — no data lost, no downtime |
| Protects against deletion, viruses, ransomware | **Yes** — older versions can be restored | **No** — the deletion or corruption is copied to the mirror immediately |
| Protects against fire/theft | Yes, if stored off-site | No — both disks are lost together |
| Cost | Cheaper storage media | Needs a second identical disk for every disk |
:::

:::tip
The key comparison: **mirroring gives continuous availability** but copies mistakes too; a **backup can restore earlier versions** but is only as recent as the last backup. Organisations usually use **both**.
:::
