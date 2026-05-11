import MockAdapter from 'axios-mock-adapter';
import { axiosInstance } from './apiInstance';
import type { UserDataListParams } from '../types/UserType';
import { userMockUtils } from '../utils/simulator';

const mock = new MockAdapter(axiosInstance, { delayResponse: 800 });


// GET List with Params
mock.onGet('/users').reply((config) => {
    const params: UserDataListParams = config.params || {};

    const name = params?.name?.trim().toLowerCase() ?? ''
    const email = params?.email?.trim().toLowerCase() ?? ''
    const sortBy = params?.sortBy ?? 'id'
    const sortDir = params?.sortDir ?? 'asc'
    const pageIndex = Math.max(params?.pageIndex ?? 0, 0)
    const pageSize = Math.max(params?.pageSize ?? 5, 1)

    const filtered = userMockUtils.INITIAL_USERS.filter(u =>
        (name ? u.name.toLowerCase().includes(name) : true) &&
        (email ? u.email.toLowerCase().includes(email) : true),
    )

    const sorted = userMockUtils.sortUsers(filtered, sortBy, sortDir)
    const start = pageIndex * pageSize
    const items = sorted.slice(start, start + pageSize)

    return [200, { items, total: filtered.length, pageIndex, pageSize }];
});

// GET User by ID
mock.onGet(/\/users\/\d+/).reply((config) => {
    const id = parseInt(config.url!.split('/').pop()!);
    const user = userMockUtils.INITIAL_USERS.find(u => u.id === id)
    if (!user) return [404, { message: `Không tìm thấy user với id=${id}.` }];
    return [200, user];
});

// POST Create User with Validation
mock.onPost('/users').reply((config) => {
    const payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;

    const validation = userMockUtils.validateUserPayload(payload)
    if (validation) {
        return [validation.code, {
            message: 'Dữ liệu không hợp lệ.',
            errors: validation.errors,
        }];
    }

    const newUser = { ...payload, id: Date.now() };
    userMockUtils.INITIAL_USERS.push(newUser);
    return [200, newUser];
});

// PUT Update User
mock.onPut(/\/users\/\d+/).reply((config) => {
    const id = parseInt(config.url!.split('/').pop()!);
    const payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;

    const user = userMockUtils.INITIAL_USERS.find(u => u.id === id)

    if (!user) return [404, { message: `Không tìm thấy user với id=${id}.` }];

    const validation = userMockUtils.validateUserPayload(payload, id)
    if (validation) {
        return [validation.code, {
            message: 'Dữ liệu không hợp lệ.',
            errors: validation.errors,
        }];
    }

    userMockUtils.INITIAL_USERS = userMockUtils.INITIAL_USERS.map(u => u.id === id ? { ...u, ...payload } : u);
    return [200, { id, ...payload }];
});

// DELETE User
mock.onDelete(/\/users\/\d+/).reply((config) => {
    const id = parseInt(config.url!.split('/').pop()!);
    userMockUtils.INITIAL_USERS = userMockUtils.INITIAL_USERS.filter(u => u.id !== id);
    return [200, { id }];
});

// POST Login
mock.onPost('/auth/login').reply((config) => {
    const payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const email = payload.email.trim().toLowerCase()

    const user = userMockUtils.INITIAL_USERS.find(u => u.email === email)

    if (!user) {
        return [401, { message: 'Email không tồn tại.' }];
    }

    if (user.password !== payload.password) {
        return [401, { message: 'Mật khẩu không đúng.' }];
    }
    
    return [200, { id: user.id, name: user.name, email: user.email }];
});