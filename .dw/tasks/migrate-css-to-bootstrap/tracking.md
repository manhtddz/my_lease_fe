---
task_id: migrate-css-to-bootstrap
started: 2026-05-11
last_updated: 2026-05-11
status: Done
current_phase: Execute complete
blockers: none
---

# Tracking: migrate-css-to-bootstrap

## Status Snapshot

**Phase:** Done  
**Next milestone:** `/dw:review migrate-css-to-bootstrap` (khuyến nghị)

## Subtask Progress

| # | Subtask | Status | Date | Notes |
|---|---------|--------|------|-------|
| ST-1 | Theme + import + spike Modal | ✅ Done | 2026-05-11 | `main.tsx` order; `theme-overrides.css`; `syncBootstrapTheme.ts` |
| ST-2 | MainLayout / Navbar | ✅ Done | 2026-05-11 | Bootstrap navbar + container |
| ST-3 | Login | ✅ Done | 2026-05-11 | Card + form-control |
| ST-4 | Home | ✅ Done | 2026-05-11 | row + card link |
| ST-5 | UserList + paginator + search | ✅ Done | 2026-05-11 | table-responsive; `UserSearchForm` |
| ST-6 | UserCreate / UserUpdate | ✅ Done | 2026-05-11 | Bootstrap forms; `UserUpdate` id typing |
| ST-7 | Form primitives | ✅ Done | 2026-05-11 | `BasicInput`, `Radio`, `GroupCheckboxes`, `PasswordInput`, `SearchInput` |
| ST-8 | Modal Bootstrap | ✅ Done | 2026-05-11 | `modal fade show d-block` + backdrop |
| ST-9 | Dọn CSS + dead App | ✅ Done | 2026-05-11 | Removed `index.css`, `app.css`, `App.tsx`, `App.css` |
| ST-10 | Regression + build | ✅ Done | 2026-05-11 | `npm run build`, `eslint src` |

Status legend: ⬜ Pending · 🟡 In Progress · ✅ Done · 🔴 Blocked · ⏸ Paused

## Regression checklist (ST-10)

| # | Case | Result | Notes |
|---|------|--------|-------|
| 1 | `npm run build` | Pass | 2026-05-11 |
| 2 | `npx eslint src` | Pass | 2026-05-11 |
| 3 | Grep `app-` trong `src/` | Pass | 0 matches |
| 4 | Smoke UI trình duyệt (login, list, modal xóa) | Chưa chạy | Nên QA tay trước release |

## Changelog

### 2026-05-11 — task-init

**Actions taken:**
- Tạo `spec.md` + `tracking.md` (v2).

### 2026-05-11 — dw-research

**Actions taken:**
- Khảo sát CSS/consumers; ghi Research Findings vào `spec.md`.

### 2026-05-11 — dw-plan

**Actions taken:**
- Plan subtasks ST-1…ST-10; debate log.

### 2026-05-11 — dw-execute (ST-1 → ST-10)

**Actions taken:**
- Bootstrap-first imports; `src/styles/theme-overrides.css`; `src/syncBootstrapTheme.ts` (`data-bs-theme` ↔ `prefers-color-scheme`).
- `MainLayout`, pages (`Login`, `Home`, `User*`), `UserSearchForm`, `BasicPaginator`, form components, `Modal`/`DeleteConfirmModal`.
- Xóa `src/index.css`, `src/styles/app.css`, `src/App.tsx`, `src/App.css`.
- Sửa `useUserList` sort state types; `UserUpdate` `useParams` an toàn.
- Cập nhật `spec.md` success criteria + `status: Done`.

**Decisions made:**
- Giữ plan: không `react-bootstrap`; modal markup BS5 + `show d-block`.

**Pain points logged:**
- `PasswordInput`: nút hiện/ẩn dùng `style` top — có thể tinh chỉnh layout sau QA.

## Handoff Notes

**For next session:**

- **Read first:** `spec.md` (Success criteria đã tick).
- **Current state:** Task Done — chờ review PR / QA smoke (modal, mobile navbar).
- **Watch out:** `GroupCheckboxes` đổi API props (bỏ `labelClass`/`inputClass` dư); không có import nội bộ — kiểm tra nếu branch khác dùng.

## Friction Journal

| Date | Friction | Component | Proposed fix |
|------|----------|-----------|--------------|

## Agent Debate Log (optional, for thorough depth)

### 2026-05-11 — Plan debate (standard / signal: cross-module UI)

**Mode:** lightweight (Mode A)

**Red-bot findings:**

- Giả định QA thủ công (ST-10) bắt hết regression — **M**: không có test tự động.
- Modal + portal có thể lệch focus / scroll body — **M**.
- ST-5 có thể **under-scoped** nếu hook modal tách file — **L** (verify khi execute).
- Gỡ `index.css` có thể ảnh hưởng `#root` / typography global — **M**.

**Blue-bot response:**

- ST-10 checklist bắt buộc + viewport mobile; defer E2E sang task khác.
- ST-8 ngay sau ST-7 trong chuỗi đề xuất để UserList không kẹt giữa hai style systems.
- Khi đụng hook: cập nhật nhánh ST-5 trong execute, không cần mở scope plan trừ khi phát sinh file mới.
- Giữ một file `theme-overrides.css` để kiểm soát `#root` nếu cần thay vì xóa sạch một lần.

**Incorporated into plan:**

- Thứ tự execute: ST-8 sau ST-7, trước ST-5 phụ thuộc modal.
- Risks bảng bổ sung hàng “không test tự động”.
- ST-9 dependencies rõ: sau ST-3…ST-8.

**Deferred:**

- `react-bootstrap` — chỉ khi TL override.
- SCSS pipeline — Out of Scope phase này.
