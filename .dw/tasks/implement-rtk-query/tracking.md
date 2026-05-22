---
task_id: implement-rtk-query
started: 2026-05-22
last_updated: 2026-05-22
status: Done
current_phase: Complete
blockers: none
---

# Tracking: Implement RTK Query thay thế Thunk

## Status Snapshot

**Phase:** Plan — awaiting GATE C approval
**Next milestone:** GATE C → Execute

## Subtask Progress

| # | Subtask | Status | Date | Notes |
|---|---------|--------|------|-------|
| ST-1 | axiosBaseQuery | ✅ Done | 2026-05-22 | |
| ST-2 | 4 RTK API slices | ✅ Done | 2026-05-22 | |
| ST-3 | Store integration | ✅ Done | 2026-05-22 | |
| ST-4 | Rewrite useBaseList | ✅ Done | 2026-05-22 | Pure state manager, no Redux coupling |
| ST-5 | Migrate 3 domain list hooks | ✅ Done | 2026-05-22 | Map isLoading → PageLoadStatus |
| ST-6 | Migrate rooms pages + cleanup | ✅ Done | 2026-05-22 | |
| ST-7 | Migrate tenants pages + cleanup | ✅ Done | 2026-05-22 | tenantDetailSlice emptied |
| ST-8 | Migrate users pages + cleanup | ✅ Done | 2026-05-22 | UserCreate/Update/List migrated, userSlice emptied |
| ST-9 | Migrate auth + cleanup | ✅ Done | 2026-05-22 | setAuthenticated added, loginThunk removed |

## Changelog

### 2026-05-22 — Task Init

**Actions taken:**
- Tạo spec.md và tracking.md
- Khảo sát codebase: rooms module, axios setup, store config

**Decisions made:**
- Chỉ migrate rooms domain trong task này
- Giữ nguyên axiosInstance + interceptors

## Handoff Notes

**For next session (or next agent):**

- **Read first:** `src/services/apiInstance.ts`, `src/utils/thunks.ts`, `src/reducers/rooms/`
- **Current state:** Phase Research
- **Watch out:** `useBaseList` hook coupled với Redux slice shape — cần xem lại khi migrate ST-3

## Friction Journal

| Date | Friction | Component | Proposed fix |
|------|----------|-----------|-------------|

<!-- dw-auto-handoff -->
### Auto-handoff — 2026-05-22 07:00 UTC

Session ended with uncommitted changes.

**Files changed:**
```
 src/components/buttons/BasicButton.tsx             |  19 ---
 src/components/forms/BasicInput.tsx                |  68 ---------
 src/components/forms/inputs/Checkbox.tsx           |  58 --------
 src/components/forms/inputs/GroupCheckboxes.tsx    |  68 ---------
 src/components/forms/inputs/NumberInput.tsx        |  42 ------
 src/components/forms/inputs/PasswordInput.tsx      |  28 ----
 src/components/forms/inputs/Radio.tsx              |  62 --------
 src/components/forms/inputs/Select.tsx             | 120 ---------------
 src/components/forms/searchs/SearchInput.tsx       |  11 --
 src/components/modals/DeleteConfirmModal.tsx       |   2 +-
 src/components/modals/Modal.tsx                    |  66 ---------
 src/components/modals/MoveoutConfirmModal.tsx      |   2 +-
 src/components/modals/RoomFormModal.tsx            | 164 ++++++++++++++-------
 src/components/modals/TenantFormModal.tsx          |  99 ++++++++-----
 src/components/paginators/BasicPaginator.tsx       |  51 -------
 src/components/search-forms/RoomSearchForm.tsx     |   2 +-
 src/components/search-forms/UserSearchForm.tsx     |   2 +-
 .../tab-content/rooms/RoomDetailBasicInfoTab.tsx   |   2 +-
 src/hooks/room-hooks/useRoomModalForm.ts           |   4 +-
 src/layouts/MainLayout.tsx                         |  83 -----------
 src/layouts/Navbar.tsx                             |   2 +-
 src/locales/en/validation.json                     |   3 +-
 src/locales/vi/validation.json                     |   3 +-
 src/pages/Login.tsx                                |   6 +-
 src/pages/rooms/RoomDetail.tsx                     |  30 +++-
 src/pages/rooms/RoomDetailInfoPage.tsx             |   2 +-
 src/pages/rooms/RoomList.tsx                       |   4 +-
 src/pages/tenants/TenantList.tsx                   |   4 +-
 src/pages/user/UserCreate.tsx                      |   8 +-
 src/pages/user/UserList.tsx                        |   4 +-
 src/pages/user/UserUpdate.tsx                      |   8 +-
 src/reducers/rooms/roomDetailSlice.ts              |  10 +-
 src/utils/form.ts                                  |  29 +++-
 src/validation/rooms/roomSchema.ts                 |  19 ++-
 34 files changed, 270 insertions(+), 815 deletions(-)
```

Next session: commit or continue work. Re-read spec.md + this tracking.md first.


<!-- dw-auto-handoff -->
### Auto-handoff — 2026-05-22 07:04 UTC

Session ended with uncommitted changes.

