import { useBaseList } from '../base/useBaseList'
import type { UserDataListParams, UserSearchForm } from '../../types/UserType'
import { useGetUsersQuery } from '../../services/rtk/userApiSlice'
import { PageLoadStatus, type PageLoadStatusType } from '../../types/enums/PageLoadStatus'
import type { ApiError } from '../../types/ex/ApiError'

const initialSearchForm: UserSearchForm = { name: '', email: '', status: [] }

export function useUserList() {
  const base = useBaseList<UserSearchForm, UserDataListParams>({
    initialSearchForm,
    buildParams: (b, sf): UserDataListParams => ({
      pageIndex: b.page,
      pageSize: b.pageSize,
      sortBy: b.sortBy as UserDataListParams['sortBy'],
      sortDir: b.sortDir as UserDataListParams['sortDir'],
      name: sf.name,
      email: sf.email,
      status: sf.status,
    }),
  })

  const { data, isLoading, isFetching, isError, error } = useGetUsersQuery(base.params)

  const list = data?.items ?? []
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
    setPageIndex: base.setPage,
    sortBy: base.sortBy,
    sortDir: base.sortDir,
    handleSort: base.handleSort,
    handleSubmit: base.handleSubmit,
    modalDeleteConfirm: base.modalDeleteConfirm,
  }
}
