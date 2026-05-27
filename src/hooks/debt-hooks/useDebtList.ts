import { useBaseList } from '../base/useBaseList'
import type { DebtDataListParams, DebtSearchForm } from '../../types/DebtType'
import { useGetDebtsQuery } from '../../services/rtk/debtApiSlice'
import { PageLoadStatus, type PageLoadStatusType } from '../../types/enums/PageLoadStatus'
import type { ApiError } from '../../types/ex/ApiError'

const initialSearchForm: DebtSearchForm = {
  tenant_name: '',
  status: '',
  debt_type: '',
}

export function useDebtList() {
  const base = useBaseList<DebtSearchForm, DebtDataListParams>({
    initialSearchForm,
    buildParams: (b, sf): DebtDataListParams => ({
      page: b.page,
      size: b.pageSize,
      sort_by: b.sortBy as DebtDataListParams['sort_by'],
      sort_dir: b.sortDir as DebtDataListParams['sort_dir'],
      tenant_name: sf.tenant_name || undefined,
      status: sf.status || undefined,
      debt_type: sf.debt_type || undefined,
    }),
  })

  const { data, isLoading, isFetching, isError, error } = useGetDebtsQuery(base.params)

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
  }
}
