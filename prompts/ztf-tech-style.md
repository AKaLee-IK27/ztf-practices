# ZTF Technical Style Guide

This file is **style and sample guidance** for `/gen-tech`. It does NOT change
topic counts, total questions, duration, language, or any quality rule defined
in `prompts/generate-technical.md` — those remain authoritative. Read this
guide first; use it to shape *how* each question reads and what its distractors
look like.

Last researched: 2026-05-26. Sources at bottom. Samples are paraphrased
reconstructions, not real exam questions.

---

## 1. Phrasing & distractor patterns

### DSA — sorting & complexity

**Phrasing:** "What is the worst-case time complexity of [algorithm] when
[input condition]?" or "Which condition causes [algorithm] to degrade to
O(n²)?"

**Distractor mix:** include the correct best-case, a correct average-case, an
off-by-one factor (O(n) vs O(n log n) vs O(n²)), and one clearly wrong choice.
Avoid making the answer the only "complicated" option — distractors must look
just as serious.

### DSA — tree traversal

**Phrasing:** show a 5–7 node binary tree using parenthesised notation in the
`code` field (e.g. `1(2(4)(5))(3(6)(7))`) and ask for in-order / post-order /
level-order output. Or give two traversals and ask to identify the root.

**Distractor mix:** at least one distractor must be a *valid traversal of a
different order* (so candidates who confuse pre- vs in-order pick it). One
distractor should swap two adjacent nodes.

### DSA — recursion & divide-and-conquer

**Phrasing:** Tower of Hanoi step counts (2^n − 1), recurrence solving with
Master Theorem, base-case identification, "what does this recursive function
return for n=5?".

**Distractor mix:** off-by-one bases (T(0)=0 vs T(0)=1), missing a step, swap
of recursion direction.

### DSA — linked lists / stacks / queues

**Phrasing:** "After these operations on a [stack/queue/linked list], what is
the state?" with a 3–6 operation sequence in the `code` field.

**Distractor mix:** distractors that match common errors (forgetting LIFO vs
FIFO, double-counting head/tail, missing the last operation).

### DSA — bit operations

**Phrasing:** "What is `x & (x - 1)` for x = 0b10110?" or "Which expression
clears the lowest set bit?"

**Distractor mix:** results that match the wrong operator (XOR for AND), or
the right operator on the wrong operand.

### OOP — code reading

**Phrasing:** 5–15 lines of Java or Python in the `code` field, ask "what does
this print?" or "which line raises an exception?"

**Distractor mix:** outputs that match common misreadings — forgetting
`static` semantics, integer vs float division, missing `@Override`, exception
type confusion (NullPointerException vs IndexOutOfBoundsException).

### OOP — theory

**Phrasing:** "Which of the following are TRUE about [inheritance /
polymorphism / encapsulation / interfaces]? (Select all that apply)" — favour
multi-correct here.

