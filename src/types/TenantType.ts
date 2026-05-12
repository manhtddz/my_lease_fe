export type Tenant = {
    id: number
    name: string
    phone_number: string
    id_card_number: string
}

export type TenantDataListParams = {
    name?: string
    phone_number?: string
    sortBy?: 'id' | 'name'
    sortDir?: 'asc' | 'desc'
    pageIndex?: number
    pageSize?: number
}

export type TenantDataListResult = {
    items: Tenant[]
    total: number
    pageIndex: number
    pageSize: number
}

export type TenantSearchForm = {
    name: string;
    phone_number: string;
};