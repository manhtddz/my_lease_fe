import type { IsPresentativeType } from "./enums/tenant-room-history/IsPresentative"

export type Tenant = {
    id: number
    name: string
    phone_number: string
    id_card_number: string
    pivot?: TenantRoomPivot | null
}

export type TenantRoomPivot = {
    room_id: number
    tenant_id: number
    move_in_date: string
    move_out_date: string | null
    is_representative: IsPresentativeType
    room_price_snapshot: string
    note: string | null
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