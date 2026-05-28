import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './rootReducer'
import { roomRtkApi } from '../services/rtk/roomApiSlice'
import { tenantRtkApi } from '../services/rtk/tenantApiSlice'
import { userRtkApi } from '../services/rtk/userApiSlice'
import { authRtkApi } from '../services/rtk/authApiSlice'
import { invoiceRtkApi } from '../services/rtk/invoiceApiSlice'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(roomRtkApi.middleware)
      .concat(tenantRtkApi.middleware)
      .concat(userRtkApi.middleware)
      .concat(authRtkApi.middleware)
      .concat(invoiceRtkApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch