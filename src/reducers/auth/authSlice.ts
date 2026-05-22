import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { PublicUser } from '../../types/UserType'

export type AuthState = {
  isAuthenticated: boolean
  currentUser: PublicUser | null
  error: string | null
  errorCode: number | null
  isLoading: boolean
}

const initialState: AuthState = {
  isAuthenticated: true,
  currentUser: null,
  error: null,
  errorCode: null,
  isLoading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<PublicUser>) => {
      state.isAuthenticated = true
      state.currentUser = action.payload
      state.error = null
      state.errorCode = null
      state.isLoading = false
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.currentUser = null
      state.error = null
      state.errorCode = null
      state.isLoading = false
    },
    clearAuthError: (state) => {
      state.error = null
      state.errorCode = null
    },
  },
})

export const { setAuthenticated, logout, clearAuthError } = authSlice.actions
export const authReducer = authSlice.reducer
