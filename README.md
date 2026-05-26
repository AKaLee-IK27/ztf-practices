# ZTF Practice — Zalo Tech Fresher Mock Exam Platform

**🇻🇳 Tiếng Việt** · [🇬🇧 English](./README.en.md)

Một web app luyện thi offline cho vòng Entry Test của chương trình **Zalo Tech Fresher** — gồm 2 phần đề thi mô phỏng đúng format thật:

- **Technical Practice** — 100 câu / 60 phút / English — DSA, OOP, Networking, Database, OS, AI/ML
- **Zalo Aptitude (ZA)** — 30 câu / 70 phút / Tiếng Việt — logic, suy luận số học, puzzle, bài toán đố

Đề được sinh bằng AI (Claude Code) dựa trên **style guide đã research từ writeup ZTF thật**, và **chấm điểm tự động** với timer y như phòng thi.

## Demo nhanh

```bash
npm install
npm run dev   # → http://localhost:5173
```

App khởi động với sẵn các đề mẫu trong `src/exams/`. Chọn 1 đề → bấm Start → làm bài → submit để xem kết quả + lịch sử lưu trong `localStorage`.

## Tính năng

### Giao diện làm bài
- ⏱ **Timer countdown** đúng theo thời lượng đề (60 hoặc 70 phút). Hết giờ → tự nộp với answers hiện có.
- 🔖 **Flag câu hỏi** để review lại trước khi nộp.
- 🧭 **Sidebar navigation** — nhảy giữa các câu, hiển thị câu đã làm / chưa làm / flag.
- 💾 **Auto-save in-progress** — reload trang giữa chừng vẫn không mất bài.
- ✅ **Multi-correct all-or-nothing** scoring (giống đề thật, không có partial credit).
- 📊 **Trang kết quả**: tổng điểm, breakdown theo topic, danh sách câu sai kèm `explanation` từ đề.
- 📚 **Lịch sử attempt** lưu trong `localStorage`, xem lại bất cứ lúc nào.

### Sinh đề bằng AI
- 🤖 **Slash commands `/gen-tech` và `/gen-za`** trong Claude Code — sinh trọn đề mới (100 hoặc 30 câu) trong 1 lần.
- 🎨 **Style guide tách rời** (`prompts/ztf-*-style.md`) — chứa phrasing patterns, distractor styles, và paraphrased samples để câu hỏi sinh ra giống ZTF thật hơn.
- 🔍 **JSON schema validation** runtime — đề lỗi sẽ bị skip với warning, không crash app.
- ♻️ **Vite HMR** — drop file JSON mới vào `src/exams/` là app tự pick up ngay.

## Tech stack

| Layer | Tech |
|---|---|
| Build | Vite 5 |
| UI | React 18 + React Router 6 |
| Language | TypeScript 5 (strict) |
| Tests | Vitest |
| Persistence | `localStorage` (zero backend) |
| Exam data | JSON tĩnh trong `src/exams/` |
| AI generation | Claude Code slash commands |

Không có backend, không có database, không có auth. Tất cả là static frontend + 1 file JSON / đề.

## Quick start

```bash
git clone https://github.com/<your-username>/ztf-practices.git
cd ztf-practices
npm install
npm run dev          # dev server với HMR
```

Mở `http://localhost:5173`.

### Scripts khác

```bash
npm run build        # production build → dist/
npm run preview      # serve dist/
npm run typecheck    # tsc --noEmit
npm test             # vitest unit tests (chạy 1 lần)
npm run test:watch   # vitest watch mode
```

## Cấu trúc project

```
ztf-practices/
├── src/
│   ├── exams/
│   │   ├── technical/exam-*.json   # đề tech (100 câu / 60 phút)
│   │   └── za/exam-*.json          # đề ZA (30 câu / 70 phút)
│   ├── lib/
│   │   ├── types.ts                # Exam, Question, Attempt types
│   │   ├── scoring.ts              # chấm điểm (all-or-nothing cho multi)
│   │   ├── storage.ts              # localStorage wrapper (ns `ztp:*`)
│   │   ├── examLoader.ts           # Vite glob import + runtime validation
│   │   └── generator.ts            # gọi /api/generate
│   ├── components/
│   │   ├── ExamList.tsx            # `/` — trang chọn đề + history
│   │   ├── ExamRunner.tsx          # `/exam/:id` — phòng thi
│   │   ├── ResultsView.tsx         # `/exam/:id/result/:attemptId`
│   │   ├── QuestionCard.tsx        # 1 câu hỏi
│   │   ├── Timer.tsx               # countdown
│   │   └── GenerateModal.tsx       # modal sinh đề từ UI
│   ├── routes.tsx                  # React Router config
│   └── main.tsx                    # entry point
├── prompts/                        # Source of truth cho /gen-* commands
│   ├── schema.md                   # JSON shape đề + question
│   ├── generate-technical.md       # rules sinh đề tech
│   ├── generate-za.md              # rules sinh đề ZA
│   ├── ztf-tech-style.md           # style guide tech (research-driven)
│   └── ztf-za-style.md             # style guide ZA (research-driven)
├── .claude/
│   └── commands/
│       ├── gen-tech.md             # slash command `/gen-tech`
│       └── gen-za.md               # slash command `/gen-za`
├── docs/superpowers/               # spec + plan brainstorming docs
└── vite.config.ts                  # plugin React + middleware /api/generate
```

## Sinh đề mới bằng Claude Code

