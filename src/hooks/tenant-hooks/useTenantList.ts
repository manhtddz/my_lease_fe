import { useBaseList } from "../base/useBaseList"
import type { TenantDataListParams, TenantSearchForm } from "../../types/TenantType"
import { fetchTenantsThunk } from "../../reducers/tenants/tenantSlice"

const initialSearchForm: TenantSearchForm = { name: '', phone_number: '' }

export function useTenantList() {

    return useBaseList<TenantSearchForm, TenantDataListParams>({
        initialSearchForm,
        selectSlice: (s) => s.tenants,
        fetchThunk: fetchTenantsThunk,
        buildParams: (base, searchForm): TenantDataListParams => ({
            page: base.page,
            size: base.pageSize,
            sort_by: base.sortBy as TenantDataListParams['sort_by'],
            sort_dir: base.sortDir as TenantDataListParams['sort_dir'],
            name: searchForm.name,
            phone_number: searchForm.phone_number,
        })
    })
}