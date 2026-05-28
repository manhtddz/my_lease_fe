import { useBaseList } from '../base/useBaseList'
import type { InvoiceDataListParams, InvoiceSearchForm } from '../../types/InvoiceType'
import type { InvoicePaymentStatusType } from '../../types/enums/invoices/InvoicePaymentStatus'
import { useGetInvoicesQuery } from '../../services/rtk/invoiceApiSlice'
import { PageLoadStatus, type PageLoadStatusType } from '../../types/enums/PageLoadStatus'
import type { ApiError } from '../../types/ex/ApiError'

const initialSearchForm: InvoiceSearchForm = { room_number: '', payment_status: '' }

export function useInvoiceList() {
  const base = useBaseList<InvoiceSearchForm, InvoiceDataListParams>({
    initialSearchForm,
    buildParams: (b, sf): InvoiceDataListParams => ({
      page: b.page,
      size: b.pageSize,
      sort_by: b.sortBy as InvoiceDataListParams['sort_by'],
      sort_dir: b.sortDir as InvoiceDataListParams['sort_dir'],
      room_number: sf.room_number || undefined,
      payment_status: sf.payment_status ? (Number(sf.payment_status) as InvoicePaymentStatusType) : undefined,
    }),
  })

  const { data, isLoading, isFetching, isError, error } = useGetInvoicesQuery(base.params)

  const list = data?.data ?? []
  const total = data?.total ?? 0
  const pageCount = Math.max(1, Math.ceil(total / base.pageSize))
  const effectivePage = Math.min(Math.max(1, base.page), pageCount)
  const showLoadingPlaceholder = isLoading && list.length === 0

  const status: PageLoadStatusType = isLoading || isFetching
    ? PageLoadStatus.LOADING
    : isError
      ? PageLoadStatus.FAILED
      : PageLoadStatus.SUCCEEDED

  const errorMessage = isError
    ? (error as ApiError)?.message ?? 'Đã có lỗi xảy ra.'
    : null

  return {
    list,
    total,
    pageCount,
    effectivePage,
    status,
    error: errorMessage,
    showLoadingPlaceholder,
    setPage: base.setPage,
    sortBy: base.sortBy,
    sortDir: base.sortDir,
    handleSort: base.handleSort,
    handleSubmit: base.handleSubmit,
    modalDeleteConfirm: base.modalDeleteConfirm,
  }
}
