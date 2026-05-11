---
task_id: migrate-css-to-bootstrap
created: 2026-05-11
status: Done
owner: ""
depth: standard
related_adr: none
target_ship: none
---

# Spec: migrate-css-to-bootstrap

## Intent

Thay thế CSS thuần (custom classes, token `:root`, file `app.css` / `index.css`) bằng **Bootstrap 5** làm nền layout và component styling cho ứng dụng React hiện tại. Mục tiêu là giảm bảo trì CSS tùy biến, thống nhất pattern UI, đồng thời tận dụng Bootstrap đã có trong dependencies.

## Research Findings

### Ngày khảo sát: 2026-05-11

### Yêu cầu gốc

Theo **Intent** trong spec: migrate CSS thuần sang Bootstrap; scope gồm theme/import, layout shell, trang + shared components.

### Files liên quan

| File | Vai trò | Cần thay đổi? | Ghi chú |
|------|---------|----------------|---------|
| `src/main.tsx` | Entry: import `index.css`, `app.css`, Bootstrap CSS+JS | Có | Thứ tự hiện tại: custom trước, Bootstrap sau → custom override được BS. Khi dọn CSS cần quyết định lại thứ tự + file theme residual. |
| `src/index.css` | Token `:root`, `#root`, typography `h1`/`h2`, `prefers-color-scheme` | Có | Thay bằng BS utilities / `data-bs-theme` / SCSS variables tùy quyết định plan. |
| `src/styles/app.css` | Hệ `app-*` (shell, form, table, alert, btn, …) | Có | Nguồn style chính cho app thật. |
| `src/App.css` | Template Vite (hero, counter, `#next-steps`, …) | Có / xóa | Chỉ được `import` từ `src/App.tsx`; **App không nằm trong router** → dead path nếu không ai import `App`. |
| `src/App.tsx` | Demo Vite | Có / xóa | Không tham chiếu từ `src/router`. |
| `src/layouts/MainLayout.tsx` | `app-shell`, `app-header`, `app-nav`, … | Có | Consumer trực tiếp `app-*`. |
| `src/pages/Login.tsx` | Auth card + form | Có | `app-auth-center`, `app-card`, `app-field`, … |
| `src/pages/Home.tsx` | Grid link | Có | `app-home-grid`, `app-home-card`. |
| `src/pages/user/UserList.tsx` | Table, toolbar, alerts | Có | Có `style={{…}}` inline chỗ title; `app-btn--secondary` **không** có rule trong `app.css`. |
| `src/pages/user/UserCreate.tsx`, `UserUpdate.tsx` | Form CRUD | Có | Pattern lặp `app-field` / `app-field-error`. |
| `src/components/forms/BasicInput.tsx` | Default `app-field` | Có | Ảnh hưởng mọi chỗ dùng `BasicInput`. |
| `src/components/forms/inputs/Radio.tsx`, `GroupCheckboxes.tsx` | Form controls | Có | Default `app-field-label` / `app-field-value` — **không** thấy định nghĩa trong `app.css`; `GroupCheckboxes` typo `app-field-imput`. |
| `src/components/forms/inputs/PasswordInput.tsx` | Toggle hiện MK | Có | Class `relative`, `absolute right-2 top-8` kiểu **Tailwind**; project **không** có Tailwind → positioning có thể không hoạt động đúng. |
| `src/components/forms/searchs/SearchInput.tsx` | `search-wrapper`, `search-input` | Có | Không thấy rule trong `.css` của `src/`. |
| `src/components/search-forms/UserSearchForm.tsx` | `filters` | Có | Không thấy rule trong `.css` của `src/`. |
| `src/components/modals/Modal.tsx` | Portal dialog | Có (ưu tiên) | Class `modal`, `modal-header`, `modal-body`, `modal-footer` **trùng tên Bootstrap**; BS `.modal { display: none; … }` (xem `bootstrap.css` ~5455) — không có `.show` / markup chuẩn BS → **nguy cơ modal không hiển thị hoặc layout sai**; `modal-overlay` không có CSS trong repo. |
| `src/components/paginators/BasicPaginator.tsx` | Pagination | Có | `app-pagination`, `app-btn`. |
| `src/components/buttons/BasicButton.tsx` | Pass-through `className` | Có (gián tiếp) | Consumer truyền `app-btn*`. |
| `src/router/*`, `PrivateRouter`, `AuthLayout` | Routing | Không / tối thiểu | Không class UI riêng đáng kể. |

### Kiến trúc hiện tại

