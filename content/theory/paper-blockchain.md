---
summary: What blockchain technology is — a decentralised, distributed ledger compared with a central database; its key properties; the structure of a block (data, timestamp, nonce, hash, previous hash) and the genesis block; hash functions and the avalanche effect; public and private keys, digital signatures and wallets; how a transaction is added; consensus — proof of work, mining and proof of stake; why the chain is tamper-resistant and the 51 % attack; public, private and consortium blockchains; smart contracts and other uses; advantages and disadvantages.
---
# What blockchain is
@lo 11.1.2.6@paper

:::definition Blockchain
A **decentralised, distributed digital ledger** (a shared database) in which records — usually **transactions** — are grouped into **blocks** that are **linked together using cryptography** (hashes). A copy of the whole chain is kept on many computers (**nodes**), so the records cannot be changed without everyone noticing.
:::

:::definition Ledger
A **record of transactions** — who sent what to whom and when. A bank keeps a ledger of all its customers' payments.
:::

:::compare Central database or blockchain?
| Central database (e.g. a bank) | Blockchain |
|---|---|
| Stored and controlled by **one organisation** | **Copied** to every node in a **peer-to-peer** network |
| The owner can **edit or delete** records | Records are **append-only** — new blocks are added, old ones are not changed |
| Users must **trust** the central authority | Trust comes from **cryptography** and **consensus** of the nodes |
| A **single point of failure** — if the server is attacked, data may be lost | No single point of failure — other nodes still have copies |
| Usually private | Often **transparent** — anyone can check the records |
| Fast | Slower — the nodes must agree |
:::

:::ascii Centralised and distributed ledgers
        CENTRALISED                         DISTRIBUTED (BLOCKCHAIN)

   User   User   User                   Node ────── Node ────── Node
     \     |     /                     [copy]      [copy]      [copy]
      \    |    /                        │    \      │      /    │
     ┌─────────────┐                     │     \     │     /     │
     │ Bank server │                   Node ────── Node ────── Node
     │  (ledger)   │                  [copy]      [copy]      [copy]
     └─────────────┘
   One owner, one copy               Every node keeps the whole ledger
:::

:::cards
### Decentralised
No central authority (bank, government) controls it; decisions are made by the network.
### Distributed
Every **node** stores a **full copy** of the ledger and the copies are kept in sync.
### Immutable
Once a block is added it is practically **impossible to change** — data has high **integrity**.
### Transparent
On a public blockchain anyone can **view and verify** all transactions (users appear only as addresses).
### Secure
Uses **hashing** and **public-key cryptography** (digital signatures).
### Consensus-based
Nodes must **agree** that a new block is valid before it is added.
:::

# The structure of a block
@lo 11.1.2.6@paper

:::compare What a block contains
| Part | Purpose |
|---|---|
| **Block number (index)** | Position of the block in the chain |
| **Timestamp** | When the block was created |
| **Data** | The transactions (sender, receiver, amount) or other records |
| **Previous hash** | The hash of the block **before** it — this is what **links** the chain |
| **Nonce** | A number changed by miners to find a valid hash (proof of work) |
| **Hash** | The block's own "fingerprint", calculated from **all** of the contents above |
:::

:::ascii Blocks linked by hashes
   ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
   │ Block 0 (genesis)   │    │ Block 1             │    │ Block 2             │
   │ Data: first record  │    │ Data: A → B 10      │    │ Data: B → C 4       │
   │ Prev hash: 0000     │ ┌─►│ Prev hash: 1A2F     │ ┌─►│ Prev hash: 7C9E     │
   │ Nonce: 3108         │ │  │ Nonce: 9921         │ │  │ Nonce: 0457         │
   │ Hash: 1A2F ─────────┼─┘  │ Hash: 7C9E ─────────┼─┘  │ Hash: 44B0          │
   └─────────────────────┘    └─────────────────────┘    └─────────────────────┘
   Each block stores the hash of the previous block, so the blocks form a chain.
:::

:::definition Genesis block
The **first** block of a blockchain. It has no block before it, so its "previous hash" is a fixed value such as all zeros.
:::

:::definition Hash function
A function that converts data of **any length** into a **fixed-length** string of characters (the **hash** or digest). Blockchains such as Bitcoin use **SHA-256**, which always gives 256 bits (64 hexadecimal characters).
:::

