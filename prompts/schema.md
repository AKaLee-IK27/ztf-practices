# Exam JSON Schema (Single Source of Truth)

All exam files in `src/exams/**/*.json` MUST conform to this schema.
The runtime validator in `src/lib/examLoader.ts` skips malformed files with a console warning.

## Top-level shape

```jsonc
{
  "id": "tech-007",                  // string, unique. Convention: "{type}-{NNN}".
  "type": "technical",               // "technical" | "za"
  "title": "Technical Practice #7",  // shown in UI
  "language": "en",                  // "en" | "vi" — MUST match question text language
  "durationMinutes": 60,             // integer > 0
  "totalQuestions": 100,             // integer, MUST equal questions.length
  "passingScore": 70,                // optional, 0-100 (percent)
  "createdAt": "2026-05-26",         // ISO date
  "topics": ["DSA", "OOP", "..."],   // optional, shown as tags on the card
  "questions": [ /* Question[] */ ]
}
```

## Question shape

```jsonc
{
  "id": "q1",                        // unique within exam, "q1".."qN" sequential
  "topic": "DSA",                    // optional, used for topic breakdown in results
  "type": "single",                  // "single" | "multi"
  "prompt": "What is...",            // the question text
  "code": null,                      // optional. String for code snippet (rendered <pre>), null/omit if none
  "options": [
    { "id": "a", "text": "..." },
    { "id": "b", "text": "..." }
    // 2 to 5 options, ids must be unique. Convention: "a", "b", "c", "d", "e".
  ],
  "correct": ["b"],                  // ALWAYS an array. Single: length 1. Multi: length 2-3 typical.
  "explanation": "..."               // REQUIRED. 2-6 sentences. Same language as prompt.
}
```

## Hard constraints (validator enforces)

- `id` non-empty string
- `type` is `"technical"` or `"za"`
- `language` is `"en"` or `"vi"`
- `durationMinutes` is a positive number
- `questions` is a non-empty array
- Every question:
  - `id` non-empty
  - `type` is `"single"` or `"multi"`
  - `prompt` non-empty
  - `options` has ≥ 2 entries
  - `correct` is non-empty array; every id MUST exist in `options`
  - `explanation` is a string (may be empty but should never be)

Files failing validation are skipped at load time.

## Style / soft rules (humans should follow)

- For `type: "single"`, `correct` has exactly 1 id.
- For `type: "multi"`, `correct` has 2-3 ids typically.
- Options should all be plausible — no obvious filler.
- Avoid "All of the above" / "None of the above".
- Multi-correct prompts MUST cue the user, e.g.:
  - EN: "Which of the following ... (Select all that apply)"
  - VI: "Đáp án nào sau đây ... (Chọn tất cả phương án đúng)"
- `explanation` is the value-add — explain reasoning, not just restate the answer.

## Example: single-correct (EN, with code snippet)

```json
{
  "id": "q42",
  "topic": "DB",
  "type": "single",
  "prompt": "Which SQL clause is used to filter groups produced by GROUP BY?",
  "code": "SELECT department, COUNT(*) AS cnt\nFROM employees\nGROUP BY department\n??? cnt > 5;",
  "options": [
    { "id": "a", "text": "WHERE" },
    { "id": "b", "text": "HAVING" },
    { "id": "c", "text": "FILTER" },
    { "id": "d", "text": "GROUP FILTER" }
  ],
  "correct": ["b"],
  "explanation": "HAVING filters rows AFTER aggregation; WHERE filters rows BEFORE aggregation and cannot reference aggregate functions like COUNT(*). The correct query uses HAVING cnt > 5."
}
```

## Example: multi-correct (VI)

```json
{
  "id": "q15",
  "topic": "Suy luận logic",
  "type": "multi",
  "prompt": "Phát biểu nào sau đây ĐÚNG về một hàm số đơn điệu tăng trên khoảng (a, b)? (Chọn tất cả phương án đúng)",
  "options": [
    { "id": "a", "text": "Với mọi x1 < x2 trong (a, b), f(x1) < f(x2)." },
    { "id": "b", "text": "Hàm số có đạo hàm dương trên toàn khoảng." },
    { "id": "c", "text": "Hàm số là hàm 1-1 (injective) trên khoảng đó." },
    { "id": "d", "text": "Hàm số có cực trị trong khoảng." }
  ],
  "correct": ["a", "c"],
  "explanation": "Đơn điệu tăng tương đương định nghĩa (a). Hàm đơn điệu tăng luôn là hàm 1-1 — không có hai giá trị x khác nhau cùng cho ra một f(x). (b) sai vì đơn điệu tăng không yêu cầu khả vi (ví dụ hàm bậc thang tăng nghiêm ngặt). (d) sai vì đơn điệu tăng nghĩa là không có cực trị trong khoảng."
}
```
