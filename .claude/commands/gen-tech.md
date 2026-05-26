---
description: Sinh đề Technical Practice mới (100 câu, 60 phút, English) vào src/exams/technical/
---

Sinh 1 đề Technical Practice mới hoàn chỉnh.

## Bước 1: Đọc spec
Đọc 2 file theo thứ tự:
1. `prompts/schema.md` — JSON schema chính xác (bắt buộc tuân thủ)
2. `prompts/generate-technical.md` — phân bổ topic, quality rules

## Bước 2: Xác định số đề tiếp theo
Liệt kê `src/exams/technical/` để xác định NNN tiếp theo.
Ví dụ: nếu có `exam-001.json`, `exam-002.json` thì NNN = `003`.

## Bước 3: (Optional) Tránh trùng câu
Đọc lướt 1-2 file đề gần nhất (nếu có) để không lặp câu hỏi.

## Bước 4: Sinh đề
Sinh đầy đủ **100 câu** theo phân bổ topic trong `prompts/generate-technical.md`.

QUAN TRỌNG:
- KHÔNG sinh từng phần rồi nối — sinh trong 1 lần để đảm bảo cân bằng topic.
- `correct` LUÔN là array (kể cả single-correct → array 1 phần tử).
- `explanation` BẮT BUỘC, 2-5 câu, tiếng Anh.
- `type: "multi"` thì prompt phải có "Select all that apply" hoặc tương đương.

## Bước 5: Ghi file
Ghi `src/exams/technical/exam-{NNN}.json`.

## Bước 6: Validate nhanh
- Đếm: `questions.length === 100`?
- Phân bổ topic gần đúng target?
- Tỷ lệ single/multi ~70/30?

## Bước 7: Báo cáo
In ra:
- Path file
- Bảng số câu theo topic
- Số single vs multi
- Ghi chú nếu có sai lệch

## Arguments
`$ARGUMENTS` (optional) có thể chứa hint, ví dụ:
- "focus more on AI and database"
- "easier difficulty for warmup"

Áp dụng hint nhưng vẫn giữ tổng 100 câu.
