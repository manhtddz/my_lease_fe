import { combineReducers } from '@reduxjs/toolkit'
import { authReducer } from './auth/authSlice'
import { usersReducer } from './users/userSlice'
import { tenantsReducer } from './tenants/tenantSlice'
import { tenantDetailReducer } from './tenants/tenantDetailSlice'
import { roomsReducer } from './rooms/roomSlice'
import { roomDetailReducer } from './rooms/roomDetailSlice'

export const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  tenants: tenantsReducer,
  tenantDetail: tenantDetailReducer,
  rooms: roomsReducer,
  roomDetail: roomDetailReducer,
})