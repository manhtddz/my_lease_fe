import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import { createApiThunk } from '../../utils/thunks'
import { PageLoadStatus, type PageLoadStatusType } from '../../types/enums/PageLoadStatus'
import type { Room, RoomDataListParams, RoomDataListResult } from '../../types/RoomType'
import { roomApi } from '../../services/room'

type RoomsState = {
  list: Room[]
  total: number
  status: PageLoadStatusType
  error: string | null
  errorCode: number | null
  validationErrors: Record<string, string[]> | null
  refetchSignal: number
}

const initialState: RoomsState = {
  list: [],
  total: 0,
  status: PageLoadStatus.IDLE,
  error: null,
  errorCode: null,
  validationErrors: null,
  refetchSignal: 0,
}

export const fetchRoomsThunk = createApiThunk(
  'rooms/fetchAll',
  async (params: RoomDataListParams | undefined, getState): Promise<RoomDataListResult> => {
    void getState
    return roomApi.getRoomDataList(params)
  },
)


export const createRoomThunk = createApiThunk(
  'rooms/createRoom',
  async (payload: Omit<Room, 'id'>, getState) => {
    void getState
    return roomApi.createRoom(payload)
  },
)

export const updateRoomThunk = createApiThunk(
  'rooms/updateRoom',
  async (payload: Room, getState) => {
    void getState
    return roomApi.updateRoom(payload.id, payload)
  },
)

export const deleteRoomThunk = createApiThunk(
  'rooms/deleteRoom',
  async (id: number, getState) => {
    void getState
    return roomApi.deleteRoomById(id)
  },
)

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    clearRoomsError: (state) => {
      state.status = PageLoadStatus.IDLE;
      state.error = null;
      state.errorCode = null;
      state.validationErrors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomsThunk.fulfilled, (state, action) => {
        state.list = action.payload.data
        state.total = action.payload.total
        state.error = null;
        state.errorCode = null;
        state.validationErrors = null;
        state.status = PageLoadStatus.SUCCEEDED;
      })
      .addCase(createRoomThunk.fulfilled, (state) => {
        state.error = null;
        state.errorCode = null;
        state.validationErrors = null;
        state.status = PageLoadStatus.SUCCEEDED;
        state.refetchSignal += 1
      })
      .addCase(updateRoomThunk.fulfilled, (state) => {
        state.error = null;
        state.errorCode = null;
        state.validationErrors = null;
        state.status = PageLoadStatus.SUCCEEDED;
        state.refetchSignal += 1
      })
      .addCase(deleteRoomThunk.fulfilled, (state) => {
        state.refetchSignal += 1;
        state.status = PageLoadStatus.SUCCEEDED;
      })

      .addMatcher(
        isAnyOf(
          fetchRoomsThunk.pending,
          createRoomThunk.pending,
          updateRoomThunk.pending,
          deleteRoomThunk.pending,
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
          fetchRoomsThunk.rejected,
          createRoomThunk.rejected,
          updateRoomThunk.rejected,
          deleteRoomThunk.rejected,
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
export const { clearRoomsError } = roomsSlice.actions
export const roomsReducer = roomsSlice.reducer