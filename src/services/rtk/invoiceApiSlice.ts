import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../axiosBaseQuery'
import type { Invoice, InvoiceDataListParams, InvoiceDataListResult } from '../../types/InvoiceType'

export const invoiceRtkApi = createApi({
  reducerPath: 'invoiceRtkApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Invoice'],
  endpoints: (builder) => ({
    getInvoices: builder.query<InvoiceDataListResult, InvoiceDataListParams | undefined>({
      query: (params) => ({ url: '/invoices', params }),
      providesTags: ['Invoice'],
    }),

    getInvoiceById: builder.query<Invoice, number>({
      query: (id) => ({ url: `/invoices/${id}` }),
      providesTags: (_result, _err, id) => [{ type: 'Invoice', id }],
    }),

    deleteInvoice: builder.mutation<void, number>({
      query: (id) => ({ url: `/invoices/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Invoice'],
    }),
  }),
})

export const {
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  useDeleteInvoiceMutation,
} = invoiceRtkApi
