import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../axiosBaseQuery'
import type { PublicUser } from '../../types/UserType'

export const authRtkApi = createApi({
  reducerPath: 'authRtkApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<PublicUser, { email: string; password: string }>({
      query: (credentials) => ({ url: '/auth/login', method: 'POST', data: credentials }),
    }),
  }),
})

export const { useLoginMutation } = authRtkApi
