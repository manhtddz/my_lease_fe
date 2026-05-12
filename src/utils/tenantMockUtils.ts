import type { Tenant, TenantDataListParams } from "../types/TenantType";

export const tenantMockUtils = {
    domain: 'tenant',

    INITIAL_TENANTS: [
        { id: 1, name: 'Alice Demo', phone_number: '0909090901', id_card_number: '11111111111111' },
        { id: 2, name: 'Bob Demo', phone_number: '0909090902', id_card_number: '22222222222222' },
        { id: 3, name: 'Carol Demo', phone_number: '0909090903', id_card_number: '33333333333333' },
        { id: 4, name: 'David Demo', phone_number: '0909090904', id_card_number: '44444444444444' },
        { id: 5, name: 'Emma Demo', phone_number: '0909090905', id_card_number: '55555555555555' },
        { id: 6, name: 'Frank Demo', phone_number: '0909090906', id_card_number: '66666666666666' },
        { id: 7, name: 'Grace Demo', phone_number: '0909090907', id_card_number: '77777777777777' },
        { id: 8, name: 'Henry Demo', phone_number: '0909090908', id_card_number: '88888888888888' },
        { id: 9, name: 'Ivy Demo', phone_number: '0909090909', id_card_number: '99999999999999' },
        { id: 10, name: 'Jack Demo', phone_number: '0909090911', id_card_number: '10101010101010' },
        { id: 11, name: 'Kate Demo', phone_number: '0909090912', id_card_number: '13131313131313' },
        { id: 12, name: 'Leo Demo', phone_number: '0909090913', id_card_number: '12121212121212' },
    ],

    validateTenantPayload(
        payload: Omit<Tenant, 'id'>,
        id?: number
    ): { errors: Record<string, string[]>; code: number } | null {
        const errors: Record<string, string[]> = {}
console.log(id);

        const phoneNumberTrim = payload.phone_number.trim()

        if (phoneNumberTrim === '') {
            errors.phone_number = [`${tenantMockUtils.domain}.phone_number.required`]
        }

        const phoneNumberExists = tenantMockUtils.INITIAL_TENANTS.some(t => t.phone_number === payload.phone_number && (id ? t.id !== id : true));
        if (phoneNumberExists) {
            errors.phone_number = [`${tenantMockUtils.domain}.phone_number.exists`]
        }

        const idCardNumberExists = tenantMockUtils.INITIAL_TENANTS.some(t => t.id_card_number === payload.id_card_number && (id ? t.id !== id : true));
        if (idCardNumberExists) {
            errors.id_card_number = [`${tenantMockUtils.domain}.id_card_number.exists`]
        }

        if (Object.keys(errors).length === 0) return null
        return { errors, code: 422 }
    },

    sortTenants(tenants: Tenant[], sortBy: TenantDataListParams['sortBy'] = 'id', sortDir: TenantDataListParams['sortDir'] = 'asc'): Tenant[] {
        const sorted = [...tenants].sort((a, b) => {
            const left = a[sortBy!]
            const right = b[sortBy!]

            const cmp =
                typeof left === 'number' && typeof right === 'number'
                    ? left - right
                    : String(left).toLowerCase() > String(right).toLowerCase() ? 1 : -1

            return sortDir === 'desc' ? -cmp : cmp
        })

        return sorted
    },
}
