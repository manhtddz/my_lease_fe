import type { InvoicePaymentStatusType } from './enums/invoices/InvoicePaymentStatus'

export type Invoice = {
  id: number
  room_id: number
  representative_tenant_id: number
  total_amount: string
  payment_status: InvoicePaymentStatusType
  note: string | null

  representative?: {
    id: number,
    name: string
  }
  room?: {
    id: number,
    room_number?: string
  }
}

export type InvoiceDataListParams = {
  page?: number
  size?: number
  sort_by?: 'id' | 'total_amount'
  sort_dir?: 'asc' | 'desc'
  room_number?: string
  representative_tenant_name?: string
  payment_status?: InvoicePaymentStatusType
}

export type InvoiceDataListResult = {
  data: Invoice[]
  total: number
  current_page: number
  per_page: number
}

export type InvoiceSearchForm = {
  room_number: string
  payment_status: string
  representative_tenant_name: string
}
