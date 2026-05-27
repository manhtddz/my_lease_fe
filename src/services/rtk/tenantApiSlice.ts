import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../axiosBaseQuery'
import type { Tenant, TenantDataListParams, TenantDataListResult } from '../../types/TenantType'

export const tenantRtkApi = createApi({
  reducerPath: 'tenantRtkApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Tenant'],
  endpoints: (builder) => ({
    getTenants: builder.query<TenantDataListResult, TenantDataListParams | undefined>({
      query: (params) => ({ url: '/tenants', params }),
      providesTags: ['Tenant'],
    }),

    getTenantById: builder.query<Tenant, number>({
      query: (id) => ({ url: `/tenants/${id}` }),
      providesTags: (_result, _err, id) => [{ type: 'Tenant', id }],
    }),

    createTenant: builder.mutation<Tenant, Omit<Tenant, 'id'>>({
      query: (data) => ({ url: '/tenants', method: 'POST', data }),
      invalidatesTags: ['Tenant'],
    }),

    updateTenant: builder.mutation<Tenant, Tenant>({
      query: (data) => ({ url: `/tenants/${data.id}`, method: 'PUT', data }),
      invalidatesTags: (_result, _err, arg) => ['Tenant', { type: 'Tenant', id: arg.id }],
    }),

    deleteTenant: builder.mutation<void, number>({
      query: (id) => ({ url: `/tenants/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Tenant'],
    }),
  }),
})

export const {
  useGetTenantsQuery,
  useGetTenantByIdQuery,
  useCreateTenantMutation,
  useUpdateTenantMutation,
  useDeleteTenantMutation,
} = tenantRtkApi
