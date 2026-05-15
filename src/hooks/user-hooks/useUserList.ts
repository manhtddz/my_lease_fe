// import { useEffect, useMemo, useState } from "react"
// import type { UserDataListParams } from "../../types/UserType"
// import { useAppDispatch, useAppSelector } from "../../reducers/hooks"
// import { fetchUsersThunk } from "../../reducers/userSlice"
// import { PageLoadStatus } from "../../types/enums/PageLoadStatus"
// import { useModalDeleteConfirm } from "../modal-hooks/useModalDeleteConfirm"
// import type { UserSearchForm } from "../../types/UserType"
// const PAGE_SIZE = 8


// export function useUserList() {
//     const dispatch = useAppDispatch()
//     const modalDeleteConfirm = useModalDeleteConfirm()

//     const list = useAppSelector((s) => s.users.list)
//     const total = useAppSelector((s) => s.users.total)
//     const error = useAppSelector((s) => s.users.error)
//     const status = useAppSelector((s) => s.users.status)
//     const refetchSignal = useAppSelector((s) => s.users.refetchSignal)

//     const [pageIndex, setPageIndex] = useState(0)
//     const [sortBy, setSortBy] = useState(null)
//     const [sortDir, setSortDir] = useState(null)
//     const [searchForm, setSearchForm] = useState<UserSearchForm>({ name: '', email: '', status: [] })


//     const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
//     const effectivePage = Math.min(pageIndex, pageCount - 1)

//     const fetchParams = useMemo<UserDataListParams>(() => {
//         return {
//             pageIndex: effectivePage,
//             pageSize: PAGE_SIZE,
//             sortBy: sortBy as UserDataListParams['sortBy'],
//             sortDir: sortDir as UserDataListParams['sortDir'],
//             name: searchForm.name,
//             email: searchForm.email,
//             status: searchForm.status
//         }
//     }, [effectivePage, sortBy, sortDir, searchForm])

//     useEffect(() => {
//         dispatch(
//             fetchUsersThunk(fetchParams),
//         )
//     }, [dispatch, fetchParams, refetchSignal])

//     const showLoadingPlaceholder =
//         list.length === 0 && (status === PageLoadStatus.IDLE || status === PageLoadStatus.LOADING)

//     function handleSort(field: string) {
//         if (field === sortBy) {
//             if (sortDir === 'asc') {
//                 // Đang ASC -> Chuyển sang DESC
//                 setSortDir('desc');
//             } else {
//                 // Đang DESC -> Quay về mặc định (Null/Default)
//                 setSortBy(null); // Hoặc field mặc định của bạn
//                 setSortDir(null);
//             }
//         } else {
//             // Bấm vào cột mới -> Bắt đầu bằng ASC
//             setSortBy(field);
//             setSortDir('asc');
//         }
//     }

//     const handleSubmit = (searchForm: UserSearchForm) => {
//         setSearchForm({
//             name: searchForm.name.trim(),
//             email: searchForm.email.trim(),
//             status: searchForm.status,
//         });
    
//         setPageIndex(0);
//     };

//     return {
//         list,
//         total,
//         error,
//         status,
//         setPageIndex,
//         sortBy,
//         sortDir,
//         pageCount,
//         effectivePage,
//         showLoadingPlaceholder,
//         handleSort,
//         handleSubmit,
//         modalDeleteConfirm,
//     }
// }

import { useBaseList } from "../base/useBaseList"
import { fetchUsersThunk } from "../../reducers/users/userSlice"
import type { UserSearchForm, UserDataListParams } from "../../types/UserType"

const initialSearchForm: UserSearchForm = { name: '', email: '', status: [] }

export function useUserList() {
    return useBaseList<UserSearchForm, UserDataListParams>({
        initialSearchForm,
        selectSlice: (s) => s.users,
        fetchThunk: fetchUsersThunk,
        buildParams: (base, searchForm): UserDataListParams => ({
            pageIndex: base.pageIndex,
            pageSize: base.pageSize,
            sortBy: base.sortBy as UserDataListParams['sortBy'],
            sortDir: base.sortDir as UserDataListParams['sortDir'],
            name: searchForm.name,
            email: searchForm.email,
            status: searchForm.status,
        }),
    })
}