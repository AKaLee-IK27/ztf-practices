# ZTF Research-Driven Exam Generation — Design Spec

**Date:** 2026-05-26
**Status:** Draft — awaiting user review
**Owner:** dev@greenpassport.co

## 1. Goal

Make `/gen-tech` and `/gen-za` generate exams that feel closer to the real Zalo Tech Fresher (ZTF) entry test in **phrasing, distractor style, and question shape** — not just plausible CS quizzes. This is achieved by adding a one-shot research pass whose output (two static style-guide markdown files) is loaded by the gen commands as guidance for style and sample patterns.

**Important constraint (primary source):** The current `/gen-tech` and `/gen-za` config (Tech: 100 câu / 60 phút / EN; ZA: 30 câu / 70 phút / VI) reflects the format **as sent by Zalo to the user directly**. This format is authoritative and is NOT changed by this work. Public web writeups (used in research) describe variants from prior years or different programs and are used **only for style/phrasing/sample inspiration**, never to override the authoritative config.

## 2. Non-goals

- No slash command for research (`/research-*`). Research is a one-shot synthesis already performed in this session.
- No JSON config alongside markdown. Style guide is markdown-only.
- No automated refresh / scheduler. Re-run by hand if/when needed.
- No claim that paraphrased samples are real exam questions (ZTF is proctored; verbatim Q&A is not public).
- **No realignment of format, number of questions, time, or topic distribution.** Current `/gen-*` config stands.
- No new exam types.
- No app code changes (UI labels and generator estimates stay as-is, since the format they reference is correct).

## 3. Research findings (advisory only — does NOT override config)

Synthesised from candidate writeups (VOZ, daynhauhoc, techsignin), the official Zalo Careers blog, and program announcements. These are **secondhand sources** describing prior years or related programs. Where they disagree with the user's authoritative config, the config wins.

### 3.1 Format observations (from public sources)

- Web sources describe a 3-hour, 2-test entry test (100 Q × 60 min each) with a 30-min break and 50/30/20 difficulty split. This describes a variant configuration that the project does NOT need to mirror — the user's authoritative format is what the gen commands target.
- Heavy time pressure (~36 sec/question) is a consistent theme; useful for understanding what "real" question length and complexity feel like.
- Mix of single + multi-correct is consistent across sources.

### 3.2 Technical test — style observations

Useful phrasing and topic patterns to mine for style (not topic distribution):

- **DSA** style: questions on sorting & complexity (best/worst case), tree traversal (pre/in/post/level-order), BST/AVL, linked lists, BFS/DFS, recursion (Tower of Hanoi), stack/queue
- **OOP** style: code reading and pseudocode debugging, in addition to theory
- **Code-reading questions**: "what does this code print?", "which line is buggy?", "select the missing fragment"
- **Bit operations**: shifts, AND/OR/XOR tricks appear repeatedly
- **Complexity analysis**: best vs worst case framing is common
- Other topics that show up in writeups but are NOT necessarily needed for this project (since config is authoritative): cybersecurity basics, computer architecture, discrete math, Git

These observations feed into **how /gen-tech writes a DSA question** (more about complexity-best-vs-worst framing, more code-reading) without changing **how many DSA questions it generates** (current config already says 25).

### 3.3 ZA (Aptitude) — style observations

Public sources describe a broader DGNL-like aptitude test (subjects + IQ + logic). The user's project specifically targets the **logic/IQ portion** in `/gen-za` (30 câu / 70 phút). The research informs:

- **Time-pressure phrasing**: short prompts, minimal setup, fast-resolution puzzles
- **Distractor style for number series**: distractors that follow a *plausible but wrong* pattern (off-by-one in the rule)
- **Puzzle uniqueness**: real puzzles converge to a single solution; trap distractors are common
- **Trap themes**: ambiguous wording avoided; pure logic; no trick puns
- These reinforce the current `/gen-za` quality rules rather than expanding them.

### 3.4 "ZA Challenge" is a separate test

The official Zalo Careers blog "Vì sao nhân viên Zalo cần thi IQ hàng năm?" describes the **annual aptitude test for current Zalo employees** (120 min, 100 MCQ + essay). This is unrelated to the fresher entry test the project targets. Mentioned only so future research doesn't conflate the two.

## 4. Decisions

### 4.1 `/gen-tech` — config unchanged

