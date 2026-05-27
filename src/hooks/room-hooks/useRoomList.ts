import { useBaseList } from '../base/useBaseList'
import type { RoomDataListParams, RoomSearchForm } from '../../types/RoomType'
import { useGetRoomsQuery } from '../../services/rtk/roomApiSlice'
import { PageLoadStatus, type PageLoadStatusType } from '../../types/enums/PageLoadStatus'
import type { ApiError } from '../../types/ex/ApiError'

const initialSearchForm: RoomSearchForm = { room_number: '', room_type: [], status: [] }

export function useRoomList() {
  const base = useBaseList<RoomSearchForm, RoomDataListParams>({
    initialSearchForm,
    buildParams: (b, sf): RoomDataListParams => ({
      page: b.page,
      size: b.pageSize,
      sort_by: b.sortBy as RoomDataListParams['sort_by'],
      sort_dir: b.sortDir as RoomDataListParams['sort_dir'],
      room_number: sf.room_number,
      room_type: sf.room_type,
      status: sf.status,
    }),
  })

  const { data, isLoading, isFetching, isError, error } = useGetRoomsQuery(base.params)

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
