import { useEffect, useMemo, useState } from "react"
import type { UserDataListParams } from "../../types/UserType"
import { useAppDispatch, useAppSelector } from "../../reducers/hooks"
import { fetchUsersThunk } from "../../reducers/userSlice"
import { PageLoadStatus } from "../../types/enums/PageLoadStatus"
import { useModalDeleteConfirm } from "../modal-hooks/useModalDeleteConfirm"
const PAGE_SIZE = 8


export function useUserList() {
    const dispatch = useAppDispatch()
    const modalDeleteConfirm = useModalDeleteConfirm()

    const list = useAppSelector((s) => s.users.list)
    const total = useAppSelector((s) => s.users.total)
    const error = useAppSelector((s) => s.users.error)
    const status = useAppSelector((s) => s.users.status)
    const refetchSignal = useAppSelector((s) => s.users.refetchSignal)

    const [pageIndex, setPageIndex] = useState(0)
    const [sortBy, setSortBy] = useState(null)
    const [sortDir, setSortDir] = useState(null)
    const [searchForm, setSearchForm] = useState({ name: '', email: '' })


    const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
    const effectivePage = Math.min(pageIndex, pageCount - 1)

    const fetchParams = useMemo<UserDataListParams>(() => {
        return {
            pageIndex: effectivePage,
            pageSize: PAGE_SIZE,
            sortBy: sortBy as UserDataListParams['sortBy'],
            sortDir: sortDir as UserDataListParams['sortDir'],
            name: searchForm.name,
            email: searchForm.email,
        }
    }, [effectivePage, sortBy, sortDir, searchForm])

    useEffect(() => {
        dispatch(
            fetchUsersThunk(fetchParams),
        )
    }, [dispatch, fetchParams, refetchSignal])

    const showLoadingPlaceholder =
        list.length === 0 && (status === PageLoadStatus.IDLE || status === PageLoadStatus.LOADING)

    function handleSort(field: string) {
        if (field === sortBy) {
            if (sortDir === 'asc') {
                // Đang ASC -> Chuyển sang DESC
                setSortDir('desc');
            } else {
                // Đang DESC -> Quay về mặc định (Null/Default)
                setSortBy(null); // Hoặc field mặc định của bạn
                setSortDir(null);
            }
        } else {
            // Bấm vào cột mới -> Bắt đầu bằng ASC
            setSortBy(field);
            setSortDir('asc');
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const nameValue = formData.get('name') as string;
        const emailValue = formData.get('email') as string;

        setSearchForm({
            name: nameValue.trim(),
            email: emailValue.trim()
        });

        setPageIndex(0);
    };

    return {
        list,
        total,
        error,
        status,
        setPageIndex,
        sortBy,
        sortDir,
        pageCount,
        effectivePage,
        showLoadingPlaceholder,
        handleSort,
        handleSubmit,
        modalDeleteConfirm,
    }
}
