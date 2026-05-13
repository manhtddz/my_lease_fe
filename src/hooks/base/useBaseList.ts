import { useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../reducers/hooks"
import { PageLoadStatus, type PageLoadStatusType } from "../../types/enums/PageLoadStatus"
import { useModalDeleteConfirm } from "../modal-hooks/useModalDeleteConfirm"
import type { RootState } from "../../reducers/index"
import type { AsyncThunk } from "@reduxjs/toolkit"

const DEFAULT_PAGE_SIZE = 8

type SliceState<T> = {
    list: T[]
    total: number
    error: string | null
    status: PageLoadStatusType
    refetchSignal: number
}

type BaseListParams = {
    pageIndex?: number
    pageSize?: number
    sortBy?: string | null
    sortDir?: 'asc' | 'desc' | null
}

type Options<T, S extends BaseListParams> = {
    pageSize?: number
    initialSearchForm: T
    selectSlice: (state: RootState) => SliceState<unknown>
    fetchThunk: AsyncThunk<any, S, any>
    buildParams: (base: BaseListParams, searchForm: T) => S
}

export function useBaseList<
    TSearchForm,
    TParams extends BaseListParams,
>({
    pageSize = DEFAULT_PAGE_SIZE,
    initialSearchForm,
    selectSlice,
    fetchThunk,
    buildParams,
}: Options<TSearchForm, TParams>) {
    const dispatch = useAppDispatch()
    const modalDeleteConfirm = useModalDeleteConfirm()

    const { list, total, error, status, refetchSignal } = useAppSelector(selectSlice)

    const [pageIndex, setPageIndex] = useState(0)
    const [sortBy, setSortBy] = useState<string | null>(null)
    const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null)
    const [searchForm, setSearchForm] = useState<TSearchForm>(initialSearchForm)

    const pageCount = Math.max(1, Math.ceil(total / pageSize))
    const effectivePage = Math.min(pageIndex, pageCount - 1)

    const fetchParams = useMemo<TParams>(() => {
        return buildParams(
            { pageIndex: effectivePage, pageSize, sortBy, sortDir },
            searchForm,
        )
    }, [effectivePage, pageSize, sortBy, sortDir, searchForm])

    useEffect(() => {
        dispatch(fetchThunk(fetchParams as any))
    }, [dispatch, fetchParams, refetchSignal])

    const showLoadingPlaceholder =
        list.length === 0 &&
        (status === PageLoadStatus.IDLE || status === PageLoadStatus.LOADING)

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
        setPageIndex(0)
    }

    return {
        list,
        total,
        error,
        status,
        pageCount,
        effectivePage,
        sortBy,
        sortDir,
        showLoadingPlaceholder,
        setPageIndex,
        handleSort,
        handleSubmit,
        modalDeleteConfirm,
        dispatch
    }
}