```text
main.tsx
  ├── index.css (:root tokens + #root shell)
  ├── styles/app.css (app-* components)
  ├── services/mock
  └── bootstrap.min.css + bootstrap.bundle.min.js
RouterProvider → layouts/pages/components
```

Luồng UI: **className cố định `app-*`** ở layout + pages; form atoms (`BasicInput`, `Radio`, `GroupCheckboxes`) đặt default class trùng hệ; **Bootstrap đã load** nhưng phần lớn UI vẫn dựa CSS custom.

### Dependencies

**Upstream:** `bootstrap@^5.3.8` (npm), import trực tiếp dist CSS/JS.

**Downstream:** Mọi route trong `src/router/index.tsx`; hooks không đổi trừ khi modal API đổi.

### Patterns & conventions

- Tiền tố class **`app-`** cho shell, form, table, alert, button.
- **Inline style** rải rác (`UserList` titles, width auto trên `Link`).
- **Không** có file test `*.test.*` / `*.spec.*` trong repo (migration chủ yếu regression thủ công / sau này thêm E2E).

### Giả định & hạn chế

- Giả định: sau migrate vẫn dùng một entry React + Vite, không đổi router.
- Hạn chế: không có test tự động để bắt regression visual.
- Chưa rõ (cần plan/TL): `react-bootstrap` hay chỉ HTML + `bootstrap.Modal` / markup tĩnh; có compile SCSS theme hay chỉ CSS variables trên `:root`.

### Test coverage hiện tại

**Không** phát hiện unit/integration test cho UI trong workspace.

### Ghi chú bổ sung

- Git history các file CSS/entry: chỉ thấy **Initial commit** trong `git log -3` (repo nhỏ / ít commit).
- **Import order:** custom CSS trước Bootstrap → override dễ; khi chuyển sang “Bootstrap first + thin overrides”, cần smoke test toàn app.

## Why Now

Chuẩn hóa stack UI trước khi mở rộng màn hình; giảm xung đột giữa custom `app-*` và Bootstrap đã import trong `main.tsx`.

## Scope

### Phương án đã xem xét

| # | Phương án | Ưu điểm | Nhược điểm | Chọn? |
|---|-----------|---------|------------|-------|
| A | **Bootstrap markup + CSS đã build + `bootstrap.bundle.min.js`** (không thêm `react-bootstrap`) | Giữ dependency tối thiểu; đúng stack hiện có | Modal cần gắn `show` / `modal-dialog` / lifecycle tay hoặc gọi API `bootstrap.Modal` | **Có** (mặc định) |
| B | Thêm **`react-bootstrap`** | Khai báo component rõ, ít lỗi markup | Thêm dependency, khóa version, bundle lớn hơn | Chỉ nếu TL ưu tiên DX và chấp nhận dep |

### Approach đã chọn (tóm tắt)

- **Không** thêm `react-bootstrap` trong phase execute đầu tiên: refactor `Modal.tsx` sang **cấu trúc Bootstrap 5** (`modal`, `modal-dialog`, `modal-content`, …) và điều khiển hiển thị bằng class `show` + `display: block`/`d-block` đúng pattern BS (hoặc `bootstrap.Modal` từ bundle đã import) để tránh xung đột `display: none` cố hữu của `.modal` khi thiếu `show`.
- **Import:** `bootstrap.min.css` trước; sau đó tối đa **một** file residual (ví dụ `src/styles/theme-overrides.css`) chỉ chứa biến brand / chỉnh nhẹ — **không** giữ nguyên `app.css` full sau cutover.
- **Dark mode:** đồng bộ `prefers-color-scheme` với `document.documentElement.dataset.bsTheme = 'dark' | 'light'` (listener nhỏ trong `main.tsx` hoặc hook), thay cho khối `@media (prefers-color-scheme: dark)` trong `index.css` nơi tương đương.
- **Dead code:** xóa `src/App.tsx` và `src/App.css` khỏi repo (không trong router); nếu cần demo Vite sau này thì tách task khác.

### In Scope — Subtasks (Draft plan)

**ST-1: Chốt theme + import + ghi nhận kỹ thuật Modal**

- **Mô tả:** Xác nhận thứ tự import trong `main.tsx`; tạo (nếu cần) `src/styles/theme-overrides.css` với biến `--bs-primary` / body tùy brand; viết 1 đoạn trong `tracking.md` mô tả cách toggle `data-bs-theme`; spike 30–45 phút trên `Modal.tsx` để chốt pattern (`show` + markup chuẩn vs `bootstrap.Modal`).
- **Files:** `src/main.tsx`, `src/styles/theme-overrides.css` (mới, optional), `tracking.md`
- **Acceptance:** Quyết định ghi rõ trong tracking; không còn class tùy ý trùng BS mà không có chiến lược (đặc biệt `.modal`).
- **Dependencies:** none (research đã xong)
- **Estimate:** 1.5h