Trong terminal ở root project:

```bash
claude

# Sinh 1 đề tech mới (100 câu, EN)
> /gen-tech

# Sinh có hint
> /gen-tech focus more on AI and database

# Sinh 1 đề ZA mới (30 câu, VI)
> /gen-za

# Sinh với hint
> /gen-za tập trung puzzle ràng buộc
```

Mỗi command sẽ:
1. Đọc `prompts/schema.md` để biết JSON shape
2. Đọc `prompts/generate-*.md` để biết topic distribution + quality rules
3. Đọc `prompts/ztf-*-style.md` để học phrasing/distractor patterns + samples
4. Sinh đầy đủ 100/30 câu trong 1 lần
5. Ghi `src/exams/{type}/exam-{NNN}.json` với NNN tiếp theo
6. Báo cáo phân bổ topic, số single/multi

Vite HMR sẽ tự load đề mới — refresh trang chọn đề là thấy.

### Sinh từ UI (browser)

Project có middleware `/api/generate` trong `vite.config.ts` — bấm nút "Generate" trong UI sẽ trigger generation qua Claude Code CLI (cần Claude Code cài sẵn local).

## Hệ thống style guide

Để câu hỏi sinh ra giống ZTF thật, project dùng "research-driven generation":

1. **Research pass** (one-shot) — thu thập format/phrasing/sample từ writeup ZTF công khai (VOZ, daynhauhoc, Zalo Careers blog).
2. **Style guide markdown** (`prompts/ztf-tech-style.md`, `prompts/ztf-za-style.md`) — mỗi file gồm:
   - Phrasing & distractor patterns theo từng topic
   - 8 paraphrased sample questions (schema-compatible)
   - Citation nguồn
3. **Gen prompts reference style guide** — `generate-technical.md` và `generate-za.md` có 1 đoạn mở đầu hướng dẫn Claude đọc style guide trước.
4. **Format/topic/timing là authoritative** — đến từ chính communication Zalo gửi user. Style guide chỉ shape phong cách, không đổi config.

Spec + implementation plan đầy đủ ở `docs/superpowers/specs/` và `docs/superpowers/plans/`.

> **Lưu ý**: Sample questions trong style guide là **paraphrased reconstructions**, KHÔNG phải câu hỏi gốc ZTF. ZTF là đề proctored, đề thật không public. Style guide chỉ là calibration anchor để câu sinh ra "có dáng" giống thật.

## JSON schema đề

Single source of truth ở `prompts/schema.md`. Tóm tắt:

```jsonc
{
  "id": "tech-001",
  "type": "technical",            // "technical" | "za"
  "title": "Technical Practice #1",
  "language": "en",               // "en" | "vi"
  "durationMinutes": 60,
  "totalQuestions": 100,
  "passingScore": 70,             // optional, %
  "createdAt": "2026-05-26",
  "topics": ["DSA", "OOP", "..."],
  "questions": [
    {
      "id": "q1",
      "topic": "DSA",
      "type": "single",            // "single" | "multi"
      "prompt": "What is...",
      "code": "...optional code snippet...",
      "options": [
        { "id": "a", "text": "..." },
        { "id": "b", "text": "..." }
      ],
      "correct": ["b"],            // luôn là array
      "explanation": "..."         // 2-5 câu, bắt buộc
    }
  ]
}
```

Validator runtime ở `src/lib/examLoader.ts` skip file lỗi với console warning thay vì crash.

## Quy tắc chấm điểm

| Tình huống | Điểm |
|---|---|
| Single-correct đúng | 1 |
| Single-correct sai | 0 |
| Multi-correct đúng TOÀN BỘ (không thừa không thiếu) | 1 |
| Multi-correct thiếu/thừa | 0 (all-or-nothing) |
| Không trả lời | 0 (sai) |
| Hết giờ | Auto submit với answers hiện có |

Không có partial credit. Đề thật cũng tính kiểu này.

## localStorage namespace

Tất cả key prefix `ztp:` (Zalo Tech Practice):

| Key | Nội dung |
|---|---|
| `ztp:attempts` | `AttemptResult[]` — toàn bộ lịch sử mọi đề đã làm |
| `ztp:inProgress:<examId>` | Snapshot bài đang làm (auto-save mỗi answer change). Xóa sau khi submit. |

Reload trang giữa chừng → app hỏi "Tiếp tục bài đang dở?".

Muốn reset → DevTools → Application → Local Storage → xóa các key bắt đầu `ztp:`.

## Đóng góp / mở rộng

- **Thêm đề tay**: drop file JSON đúng schema vào `src/exams/{technical|za}/`. Vite auto pick up.
- **Đổi quy tắc chấm**: sửa `src/lib/scoring.ts` (có unit tests).
- **Đổi UI**: components đều thuần React + CSS inline-ish.
- **Đổi topic distribution**: sửa bảng trong `prompts/generate-*.md`.
- **Đổi style guide**: sửa `prompts/ztf-*-style.md`. Có thể re-run research nếu format ZTF thay đổi.

## Disclaimer

Project độc lập, **không liên kết chính thức với Zalo / VNG**. Mọi đề trong repo là paraphrased reconstruction / AI-generated để luyện tập, không phải đề gốc của Zalo Tech Fresher. Mục tiêu là giúp candidate làm quen format và rèn phản xạ trước khi vào phòng thi thật.

## License

MIT. Dùng tự do cho mục đích học tập và luyện thi.
