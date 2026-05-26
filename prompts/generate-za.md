# Sinh đề Zalo Aptitude (ZA)

**Trước khi sinh đề**, đọc `prompts/ztf-za-style.md` đầy đủ. File đó cung cấp
phong cách phrasing, kiểu distractor, và 8 câu hỏi mẫu phỏng dựng. Dùng làm
tham chiếu phong cách. Số câu, thời lượng, ngôn ngữ, và quy tắc chất lượng
bên dưới vẫn là nguồn chính, không đổi.

Tạo đề luyện thi đánh giá năng lực logic & tư duy cho thi tuyển Zalo fresher.

## Hard constraints

- Ngôn ngữ: **Tiếng Việt** (mọi prompt, option, explanation)
- Tổng số câu: **30**
- Thời lượng: **70 phút**
- Độ khó: fresher / sinh viên năm cuối
- JSON output PHẢI tuân thủ `prompts/schema.md`

## Phân bổ dạng câu hỏi (target)

| Dạng | Số câu | Mô tả |
|------|--------|-------|
| Suy luận số học (number series) | 5 | tìm số tiếp theo, quy luật dãy, dãy hình |
| Suy luận logic (syllogism) | 5 | "Nếu A thì B. C là A. Suy ra?" — diễn dịch, quy nạp |
| Bài toán đố (word problems) | 6 | tỉ lệ, phần trăm, vận tốc, công việc chung, tuổi |
| Tư duy không gian / hình học | 4 | xoay hình, gập hình, đếm khối, đối xứng |
| Sắp xếp & ràng buộc (puzzle) | 5 | "5 người ngồi ghế, A bên trái B..." |
| Đọc hiểu biểu đồ / dữ liệu | 3 | bảng số liệu, biểu đồ cột, tính toán dựa trên dữ kiện |
| Phân tích quan hệ (analogy) | 2 | "A : B :: C : ?" |

Có thể lệch ±1 câu mỗi dạng nếu chất lượng câu tốt hơn.

## Loại câu hỏi

- Hầu hết là **single-correct** (~27 câu)
- Multi-correct chỉ ~3 câu (10%), thường ở dạng suy luận logic hoặc đọc hiểu

## Quality rules

1. **Viết tiếng Việt tự nhiên**. KHÔNG dịch máy từ tiếng Anh. Dùng cú pháp và lối diễn đạt thường thấy trong đề thi VN.
2. `explanation` tiếng Việt, 3-6 câu, giải thích **từng bước** suy luận — học sinh đọc xong phải hiểu cách giải, không chỉ biết đáp án.
3. Với bài toán đố: liệt kê đầy đủ dữ kiện trong `prompt`, lời giải trong `explanation`.
4. Với puzzle ràng buộc: đáp án phải UNIQUE — chỉ 1 cách sắp xếp thỏa mãn.
5. Tránh câu hỏi mẹo / chơi chữ — tập trung logic thuần.
6. Tránh "Tất cả đáp án trên" / "Không có đáp án nào đúng".
7. Đáp án không nên quá lộ liễu — distractor phải hợp lý.
8. Tránh trùng lặp với các đề đã có trong `src/exams/za/`.

## File naming

Output: `src/exams/za/exam-{NNN}.json` (NNN 3 chữ số).

1. `ls src/exams/za/` để biết NNN hiện có.
2. Lấy NNN tiếp theo.
3. Ghi file.

## Output checklist sau khi sinh

In ra:
- Path file vừa ghi
- Số câu theo dạng (bảng)
- Số single vs multi
- Ghi chú nếu có sai lệch so với target
