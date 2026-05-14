export type Tenant = {
    id: number
    name: string
    phone_number: string
    id_card_number: string
}

export type TenantDataListParams = {
    name?: string
    phone_number?: string
    sort_by?: 'id' | 'name'
    sort_dir?: 'asc' | 'desc'
    page?: number
    size?: number
}

export type TenantDataListResult = {
    data: Tenant[]
    total: number
    current_page: number
    per_page: number
}

export type TenantSearchForm = {
    name: string;
    phone_number: string;
};