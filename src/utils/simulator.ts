import type { User, UserDataListParams } from "../types/UserType";

export function delay(ms: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, ms)
    })
}

export const userMockUtils = {
    INITIAL_USERS: [
        { id: 1, name: 'Alice Demo', email: 'alice@demo.test', password: 'demo123' },
        { id: 2, name: 'Bob Demo', email: 'bob@demo.test', password: 'demo123' },
        { id: 3, name: 'Carol Demo', email: 'carol@demo.test', password: 'secret' },
        { id: 4, name: 'David Demo', email: 'david@demo.test', password: 'demo123' },
        { id: 5, name: 'Emma Demo', email: 'emma@demo.test', password: 'demo123' },
        { id: 6, name: 'Frank Demo', email: 'frank@demo.test', password: 'demo123' },
        { id: 7, name: 'Grace Demo', email: 'grace@demo.test', password: 'demo123' },
        { id: 8, name: 'Henry Demo', email: 'henry@demo.test', password: 'demo123' },
        { id: 9, name: 'Ivy Demo', email: 'ivy@demo.test', password: 'demo123' },
        { id: 10, name: 'Jack Demo', email: 'jack@demo.test', password: 'demo123' },
        { id: 11, name: 'Kate Demo', email: 'kate@demo.test', password: 'demo123' },
        { id: 12, name: 'Leo Demo', email: 'leo@demo.test', password: 'demo123' },
    ],

    validateUserPayload(
        payload: Omit<User, 'id'>
    ): { errors: Record<string, string[]>; code: number } | null {
        const errors: Record<string, string[]> = {}

        const emailTrim = payload.email.trim().toLowerCase()
        const nameTrim = payload.name.trim()
        const passwordTrim = payload.password.trim()

        // Chọn code theo thứ tự ưu tiên tương tự logic if-else trước đây.

        if (emailTrim === '') {
            errors.email = ['Email không được để trống.']
        }

        if (nameTrim === '') {
            errors.name = ['Tên không được để trống.']
        }

        if (passwordTrim === '') {
            errors.password = ['Mật khẩu không được để trống.']
        } else if (payload.password.length < 8) {
            errors.password = ['Mật khẩu phải có ít nhất 8 ký tự.']
        }

        const exists = userMockUtils.INITIAL_USERS.some(u => u.email === payload.email);

        if (exists) {
            if (!errors.email) {
                errors.email = ['Email đã tồn tại.']
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
