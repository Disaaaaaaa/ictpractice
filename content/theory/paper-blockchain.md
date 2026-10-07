---
summary: How blockchain works — blocks, hashes, chains, distributed ledgers and consensus — and where blockchain technology is used.
---
# How blockchain works
@lo 11.1.2.6@paper

:::definition Blockchain
A **decentralised, distributed digital ledger** in which records (transactions) are grouped into **blocks** that are **linked in a chain by cryptographic hashes** and copied to many computers (**nodes**), so that records cannot be changed without detection.
:::

:::cards
### Block
Contains a set of **transactions/data**, a **timestamp**, its own **hash**, and the **hash of the previous block**.
### Hash
A fixed-length "fingerprint" calculated from the block's contents (e.g. SHA-256). Changing even one character gives a completely different hash.
### Chain
Each block stores the previous block's hash, so blocks are linked in order back to the first (**genesis**) block.
### Distributed ledger
Every node keeps a **full copy** of the blockchain; there is no central authority.
### Consensus
Nodes must **agree** before a new block is added — e.g. **proof of work** (mining: solving a hard puzzle) or **proof of stake**.
:::

:::mermaid Blocks linked by hashes
flowchart LR
  B1["Block 1<br/>data<br/>hash: 1A2F<br/>prev: 0000"] --> B2["Block 2<br/>data<br/>hash: 7C9E<br/>prev: 1A2F"] --> B3["Block 3<br/>data<br/>hash: 44B0<br/>prev: 7C9E"]
:::

:::steps Adding a transaction
- A user requests a transaction (e.g. send 1 coin to Asel), signed with their **private key**.
- The transaction is **broadcast** to the network of nodes.
- Nodes **validate** it (digital signature, enough balance).
- Valid transactions are grouped into a new **block**.
- Nodes reach **consensus** (e.g. a miner solves the proof-of-work puzzle).
- The block is **added to the chain** on every node; the transaction is complete.
:::

:::callout info Why it is tamper-resistant
If someone changes data in Block 2, its hash changes, so Block 3's "previous hash" no longer matches and the chain is broken. The attacker would have to recalculate every following block **on most of the nodes at once**, which is practically impossible.
:::

:::compare Uses of blockchain
| Area | Example |
|---|---|
| Cryptocurrencies | Bitcoin, Ethereum — payments without banks |
| Smart contracts | Programs on the blockchain that run automatically when conditions are met |
| Supply chains | Tracking food or medicines from producer to shop |
| Finance | Faster international transfers, record keeping |
| Digital identity and certificates | Tamper-proof diplomas, land registries |
| Voting | Transparent, verifiable records of votes |
| Games and digital ownership | NFTs, in-game items; domain names |
:::

:::compare Advantages and disadvantages
| Advantages | Disadvantages |
|---|---|
| Very hard to tamper with — high data integrity | Proof of work uses huge amounts of **electricity** |
| No central authority or single point of failure | Slow and limited number of transactions per second |
| Transparent — everyone can verify records | Mistakes cannot be undone; lost private keys = lost assets |
| Lower cost for some transactions (no intermediaries) | Legal and regulatory uncertainty; used in some crimes |
| | Data stored on a public chain is visible (privacy) |
:::