:::cards
### Properties of a cryptographic hash
- **Fixed length** — a word and a whole book both give a 64-character SHA-256 hash.
- **Deterministic** — the same data always gives the **same** hash.
- **One-way** — the original data **cannot be worked out** from the hash.
- **Avalanche effect** — a tiny change in the data gives a **completely different** hash.
- **Collision-resistant** — it is practically impossible to find two different inputs with the same hash.
:::

:::example The avalanche effect (real SHA-256 hashes)
| Data | SHA-256 hash |
|---|---|
| `Aida pays Bek 10` | `58fac423c8099c22…1e726b74` |
| `Aida pays Bek 90` | `b5ac3f0990250b67…4086512a` |

Changing **one digit** of the amount produces a totally different hash — so any change to a block is **detected immediately**.
:::

# Keys, signatures and wallets
@lo 11.1.2.6@paper

:::cards
### Public and private keys
- Every user has a **key pair**.
- The **private key** is kept **secret** — it is used to **sign** transactions.
- The **public key** (and the **address** made from it) is shared — others use it to send coins and to **check** signatures.
### Digital signature
- The sender signs the transaction with their **private key**.
- Any node can **verify** the signature with the sender's **public key**.
- This proves the transaction really comes from the owner and has **not been changed**.
### Wallet
- Software or a device that stores a user's **keys** and shows their balance.
- Coins are not "inside" the wallet — the blockchain records them; the wallet holds the keys that control them.
- **Lost private key = lost coins**: there is no bank to reset it.
:::

# How a transaction is added
@lo 11.1.2.6@paper

:::steps Adding a transaction to the blockchain
- A user **requests** a transaction (e.g. send 1 coin to Asel) and **signs** it with their **private key**.
- The transaction is **broadcast** to the peer-to-peer network of nodes.
- Nodes **validate** it — they check the digital signature and that the sender has enough balance (no double spending).
- Valid transactions are grouped together into a new **block**.
- Nodes reach **consensus** — e.g. a miner solves the **proof-of-work** puzzle.
- The new block, containing the hash of the previous block, is **added to the chain** and **copied to every node**.
- The transaction is **complete** and permanent.
:::

:::ascii The process
   User signs        Broadcast to         Nodes          Grouped        Consensus       Block added
   transaction  ──►  the network    ──►  validate   ──►  into a    ──►  (mining /  ──►  to every
   (private key)     of nodes            signature      new block       proof of        copy of
                                         + balance                      work)           the chain
:::

:::definition Consensus mechanism
The set of rules by which the nodes of a decentralised network **agree** which new block is valid and gets added, without a central authority.
:::

:::compare Proof of work and proof of stake
| | **Proof of work (PoW)** | **Proof of stake (PoS)** |
|---|---|---|
| Who adds the block | **Miners** compete to solve a hard mathematical puzzle | **Validators** chosen according to the coins they **stake** (lock up) |
| How | Change the **nonce** again and again until the block's hash starts with a required number of zeros | Selected validator proposes the block; others check it |
| Reward | New coins + transaction fees | Transaction fees |
| Energy use | **Very high** — millions of hash calculations per second | **Low** |
| Example | Bitcoin | Ethereum (since 2022) |
| Cheating costs | The cost of electricity and hardware | The validator **loses** its staked coins |
:::

:::definition Mining
The process in proof of work where nodes (**miners**) repeatedly change the **nonce** and calculate the block's hash until it meets the **difficulty target** (e.g. starts with "0000"). The first miner to succeed broadcasts the block and receives a **reward**. Finding the hash is hard, but **checking** it is easy for the other nodes.
:::

# Why the chain is tamper-resistant
@lo 11.1.2.6@paper

:::steps What happens if someone changes an old block
- An attacker changes the amount in **Block 1** from 10 to 90.
- Block 1's **hash changes** completely (avalanche effect).
- **Block 2** still stores the **old** hash as its "previous hash", so the **link is broken**.
- To hide the change, the attacker would have to **re-mine Block 1, Block 2 and every later block** — each needing proof of work.
- Meanwhile the honest network keeps adding new blocks, and the attacker's copy also differs from the copies on **all the other nodes**.
- Nodes accept the version held by the **majority**, so the altered chain is **rejected**.
:::

:::callout warning The 51 % attack
If one person or group controlled **more than half** of the network's computing power (or stake), they could out-pace the honest nodes and rewrite recent blocks. On large networks such as Bitcoin this would be **extremely expensive**, which is why big public blockchains are considered secure.
:::

