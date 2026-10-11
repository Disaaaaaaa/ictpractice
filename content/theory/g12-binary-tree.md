---
summary: Tree terminology, binary trees and binary search trees, building a BST from numbers and strings, storing it as nodes with left pointer, data and right pointer, inserting and searching with a trace, in-order, pre-order and post-order traversals, balanced and unbalanced trees, and where binary trees are used.
---
# Trees and binary trees
@lo 12.5.2.2

:::definition Tree
A **hierarchical** (non-linear) data structure made of **nodes** joined by **branches (edges)**. It has one **root** at the top; every other node has exactly **one parent**.
:::

:::definition Binary tree
A tree in which each node has **at most two children**: a **left** child and a **right** child.
:::

:::compare Tree terminology
| Term | Meaning |
|---|---|
| **Root** | The top node — it has **no parent** |
| **Parent / child** | A node and the nodes directly below it |
| **Siblings** | Children of the same parent |
| **Leaf** | A node with **no children** |
| **Subtree** | A node together with all its descendants |
| **Branch (edge)** | The link (pointer) between a parent and a child |
| **Level / depth** | How far a node is from the root (root = level 0) |
| **Height** | The number of levels in the tree (or edges on the longest root-to-leaf path) |
:::

:::ascii A binary tree with its parts labelled
                 [6]            ← root (level 0)
                /   \
             [3]     [8]        ← level 1: 3 and 8 are siblings
            /   \       \
          [2]   [5]     [9]     ← level 2: leaves (no children)

  3 is the parent of 2 and 5 · the left subtree of 6 is {3, 2, 5}
:::

# Binary search trees
@lo 12.5.2.2

:::definition Binary search tree (BST)
A binary tree where, for **every** node, all values in its **left subtree are smaller** and all values in its **right subtree are greater** (equal values go right, by agreement). Strings are compared **alphabetically**.
:::

:::steps Inserting a value
- Start at the **root**.
- If the new value is **smaller** than the node, go **left**; if it is **greater (or equal)**, go **right**.
- Repeat until you reach an **empty** position, and attach the new node there.
- Values must be inserted **in the order given** — a different order gives a different tree.
:::

:::steps Build a BST from 6, 3, 8, 5, 9, 2
- **6** is the root.
- **3** < 6 → left of 6.
- **8** > 6 → right of 6.
- **5** < 6 → go left to 3; 5 > 3 → **right of 3**.
- **9** > 6 → go right to 8; 9 > 8 → **right of 8**.
- **2** < 6 → left to 3; 2 < 3 → **left of 3**.
:::

The result is the tree drawn in the previous section.

:::example A BST of strings: "M", "B", "A", "K", "H", "V", "T"
```text
                 [M]
               /     \
            [B]       [V]
           /   \      /
         [A]   [K]  [T]
               /
             [H]
```
B < M → left; A < M, A < B → left of B; K < M, K > B → right of B; H < M, H > B, H < K → left of K; V > M → right; T > M, T < V → left of V.
:::

:::example A larger tree: 50, 30, 70, 20, 40, 60, 80, 35
```text
                  [50]
               /        \
           [30]          [70]
          /    \        /    \
       [20]    [40]   [60]   [80]
               /
            [35]
```
:::

# Storing a tree with pointers
@lo 12.5.2.2

Each node is stored as **Left pointer | Data | Right pointer**. A pointer holds the **index (address) of the child node**; **−1** (or NULL / 0) means "**no child**". A separate **root pointer** holds the index of the root.

:::compare Array representation of the tree 6, 3, 8, 5, 9, 2 (nodes stored in insertion order)
| Index | Left pointer | Data | Right pointer |
|---|---|---|---|
| 1 | 2 | 6 | 3 |
| 2 | 6 | 3 | 4 |
| 3 | −1 | 8 | 5 |
| 4 | −1 | 5 | −1 |
| 5 | −1 | 9 | −1 |
| 6 | −1 | 2 | −1 |
:::

Root pointer = **1**. Node 1 (6) has left → index **2** (3) and right → index **3** (8). Node 2 (3) has left → **6** (2) and right → **4** (5). Leaves have **−1** in both pointers.

:::compare Array representation of "M", "B", "A", "K", "H", "V", "T"
| Index | Left | Data | Right |
|---|---|---|---|
| 1 | 2 | M | 6 |
| 2 | 3 | B | 4 |
| 3 | −1 | A | −1 |
| 4 | 5 | K | −1 |
| 5 | −1 | H | −1 |
| 6 | 7 | V | −1 |
| 7 | −1 | T | −1 |
:::

```pseudocode | Inserting a new node into the arrays
// Tree[i].Left, Tree[i].Data, Tree[i].Right; FreePtr = next empty index
PROCEDURE Insert(Value)
    Tree[FreePtr].Data ← Value
    Tree[FreePtr].Left ← -1
    Tree[FreePtr].Right ← -1
    IF Root = -1 THEN
        Root ← FreePtr                       // first node becomes the root
    ELSE
        Current ← Root
        Placed ← FALSE
        WHILE NOT Placed DO
            IF Value < Tree[Current].Data THEN
                IF Tree[Current].Left = -1 THEN
                    Tree[Current].Left ← FreePtr
                    Placed ← TRUE
                ELSE
                    Current ← Tree[Current].Left
                ENDIF
            ELSE
                IF Tree[Current].Right = -1 THEN
                    Tree[Current].Right ← FreePtr
                    Placed ← TRUE
                ELSE
                    Current ← Tree[Current].Right
                ENDIF
            ENDIF
        ENDWHILE
    ENDIF
    FreePtr ← FreePtr + 1
ENDPROCEDURE
```

