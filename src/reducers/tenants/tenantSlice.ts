// Server state cho tenants domain đã migrate sang RTK Query (src/services/rtk/tenantApiSlice.ts).
import { createSlice } from '@reduxjs/toolkit'

const tenantsSlice = createSlice({
  name: 'tenants',
  initialState: {},
  reducers: {},
})

export const tenantsReducer = tenantsSlice.reducer
