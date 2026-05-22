// Server state cho room detail đã được migrate sang RTK Query (src/services/rtk/roomApiSlice.ts).
// File này được giữ lại để tránh breaking imports, có thể xóa khi toàn bộ import được cập nhật.
import { createSlice } from '@reduxjs/toolkit'

const roomDetailSlice = createSlice({
  name: 'roomDetail',
  initialState: {},
  reducers: {},
})

export const roomDetailReducer = roomDetailSlice.reducer
