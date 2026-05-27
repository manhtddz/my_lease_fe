import { combineReducers } from '@reduxjs/toolkit'
import { authReducer } from './auth/authSlice'
import { usersReducer } from './users/userSlice'
import { tenantsReducer } from './tenants/tenantSlice'
import { tenantDetailReducer } from './tenants/tenantDetailSlice'
import { roomsReducer } from './rooms/roomSlice'
import { roomDetailReducer } from './rooms/roomDetailSlice'
import { roomRtkApi } from '../services/rtk/roomApiSlice'
import { tenantRtkApi } from '../services/rtk/tenantApiSlice'
import { userRtkApi } from '../services/rtk/userApiSlice'
import { authRtkApi } from '../services/rtk/authApiSlice'
import { debtRtkApi } from '../services/rtk/debtApiSlice'

export const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  tenants: tenantsReducer,
  tenantDetail: tenantDetailReducer,
  rooms: roomsReducer,
  roomDetail: roomDetailReducer,
  [roomRtkApi.reducerPath]: roomRtkApi.reducer,
  [tenantRtkApi.reducerPath]: tenantRtkApi.reducer,
  [userRtkApi.reducerPath]: userRtkApi.reducer,
  [authRtkApi.reducerPath]: authRtkApi.reducer,
  [debtRtkApi.reducerPath]: debtRtkApi.reducer,
})