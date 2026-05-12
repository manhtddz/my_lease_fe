import { combineReducers } from '@reduxjs/toolkit'
import { authReducer } from './authSlice'
import { usersReducer } from './userSlice'
import { tenantsReducer } from './tenantSlice'

export const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  tenants: tenantsReducer,
})