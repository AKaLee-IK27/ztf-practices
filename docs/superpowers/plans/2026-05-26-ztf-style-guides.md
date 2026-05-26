# ZTF Style Guides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two style-guide markdown files (`prompts/ztf-tech-style.md`, `prompts/ztf-za-style.md`) and wire them into `/gen-tech` and `/gen-za` so generated exams adopt ZTF-style phrasing, distractor patterns, and sample shapes — without changing any current format/topic/timing config.

**Architecture:** Markdown-only style guides committed to the repo. Each guide has 3 sections: phrasing & distractor patterns, paraphrased sample questions (schema-shaped), and sources. The two `generate-*.md` prompts get a one-paragraph prepend pointing at their respective style guide. No app code changes. No new exam types.

**Tech Stack:** Markdown files only. Verification via existing Vite + TypeScript build / schema validator in `src/lib/examLoader.ts` after a sanity-check generation.

**Spec:** [docs/superpowers/specs/2026-05-26-ztf-research-design.md](../specs/2026-05-26-ztf-research-design.md)

---

## File Structure

Files this plan creates or modifies:

- **Create** `prompts/ztf-tech-style.md` — Technical style guide (EN). One responsibility: phrasing + samples for /gen-tech.
- **Create** `prompts/ztf-za-style.md` — ZA style guide (VI). One responsibility: phrasing + samples for /gen-za.
- **Modify** `prompts/generate-technical.md` — Prepend a single paragraph linking the style guide.
- **Modify** `prompts/generate-za.md` — Prepend a single paragraph linking the style guide.

No other files change. UI labels, generator estimates, schema, and existing exam JSONs all stay as-is (verified in spec §5).

---

## Task 1: Create `prompts/ztf-tech-style.md`

**Files:**
- Create: `prompts/ztf-tech-style.md`

- [ ] **Step 1: Write the file**

Create `prompts/ztf-tech-style.md` with this exact content:

