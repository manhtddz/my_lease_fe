---
date: 2026-05-11T12:00:00
from: researcher
to: planner
task: migrate-css-to-bootstrap
status: DONE_WITH_CONCERNS
---

## Summary

Đã rà soát toàn bộ CSS trong `src/` và consumer JSX: 3 file CSS (trong đó `App.css` chỉ gắn với dead `App.tsx`); UI thật dựa `app.css` + `index.css`; Bootstrap đã import nhưng xung đột nghiêm trọng với component `Modal` (class `.modal` của Bootstrap). Không có test tự động cho UI.

## Details

- **Entry CSS:** `main.tsx` — thứ tự `index.css` → `app.css` → Bootstrap (custom override được BS).
- **Surface area:** `MainLayout`, `Login`, `Home`, `UserList`/`UserCreate`/`UserUpdate`, `BasicInput` + inputs, `BasicPaginator`, `BasicButton` (gián tiếp), `Modal`, `SearchInput`, `UserSearchForm`.
- **Class “ma”:** `app-btn--secondary` dùng trong JSX nhưng không có trong `app.css`; `app-field-label` / `app-field-value` không định nghĩa trong `app.css`; `PasswordInput` dùng `relative`/`absolute` không phải Bootstrap utilities (thiếu Tailwind).
- **Modal:** Markup dùng `className="modal"` trùng Bootstrap; BS set `display: none` cho `.modal` khi không có flow `.show` + `.modal-dialog` chuẩn — cần spike UI hiện tại và chọn hướng BS Modal API / đổi tên class / `react-bootstrap`.
- **Tests:** không tìm thấy `*.test.*` / `*.spec.*`.

## Concerns (DONE_WITH_CONCERNS)

- Xung đột Bootstrap `.modal` có thể đã gây bug hiển thị hoặc cần verify ngay trong spike đầu plan.
- Không test tự động → plan nên gồm checklist regression thủ công rõ ràng.

## Next Steps

- Chạy **`/dw:plan migrate-css-to-bootstrap`**: chốt quyết định theme/import, chiến lược Modal, xử lý `App.tsx`/`App.css`, chia subtask theo layout → pages → shared → dọn CSS.
