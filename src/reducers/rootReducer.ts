import { combineReducers } from '@reduxjs/toolkit'
import { authReducer } from './authSlice'
import { usersReducer } from './userSlice'
import { tenantsReducer } from './tenantSlice'
import { tenantDetailReducer } from './tenantDetailSlice'
import { roomsReducer } from './roomSlice'

export const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  tenants: tenantsReducer,
  tenantDetail: tenantDetailReducer,
  rooms: roomsReducer,
})