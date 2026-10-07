---
summary: Binary tree terminology, building a binary search tree, storing it with left and right pointers in arrays, searching it and traversing it.
---
# Binary trees and binary search trees
@lo 12.5.2.2

:::definition Binary tree
A hierarchical data structure in which each **node** has **at most two children**: a **left** child and a **right** child.
:::

:::definition Binary search tree (BST)
A binary tree where, for every node, all values in the **left subtree are smaller** and all values in the **right subtree are greater** (or equal, by agreement).
:::

:::compare Terms
| Term | Meaning |
|---|---|
| Root | The top node (no parent) |
| Parent / child | A node and the nodes directly below it |
| Leaf | A node with no children |
| Subtree | A node and all its descendants |
| Branch (edge) | A link between a parent and a child |
| Depth / height | Number of levels |
:::

## Building a BST

:::steps Insert 6, 3, 8, 5, 9, 2 in this order
- **6** is the root.
- **3** < 6 → left of 6.
- **8** > 6 → right of 6.
- **5** < 6 → go left to 3; 5 > 3 → right of 3.
- **9** > 6 → go right to 8; 9 > 8 → right of 8.
- **2** < 6 → left to 3; 2 < 3 → left of 3.
:::

:::mermaid The resulting binary search tree
flowchart TB
  N6((6)) --> N3((3))
  N6 --> N8((8))
  N3 --> N2((2))
  N3 --> N5((5))
  N8 --> N9((9))
:::

:::callout info Strings
Strings are compared **alphabetically**: inserting `M, B, V, A, K, T, H` gives root M; B left of M; V right of M; A left of B; K right of B; T left of V; H left of K.
:::

## Storing a tree in arrays (left pointer, data, right pointer)

Each node is stored as **Left pointer | Data | Right pointer**; **−1** (or 0 / null) means "no child".

:::compare Array representation of the tree above (insertion order 6, 3, 8, 5, 9, 2)
| Index | Left | Data | Right |
|---|---|---|---|
| 1 | 2 | 6 | 3 |
| 2 | 6 | 3 | 4 |
| 3 | −1 | 8 | 5 |
| 4 | −1 | 5 | −1 |
| 5 | −1 | 9 | −1 |
| 6 | −1 | 2 | −1 |
:::

Root pointer = 1. Node 1 (6) has left → index 2 (3) and right → index 3 (8), and so on.

## Searching a BST

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

:::tip
Each comparison discards one subtree, so a balanced BST with *n* nodes is searched in about **log₂ n** steps — much faster than a linear search.
:::

## Traversals

:::compare Traversing the tree 6, 3, 8, 5, 9, 2
| Traversal | Order | Result |
|---|---|---|
| In-order | Left, **Node**, Right | 2, 3, 5, 6, 8, 9 — **sorted** |
| Pre-order | **Node**, Left, Right | 6, 3, 2, 5, 8, 9 |
| Post-order | Left, Right, **Node** | 2, 5, 3, 9, 8, 6 |
:::
