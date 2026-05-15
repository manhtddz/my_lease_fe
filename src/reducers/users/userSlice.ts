import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import type { User, UserDataListParams, UserDataListResult } from '../../types/UserType'
import { userApi } from '../../services/user'
import { createApiThunk } from '../../utils/thunks'
import { PageLoadStatus, type PageLoadStatusType } from '../../types/enums/PageLoadStatus'

type UsersState = {
  list: User[]
  total: number
  status: PageLoadStatusType
  error: string | null
  errorCode: number | null
  validationErrors: Record<string, string[]> | null
  refetchSignal: number
}

const initialState: UsersState = {
  list: [],
  total: 0,
  status: PageLoadStatus.IDLE,
  error: null,
  errorCode: null,
  validationErrors: null,
  refetchSignal: 0,
}

export const fetchUsersThunk = createApiThunk(
  'users/fetchAll',
  async (params: UserDataListParams | undefined, getState): Promise<UserDataListResult> => {
    void getState
    return userApi.getUserDataList(params)
  },
)

export const fetchUserByIdThunk = createApiThunk(
  'users/fetchById',
  async (id: number, getState): Promise<User> => {
    void getState
    return userApi.getUserById(id)
  },
)

export const createUserThunk = createApiThunk(
  'users/createUser',
  async (payload: Omit<User, 'id'>, getState) => {
    void getState
    return userApi.createUser(payload)
  },
)

export const updateUserThunk = createApiThunk(
  'users/updateUser',
  async (payload: User, getState) => {
    void getState
    return userApi.updateUser(payload.id, payload)
  },
)

export const deleteUserThunk = createApiThunk(
  'users/deleteUser',
  async (id: number, getState) => {
    void getState
    return userApi.deleteUserById(id)
  },
)

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsersError: (state) => {
      state.status = PageLoadStatus.IDLE;
      state.error = null;
      state.errorCode = null;
      state.validationErrors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.list = action.payload.items
        state.total = action.payload.total
        state.error = null;
        state.errorCode = null;
        state.validationErrors = null;
        state.status = PageLoadStatus.SUCCEEDED;
      })
      .addCase(createUserThunk.fulfilled, (state) => {
        state.error = null;
        state.errorCode = null;
        state.validationErrors = null;
        state.status = PageLoadStatus.SUCCEEDED;
        state.refetchSignal += 1
      })
      .addCase(updateUserThunk.fulfilled, (state) => {
        state.error = null;
        state.errorCode = null;
        state.validationErrors = null;
        state.status = PageLoadStatus.SUCCEEDED;
        state.refetchSignal += 1
      })
      .addCase(deleteUserThunk.fulfilled, (state) => {
        state.refetchSignal += 1;
        state.status = PageLoadStatus.SUCCEEDED;
      })

      .addMatcher(
        isAnyOf(
          fetchUsersThunk.pending,
          createUserThunk.pending,
          updateUserThunk.pending,
          deleteUserThunk.pending,
        ),
        (state) => {
          state.status = PageLoadStatus.LOADING;
          state.error = null
          state.errorCode = null
          state.validationErrors = null
        },
      )

      // ── rejected — tất cả giống nhau → gom vào 1 matcher ──
      .addMatcher(
        isAnyOf(
          fetchUsersThunk.rejected,
          createUserThunk.rejected,
          updateUserThunk.rejected,
          deleteUserThunk.rejected,
        ),
        (state, action) => {
          state.status = PageLoadStatus.FAILED;
          const payload = action.payload

          if (!payload) {
            state.errorCode = null;
            state.error = action.error?.message ?? 'Đã có lỗi xảy ra.'
            state.validationErrors = null;
            return
          }

          const statusCode = payload.status
          state.errorCode = statusCode;

          switch (statusCode) {
            // Validation (mock POST/PUT trả 422 + `errors`)
            case 422: {
              state.error = payload.message;
              state.validationErrors = payload.errors ?? null;
              break
            }
            case 404: {
              state.error = payload.message;
              state.validationErrors = null
              break
            }
            case 500: {
              state.error = payload.message;
              state.validationErrors = null
              break
            }

            default: {
              state.error = payload.message ?? 'Đã có lỗi xảy ra.'
              state.validationErrors = payload.errors ?? null;
              break
            }
          }
        },
      )
  },
})
export const { clearUsersError } = usersSlice.actions
export const usersReducer = usersSlice.reducer