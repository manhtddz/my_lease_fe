---
task_id: implement-rtk-query
created: 2026-05-22
status: Approved
owner:
depth: standard
related_adr: none
target_ship: none
---

# Spec: Implement RTK Query thay thế Thunk

## Intent

Thay thế toàn bộ `createAsyncThunk` / `createApiThunk` trong tất cả các slice bằng RTK Query. RTK Query đã có sẵn trong `@reduxjs/toolkit` v2.11.2, không cần cài thêm package.

Axios instance (`src/services/apiInstance.ts`) — với interceptors xử lý auth 401, unwrap `data.data`, error handling — được giữ nguyên và tích hợp qua `axiosBaseQuery` tùy chỉnh.

`createApiThunk` trong `src/utils/thunks.ts` được **giữ nguyên** — không xóa.

## Why Now

Architecture hiện tại dùng thunk thủ công khiến mỗi slice tự quản lý loading/error/data state lặp đi lặp lại. RTK Query cung cấp caching, auto-refetch, invalidation built-in — giảm boilerplate và chuẩn hóa data-fetching layer trên toàn app.

## Scope

### In Scope

**ST-1: Tạo axiosBaseQuery**
- File: `src/services/axiosBaseQuery.ts`
- Wrap `axiosInstance`, tái dùng `axiosErrorToApiError` từ `src/utils/thunks.ts`
- Type: `BaseQueryFn<{ url, method, data, params }, unknown, ApiError>`
- Acceptance: baseQuery xử lý đúng response (interceptor đã unwrap) và error → ApiError shape
- Effort: 0.5h
- Dependencies: none

**ST-2: Tạo 4 RTK API slices**
- Files mới: `src/services/rtk/roomApiSlice.ts`, `tenantApiSlice.ts`, `userApiSlice.ts`, `authApiSlice.ts`
- `roomApiSlice`: getRooms (list+params), getRoomById, createRoom, updateRoom, deleteRoom, getCurrentOccupants, moveOutTenant, moveOutAll — tag types: `Room`, `RoomDetail`, `Occupants`
- `tenantApiSlice`: getTenants, getTenantById, createTenant, updateTenant, deleteTenant — tag: `Tenant`
- `userApiSlice`: getUsers, getUserById, createUser, updateUser, deleteUser — tag: `User`
- `authApiSlice`: login mutation (không cần tag)
- Tất cả dùng `invalidatesTags` để auto-refetch sau mutation (thay thế `refetchSignal` pattern)
- Acceptance: TypeScript compile clean, tag invalidation đúng
- Effort: 2.5h
- Dependencies: ST-1

**ST-3: Tích hợp store**
- Files: `src/reducers/rootReducer.ts`, `src/reducers/index.ts`
- Thêm `xxxApiSlice.reducer` vào `rootReducer`
- Thêm `xxxApiSlice.middleware` vào `configureStore`
- Acceptance: store build không lỗi TypeScript
- Effort: 0.5h
- Dependencies: ST-2

**ST-4: Rewrite useBaseList — state-only manager**
- File: `src/hooks/base/useBaseList.ts`
- **Bỏ**: `selectSlice`, `fetchThunk` (Redux coupling)
- **Giữ**: page/sort/search state management, `buildParams`, `handleSort`, `handleSubmit`, `modalDeleteConfirm`
- **Bỏ**: `dispatch` khỏi return value
- Return: `{ params, page, setPage, sortBy, sortDir, handleSort, handleSubmit, pageCount, effectivePage, modalDeleteConfirm }`
- `pageCount` cần `total` từ bên ngoài → accept `total` làm argument
- Acceptance: hook không còn import từ Redux; TypeScript clean
- Effort: 1h
- Dependencies: ST-3

**ST-5: Migrate 3 domain list hooks**
- Files: `src/hooks/room-hooks/useRoomList.ts`, `tenant-hooks/useTenantList.ts`, `user-hooks/useUserList.ts`
- Pattern: mỗi hook gọi `useBaseList` (get params) + RTK Query `useGetXxxQuery(params)` rồi combine
- Map RTK Query state → `status: PageLoadStatusType` cho `BasicPaginator` backward compat:
  `isLoading || isFetching` → `LOADING`, `isError` → `FAILED`, else → `SUCCEEDED`
- Return interface giữ nguyên (list, total, status, error, showLoadingPlaceholder, pageCount, effectivePage, setPage, sortBy, sortDir, handleSort, handleSubmit, modalDeleteConfirm)
- Acceptance: interface không đổi, pages không cần sửa logic (chỉ sửa delete flow)
- Effort: 1h
- Dependencies: ST-4

