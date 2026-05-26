---
description: Sinh đề Zalo Aptitude mới (30 câu, 70 phút, Tiếng Việt) vào src/exams/za/
---

Sinh 1 đề Zalo Aptitude mới hoàn chỉnh.

## Bước 1: Đọc spec
1. `prompts/schema.md` — JSON schema
2. `prompts/generate-za.md` — phân bổ dạng câu, quality rules

## Bước 2: Xác định số đề tiếp theo
`ls src/exams/za/` → tìm NNN tiếp theo (3 chữ số).

## Bước 3: (Optional) Tránh trùng
Đọc 1 đề gần nhất nếu có.

## Bước 4: Sinh đề
Sinh đầy đủ **30 câu** theo phân bổ dạng trong `prompts/generate-za.md`.

QUAN TRỌNG:
- Viết tiếng Việt tự nhiên, KHÔNG dịch máy.
- `explanation` tiếng Việt, 3-6 câu, giải thích từng bước.
- Puzzle ràng buộc: đáp án PHẢI unique.
- Bài toán đố: dữ kiện đầy đủ trong prompt.

## Bước 5: Ghi file
`src/exams/za/exam-{NNN}.json`.

## Bước 6: Báo cáo
- Path file
- Bảng số câu theo dạng
- Số single/multi
- Ghi chú sai lệch (nếu có)

## Arguments
`$ARGUMENTS` (optional): hint như "tập trung puzzle ràng buộc", "thêm bài toán tốc độ".