- Total Q / time: **100 / 60 min** (unchanged)
- Language: **English** (unchanged)
- Topic distribution: **unchanged** (DSA 25, OOP 20, Net 15, DB 15, OS 10, AI/ML 10, General CS 5)
- Question type mix: **unchanged** (~70 single / ~30 multi)
- New: style guide adds phrasing/distractor/sample guidance the prompt now references

### 4.2 `/gen-za` — config unchanged

- Total Q / time: **30 / 70 phút** (unchanged)
- Language: **VI** (unchanged)
- Topic distribution: **unchanged** (number series 5, syllogism 5, word problems 6, spatial 4, puzzle 5, chart 3, analogy 2)
- Question type mix: **unchanged** (~27 single / ~3 multi)
- New: style guide adds phrasing/distractor/sample guidance the prompt now references

### 4.3 Style guide structure

Two files at `prompts/`, each with the same 4 sections:

1. **Header / context** — short note that this is style/phrasing guidance only; topic counts and timing remain in `generate-technical.md` / `generate-za.md` (the gen prompts)
2. **Phrasing & distractor patterns** — for each topic the gen prompt covers, give 1–3 concrete phrasing patterns and the kind of plausible-but-wrong distractor that fits
3. **Sample questions (paraphrased)** — 8–12 paraphrased samples per file, schema-shaped (id/type/prompt/options/correct/explanation), labelled **paraphrased/representative, not verbatim**. These are calibration anchors, not study answers.
4. **Sources & notes** — URLs consulted, date stamp, confidence notes

### 4.4 Wiring into `/gen-*`

Update `prompts/generate-technical.md` and `prompts/generate-za.md` to begin with one new short paragraph:

> **Before generating**, read `prompts/ztf-tech-style.md` (or `ztf-za-style.md`) in full. It provides phrasing patterns, distractor styles, and paraphrased sample questions modelled on real ZTF questions. Use it as a style reference. Topic counts, timing, language, and quality rules below are authoritative and unchanged.

No other edits to the gen prompts. The topic tables, total counts, and quality rules remain exactly as they are.

## 5. Deliverables

Concrete files to create or modify:

1. **Create** `prompts/ztf-tech-style.md` — new style guide (Tech, EN)
2. **Create** `prompts/ztf-za-style.md` — new style guide (ZA, VI)
3. **Modify** `prompts/generate-technical.md` — prepend the one-paragraph reference to the style guide; nothing else changes
4. **Modify** `prompts/generate-za.md` — prepend the one-paragraph reference to the style guide; nothing else changes

**No app code changes.** UI label "Zalo Aptitude (30 câu)" in `GenerateModal.tsx:25` and generator comment in `generator.ts:22` remain correct.

**No changes to `prompts/schema.md`.** Already verified it uses values only as examples.

**Existing exams** in `src/exams/**` are unchanged.

## 6. Open questions

- **Sample question fidelity**: paraphrased samples are plausible reconstructions inspired by writeups + topic patterns. They calibrate `/gen-*` style. Confirmed acceptable scope by user.
- **Refresh policy**: re-run research by hand if Zalo materially changes format. Out of scope for this work.

## 7. Sources

Consulted on 2026-05-26 (advisory only; user's primary-source Zalo communication is authoritative for format):

- daynhauhoc.com — "Chia sẻ cấu trúc đề thi fresher zalo" (2022 candidate writeup, most detailed)
- techsignin.com — "Ước mơ kỹ sư công nghệ với Zalo Tech Fresher 2022" (official feature)
- voz.vn — multiple 2025 & 2026 ZTF threads
- voz.vn — VNG fresher test thread (related company)
- zalo.careers/blog — "Vì sao nhân viên Zalo cần thi IQ hàng năm?" (employee ZA Challenge, not entry test)
- engineerprogurus.com — Zalo interview success story (mid-level)
- zalo.careers/techfresher — official program page

Confidence notes:
- High: that real ZTF questions use the phrasing/distractor patterns described in §3.2 and §3.3
- Medium: which specific topics appear in any given year (varies)
- Low: any verbatim wording — none should be claimed

## 8. Implementation order

The implementation plan (separate doc) will execute:

1. Write `prompts/ztf-tech-style.md`
2. Write `prompts/ztf-za-style.md`
3. Update `prompts/generate-technical.md` (prepend one paragraph)
4. Update `prompts/generate-za.md` (prepend one paragraph)
5. Sanity check: run `/gen-tech` and `/gen-za` once; confirm output still validates against the schema and that style is noticeably closer to the paraphrased samples