**ST-6: Migrate rooms pages + cleanup roomSlice/roomDetailSlice**
- Files sửa: `RoomList.tsx`, `RoomDetail.tsx`, `RoomDetailInfoPage.tsx`
- `RoomList`: bỏ `dispatch(deleteRoomThunk)` → dùng `useDeleteRoomMutation`; bỏ `dispatch(updateRoomThunk/createRoomThunk)` → dùng mutations từ RTK; server validation errors từ mutation result thay vì slice state
- `RoomDetail`: bỏ `dispatch(updateRoomDetailThunk)` → `useUpdateRoomMutation`; bỏ `refetchSignal` pattern (RTK tự invalidate)
- `RoomDetailInfoPage`: bỏ `dispatch(moveOut*)` → `useMoveOutTenantMutation`, `useMoveOutAllMutation`
- Cleanup: xóa toàn bộ thunks + server-state khỏi `roomSlice.ts` và `roomDetailSlice.ts` (giữ lại slice nếu còn UI state, xóa hẳn nếu empty)
- Acceptance: rooms CRUD + detail + move-out hoạt động đúng; không còn `createApiThunk` call trong rooms files
- Effort: 2h
- Dependencies: ST-5

**ST-7: Migrate tenants pages + cleanup**
- Files sửa: `TenantList.tsx`, `TenantDetail.tsx`, `TenantFormModal.tsx`
- Known unknown: `TenantFormModal` dispatch thunk internally — phải đọc file trước khi execute subtask này
- `TenantList`: bỏ `dispatch(deleteTenantThunk)` → `useDeleteTenantMutation`
- Cleanup: xóa thunks khỏi `tenantSlice.ts`, `tenantDetailSlice.ts`
- Acceptance: tenants CRUD hoạt động; không còn thunk call
- Effort: 1.5h
- Dependencies: ST-5

**ST-8: Migrate users pages + cleanup**
- Files sửa: `UserList.tsx`, `UserCreate.tsx`, `UserUpdate.tsx`
- `UserList`: bỏ `dispatch(deleteUserThunk)` → `useDeleteUserMutation`
- `UserCreate`/`UserUpdate`: bỏ `useAppSelector(s.users.status/validationErrors)` → dùng mutation result trực tiếp
- Cleanup: xóa thunks + server state khỏi `userSlice.ts`
- Acceptance: CRUD users hoạt động; không còn thunk
- Effort: 1.5h
- Dependencies: ST-5

**ST-9: Migrate auth + cleanup**
- Files sửa: `Login.tsx`, `src/reducers/auth/authSlice.ts`
- `authSlice`: xóa `loginThunk`; **giữ** `isAuthenticated`, `currentUser`, `logout`, `clearAuthError`
- `Login.tsx`: dùng `useLoginMutation` từ `authApiSlice`; khi fulfilled → `dispatch(setAuthenticated(user))`; cần thêm action `setAuthenticated` vào `authSlice`
- Acceptance: login/logout hoạt động; `loginThunk` không còn
- Effort: 0.5h
- Dependencies: ST-2, ST-3

### Out of Scope (Won't Contain)

- Thay đổi `createApiThunk` trong `src/utils/thunks.ts` — giữ nguyên
- Thay đổi UI/UX component
- Optimistic update phức tạp
- Migrate mock adapter setup

## Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|-----------|
| `BasicPaginator` nhận `status: PageLoadStatusType` — phải map RTK state | M | Domain hooks map `isLoading/isFetching` → LOADING, `isError` → FAILED. 3 dòng per hook |
| `TenantFormModal` dispatch thunk internally | M | Đọc file trước ST-7, extend-plan nếu cần |
| `axiosInstance` interceptor unwrap `data.data` có thể double-unwrap | H | baseQuery chỉ lấy `result.data` (đã unwrapped bởi interceptor) — test kỹ ST-1 |
| `useBaseList` nhận `total` từ outside — breaking interface với domain hooks | M | Domain hooks truyền `total` từ query result vào `useBaseList`; `pageCount` tính trong domain hook |

## Success Criteria

- [ ] Tất cả domains: list, CRUD, detail hoạt động đúng
- [ ] Không còn `createApiThunk` / `createAsyncThunk` nào trong slice files
- [ ] `refetchSignal` pattern đã bị xóa — thay bằng RTK Query invalidation
- [ ] TypeScript build không có lỗi mới
- [ ] `createApiThunk` vẫn còn trong `src/utils/thunks.ts`

## Dependencies

- `@reduxjs/toolkit` ^2.11.2 (đã có, RTK Query included)
- `axiosInstance` tại `src/services/apiInstance.ts`

## Known Unknowns

- `TenantFormModal` xử lý mutations nội bộ — cần đọc trước ST-7
- `UserUpdate.tsx` chưa đọc — có thể cần xử lý prefill data tương tự UserCreate

## Acceptance (Task Complete When)

- [ ] ST-1 → ST-9 done
- [ ] Không còn `createApiThunk` call trong slice files
- [ ] TypeScript compile clean
- [ ] `createApiThunk` còn trong utils/thunks.ts