**ST-2: MainLayout → Navbar / container**

- **Mô tả:** Thay `app-shell`, `app-header`, `app-nav`, `app-brand`, `app-main` bằng `navbar`, `container-fluid`/`container`, utilities (`d-flex`, `gap-*`, …); nút logout → `btn btn-outline-secondary` hoặc tương đương.
- **Files:** `src/layouts/MainLayout.tsx`
- **Acceptance:** Nav hoạt động, trạng thái active, logout; layout không vỡ ở viewport hẹp (có thể thêm `navbar-expand-lg` + toggler nếu cần).
- **Dependencies:** ST-1
- **Estimate:** 2h

**ST-7: Form primitives (ưu tiên trước các trang form)**

- **Mô tả:** `BasicInput`, `Radio`, `GroupCheckboxes`, `NumberInput`, `PasswordInput`, `SearchInput` — default classNames Bootstrap (`mb-3`, `form-label`, `form-control`, `form-check`, …); sửa typo `app-field-imput`; `PasswordInput` dùng `position-relative` + `position-absolute` (Bootstrap utilities) hoặc `input-group`.
- **Files:** `src/components/forms/BasicInput.tsx`, `inputs/Radio.tsx`, `inputs/GroupCheckboxes.tsx`, `inputs/NumberInput.tsx`, `inputs/PasswordInput.tsx`, `searchs/SearchInput.tsx`
- **Acceptance:** Không còn phụ thuộc class `app-field*` trong defaults; hiển thị lỗi dùng `invalid-feedback` / `text-danger` thống nhất nơi áp dụng.
- **Dependencies:** ST-1
- **Estimate:** 2.5h

**ST-8: Modal Bootstrap**

- **Mô tả:** Refactor `Modal.tsx` theo markup BS5; backdrop + đóng + portal; đảm bảo không dùng inner `div.modal` sai role so với BS (tuân cấu trúc `modal-dialog` > `modal-content` > header/body/footer).
- **Files:** `src/components/modals/Modal.tsx`, consumer (`src/pages/user/UserList.tsx` hoặc hook modal nếu có)
- **Acceptance:** Modal xóa user mở/đóng đúng; không bị `display:none` “kẹt”; focus có thể xử lý tối thiểu (đóng bằng nút/X/overlay theo hành vi hiện có).
- **Dependencies:** ST-1 (kỹ thuật), khuyến nghị sau ST-2 để có shell ổn định
- **Estimate:** 2h

**ST-3: Trang Login**

- **Mô tả:** Card + form + alert lỗi bằng `card`, `form-control`, `alert`, `btn btn-primary`.
- **Files:** `src/pages/Login.tsx`
- **Acceptance:** Không class `app-*` trên trang; giao diện tương đương chức năng.
- **Dependencies:** ST-7
- **Estimate:** 1.5h

**ST-4: Trang Home**

- **Mô tả:** Grid card → `row` / `col-*` / `card`.
- **Files:** `src/pages/Home.tsx`
- **Acceptance:** Không `app-home-*`.
- **Dependencies:** ST-2
- **Estimate:** 1h

**ST-5: UserList + paginator + search form**

- **Mô tả:** Toolbar, table, alert, links — `table`, `table-hover` hoặc `table-striped`, `btn`, `alert`; thay `app-btn--secondary` bằng `btn btn-outline-secondary` (hoặc tương đương); `BasicPaginator`; `UserSearchForm` (`filters` → `row`/`g-3`).
- **Files:** `src/pages/user/UserList.tsx`, `src/components/paginators/BasicPaginator.tsx`, `src/components/search-forms/UserSearchForm.tsx`
- **Acceptance:** Bỏ inline style không cần thiết nơi đã có utility; modal xóa vẫn hoạt động (sau ST-8).
- **Dependencies:** ST-7, ST-8
- **Estimate:** 3.5h

**ST-6: UserCreate / UserUpdate**

- **Mô tả:** Form CRUD Bootstrap; actions row `d-flex gap-2`.
- **Files:** `src/pages/user/UserCreate.tsx`, `src/pages/user/UserUpdate.tsx`
- **Acceptance:** Không `app-*` trên hai trang.
- **Dependencies:** ST-7
- **Estimate:** 3h

**ST-9: Dọn CSS và dead code**