# Searching a BST
@lo 12.5.2.2

```pseudocode | Search for a value
Current ← Root
WHILE Current <> -1 AND Tree[Current].Data <> Target DO
    IF Target < Tree[Current].Data THEN
        Current ← Tree[Current].Left
    ELSE
        Current ← Tree[Current].Right
    ENDIF
ENDWHILE
IF Current = -1 THEN
    OUTPUT "Not found"
ELSE
    OUTPUT "Found at node ", Current
ENDIF
```

:::example Searching for 5 and for 7 in the tree 6, 3, 8, 5, 9, 2
| Target | Nodes visited | Result |
|---|---|---|
| 5 | 6 (5 < 6, go left) → 3 (5 > 3, go right) → **5** | Found at index 4 after **3** comparisons |
| 7 | 6 (7 > 6, right) → 8 (7 < 8, left) → −1 | **Not found** after 2 comparisons |
:::

:::tip Why a BST is fast
Each comparison **discards a whole subtree**, so a **balanced** BST with *n* nodes needs about **log₂ n** comparisons: 1 000 000 nodes → about **20** comparisons, instead of up to 1 000 000 for a linear search.
:::

:::callout warning Unbalanced trees
If values are inserted **already sorted** (1, 2, 3, 4, 5), every node goes to the **right** and the tree becomes a long chain — like a linked list. Searching then takes up to **n** comparisons. A **balanced** tree has roughly equal numbers of nodes in the left and right subtrees.
:::

# Traversing a binary tree
@lo 12.5.2.2

:::definition Traversal
Visiting **every node exactly once** in a fixed order. The three depth-first traversals differ only in **when the node itself is visited**.
:::

:::compare The three traversals
| Traversal | Order | Result for 6, 3, 8, 5, 9, 2 | Use |
|---|---|---|---|
| **In-order** | Left, **Node**, Right | 2, 3, 5, 6, 8, 9 | Outputs a BST in **sorted order** |
| **Pre-order** | **Node**, Left, Right | 6, 3, 2, 5, 8, 9 | **Copying** a tree (insert in this order to rebuild it) |
| **Post-order** | Left, Right, **Node** | 2, 5, 3, 9, 8, 6 | **Deleting** a tree; evaluating expression trees |
:::

```pseudocode | In-order traversal (recursive)
PROCEDURE InOrder(Node)
    IF Node <> -1 THEN
        InOrder(Tree[Node].Left)      // 1 left subtree
        OUTPUT Tree[Node].Data        // 2 the node
        InOrder(Tree[Node].Right)     // 3 right subtree
    ENDIF
ENDPROCEDURE
```

:::example Traversals of the larger tree 50, 30, 70, 20, 40, 60, 80, 35
- In-order: 20, 30, 35, 40, 50, 60, 70, 80
- Pre-order: 50, 30, 20, 40, 35, 70, 60, 80
- Post-order: 20, 35, 40, 30, 60, 80, 70, 50
:::

:::tip A quick way to traverse by hand
Draw a line around the tree starting at the left of the root. **Pre-order**: write a node when you pass its **left** side; **in-order**: when you pass **underneath** it; **post-order**: when you pass its **right** side.
:::

:::compare Where binary trees are used
| Use | How |
|---|---|
| **Searching and sorting** | A BST gives fast search; in-order traversal gives sorted output |
| **Expression trees** | Operators in nodes, operands in leaves: (3 + 4) × 2 |
| **File systems / indexes** | Folders and database indexes are organised as trees |
| **Decision trees / expert systems** | Each node asks a yes/no question |
| **Compression** (Huffman trees) | Frequent characters get shorter codes |
:::

# Exam practice and summary
@lo 12.5.2.2

:::example Exam-style answers
**Q: Complete a binary search tree using 6, 3, 8, 5, 9, 2. Each node is Left pointer | Data | Right pointer. [3]**
Node for **3** points left to **2** and right to **5** (1); **2** is a leaf with −1 pointers (1); **5** is a leaf with −1 pointers (1).

**Q: State the value of the root of the tree built from "M", "B", "A", "K", "H", "V", "T". [1]**
**M** — the first value inserted (1).

**Q: Write the in-order traversal of the tree. [1]**
A, B, H, K, M, T, V (1).

**Q: Explain why a BST may become inefficient. [2]**
If the data is inserted in **sorted order** the tree becomes **unbalanced** — a single chain (1), so a search may visit **every node** instead of about log₂ n (1).
:::

:::warning Common mistakes
- Putting smaller values on the **right** — smaller go **left**.
- Comparing only with the **root** — keep comparing at each level until an empty position is found.
- Forgetting **−1 / NULL** pointers for leaves.
- Mixing up pre-order (node **first**) and post-order (node **last**).
:::

:::steps Check yourself
- Define root, leaf, parent, subtree and height.
- Build the BST for 45, 22, 67, 12, 30, 50, 89, 25 and draw its pointer table.
- Trace a search for 30 and for 60 in that tree.
- Write its in-order, pre-order and post-order traversals.
- What happens if 10, 20, 30, 40 are inserted in this order?
- Give two uses of binary trees.
:::
