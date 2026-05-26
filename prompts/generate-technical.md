# Generate Technical Practice Exam

**Before generating**, read `prompts/ztf-tech-style.md` in full. It contains phrasing
patterns, distractor styles, and 8 paraphrased sample questions modelled on real ZTF
exam reports. Use it as a style reference. Topic counts, timing, language, and quality
rules below remain authoritative and unchanged.

You are creating a practice exam for Vietnamese fresher candidates preparing for the
Zalo technical assessment. The exam is taken in English.

## Hard constraints

- Language: **English** (every prompt, option, explanation)
- Total questions: **100**
- Duration: **60 minutes**
- Difficulty: fresher level (final-year CS student or 0-2 YOE)
- Output JSON MUST conform to `prompts/schema.md`

## Topic distribution (target)

| Topic | Count | Notes |
|-------|-------|-------|
| DSA (algorithms, data structures, complexity) | 25 | arrays, trees, graphs, sorting, recursion, hashing, Big-O analysis |
| OOP & Language fundamentals | 20 | inheritance, polymorphism, encapsulation, generics, exceptions, Java/C++/Python concepts |
| Networking & Web | 15 | HTTP methods, status codes, TCP/UDP, DNS, REST principles, basic security (CSRF, XSS, HTTPS) |
| Database | 15 | SQL queries (joins, group by, having, subquery), normalization, indexing, transactions, NoSQL vs SQL |
| Operating Systems | 10 | processes vs threads, scheduling, memory (paging, virtual memory), deadlocks, synchronization primitives |
| AI / ML basics | 10 | supervised vs unsupervised, common algorithms (linear/logistic regression, decision trees, k-means, neural net basics), train/test split, overfitting, evaluation metrics |
| General CS / Logic | 5 | bit manipulation, math, design patterns at a high level |

Use these counts as a strong guide; minor variance (±2 per topic) is OK if it yields better questions.

## Question type mix

- ~70 single-correct (use `type: "single"`)
- ~30 multi-correct (use `type: "multi"`) — typically 2-3 correct out of 4-5 options
- Multi-correct prompts MUST include "Select all that apply" (or similar)

## Quality rules

1. Every question MUST have a clear `explanation` of 2-5 sentences — this is teaching material, not just a scoring tool.
2. Code snippets go in the `code` field (renders monospace). Don't shove code into `prompt`.
3. All options should be plausible distractors — no joke filler.
4. Avoid "All of the above" / "None of the above".
5. Don't repeat questions from existing exams in `src/exams/technical/`. Skim 1-2 recent files first.
6. Topic field on the question should match one of the categories in the distribution table.
7. Don't use Vietnamese characters anywhere (the exam is fully English).

## File naming

Output path: `src/exams/technical/exam-{NNN}.json` where `NNN` is zero-padded to 3 digits.

1. List the existing files: `ls src/exams/technical/`
2. Find the highest `NNN` (e.g. if `exam-001.json` and `exam-002.json` exist, next is `003`).
3. Write the new file at that path.

## Output checklist after generation

After writing the file, print:
- Path of the new file
- Question count by topic (table)
- Number of single vs multi questions
- Any deviation from the target distribution and why
