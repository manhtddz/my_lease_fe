import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../axiosBaseQuery'
import type { Debt, DebtDataListParams, DebtDataListResult } from '../../types/DebtType'

export const debtRtkApi = createApi({
  reducerPath: 'debtRtkApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Debt'],
  endpoints: (builder) => ({
    getDebts: builder.query<DebtDataListResult, DebtDataListParams | undefined>({
      query: (params) => ({ url: '/debts', params }),
      providesTags: ['Debt'],
    }),

    getDebtById: builder.query<Debt, number>({
      query: (id) => ({ url: `/debts/${id}` }),
      providesTags: (_result, _err, id) => [{ type: 'Debt', id }],
    }),
  }),
})

export const {
  useGetDebtsQuery,
  useGetDebtByIdQuery,
} = debtRtkApi
