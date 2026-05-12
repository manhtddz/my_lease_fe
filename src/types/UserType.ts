export type User = {
    id: number
    name: string
    email: string
    password: string
    status: string
}

export type PublicUser = Omit<User, 'password'>

export type UserDataListParams = {
    name?: string
    email?: string
    status?: string[]
    sortBy?: 'id' | 'name' | 'email' | 'status'
    sortDir?: 'asc' | 'desc'
    pageIndex?: number
    pageSize?: number
}

export type UserDataListResult = {
    items: User[]
    total: number
    pageIndex: number
    pageSize: number
}

export type UserSearchForm = {
    name: string;
    email: string;
    status: string[];
};