- **Mô tả:** Gỡ `src/styles/app.css`, thu gọn/xóa `src/index.css` (chỉ giữ reset tối thiểu nếu cần); cập nhật `main.tsx`; xóa `App.tsx`, `App.css` nếu không dùng.
- **Files:** `src/main.tsx`, `src/index.css`, `src/styles/app.css`, `src/App.tsx`, `src/App.css`
- **Acceptance:** Router bundle không import CSS `app-*`; chỉ Bootstrap + tối đa một file overrides đã đặt tên.
- **Dependencies:** ST-3, ST-4, ST-5, ST-6, ST-7, ST-8 xong (không còn `app-*` trên route chính); có thể bắt đầu xóa CSS song song từng phần nếu grep sạch từng nhóm file.
- **Estimate:** 1.5h

**ST-10: Regression checklist + build**

- **Mô tả:** Checklist thủ công trong `tracking.md` (login, home, list/create/update user, modal xóa, pagination, mobile width); `npm run build`.
- **Files:** `tracking.md` (checklist), toàn repo
- **Acceptance:** Checklist đánh dấu pass; build pass hoặc lỗi TS ngoài scope được liệt kê rõ dòng file + quyết định follow-up.
- **Dependencies:** ST-9
- **Estimate:** 1.5h

**Ước lượng coding + QA (tổng):** ~19h (Research đã hoàn thành; Planning session này không tính vào estimate execute).

### Thứ tự execute đề xuất

`ST-1` → `ST-2` → `ST-7` → `ST-8` → `ST-3` → `ST-4` → `ST-5` → `ST-6` → `ST-9` → `ST-10`

### Out of Scope (Won't Contain)

- Thay framework UI khác (MUI, Chakra).
- Đổi business logic / API / contract RTK slices.
- Sửa toàn bộ nợ TypeScript không liên quan UI (trừ lỗi bắt buộc để build do đổi JSX types nhỏ — từng case quyết định trong execute).
- Thêm E2E / Visual regression automation (có thể task follow-up).
- SCSS pipeline Vite (compile `bootstrap/scss`) — **optional** sau nếu TL yêu cầu theme sâu; phase này ưu tiên CSS overrides tối thiểu.

## Timeline (if ship target)

| Phase | Duration | Target Date |
|-------|----------|-------------|
| Research | done | 2026-05-11 |
| Plan (Draft) | done | 2026-05-11 |
| Execute (ST-1→ST-10) | ~19h | TBD sau approve |

## Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Xung đột / sai markup **Bootstrap Modal** (`display:none`, backdrop, z-index) | H | ST-1 spike + ST-8 sớm trong chuỗi; bám markup chính thức BS5 |
| Mất tương đồng dark/light với token cũ | M | `data-bs-theme` + overrides tối thiểu; so sánh screenshot trước/sau |
| Không có test tự động → regression sót | M | ST-10 checklist bắt buộc; ưu tiên smoke trên Chrome + viewport mobile |
| `BasicButton` / consumer truyền `className` cũ sau đổi default | L | Grep `app-` trước khi merge; một pass dọn class sót |
| Scope creep SCSS / redesign | M | Giữ “một file override”; mọi thay đổi visual lớn qua TL |

## Success Criteria

Measurable outcomes (not vibes):

- [x] Các route trong `src/router` render đúng **không** phụ thuộc class `app-*` (grep `app-` trong `src/` = 0 hoặc chỉ comment/string ngoài className — mục tiêu 0 trong JSX).
- [x] `npm run build` pass sau migration, hoặc danh sách lỗi TS còn lại được ghi trong `tracking.md` với owner/follow-up.
- [x] `main.tsx` chỉ import **Bootstrap CSS** + tối đa **một** file CSS custom đặt tên (theme/overrides); `app.css` đã gỡ hoặc rỗng và không còn dùng.
- [x] Checklist regression ST-10 đã điền kết quả (pass/fail + ghi chú).

## Dependencies

- **Tech lead** review và approve plan (team có role `techlead` trong `dw.config.yml`).
- **User / PM** xác nhận: xóa `App.tsx` demo là chấp nhận được.
- Bootstrap đã có trong `package.json` và bundle đã import trong `main.tsx`.

## Known Unknowns (admitted gaps)

- TL có thể **override** quyết định “không `react-bootstrap`” — nếu approve đổi, cập nhật ST-8 và estimate (+2–4h tùy scope).
- Mức độ giữ **màu accent tím** so với palette mặc định Bootstrap: tinh chỉnh trong ST-1 / `theme-overrides.css`.

## Acceptance (Task Complete When)

- [x] Spec `status: Done` (hoặc Approved flow xong) và tracking đóng milestone.
- [x] UI chính đã Bootstrap hóa theo success criteria.
- [x] Ghi chú handoff nếu còn việc follow-up.
