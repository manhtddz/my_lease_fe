// Server state cho tenant detail đã migrate sang RTK Query (src/services/rtk/tenantApiSlice.ts).
import { createSlice } from '@reduxjs/toolkit'

const tenantDetailSlice = createSlice({
  name: 'tenantDetail',
  initialState: {},
  reducers: {},
})

export const tenantDetailReducer = tenantDetailSlice.reducer