````markdown
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
  "explanation": "In-order = left, root, right. From node 1: traverse left subtree (4 2 5), then root (1), then right subtree (3 6). Option (b) is pre-order; (c) is post-order; (d) is level-order with values renumbered."
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
  "correct": ["c"],
  "explanation": "Static fields are resolved at compile-time based on the reference type (A), so obj.x is A.x = 1. Instance fields are also resolved by reference type for field access (no polymorphism for fields in Java), so obj.y is A's y = 2... wait — actually instance fields ARE accessed by reference type, giving 2. But the correct answer here is 1 2 if the rules are strictly applied. Recheck: in Java, field access on a reference is resolved at compile time by reference type. Both x (static) and y (instance) resolve to A's. Correct answer: 1 2."
}
```

> Plan-author note: Sample 3's explanation is intentionally messy in the plan
> draft to flag that the *implementer* must verify Java field-access semantics
> with a quick run before pasting. Replace with the verified-correct
> single-paragraph explanation. Fix `correct` to match.

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
  "explanation": "302 Found triggers a redirect. Historically most browsers convert POST to GET on a 302 (even though the spec is ambiguous). Use 307/308 to preserve the method and body."
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
  "explanation": "HAVING filters AFTER aggregation and can reference aggregate aliases like n. WHERE filters BEFORE aggregation and cannot use COUNT(*). FILTER is a clause modifier for aggregate functions, not a row filter."
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
````

- [ ] **Step 2: Verify file exists and has the expected sections**

Run: `grep -nE "^## " /Users/rowlet/Repos/ztf-practices/prompts/ztf-tech-style.md`

Expected output (3 section headers):
```
## 1. Phrasing & distractor patterns
## 2. Paraphrased sample questions
## 3. Sources
```

- [ ] **Step 3: Verify all sample questions are valid JSON**

Run:
```bash
cd /Users/rowlet/Repos/ztf-practices && \
node -e "
const fs = require('fs');
const md = fs.readFileSync('prompts/ztf-tech-style.md', 'utf8');
const matches = md.matchAll(/\`\`\`json\n([\s\S]*?)\n\`\`\`/g);
let count = 0, errs = 0;
for (const m of matches) {
  count++;
  try { JSON.parse(m[1]); } catch (e) { errs++; console.error('Sample', count, 'invalid:', e.message); }
}
console.log('Samples:', count, 'Errors:', errs);
"
```

Expected output: `Samples: 8 Errors: 0`

If any sample fails to parse, fix the JSON in place and re-run before proceeding.

- [ ] **Step 4: Resolve the flagged plan-author note on Sample 3 (Java semantics)**

Sample 3 tests Java field access on `obj.x` (static field) and `obj.y` (instance field) when `A obj = new B()`. Correct Java semantics:
- `obj.x` — static field via a reference is resolved by the **declared type** of the reference (A) at compile time → A.x = 1
- `obj.y` — non-static field access is ALSO resolved by **declared type** (A). Java fields are NOT polymorphic. → A's y = 2

Correct answer = `"1 2"` = option `a`.

Edit `prompts/ztf-tech-style.md` Sample 3:

- Change `"correct": ["c"]` to `"correct": ["a"]`
- Replace the `explanation` field with: `"Both static and non-static field accesses through a reference are resolved at compile time by the declared type of the reference (A here), not the runtime type. Polymorphism applies to methods, not fields. obj.x is A.x = 1; obj.y is A's y = 2. Output: '1 2'."`
- Remove the plan-author note paragraph that follows Sample 3.

Re-run the JSON-parse check from Step 3:

```bash
cd /Users/rowlet/Repos/ztf-practices && \
node -e "
const fs = require('fs');
const md = fs.readFileSync('prompts/ztf-tech-style.md', 'utf8');
const matches = md.matchAll(/\`\`\`json\n([\s\S]*?)\n\`\`\`/g);
let count = 0, errs = 0;
for (const m of matches) { count++; try { JSON.parse(m[1]); } catch (e) { errs++; console.error(count, e.message); } }
console.log('Samples:', count, 'Errors:', errs);
"
```

Expected: `Samples: 8 Errors: 0`

- [ ] **Step 5: Commit**

```bash
cd /Users/rowlet/Repos/ztf-practices && \
git add prompts/ztf-tech-style.md && \
git commit -m "$(cat <<'EOF'
feat: add ZTF technical style guide

Style and sample guidance for /gen-tech. Captures phrasing and distractor
patterns observed in public writeups about Zalo Tech Fresher exams, plus 8
paraphrased sample questions as calibration anchors.

Topic counts, duration, language, and quality rules remain authoritative in
prompts/generate-technical.md — this file only shapes how questions read.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Create `prompts/ztf-za-style.md`

**Files:**
- Create: `prompts/ztf-za-style.md`

- [ ] **Step 1: Write the file**

Create `prompts/ztf-za-style.md` with this exact content:

````markdown
# Hướng dẫn phong cách câu hỏi ZA (Zalo Aptitude)

File này là **hướng dẫn phong cách và câu hỏi mẫu** cho `/gen-za`. KHÔNG
thay đổi số câu, thời lượng, ngôn ngữ, phân bổ dạng câu, hay quy tắc chất
lượng đã định trong `prompts/generate-za.md` — phần đó vẫn là nguồn chính.
Đọc file này trước khi gen; dùng nó để định hình *cách viết* câu hỏi và
distractor.

Cập nhật: 2026-05-26. Nguồn ở cuối file. Sample là phỏng dựng — KHÔNG phải
câu hỏi gốc.

---

## 1. Phong cách & distractor

### Suy luận số học (number series)

**Cách đặt câu hỏi:** câu ngắn 1 dòng, dãy 5–7 số rồi dấu `?`. Ví dụ:
"Số tiếp theo trong dãy: 2, 6, 12, 20, 30, ?".

**Distractor:** một đáp án theo quy luật *gần đúng nhưng lệch* (sai 1 bước,
sai dấu, dùng phép cộng thay phép nhân). Một đáp án theo quy luật khác hợp lý
khi nhìn nhanh. Một đáp án lệch lớn để loại bằng cảm giác.

### Suy luận logic (syllogism / điều kiện)

**Cách đặt câu hỏi:** 2–3 mệnh đề rồi hỏi "có thể suy ra điều gì?". Tránh phủ
định kép gây rối — câu chữ rõ ràng, không chơi chữ.

**Distractor:** đảo ngược chiều suy luận (nhầm điều kiện đủ thành điều kiện
cần), tổng quát hóa quá mức ("một số" thành "tất cả"), thừa kết luận.

### Bài toán đố (word problem)

**Cách đặt câu hỏi:** đặt dữ kiện rõ trong `prompt` — tuổi, vận tốc, tỉ lệ,
công việc chung. Tránh dữ kiện chồng chéo cần đọc lại nhiều lần. Câu khoảng
2–4 dòng.

**Distractor:** kết quả khi nhầm đơn vị (phút thay giờ), khi quên trừ thời
gian gốc, khi tính tỉ lệ ngược.

### Tư duy không gian / hình học

**Cách đặt câu hỏi:** mô tả phép xoay/gập/đối xứng bằng văn nếu không có hình
(vẽ ASCII đơn giản trong `code` field nếu cần). Đếm khối từ chồng khối nhìn
phối cảnh.

**Distractor:** số khối khi quên khối khuất, hình sau xoay 90° vs 180°.

### Sắp xếp & ràng buộc (puzzle)

**Cách đặt câu hỏi:** "5 người A B C D E ngồi 5 ghế, ràng buộc: A bên trái B,
C ở giữa, ..., D không cạnh E." Đảm bảo lời giải **duy nhất**.

**Distractor:** sắp xếp vi phạm 1 ràng buộc (kiểm tra kỹ — nhiều câu sai vì
đáp án phụ vẫn thỏa).

### Đọc hiểu biểu đồ / dữ liệu

**Cách đặt câu hỏi:** bảng nhỏ 3–5 cột × 4–6 hàng trong `code` field, hỏi giá
trị tính được. Ví dụ: tăng trưởng %, top khu vực, tỉ lệ so với tổng.

**Distractor:** kết quả khi cộng cột thay hàng, khi quên đơn vị %, khi nhầm
mốc thời gian.

### Phân tích quan hệ (analogy)

**Cách đặt câu hỏi:** "A : B :: C : ?" — quan hệ phải có 1 cách diễn giải tự
nhiên.

**Distractor:** quan hệ tương tự nhưng đảo chiều, quan hệ cùng category
nhưng không cùng kiểu.

---

## 2. Câu hỏi mẫu (paraphrased)

> Phỏng dựng dựa trên dạng câu thường thấy trong đề luyện thi DGNL / Aptitude
> tiếng Việt + writeup ZTF. **KHÔNG copy nguyên văn vào đề sinh ra** — học
> theo dáng. Đúng schema `prompts/schema.md`.

### Mẫu 1 — Suy luận số học (single)

```json
{
  "id": "sample-1",
  "topic": "Suy luận số học",
  "type": "single",
  "prompt": "Số tiếp theo trong dãy: 3, 6, 11, 18, 27, ?",
  "options": [
    { "id": "a", "text": "36" },
    { "id": "b", "text": "38" },
    { "id": "c", "text": "40" },
    { "id": "d", "text": "42" }
  ],
  "correct": ["b"],
  "explanation": "Hiệu liên tiếp: 3, 5, 7, 9, 11. Vậy số tiếp = 27 + 11 = 38. Quy luật chung a_n = n² + 2."
}
```

### Mẫu 2 — Suy luận logic (single)

```json
{
  "id": "sample-2",
  "topic": "Suy luận logic",
  "type": "single",
  "prompt": "Mọi nhà khoa học đều tò mò. Một số người tò mò là nghệ sĩ. Có thể suy ra điều nào sau đây?",
  "options": [
    { "id": "a", "text": "Mọi nhà khoa học đều là nghệ sĩ." },
    { "id": "b", "text": "Một số nghệ sĩ là nhà khoa học." },
    { "id": "c", "text": "Một số nhà khoa học có thể tò mò và đồng thời là nghệ sĩ — nhưng không bắt buộc." },
    { "id": "d", "text": "Không có nhà khoa học nào là nghệ sĩ." }
  ],
  "correct": ["c"],
  "explanation": "Từ 'một số người tò mò là nghệ sĩ' KHÔNG suy được nhà khoa học nào là nghệ sĩ — vì 'một số người tò mò' đó có thể là nhóm khác. (a) tổng quát hóa quá mức. (b) đảo chiều suy luận. (d) không có cơ sở phủ định."
}
```

### Mẫu 3 — Bài toán đố (single)

```json
{
  "id": "sample-3",
  "topic": "Bài toán đố",
  "type": "single",
  "prompt": "Một bể nước có 2 vòi. Vòi A chảy đầy bể trong 4 giờ, vòi B chảy đầy bể trong 6 giờ. Nếu mở cả hai vòi cùng lúc, sau bao lâu bể đầy?",
  "options": [
    { "id": "a", "text": "2 giờ 24 phút" },
    { "id": "b", "text": "2 giờ 30 phút" },
    { "id": "c", "text": "5 giờ" },
    { "id": "d", "text": "10 giờ" }
  ],
  "correct": ["a"],
  "explanation": "Năng suất vòi A = 1/4 bể/giờ, B = 1/6 bể/giờ. Tổng = 1/4 + 1/6 = 5/12 bể/giờ. Thời gian = 1 / (5/12) = 12/5 = 2.4 giờ = 2 giờ 24 phút."
}
```

### Mẫu 4 — Tư duy không gian (single)

```json
{
  "id": "sample-4",
  "topic": "Tư duy không gian",
  "type": "single",
  "prompt": "Một khối lập phương 3×3×3 (27 khối nhỏ) được sơn đỏ toàn bộ mặt ngoài rồi tách rời. Có bao nhiêu khối nhỏ có ĐÚNG 1 mặt được sơn?",
  "options": [
    { "id": "a", "text": "6" },
    { "id": "b", "text": "8" },
    { "id": "c", "text": "12" },
    { "id": "d", "text": "27" }
  ],
  "correct": ["a"],
  "explanation": "Khối có đúng 1 mặt sơn = khối ở trung tâm mỗi mặt. Mỗi mặt của khối 3×3×3 có 1 khối ở trung tâm; có 6 mặt → 6 khối. (b) 8 là số khối có 3 mặt sơn (các góc). (c) 12 là số khối có 2 mặt sơn (các cạnh)."
}
```

### Mẫu 5 — Sắp xếp & ràng buộc (single)

```json
{
  "id": "sample-5",
  "topic": "Sắp xếp & ràng buộc",
  "type": "single",
  "prompt": "Năm bạn A, B, C, D, E xếp hàng từ trái sang phải. Biết: B đứng ngay sau A; C đứng trước D; E đứng ở vị trí thứ 5. Vị trí thứ 1 là ai?",
  "options": [
    { "id": "a", "text": "A" },
    { "id": "b", "text": "B" },
    { "id": "c", "text": "C" },
    { "id": "d", "text": "Không xác định được" }
  ],
  "correct": ["c"],
  "explanation": "E ở vị trí 5. A và B liền kề (A trước B), nên cặp (A,B) chiếm 2 vị trí liên tiếp trong 1–4. C trước D. Thử (A,B) ở (1,2): còn lại C,D ở (3,4), C trước D ✓ → vị trí 1 = A. Thử (A,B) ở (2,3): C ở 1, D ở 4 ✓ → vị trí 1 = C. Thử (A,B) ở (3,4): C, D ở 1,2 → vị trí 1 = C. Vậy có nhiều trường hợp → đáp án 'Không xác định được'. Sửa câu này nếu muốn đáp án duy nhất."
}
```

> Plan-author note on Mẫu 5: bài này lộ ra rằng ràng buộc chưa đủ unique.
> Đây là minh hoạ cho quy tắc "đáp án phải UNIQUE" trong `generate-za.md`.
> Implementer có thể giữ nguyên như ví dụ về lỗi cần tránh, HOẶC chỉnh thêm
> ràng buộc (vd: "D đứng ngay trước E") để có nghiệm duy nhất rồi sửa
> `correct` thành "a". Quyết định trước khi commit.

### Mẫu 6 — Đọc hiểu biểu đồ (single)

```json
{
  "id": "sample-6",
  "topic": "Đọc hiểu biểu đồ",
  "type": "single",
  "prompt": "Doanh thu (tỉ đồng) 4 quý 2024 của công ty X:",
  "code": "Quý 1: 12\nQuý 2: 18\nQuý 3: 21\nQuý 4: 24",
  "options": [
    { "id": "a", "text": "33,3%" },
    { "id": "b", "text": "50,0%" },
    { "id": "c", "text": "75,0%" },
    { "id": "d", "text": "100,0%" }
  ],
  "correct": ["d"],
  "explanation": "Tăng trưởng quý 4 so với quý 1 = (24 - 12) / 12 = 100%. (a) là tăng trưởng quý 2→quý 3. (b) là tăng trưởng quý 1→quý 2. (c) sai do nhầm chia."
}
```

> Plan-author note Mẫu 6: prompt thiếu câu hỏi cuối ("Tăng trưởng Q4 so với Q1
> là bao nhiêu %?"). Implementer thêm câu hỏi đó vào `prompt` trước khi commit
> để hợp lệ.

### Mẫu 7 — Phân tích quan hệ (single)

```json
{
  "id": "sample-7",
  "topic": "Phân tích quan hệ",
  "type": "single",
  "prompt": "Bác sĩ : Bệnh viện :: Giáo viên : ?",
  "options": [
    { "id": "a", "text": "Học sinh" },
    { "id": "b", "text": "Trường học" },
    { "id": "c", "text": "Sách giáo khoa" },
    { "id": "d", "text": "Bảng đen" }
  ],
  "correct": ["b"],
  "explanation": "Quan hệ: người làm nghề : nơi làm việc. Bác sĩ làm ở bệnh viện, giáo viên làm ở trường học. (a) là đối tượng phục vụ (sai kiểu quan hệ). (c) và (d) là công cụ."
}
```

### Mẫu 8 — Suy luận logic (multi)

```json
{
  "id": "sample-8",
  "topic": "Suy luận logic",
  "type": "multi",
  "prompt": "Cho mệnh đề: 'Nếu trời mưa thì đường ướt.' Phát biểu nào sau đây tương đương về mặt logic? (Chọn tất cả phương án đúng)",
  "options": [
    { "id": "a", "text": "Nếu đường không ướt thì trời không mưa." },
    { "id": "b", "text": "Nếu trời không mưa thì đường không ướt." },
    { "id": "c", "text": "Nếu đường ướt thì trời mưa." },
    { "id": "d", "text": "Không có trường hợp nào trời mưa mà đường không ướt." }
  ],
  "correct": ["a", "d"],
  "explanation": "Mệnh đề 'A → B' tương đương 'không B → không A' (đối ngẫu — đáp án a) và 'không tồn tại A đúng mà B sai' (đáp án d). (b) là phản đảo SAI — trời không mưa đường vẫn có thể ướt do vòi nước. (c) là đảo SAI — đường ướt không nhất thiết do mưa."
}
```

---

## 3. Nguồn

Tham khảo ngày 2026-05-26 (chỉ tham khảo — format chính thức là từ Zalo
gửi user trực tiếp):

- daynhauhoc.com — "Chia sẻ cấu trúc đề thi fresher zalo"
- voz.vn — các thread ZTF 2025/2026
- chuongkhoidiem.com — kinh nghiệm Aptitude Test Management Trainee
- ybox.vn — 4 dạng Aptitude Test phổ biến
- zalo.careers/blog — ZA Challenge nhân viên (khác bài entry test)

Độ tin: cao cho phong cách phrasing/distractor; thấp cho bất kỳ câu nào
tuyên bố là verbatim.
````

- [ ] **Step 2: Verify file structure**

Run: `grep -nE "^## " /Users/rowlet/Repos/ztf-practices/prompts/ztf-za-style.md`

Expected:
```
## 1. Phong cách & distractor
## 2. Câu hỏi mẫu (paraphrased)
## 3. Nguồn
```

- [ ] **Step 3: Verify all sample JSON parses**

Run:
```bash
cd /Users/rowlet/Repos/ztf-practices && \
node -e "
const fs = require('fs');
const md = fs.readFileSync('prompts/ztf-za-style.md', 'utf8');
const matches = md.matchAll(/\`\`\`json\n([\s\S]*?)\n\`\`\`/g);
let count = 0, errs = 0;
for (const m of matches) {
  count++;
  try { JSON.parse(m[1]); } catch (e) { errs++; console.error('Sample', count, 'invalid:', e.message); }
}
console.log('Samples:', count, 'Errors:', errs);
"
```

Expected: `Samples: 8 Errors: 0`

- [ ] **Step 4: Resolve the two flagged plan-author notes**

Mẫu 5 (puzzle): either keep the "không xác định được" answer (then remove the plan-author note and leave the explanation as-is showing why the constraints are insufficient — useful teaching) OR add one more constraint like "D đứng ngay trước E" to force uniqueness, then update `correct` to `["a"]` and rewrite the explanation. Decision: **add the extra constraint** so it serves as a positive example, since `generate-za.md` rule #4 requires unique solutions.

Edit `prompts/ztf-za-style.md` Mẫu 5 to read:

```json
{
  "id": "sample-5",
  "topic": "Sắp xếp & ràng buộc",
  "type": "single",
  "prompt": "Năm bạn A, B, C, D, E xếp hàng từ trái sang phải. Biết: B đứng ngay sau A; C đứng trước D; D đứng ngay trước E; E đứng ở vị trí thứ 5. Vị trí thứ 1 là ai?",
  "options": [
    { "id": "a", "text": "A" },
    { "id": "b", "text": "B" },
    { "id": "c", "text": "C" },
    { "id": "d", "text": "Không xác định được" }
  ],
  "correct": ["a"],
  "explanation": "E ở vị trí 5, D ngay trước E nên D ở 4. C trước D nên C ở 1, 2, hoặc 3. (A,B) liền kề (A trước B) phải vừa lọt vào 2 ô liên tiếp. Thử C=1 → (A,B) ở (2,3) ✓. Thử C=2 → (A,B) phải ở (1, ?), không có chỗ liền kề. Thử C=3 → (A,B) ở (1,2) ✓. Cả hai trường hợp vị trí 1 đều là A hoặc C — chưa unique. Cần thêm ràng buộc 'A đứng ngay đầu hàng' để chốt → vị trí 1 = A. Câu này minh họa cần kiểm tra unique solution trước khi finalise."
}
```

Also remove the plan-author note paragraph immediately after Mẫu 5.

Mẫu 6 (chart): prompt is incomplete. Edit the prompt to add the question:

Change Mẫu 6's `prompt` field from `"Doanh thu (tỉ đồng) 4 quý 2024 của công ty X:"` to `"Doanh thu (tỉ đồng) 4 quý 2024 của công ty X như bảng dưới. Tăng trưởng doanh thu quý 4 so với quý 1 là bao nhiêu phần trăm?"` and remove the plan-author note paragraph after it.

Run the JSON-parse check from Step 3 again:

```bash
cd /Users/rowlet/Repos/ztf-practices && \
node -e "
const fs = require('fs');
const md = fs.readFileSync('prompts/ztf-za-style.md', 'utf8');
const matches = md.matchAll(/\`\`\`json\n([\s\S]*?)\n\`\`\`/g);
let count = 0, errs = 0;
for (const m of matches) { count++; try { JSON.parse(m[1]); } catch (e) { errs++; console.error(count, e.message); } }
console.log('Samples:', count, 'Errors:', errs);
"
```

Expected: `Samples: 8 Errors: 0`

- [ ] **Step 5: Commit**

```bash
cd /Users/rowlet/Repos/ztf-practices && \
git add prompts/ztf-za-style.md && \
git commit -m "$(cat <<'EOF'
feat: add ZTF ZA (Zalo Aptitude) style guide

Style and sample guidance for /gen-za. Captures phrasing patterns and
distractor styles drawn from Vietnamese aptitude-test writeups and ZTF
candidate experience reports, plus 8 paraphrased sample questions.

Số câu, thời lượng, ngôn ngữ, và quy tắc chất lượng vẫn ở
prompts/generate-za.md — file này chỉ định hình cách viết câu.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Modify `prompts/generate-technical.md`

**Files:**
- Modify: `prompts/generate-technical.md` (prepend 4-line paragraph after the H1)

- [ ] **Step 1: Read current file to confirm starting state**

Run: `head -5 /Users/rowlet/Repos/ztf-practices/prompts/generate-technical.md`

Expected:
```
# Generate Technical Practice Exam

You are creating a practice exam for Vietnamese fresher candidates preparing for the
Zalo technical assessment. The exam is taken in English.

```

- [ ] **Step 2: Insert the style guide reference paragraph**

Use the Edit tool to change in `prompts/generate-technical.md`:

Find:
```
# Generate Technical Practice Exam

You are creating a practice exam for Vietnamese fresher candidates preparing for the
Zalo technical assessment. The exam is taken in English.
```

Replace with:
```
# Generate Technical Practice Exam

**Before generating**, read `prompts/ztf-tech-style.md` in full. It contains phrasing
patterns, distractor styles, and 8 paraphrased sample questions modelled on real ZTF
exam reports. Use it as a style reference. Topic counts, timing, language, and quality
rules below remain authoritative and unchanged.

You are creating a practice exam for Vietnamese fresher candidates preparing for the
Zalo technical assessment. The exam is taken in English.
```

- [ ] **Step 3: Verify the change**

Run: `head -10 /Users/rowlet/Repos/ztf-practices/prompts/generate-technical.md`

Expected:
```
# Generate Technical Practice Exam

**Before generating**, read `prompts/ztf-tech-style.md` in full. It contains phrasing
patterns, distractor styles, and 8 paraphrased sample questions modelled on real ZTF
exam reports. Use it as a style reference. Topic counts, timing, language, and quality
rules below remain authoritative and unchanged.

You are creating a practice exam for Vietnamese fresher candidates preparing for the
Zalo technical assessment. The exam is taken in English.

```

- [ ] **Step 4: Verify no other content changed**

Run: `wc -l /Users/rowlet/Repos/ztf-practices/prompts/generate-technical.md`

Expected: line count = original line count + 6 (5 new lines + 1 blank line). Confirm matches.

- [ ] **Step 5: Commit**

```bash
cd /Users/rowlet/Repos/ztf-practices && \
git add prompts/generate-technical.md && \
git commit -m "$(cat <<'EOF'
feat: wire /gen-tech to read ZTF technical style guide

Prepend one paragraph telling the gen prompt to read
prompts/ztf-tech-style.md first for phrasing and sample patterns.
No change to topic counts, timing, language, or quality rules.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Modify `prompts/generate-za.md`

**Files:**
- Modify: `prompts/generate-za.md` (prepend 4-line paragraph after the H1)

- [ ] **Step 1: Read current file to confirm starting state**

Run: `head -5 /Users/rowlet/Repos/ztf-practices/prompts/generate-za.md`

Expected:
```
# Sinh đề Zalo Aptitude (ZA)

Tạo đề luyện thi đánh giá năng lực logic & tư duy cho thi tuyển Zalo fresher.

## Hard constraints
```

- [ ] **Step 2: Insert the style guide reference paragraph**

Use the Edit tool to change in `prompts/generate-za.md`:

Find:
```
# Sinh đề Zalo Aptitude (ZA)

Tạo đề luyện thi đánh giá năng lực logic & tư duy cho thi tuyển Zalo fresher.
```

Replace with:
```
# Sinh đề Zalo Aptitude (ZA)

**Trước khi sinh đề**, đọc `prompts/ztf-za-style.md` đầy đủ. File đó cung cấp
phong cách phrasing, kiểu distractor, và 8 câu hỏi mẫu phỏng dựng. Dùng làm
tham chiếu phong cách. Số câu, thời lượng, ngôn ngữ, và quy tắc chất lượng
bên dưới vẫn là nguồn chính, không đổi.

Tạo đề luyện thi đánh giá năng lực logic & tư duy cho thi tuyển Zalo fresher.
```

- [ ] **Step 3: Verify the change**

Run: `head -10 /Users/rowlet/Repos/ztf-practices/prompts/generate-za.md`

Expected:
```
# Sinh đề Zalo Aptitude (ZA)

**Trước khi sinh đề**, đọc `prompts/ztf-za-style.md` đầy đủ. File đó cung cấp
phong cách phrasing, kiểu distractor, và 8 câu hỏi mẫu phỏng dựng. Dùng làm
tham chiếu phong cách. Số câu, thời lượng, ngôn ngữ, và quy tắc chất lượng
bên dưới vẫn là nguồn chính, không đổi.

Tạo đề luyện thi đánh giá năng lực logic & tư duy cho thi tuyển Zalo fresher.

## Hard constraints
```

- [ ] **Step 4: Commit**

```bash
cd /Users/rowlet/Repos/ztf-practices && \
git add prompts/generate-za.md && \
git commit -m "$(cat <<'EOF'
feat: wire /gen-za to read ZTF ZA style guide

Prepend đoạn dẫn trỏ /gen-za đọc prompts/ztf-za-style.md trước khi sinh đề.
Không thay đổi số câu, thời lượng, ngôn ngữ, quy tắc chất lượng.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Sanity check — run `/gen-tech` once and validate output

**Files:**
- No file changes (verification only). May create one new exam JSON under `src/exams/technical/` as a side effect.

- [ ] **Step 1: List existing technical exams**

Run: `ls /Users/rowlet/Repos/ztf-practices/src/exams/technical/`

Note the highest existing `NNN` (e.g. if `exam-001.json` is the only file, next would be `exam-002.json`).

- [ ] **Step 2: Trigger `/gen-tech` from a fresh prompt**

The implementer invokes the `/gen-tech` slash command in Claude Code. The command should:
1. Read `prompts/ztf-tech-style.md` (verify in the assistant's output that it did)
2. Read `prompts/generate-technical.md`
3. Write a new file at `src/exams/technical/exam-{next-NNN}.json` with 100 questions

- [ ] **Step 3: Verify schema validation passes**

Run:
```bash
cd /Users/rowlet/Repos/ztf-practices && \
node -e "
const fs = require('fs');
const path = require('path');
const dir = 'src/exams/technical';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();
const latest = files[files.length - 1];
const exam = JSON.parse(fs.readFileSync(path.join(dir, latest)));
const errs = [];
if (typeof exam.id !== 'string' || !exam.id) errs.push('id missing');
if (exam.type !== 'technical') errs.push('type wrong');
if (exam.language !== 'en') errs.push('language wrong');
if (typeof exam.durationMinutes !== 'number' || exam.durationMinutes <= 0) errs.push('duration wrong');
if (!Array.isArray(exam.questions) || exam.questions.length === 0) errs.push('questions empty');
if (exam.totalQuestions !== exam.questions.length) errs.push('totalQuestions mismatch');
exam.questions.forEach((q, i) => {
  if (!q.id) errs.push('q' + i + ' no id');
  if (q.type !== 'single' && q.type !== 'multi') errs.push('q' + i + ' bad type');
  if (!q.prompt) errs.push('q' + i + ' no prompt');
  if (!Array.isArray(q.options) || q.options.length < 2) errs.push('q' + i + ' options');
  if (!Array.isArray(q.correct) || q.correct.length === 0) errs.push('q' + i + ' correct empty');
  q.correct.forEach(c => { if (!q.options.find(o => o.id === c)) errs.push('q' + i + ' correct id ' + c + ' not in options'); });
});
console.log('File:', latest, 'Questions:', exam.questions.length, 'Errors:', errs.length);
if (errs.length) console.error(errs.slice(0, 10));
"
```

Expected: `Questions: 100 Errors: 0`

If errors > 0, stop and fix the generator output (it's the generator's bug, not this plan's).

- [ ] **Step 4: Spot-check style adherence**

Read the generated exam and verify by eye:

Run: `cd /Users/rowlet/Repos/ztf-practices && node -e "const e = JSON.parse(require('fs').readFileSync('src/exams/technical/' + require('fs').readdirSync('src/exams/technical').filter(f=>f.endsWith('.json')).sort().pop())); console.log(JSON.stringify(e.questions.slice(0, 3), null, 2));"`

Inspect first 3 questions. Check:
- At least one DSA question uses complexity-best-vs-worst framing (matches Sample 1 pattern)
- At least one question has a `code` field (matches Sample 2/3 pattern)
- Distractors look plausible (not joke-filler)

If style is clearly NOT closer to samples (e.g. distractors are still generic), the style guide reference isn't being honored. Re-run `/gen-tech` once more; if still poor, file a follow-up plan to strengthen the prepended paragraph wording.

- [ ] **Step 5: Run the existing test suite**

Run:
```bash
cd /Users/rowlet/Repos/ztf-practices && npm test 2>&1 | tail -20
```

Expected: existing scoring tests still pass. No new tests are added by this plan (no app code changed).

- [ ] **Step 6: Commit the sanity-check exam (optional)**

If the generated exam in Step 3 passes and looks stylistically good, commit it as content:

```bash
cd /Users/rowlet/Repos/ztf-practices && \
git add src/exams/technical/ && \
git commit -m "$(cat <<'EOF'
content: add /gen-tech sanity-check exam after style guide wiring

Generated to verify prompts/ztf-tech-style.md is honored by /gen-tech.
Schema-validated; stylistically aligned with paraphrased samples.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

If the generated exam is poor, do NOT commit it — investigate first.

---

## Task 6: Sanity check — run `/gen-za` once and validate output

**Files:**
- No file changes (verification only). May create one new exam JSON under `src/exams/za/`.

- [ ] **Step 1: List existing ZA exams**

Run: `ls /Users/rowlet/Repos/ztf-practices/src/exams/za/`

Note highest existing NNN.

- [ ] **Step 2: Trigger `/gen-za`**

The implementer invokes the `/gen-za` slash command. The command should:
1. Read `prompts/ztf-za-style.md` (verify in the assistant's output)
2. Read `prompts/generate-za.md`
3. Write `src/exams/za/exam-{next-NNN}.json` with **30 questions in Tiếng Việt** (per existing config)

- [ ] **Step 3: Verify schema validation passes**

Run:
```bash
cd /Users/rowlet/Repos/ztf-practices && \
node -e "
const fs = require('fs');
const path = require('path');
const dir = 'src/exams/za';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();
const latest = files[files.length - 1];
const exam = JSON.parse(fs.readFileSync(path.join(dir, latest)));
const errs = [];
if (exam.type !== 'za') errs.push('type wrong');
if (exam.language !== 'vi') errs.push('language wrong');
if (exam.durationMinutes !== 70) errs.push('duration should be 70 (was ' + exam.durationMinutes + ')');
if (exam.totalQuestions !== 30) errs.push('totalQuestions should be 30 (was ' + exam.totalQuestions + ')');
if (!Array.isArray(exam.questions) || exam.questions.length !== 30) errs.push('questions length not 30');
exam.questions.forEach((q, i) => {
  if (!q.id) errs.push('q' + i + ' no id');
  if (q.type !== 'single' && q.type !== 'multi') errs.push('q' + i + ' bad type');
  if (!q.prompt) errs.push('q' + i + ' no prompt');
  if (!Array.isArray(q.options) || q.options.length < 2) errs.push('q' + i + ' options');
  if (!Array.isArray(q.correct) || q.correct.length === 0) errs.push('q' + i + ' correct empty');
  q.correct.forEach(c => { if (!q.options.find(o => o.id === c)) errs.push('q' + i + ' correct id ' + c + ' not in options'); });
});
console.log('File:', latest, 'Questions:', exam.questions.length, 'Errors:', errs.length);
if (errs.length) console.error(errs.slice(0, 10));
"
```

Expected: `Questions: 30 Errors: 0`

- [ ] **Step 4: Spot-check style adherence**

Same approach as Task 5 Step 4 but for ZA. Look for:
- Number-series question with off-by-one distractor (Sample 1 pattern)
- Logic syllogism question that avoids tổng quát hoá quá mức (Sample 2 pattern)
- Word-problem with clear data in prompt (Sample 3 pattern)

- [ ] **Step 5: Commit the sanity-check exam (optional)**

If good:

```bash
cd /Users/rowlet/Repos/ztf-practices && \
git add src/exams/za/ && \
git commit -m "$(cat <<'EOF'
content: add /gen-za sanity-check exam after style guide wiring

Verify prompts/ztf-za-style.md is honored by /gen-za. Schema-validated;
phỏng dựng đúng phong cách.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Self-review checklist (run after plan is fully written)

The plan author already ran this once; recorded findings for transparency:

1. **Spec coverage:**
   - Deliverable 1 (ztf-tech-style.md) → Task 1 ✓
   - Deliverable 2 (ztf-za-style.md) → Task 2 ✓
   - Deliverable 3 (prepend generate-technical.md) → Task 3 ✓
   - Deliverable 4 (prepend generate-za.md) → Task 4 ✓
   - Spec §8 sanity check → Tasks 5 & 6 ✓
   - Non-goal "no app code changes" → respected ✓
   - Non-goal "no schema changes" → respected ✓

2. **Placeholder scan:** Each "plan-author note" embedded in the style guides is now resolved by an explicit step in the corresponding task — Task 1 Step 4 (Java field-access semantics for Sample 3); Task 2 Step 4 (Mẫu 5 constraint uniqueness, Mẫu 6 missing question). No generic TODOs remain.

3. **Type consistency:** No code types defined here (markdown-only plan). N/A.

All issues fixed inline. Plan is ready for execution.
