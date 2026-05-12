// import { useEffect, useMemo, useState } from "react"
// import type { UserDataListParams } from "../../types/UserType"
// import { useAppDispatch, useAppSelector } from "../../reducers/hooks"
// import { fetchTenantsThunk } from "../../reducers/tenantSlice"
// import { PageLoadStatus } from "../../types/enums/PageLoadStatus"
// import { useModalDeleteConfirm } from "../modal-hooks/useModalDeleteConfirm"
// import type { TenantSearchForm } from "../../types/TenantType"
// import type { TenantDataListParams } from "../../types/TenantType"
// const PAGE_SIZE = 8


// export function useTenantList() {
//     const dispatch = useAppDispatch()
//     const modalDeleteConfirm = useModalDeleteConfirm()

//     const list = useAppSelector((s) => s.tenants.list)
//     const total = useAppSelector((s) => s.tenants.total)
//     const error = useAppSelector((s) => s.tenants.error)
//     const status = useAppSelector((s) => s.tenants.status)
//     const refetchSignal = useAppSelector((s) => s.tenants.refetchSignal)

//     const [pageIndex, setPageIndex] = useState(0)
//     const [sortBy, setSortBy] = useState(null)
//     const [sortDir, setSortDir] = useState(null)
//     const [searchForm, setSearchForm] = useState<TenantSearchForm>({ name: '', phone_number: '' })


//     const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
//     const effectivePage = Math.min(pageIndex, pageCount - 1)

//     const fetchParams = useMemo<TenantDataListParams>(() => {
//         return {
//             pageIndex: effectivePage,
//             pageSize: PAGE_SIZE,
//             sortBy: sortBy as TenantDataListParams['sortBy'],
//             sortDir: sortDir as TenantDataListParams['sortDir'],
//             name: searchForm.name,
//             phone_number: searchForm.phone_number,
//         }
//     }, [effectivePage, sortBy, sortDir, searchForm])

//     useEffect(() => {
//         dispatch(
//             fetchTenantsThunk(fetchParams),
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

//     const handleSubmit = (searchForm: TenantSearchForm) => {
//         setSearchForm({
//             name: searchForm.name.trim(),
//             phone_number: searchForm.phone_number.trim(),
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
import type { TenantDataListParams, TenantSearchForm } from "../../types/TenantType"
import { fetchTenantsThunk } from "../../reducers/tenantSlice"

const initialSearchForm: TenantSearchForm = { name: '', phone_number: '' }

export function useTenantList() {

    return useBaseList<TenantSearchForm, TenantDataListParams>({
        initialSearchForm,
        selectSlice: (s) => s.tenants,
        fetchThunk: fetchTenantsThunk,
        buildParams: (base, searchForm): TenantDataListParams => ({
            pageIndex: base.pageIndex,
            pageSize: base.pageSize,
            sortBy: base.sortBy as TenantDataListParams['sortBy'],
            sortDir: base.sortDir as TenantDataListParams['sortDir'],
            name: searchForm.name,
            phone_number: searchForm.phone_number,
        })
    })
}