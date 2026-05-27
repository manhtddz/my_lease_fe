import { useMemo, useState } from 'react'
import { useModalDeleteConfirm } from '../modal-hooks/useModalDeleteConfirm'

const DEFAULT_PAGE_SIZE = import.meta.env.VITE_DEFAULT_PAGE_SIZE

export type BaseListParams = {
  page?: number
  pageSize?: number
  sortBy?: string | null
  sortDir?: 'asc' | 'desc' | null
}

type Options<TSearchForm, TParams> = {
  pageSize?: number
  initialSearchForm: TSearchForm
  buildParams: (base: BaseListParams, searchForm: TSearchForm) => TParams
}

/**
 * Manages pagination/sort/search state only.
 * Domain hooks combine this with an RTK Query hook to get list data.
 */
export function useBaseList<TSearchForm, TParams>({
  pageSize = DEFAULT_PAGE_SIZE,
  initialSearchForm,
  buildParams,
}: Options<TSearchForm, TParams>) {
  const modalDeleteConfirm = useModalDeleteConfirm()

  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null)
  const [searchForm, setSearchForm] = useState<TSearchForm>(initialSearchForm)

  const params = useMemo<TParams>(
    () => buildParams({ page, pageSize, sortBy, sortDir }, searchForm),
    [page, pageSize, sortBy, sortDir, searchForm],
  )

  function handleSort(field: string) {
    if (field === sortBy) {
      if (sortDir === 'asc') {
        setSortDir('desc')
      } else {
        setSortBy(null)
        setSortDir(null)
      }
    } else {
      setSortBy(field)
      setSortDir('asc')
    }
  }

  function handleSubmit(form: TSearchForm) {
    const trimmed = Object.fromEntries(
      Object.entries(form as Record<string, unknown>).map(([k, v]) => [
        k,
        typeof v === 'string' ? v.trim() : v,
      ]),
    ) as TSearchForm
    setSearchForm(trimmed)
    setPage(1)
  }

  return {
    params,
    page,
    pageSize,
    setPage,
    sortBy,
    sortDir,
    handleSort,
    handleSubmit,
    modalDeleteConfirm,
  }
}