**Distractor mix:** mix of textbook-correct, common-misconception ("private
fields can't be accessed from subclasses" — true; "interfaces can't have
implementation" — outdated post-Java 8), and clearly wrong claims.

### Networking & Web

**Phrasing:** scenario-driven. "A browser sends a POST to /login; the server
responds 302 with Location: /home. What does the browser do next?" or status
code matching with edge cases.

**Distractor mix:** adjacent status codes (301 vs 302 vs 307 vs 308), method
swaps (PUT vs PATCH for partial update), TCP vs UDP confusion on
ordering/reliability.

### Database / SQL

**Phrasing:** SQL snippet in `code` field with one clause replaced by `???`,
ask which clause fills it. Or "Which JOIN produces N rows given these
inputs?".

**Distractor mix:** WHERE vs HAVING (filter before vs after aggregation),
INNER vs LEFT JOIN row counts, GROUP BY missing required column.

### Operating Systems

**Phrasing:** scenario for concept identification — "Process A holds X needs
Y; Process B holds Y needs X" → identify deadlock. Or "Which scheduling
algorithm minimises average waiting time for [workload]?"

**Distractor mix:** deadlock / starvation / livelock distinctions, page
replacement algorithm trade-offs (LRU vs FIFO under specific access
patterns).

### AI / ML basics

**Phrasing:** "You have labelled data with 2 classes and want to predict
class. Which is most appropriate?" or "What does overfitting indicate?".
Keep the question lightweight — fresher level.

**Distractor mix:** confuse precision vs recall, supervised vs reinforcement,
classification vs regression on borderline cases.

### General CS / Logic

**Phrasing:** small puzzles, bit-trick recognition, design pattern
identification by short scenario.

---

## 2. Paraphrased sample questions

> Paraphrased reconstructions modelled on writeups and known DSA-style
> questions. **Do NOT copy verbatim into generated exams** — emulate the
> shape. All samples are schema-compatible with `prompts/schema.md`.

### Sample 1 — DSA / complexity (single)

```json
{
  "id": "sample-1",
  "topic": "DSA",
  "type": "single",
  "prompt": "Quicksort degrades to O(n²) worst-case under which condition?",
  "options": [
    { "id": "a", "text": "Input is already sorted and pivot is always the first element" },
    { "id": "b", "text": "Input contains all unique values" },
    { "id": "c", "text": "Pivot is chosen uniformly at random" },
    { "id": "d", "text": "Recursion depth exceeds log n" }
  ],
  "correct": ["a"],
  "explanation": "With a first-element pivot on a sorted input, each partition splits into 0 and n-1 elements, producing n recursive calls each doing O(n) work — total O(n²). Random pivots avoid this. Uniqueness has no effect. Recursion depth log n is the best case, not worst."
}
```

### Sample 2 — DSA / tree traversal (single)

```json
{
  "id": "sample-2",
  "topic": "DSA",
  "type": "single",
  "prompt": "Given the binary tree below, what is its in-order traversal?",
  "code": "        1\n       / \\\n      2   3\n     / \\   \\\n    4   5   6",
  "options": [
    { "id": "a", "text": "4 2 5 1 3 6" },
    { "id": "b", "text": "1 2 4 5 3 6" },
    { "id": "c", "text": "4 5 2 6 3 1" },
    { "id": "d", "text": "1 2 3 4 5 6" }
  ],
  "correct": ["a"],
  "explanation": "In-order = left, root, right. From node 1: traverse left subtree (4 2 5), then root (1), then right subtree (3 6). Option (b) is pre-order; (c) is post-order; (d) is the level-order (BFS) traversal."
}
```

### Sample 3 — OOP / code reading (single)

```json
{
  "id": "sample-3",
  "topic": "OOP",
  "type": "single",
  "prompt": "What does the following Java code print?",
  "code": "class A {\n  static int x = 1;\n  int y = 2;\n}\nclass B extends A {\n  static int x = 10;\n  int y = 20;\n}\npublic class Main {\n  public static void main(String[] a) {\n    A obj = new B();\n    System.out.println(obj.x + \" \" + obj.y);\n  }\n}",
  "options": [
    { "id": "a", "text": "1 2" },
    { "id": "b", "text": "10 20" },
    { "id": "c", "text": "1 20" },
    { "id": "d", "text": "10 2" }
  ],
  "correct": ["a"],
  "explanation": "Both static and non-static field accesses through a reference are resolved at compile time by the declared type of the reference (A here), not the runtime type. Polymorphism applies to methods, not fields. obj.x is A.x = 1; obj.y is A's y = 2. Output: '1 2'."
}
```

### Sample 4 — Networking (single)

```json
{
  "id": "sample-4",
  "topic": "Networking & Web",
  "type": "single",
  "prompt": "A browser sends a POST to /login. The server responds with status 302 and Location: /home. What does the browser send next?",
  "options": [
    { "id": "a", "text": "POST /home with the same body" },
    { "id": "b", "text": "GET /home" },
    { "id": "c", "text": "POST /login again" },
    { "id": "d", "text": "Nothing — 302 is an error" }
  ],
  "correct": ["b"],
  "explanation": "302 Found triggers a redirect. RFC 7231 §6.4.3 explicitly allows a user agent to change the request method from POST to GET on a 302, which is what browsers do in practice. Use 307 (or 308 for permanent) when you must preserve the method and body."
}
```

### Sample 5 — Database / SQL (single)

```json
{
  "id": "sample-5",
  "topic": "Database",
  "type": "single",
  "prompt": "Which clause must fill the blank so the query returns departments with more than 5 employees?",
  "code": "SELECT department, COUNT(*) AS n\nFROM employees\nGROUP BY department\n??? n > 5;",
  "options": [
    { "id": "a", "text": "WHERE" },
    { "id": "b", "text": "HAVING" },
    { "id": "c", "text": "FILTER" },
    { "id": "d", "text": "ORDER BY" }
  ],
  "correct": ["b"],
  "explanation": "HAVING filters AFTER aggregation, so it can compare against aggregate expressions like COUNT(*). WHERE filters BEFORE aggregation and cannot reference aggregates. (Note: many databases such as MySQL and PostgreSQL allow the SELECT alias `n` in HAVING; standard SQL requires repeating COUNT(*).) FILTER is a per-aggregate modifier, not a row filter."
}
```

### Sample 6 — OS / synchronization (multi)

```json
{
  "id": "sample-6",
  "topic": "Operating Systems",
  "type": "multi",
  "prompt": "Which of the following are necessary conditions for a deadlock? (Select all that apply)",
  "options": [
    { "id": "a", "text": "Mutual exclusion" },
    { "id": "b", "text": "Hold and wait" },
    { "id": "c", "text": "Preemption of resources" },
    { "id": "d", "text": "Circular wait" }
  ],
  "correct": ["a", "b", "d"],
  "explanation": "The four Coffman conditions are mutual exclusion, hold and wait, NO preemption (preemption breaks deadlock), and circular wait. (c) is the inverse — it prevents deadlock, not causes it."
}
```

### Sample 7 — AI/ML basics (single)

```json
{
  "id": "sample-7",
  "topic": "AI / ML basics",
  "type": "single",
  "prompt": "You have 10,000 emails labelled spam or not-spam. You want to predict the label on new emails. Which is most appropriate?",
  "options": [
    { "id": "a", "text": "Supervised classification" },
    { "id": "b", "text": "Unsupervised clustering" },
    { "id": "c", "text": "Reinforcement learning" },
    { "id": "d", "text": "Linear regression" }
  ],
  "correct": ["a"],
  "explanation": "Labels are provided, output is a discrete class → supervised classification. Clustering assumes no labels. Reinforcement learning is for sequential decisions with rewards. Linear regression predicts continuous values, not classes."
}
```

### Sample 8 — General CS / bit operations (single)

```json
{
  "id": "sample-8",
  "topic": "General CS / Logic",
  "type": "single",
  "prompt": "What is the value of x & (x - 1) when x = 0b10110 (binary)?",
  "options": [
    { "id": "a", "text": "0b10100" },
    { "id": "b", "text": "0b10000" },
    { "id": "c", "text": "0b00010" },
    { "id": "d", "text": "0b10111" }
  ],
  "correct": ["a"],
  "explanation": "x - 1 = 0b10101. x & (x - 1) = 0b10110 & 0b10101 = 0b10100. This idiom clears the lowest set bit of x."
}
```

---

## 3. Sources

Consulted on 2026-05-26 (advisory only — the user's primary-source Zalo
communication is authoritative for format):

- daynhauhoc.com — "Chia sẻ cấu trúc đề thi fresher zalo" (2022 candidate writeup)
- techsignin.com — "Ước mơ kỹ sư công nghệ với Zalo Tech Fresher 2022"
- voz.vn — multiple 2025 & 2026 ZTF threads
- engineerprogurus.com — Zalo interview success story (mid-level)
- zalo.careers/techfresher — official program page

Confidence: high on phrasing/distractor patterns, medium on which exact
topics appear in a given year, low on any verbatim wording (none claimed).
