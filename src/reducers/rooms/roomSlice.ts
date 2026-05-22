// Server state cho rooms domain đã được migrate sang RTK Query (src/services/rtk/roomApiSlice.ts).
// File này được giữ lại để tránh breaking imports, có thể xóa khi toàn bộ import được cập nhật.
import { createSlice } from '@reduxjs/toolkit'

const roomsSlice = createSlice({
  name: 'rooms',
  initialState: {},
  reducers: {},
})

export const roomsReducer = roomsSlice.reducer
