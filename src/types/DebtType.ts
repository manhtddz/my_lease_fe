import type { DebtStatusType } from './enums/debts/DebtStatus'
import type { DebtTypeValueType } from './enums/debts/DebtType'

export type Debt = {
    id: number
    invoice_id: number
    tenant_id: number
    original_amount: string
    paid_amount: string
    remaining_amount: string
    due_date: string
    status: DebtStatusType
    note: string | null
    debt_type: DebtTypeValueType
    penalty_amount: string

    tenant?: {
        id: number
        name: string
    }
}

export type DebtDataListParams = {
    tenant_name?: string
    status?: DebtStatusType | ''
    debt_type?: DebtTypeValueType | ''
    sort_by?: 'id' | 'due_date' | 'remaining_amount'
    sort_dir?: 'asc' | 'desc'
    page?: number
    size?: number
}

export type DebtDataListResult = {
    data: Debt[]
    total: number
    current_page: number
    per_page: number
}

export type DebtSearchForm = {
    tenant_name: string
    status: DebtStatusType | ''
    debt_type: DebtTypeValueType | ''
}