:::compare Types of blockchain
| Type | Who can join and read | Example |
|---|---|---|
| **Public** (permissionless) | **Anyone** can read, send transactions and become a node | Bitcoin, Ethereum |
| **Private** (permissioned) | Only **invited** members of one organisation | A company's internal records |
| **Consortium** | Controlled by a **group** of organisations | Banks sharing settlement records; supply-chain partners |
:::

# Uses of blockchain
@lo 11.1.2.6@paper

:::definition Smart contract
A **program stored on the blockchain** that **runs automatically** when agreed conditions are met, without a middle-man. Example: when a delivery is confirmed, the payment is released to the supplier automatically.
:::

:::compare Uses of blockchain technology
| Area | Example | Why blockchain helps |
|---|---|---|
| **Cryptocurrencies** | Bitcoin, Ethereum | Payments between people **without a bank**; no double spending |
| **Smart contracts** | Insurance paid automatically when a flight is delayed | Self-executing, no intermediary |
| **Financial services** | International transfers, record keeping | Faster and cheaper than through several banks |
| **Supply chains** | Tracking food or medicines from producer to shop | Every step recorded; fakes are detected |
| **Healthcare** | Sharing patient records between hospitals | Tamper-proof history; patient controls access |
| **Education** | Diplomas and certificates | Employers can verify them; cannot be forged |
| **Government** | Land registries, digital identity | Ownership records cannot be secretly changed |
| **Voting** | Recording votes | Transparent and verifiable |
| **Games and digital ownership** | NFTs, in-game items | Proof of who owns a digital item |
| **Domain names** | Blockchain-based domain names | No central registrar |
:::

:::compare Advantages and disadvantages
| Advantages | Disadvantages |
|---|---|
| Very hard to tamper with — **high data integrity** | **Proof of work** uses huge amounts of **electricity** |
| **No central authority** and no single point of failure | **Slow** — limited number of transactions per second |
| **Transparent** — anyone can verify records | Mistakes **cannot be undone**; **lost private keys** mean lost assets |
| Fewer **intermediaries** → lower fees, faster international payments | Every node stores the whole chain → **large storage** needs |
| Records are **permanent** with timestamps — a full audit trail | **Legal and regulatory** uncertainty; cryptocurrencies used in some crimes |
| Strong **cryptography** protects transactions | Data on a public chain is **visible** to everyone (privacy) |
:::

# Exam practice and summary
@lo 11.1.2.6@paper

:::example Exam-style answers
**Q: Describe what blockchain technology is. [1]**
A **distributed database** shared among the **nodes** of a computer network / a growing list of records (**blocks**) **linked using cryptography** / a technology for keeping a **secure, decentralised** record of transactions (1).

**Q: Give one example of using blockchain technology. [1]**
Cryptocurrencies (Bitcoin) / smart contracts / financial services / games / supply chain / domain names (1).

**Q: Explain how a blockchain prevents a record from being changed. [3]**
Each block contains the **hash of the previous block** (1); changing data changes that block's **hash**, so it no longer matches the next block and the chain is broken (1); every node has a **copy**, so the altered chain differs from the majority and is **rejected** (1).

**Q: Describe the role of miners. [2]**
Miners **validate** transactions and group them into a block (1); they compete to solve the **proof-of-work** puzzle (find a nonce giving a valid hash) and the winner adds the block and is **rewarded** (1).
:::

:::warning Common mistakes
- Saying blockchain is "stored on one secure server" — it is **distributed** across many nodes.
- Saying a hash can be **decrypted** — hashing is **one-way**, it is not encryption.
- Confusing the **private** key (secret, used to sign) with the **public** key (shared, used to verify).
- Writing "blockchain = Bitcoin" — Bitcoin is just **one use** of blockchain.
- Forgetting that each block stores the **previous** block's hash — this is what forms the chain.
:::

:::steps Check yourself
- Define blockchain, ledger, node and genesis block.
- List the six parts of a block and say which part links the chain.
- Give four properties of a cryptographic hash function.
- Describe the steps for adding a transaction to a blockchain.
- Compare proof of work and proof of stake.
- Explain why changing an old block is detected, and what a 51 % attack is.
- Give five uses of blockchain and three advantages and three disadvantages.
:::