**Files changed:**
```
 src/components/buttons/BasicButton.tsx             |  19 ---
 src/components/forms/BasicInput.tsx                |  68 ---------
 src/components/forms/inputs/Checkbox.tsx           |  58 --------
 src/components/forms/inputs/GroupCheckboxes.tsx    |  68 ---------
 src/components/forms/inputs/NumberInput.tsx        |  42 ------
 src/components/forms/inputs/PasswordInput.tsx      |  28 ----
 src/components/forms/inputs/Radio.tsx              |  62 --------
 src/components/forms/inputs/Select.tsx             | 120 ---------------
 src/components/forms/searchs/SearchInput.tsx       |  11 --
 src/components/modals/DeleteConfirmModal.tsx       |   2 +-
 src/components/modals/Modal.tsx                    |  66 ---------
 src/components/modals/MoveoutConfirmModal.tsx      |   2 +-
 src/components/modals/RoomFormModal.tsx            | 164 ++++++++++++++-------
 src/components/modals/TenantFormModal.tsx          |  99 ++++++++-----
 src/components/paginators/BasicPaginator.tsx       |  51 -------
 src/components/search-forms/RoomSearchForm.tsx     |   2 +-
 src/components/search-forms/UserSearchForm.tsx     |   2 +-
 .../tab-content/rooms/RoomDetailBasicInfoTab.tsx   |   2 +-
 src/hooks/room-hooks/useRoomModalForm.ts           |   4 +-
 src/layouts/MainLayout.tsx                         |  83 -----------
 src/layouts/Navbar.tsx                             |   2 +-
 src/locales/en/validation.json                     |   3 +-
 src/locales/vi/validation.json                     |   3 +-
 src/pages/Login.tsx                                |   6 +-
 src/pages/rooms/RoomDetail.tsx                     |  30 +++-
 src/pages/rooms/RoomDetailInfoPage.tsx             |   2 +-
 src/pages/rooms/RoomList.tsx                       |   4 +-
 src/pages/tenants/TenantList.tsx                   |   4 +-
 src/pages/user/UserCreate.tsx                      |   8 +-
 src/pages/user/UserList.tsx                        |   4 +-
 src/pages/user/UserUpdate.tsx                      |   8 +-
 src/reducers/rooms/roomDetailSlice.ts              |  10 +-
 src/utils/form.ts                                  |  29 +++-
 src/validation/rooms/roomSchema.ts                 |  19 ++-
 34 files changed, 270 insertions(+), 815 deletions(-)
```

Next session: commit or continue work. Re-read spec.md + this tracking.md first.


<!-- dw-auto-handoff -->
### Auto-handoff — 2026-05-22 07:08 UTC

Session ended with uncommitted changes.

**Files changed:**
```
 src/components/buttons/BasicButton.tsx             |  19 ---
 src/components/forms/BasicInput.tsx                |  68 ---------
 src/components/forms/inputs/Checkbox.tsx           |  58 --------
 src/components/forms/inputs/GroupCheckboxes.tsx    |  68 ---------
 src/components/forms/inputs/NumberInput.tsx        |  42 ------
 src/components/forms/inputs/PasswordInput.tsx      |  28 ----
 src/components/forms/inputs/Radio.tsx              |  62 --------
 src/components/forms/inputs/Select.tsx             | 120 ---------------
 src/components/forms/searchs/SearchInput.tsx       |  11 --
 src/components/modals/DeleteConfirmModal.tsx       |   2 +-
 src/components/modals/Modal.tsx                    |  66 ---------
 src/components/modals/MoveoutConfirmModal.tsx      |   2 +-
 src/components/modals/RoomFormModal.tsx            | 164 ++++++++++++++-------
 src/components/modals/TenantFormModal.tsx          |  99 ++++++++-----
 src/components/paginators/BasicPaginator.tsx       |  51 -------
 src/components/search-forms/RoomSearchForm.tsx     |   2 +-
 src/components/search-forms/UserSearchForm.tsx     |   2 +-
 .../tab-content/rooms/RoomDetailBasicInfoTab.tsx   |   2 +-
 src/hooks/room-hooks/useRoomModalForm.ts           |   4 +-
 src/layouts/MainLayout.tsx                         |  83 -----------
 src/layouts/Navbar.tsx                             |   2 +-
 src/locales/en/validation.json                     |   3 +-
 src/locales/vi/validation.json                     |   3 +-
 src/pages/Login.tsx                                |   6 +-
 src/pages/rooms/RoomDetail.tsx                     |  30 +++-
 src/pages/rooms/RoomDetailInfoPage.tsx             |   2 +-
 src/pages/rooms/RoomList.tsx                       |   4 +-
 src/pages/tenants/TenantList.tsx                   |   4 +-
 src/pages/user/UserCreate.tsx                      |   8 +-
 src/pages/user/UserList.tsx                        |   4 +-
 src/pages/user/UserUpdate.tsx                      |   8 +-
 src/reducers/rooms/roomDetailSlice.ts              |  10 +-
 src/utils/form.ts                                  |  29 +++-
 src/validation/rooms/roomSchema.ts                 |  19 ++-
 34 files changed, 270 insertions(+), 815 deletions(-)
```

Next session: commit or continue work. Re-read spec.md + this tracking.md first.

