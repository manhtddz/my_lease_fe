import { useBaseList } from '../base/useBaseList'
import type { TenantDataListParams, TenantSearchForm } from '../../types/TenantType'
import { useGetTenantsQuery } from '../../services/rtk/tenantApiSlice'
import { PageLoadStatus, type PageLoadStatusType } from '../../types/enums/PageLoadStatus'
import type { ApiError } from '../../types/ex/ApiError'

const initialSearchForm: TenantSearchForm = { name: '', phone_number: '' }

export function useTenantList() {
  const base = useBaseList<TenantSearchForm, TenantDataListParams>({
    initialSearchForm,
    buildParams: (b, sf): TenantDataListParams => ({
      page: b.page,
      size: b.pageSize,
      sort_by: b.sortBy as TenantDataListParams['sort_by'],
      sort_dir: b.sortDir as TenantDataListParams['sort_dir'],
      name: sf.name,
      phone_number: sf.phone_number,
    }),
  })

  const { data, isLoading, isFetching, isError, error } = useGetTenantsQuery(base.params)

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
