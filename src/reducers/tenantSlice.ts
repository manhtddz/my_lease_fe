import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import { createApiThunk } from '../utils/thunks'
import { PageLoadStatus, type PageLoadStatusType } from '../types/enums/PageLoadStatus'
import type { Tenant, TenantDataListParams, TenantDataListResult } from '../types/TenantType'
import { tenantApi } from '../services/tenant'

type TenantsState = {
  list: Tenant[]
  total: number
  status: PageLoadStatusType
  error: string | null
  errorCode: number | null
  validationErrors: Record<string, string[]> | null
  refetchSignal: number
}

const initialState: TenantsState = {
  list: [],
  total: 0,
  status: PageLoadStatus.IDLE,
  error: null,
  errorCode: null,
  validationErrors: null,
  refetchSignal: 0,
}

export const fetchTenantsThunk = createApiThunk(
  'tenants/fetchAll',
  async (params: TenantDataListParams | undefined, getState): Promise<TenantDataListResult> => {
    void getState
    return tenantApi.getTenantDataList(params)
  },
)

export const fetchTenantByIdThunk = createApiThunk(
  'tenants/fetchById',
  async (id: number, getState): Promise<Tenant> => {
    void getState
    return tenantApi.getTenantById(id)
  },
)

export const createTenantThunk = createApiThunk(
  'tenants/createTenant',
  async (payload: Omit<Tenant, 'id'>, getState) => {
    void getState
    return tenantApi.createTenant(payload)
  },
)

export const updateTenantThunk = createApiThunk(
  'tenants/updateTenant',
  async (payload: Tenant, getState) => {
    void getState
    return tenantApi.updateTenant(payload.id, payload)
  },
)

export const deleteTenantThunk = createApiThunk(
  'tenants/deleteTenant',
  async (id: number, getState) => {
    void getState
    return tenantApi.deleteTenantById(id)
  },
)

const tenantsSlice = createSlice({
  name: 'tenants',
  initialState,
  reducers: {
    clearTenantsError: (state) => {
      state.status = PageLoadStatus.IDLE;
      state.error = null;
      state.errorCode = null;
      state.validationErrors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTenantsThunk.fulfilled, (state, action) => {
        state.list = action.payload.items
        state.total = action.payload.total
        state.error = null;
        state.errorCode = null;
        state.validationErrors = null;
        state.status = PageLoadStatus.SUCCEEDED;
      })
      .addCase(createTenantThunk.fulfilled, (state) => {
        state.error = null;
        state.errorCode = null;
        state.validationErrors = null;
        state.status = PageLoadStatus.SUCCEEDED;
        state.refetchSignal += 1
      })
      .addCase(updateTenantThunk.fulfilled, (state) => {
        state.error = null;
        state.errorCode = null;
        state.validationErrors = null;
        state.status = PageLoadStatus.SUCCEEDED;
        state.refetchSignal += 1
      })
      .addCase(deleteTenantThunk.fulfilled, (state) => {
        state.refetchSignal += 1;
        state.status = PageLoadStatus.SUCCEEDED;
      })

      .addMatcher(
        isAnyOf(
          fetchTenantsThunk.pending,
          createTenantThunk.pending,
          updateTenantThunk.pending,
          deleteTenantThunk.pending,
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
          fetchTenantsThunk.rejected,
          createTenantThunk.rejected,
          updateTenantThunk.rejected,
          deleteTenantThunk.rejected,
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
export const { clearTenantsError } = tenantsSlice.actions
export const tenantsReducer = tenantsSlice.reducer