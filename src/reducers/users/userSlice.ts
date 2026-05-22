// Server state cho users domain đã migrate sang RTK Query (src/services/rtk/userApiSlice.ts).
import { createSlice } from '@reduxjs/toolkit'

const usersSlice = createSlice({
  name: 'users',
  initialState: {},
  reducers: {},
})

export const usersReducer = usersSlice.reducer
