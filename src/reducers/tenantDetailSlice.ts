import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import { createApiThunk } from '../utils/thunks'
import type { Tenant } from '../types/TenantType'
import { tenantApi } from '../services/tenant'

type TenantDetailState = {
    tenant: Tenant | null
    error: string | null
    errorCode: number | null
    refetchSignal: number
}

const initialState: TenantDetailState = {
    tenant: null,
    error: null,
    errorCode: null,
    refetchSignal: 0,
}

export const fetchTenantByIdThunk = createApiThunk(
    'tenants/fetchById',
    async (id: number, getState): Promise<Tenant> => {
        void getState
        return tenantApi.getTenantById(id)
    },
)

const tenantDetailSlice = createSlice({
    name: 'tenantDetail',
    initialState,
    reducers: {
        clearTenantDetailError: (state) => {
            state.tenant = null;
            state.error = null;
            state.errorCode = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTenantByIdThunk.fulfilled, (state, action) => {
                state.tenant = action.payload
                state.error = null;
                state.errorCode = null;
                state.refetchSignal += 1
            })
            .addMatcher(
                isAnyOf(
                    fetchTenantByIdThunk.pending,
                ),
                (state) => {
                    state.error = null
                    state.errorCode = null
                },
            )

            // ── rejected — tất cả giống nhau → gom vào 1 matcher ──
            .addMatcher(
                isAnyOf(
                    fetchTenantByIdThunk.rejected,
                ),
                (state, action) => {
                    const payload = action.payload

                    if (!payload) {
                        state.errorCode = null;
                        state.error = action.error?.message ?? 'Đã có lỗi xảy ra.'
                        return
                    }

                    const statusCode = payload.status
                    state.errorCode = statusCode;

                    switch (statusCode) {
                        // Validation (mock POST/PUT trả 422 + `errors`)
                        case 422: {
                            state.error = payload.message;
                            break
                        }
                        case 404: {
                            state.error = payload.message;
                            break
                        }
                        case 500: {
                            state.error = payload.message;
                            break
                        }

                        default: {
                            state.error = payload.message ?? 'Đã có lỗi xảy ra.'
                            break
                        }
                    }
                },
            )
    },
});
export const { clearTenantDetailError } = tenantDetailSlice.actions
export const tenantDetailReducer = tenantDetailSlice.reducer