import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../axiosBaseQuery'
import type { User, UserDataListParams, UserDataListResult } from '../../types/UserType'

export const userRtkApi = createApi({
  reducerPath: 'userRtkApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<UserDataListResult, UserDataListParams | undefined>({
      query: (params) => ({ url: '/users', params }),
      providesTags: ['User'],
    }),

    getUserById: builder.query<User, number>({
      query: (id) => ({ url: `/users/${id}` }),
      providesTags: (_result, _err, id) => [{ type: 'User', id }],
    }),

    createUser: builder.mutation<User, Omit<User, 'id'>>({
      query: (data) => ({ url: '/users', method: 'POST', data }),
      invalidatesTags: ['User'],
    }),

    updateUser: builder.mutation<User, User>({
      query: (data) => ({ url: `/users/${data.id}`, method: 'PUT', data }),
      invalidatesTags: (_result, _err, arg) => ['User', { type: 'User', id: arg.id }],
    }),

    deleteUser: builder.mutation<void, number>({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userRtkApi
