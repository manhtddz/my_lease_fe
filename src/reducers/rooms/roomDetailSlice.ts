import { createSlice } from '@reduxjs/toolkit'
import { createApiThunk } from '../../utils/thunks'
import { roomApi } from '../../services/room'
import type { Room } from '../../types/RoomType'
import type { Tenant } from '../../types/TenantType'

type RoomDetailState = {
    room: Room | null
    currentOccupants: Tenant[] | null
    error: string | null
    errorCode: number | null
    refetchSignal: number
    isLoading: boolean           // loading cho fetchRoomById
    isOccupantsLoading: boolean  // loading riêng cho occupants — không reset cả trang
    isMoveOutLoading: boolean
    validationErrors: Record<string, string[]> | null
}

const initialState: RoomDetailState = {
    room: null,
    currentOccupants: null,
    error: null,
    errorCode: null,
    refetchSignal: 0,
    isLoading: false,
    isOccupantsLoading: false,
    isMoveOutLoading: false,
    validationErrors: null,
}

export const fetchRoomByIdThunk = createApiThunk(
    'rooms/fetchById',
    async (id: number, getState): Promise<Room> => {
        void getState
        return roomApi.getRoomById(id)
    },
)

export const fetchCurrentOccupantsByIdThunk = createApiThunk(
    'rooms/getCurrentOccupantsById',
    async (id: number, getState): Promise<Tenant[]> => {
        void getState
        const result = await roomApi.getCurrentOccupantsById(id)
        return result
    },
)

export const moveOutTenantThunk = createApiThunk(
    'rooms/moveOutTenant',
    async (payload: { roomId: number; tenantId: number }, getState) => {
        void getState
        const result = await roomApi.moveOutTenant(payload.roomId, payload.tenantId)
        return result
    },
)

export const moveOutAllThunk = createApiThunk(
    'rooms/moveOutAll',
    async (payload: { roomId: number }, getState) => {
        void getState
        const result = await roomApi.moveOutAll(payload.roomId)
        return result
    },
)

export const updateRoomDetailThunk = createApiThunk(
    'rooms/updateRoomDetail',
    async (payload: Room, getState) => {
        void getState
        console.log(payload)
        return roomApi.updateRoom(payload.id, payload)
    },
)

const roomDetailSlice = createSlice({
    name: 'roomDetail',
    initialState,
    reducers: {
        clearRoomDetailError: (state) => {
            state.room = null
            state.currentOccupants = null
            state.error = null
            state.errorCode = null
            state.isLoading = false
            state.isOccupantsLoading = false
            state.isMoveOutLoading = false
            state.validationErrors = null
        },
        removeOccupant: (state, action) => {
            state.currentOccupants = state.currentOccupants?.filter((tenant) => tenant.id !== action.payload)
        },
        removeAllOccupants: (state) => {
            state.currentOccupants = null
        },
    },
    extraReducers: (builder) => {
        builder
            // ── fetchRoomById ──
            .addCase(fetchRoomByIdThunk.pending, (state) => {
                state.isLoading = true
                state.room = null
                state.error = null
                state.errorCode = null
            })
            .addCase(fetchRoomByIdThunk.fulfilled, (state, action) => {
                state.room = action.payload
                state.error = null
                state.errorCode = null
                state.isLoading = false
            })
            .addCase(fetchRoomByIdThunk.rejected, (state, action) => {
                state.isLoading = false
                const payload = action.payload
                state.errorCode = payload?.status ?? null
                state.error = payload?.message ?? action.error?.message ?? 'Đã có lỗi xảy ra.'
            })

            .addCase(fetchCurrentOccupantsByIdThunk.pending, (state) => {
                state.isOccupantsLoading = true
                state.error = null
                state.errorCode = null
            })
            .addCase(fetchCurrentOccupantsByIdThunk.fulfilled, (state, action) => {
                state.currentOccupants = action.payload
                state.error = null
                state.errorCode = null
                state.isOccupantsLoading = false
            })
            .addCase(fetchCurrentOccupantsByIdThunk.rejected, (state, action) => {
                state.isOccupantsLoading = false
                const payload = action.payload
                state.errorCode = payload?.status ?? null
                state.error = payload?.message ?? action.error?.message ?? 'Đã có lỗi xảy ra.'
            })

            // ── moveOutTenant ──
            .addCase(moveOutTenantThunk.pending, (state) => {
                state.isMoveOutLoading = true
                state.error = null
                state.errorCode = null
            })
            .addCase(moveOutTenantThunk.fulfilled, (state) => {
                state.isMoveOutLoading = false
            })
            .addCase(moveOutTenantThunk.rejected, (state, action) => {
                state.isMoveOutLoading = false
                const payload = action.payload
                state.errorCode = payload?.status ?? null
                state.error = payload?.message ?? 'Đã có lỗi xảy ra.'
            })

            // ── moveOutAll ──
            .addCase(moveOutAllThunk.pending, (state) => {
                state.isMoveOutLoading = true
                state.error = null
                state.errorCode = null
            })
            .addCase(moveOutAllThunk.fulfilled, (state) => {
                state.isMoveOutLoading = false
            })
            .addCase(moveOutAllThunk.rejected, (state, action) => {
                state.isMoveOutLoading = false
                const payload = action.payload
                state.errorCode = payload?.status ?? null
                state.error = payload?.message ?? 'Đã có lỗi xảy ra.'
            })

            // ── updateRoomDetail ──
            .addCase(updateRoomDetailThunk.pending, (state) => {
                state.isLoading = true
                state.error = null
                state.errorCode = null
            })
            .addCase(updateRoomDetailThunk.fulfilled, (state, action) => {
                state.room = action.payload
                state.error = null
                state.errorCode = null
                state.isLoading = false
            })
            .addCase(updateRoomDetailThunk.rejected, (state, action) => {
                state.isLoading = false
                const payload = action.payload
                state.errorCode = payload?.status ?? null
                state.error = payload?.message ?? 'Đã có lỗi xảy ra.'
                if(payload?.status === 422) {
                    state.validationErrors = payload.errors ?? null
                }
            })
    },
})

export const { clearRoomDetailError, removeOccupant, removeAllOccupants } = roomDetailSlice.actions
export const roomDetailReducer = roomDetailSlice.reducer