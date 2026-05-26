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
    { "id": "c", "text": "Một số nhà khoa học có thể đồng thời là nghệ sĩ — nhưng điều đó không bắt buộc từ các tiền đề." },
    { "id": "d", "text": "Không có nhà khoa học nào là nghệ sĩ." }
  ],
  "correct": ["c"],
  "explanation": "Từ 'một số người tò mò là nghệ sĩ' KHÔNG suy được nhà khoa học nào là nghệ sĩ — vì 'một số người tò mò' đó có thể là nhóm khác. (a) tổng quát hóa quá mức. (b) là kết luận không có cơ sở logic từ hai tiền đề đã cho. (d) không có cơ sở phủ định."
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
  "prompt": "Năm bạn A, B, C, D, E xếp hàng từ trái sang phải. Biết: B đứng ngay sau A; C đứng trước D; D đứng ngay trước E; E đứng ở vị trí thứ 5. Vị trí thứ 1 là ai?",
  "options": [
    { "id": "a", "text": "A" },
    { "id": "b", "text": "B" },
    { "id": "c", "text": "C" },
    { "id": "d", "text": "Không xác định được" }
  ],
  "correct": ["d"],
  "explanation": "E ở vị trí 5, D ngay trước E nên D ở 4. Còn lại ba vị trí 1–3 cho A, B, C với B ngay sau A. Thử A=1, B=2, C=3 thoả mãn C trước D. Thử A=2, B=3, C=1 cũng thoả mãn. Cả hai phương án hợp lệ, nên vị trí 1 không xác định được từ các ràng buộc đã cho."
}
```

### Mẫu 6 — Đọc hiểu biểu đồ (single)

```json
{
  "id": "sample-6",
  "topic": "Đọc hiểu biểu đồ",
  "type": "single",
  "prompt": "Doanh thu (tỉ đồng) 4 quý 2024 của công ty X như bảng dưới. Tăng trưởng doanh thu quý 4 so với quý 1 là bao nhiêu phần trăm?",
  "code": "Quý 1: 12\nQuý 2: 18\nQuý 3: 21\nQuý 4: 24",
  "options": [
    { "id": "a", "text": "33,3%" },
    { "id": "b", "text": "50,0%" },
    { "id": "c", "text": "75,0%" },
    { "id": "d", "text": "100,0%" }
  ],
  "correct": ["d"],
  "explanation": "Tăng trưởng = (Q4 − Q1) / Q1 = (24 − 12) / 12 = 100%. (a) 33,3% là kết quả khi nhầm chia cho Q2: (18 − 12) / 18. (b) 50,0% là (24 − 12) / 24 — nhầm chia cho Q4. (c) 75,0% là (Q4 − Q1) / 16 — nhầm mốc so sánh."
}
```

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
