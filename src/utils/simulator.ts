import type { User, UserDataListParams } from "../types/UserType";

export function delay(ms: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, ms)
    })
}

export const removeAccents = (str: string) => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

export const userMockUtils = {
    domain: 'user',

    INITIAL_USERS: [
        { id: 1, name: 'Alice Demo', email: 'alice@demo.test', password: 'demo123', status: '0' },
        { id: 2, name: 'Bob Demo', email: 'bob@demo.test', password: 'demo123', status: '0' },
        { id: 3, name: 'Carol Demo', email: 'carol@demo.test', password: 'secret', status: '0' },
        { id: 4, name: 'David Demo', email: 'david@demo.test', password: 'demo123', status: '0' },
        { id: 5, name: 'Emma Demo', email: 'emma@demo.test', password: 'demo123', status: '0' },
        { id: 6, name: 'Frank Demo', email: 'frank@demo.test', password: 'demo123', status: '0' },
        { id: 7, name: 'Grace Demo', email: 'grace@demo.test', password: 'demo123', status: '0' },
        { id: 8, name: 'Henry Demo', email: 'henry@demo.test', password: 'demo123', status: '0' },
        { id: 9, name: 'Ivy Demo', email: 'ivy@demo.test', password: 'demo123', status: '0' },
        { id: 10, name: 'Jack Demo', email: 'jack@demo.test', password: 'demo123', status: '0' },
        { id: 11, name: 'Kate Demo', email: 'kate@demo.test', password: 'demo123', status: '0' },
        { id: 12, name: 'Leo Demo', email: 'leo@demo.test', password: 'demo123', status: '0' },
    ],

    validateUserPayload(
        payload: Omit<User, 'id'>,
        id?: number
    ): { errors: Record<string, string[]>; code: number } | null {
        const errors: Record<string, string[]> = {}

        const emailTrim = payload.email.trim().toLowerCase()
        const nameTrim = payload.name.trim()
        const passwordTrim = payload.password.trim()
        const status = payload.status
        if (status !== '1' && status !== '0') {
            errors.status = [`${userMockUtils.domain}.status.invalid`]
        }

        if (emailTrim === '') {
            errors.email = [`${userMockUtils.domain}.email.required`]
        }

        if (nameTrim === '') {
            errors.name = [`${userMockUtils.domain}.name.required`]
        }

        if (passwordTrim === '') {
            errors.password = [`${userMockUtils.domain}.password.required`]
        } else if (payload.password.length < 6) {
            errors.password = [`${userMockUtils.domain}.password.min`]
        }

        const exists = userMockUtils.INITIAL_USERS.some(u => u.email === payload.email && (id ? u.id !== id : true));

        if (exists) {
            if (!errors.email) {
                errors.email = [`${userMockUtils.domain}.email.exists`]
            }
        }

        if (Object.keys(errors).length === 0) return null
        return { errors, code: 422 }
    },

    sortUsers(users: User[], sortBy: UserDataListParams['sortBy'] = 'id', sortDir: UserDataListParams['sortDir'] = 'asc'): User[] {
        const sorted = [...users].sort((a, b) => {
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
