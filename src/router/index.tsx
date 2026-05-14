import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthLayout } from '../layouts/AuthLayout'
import { LoginPage } from '../pages/Login'
import { PrivateRouter } from './PrivateRouter'
import { MainLayout } from '../layouts/MainLayout'
import { HomePage } from '../pages/Home'
import { UserListPage } from '../pages/user/UserList'
import { UserCreatePage } from '../pages/user/UserCreate'
import { UserUpdatePage } from '../pages/user/UserUpdate'
import { TenantListPage } from '../pages/tenants/TenantList'
import { TenantDetailPage } from '../pages/tenants/TenantDetail'
import { RoomListPage } from '../pages/rooms/RoomList'


export const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            {
                path: '/login',
                element: <LoginPage />,
            },
        ],
    },
    {
        element: <PrivateRouter />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        path: '/',
                        element: <HomePage />,
                    },
                    {
                        path: '/users',
                        element: <UserListPage />,
                    },
                    {
                        path: '/users/create',
                        element: <UserCreatePage />,
                    },
                    {
                        path: '/users/update/:userId',
                        element: <UserUpdatePage />,
                    },
                    {
                        path: '/tenants',
                        element: <TenantListPage />,
                    },
                    {
                        path: '/tenants/detail/:tenantId',
                        element: <TenantDetailPage />,
                        children: [
                            {
                                index: true,
                                element: <Navigate to="room" replace />,
                            },
                            {
                                path: 'room',
                                element: <div>Phòng</div>,
                            },
                            {
                                path: 'history',
                                element: <div>Lịch sử</div>,
                            },
                            {
                                path: 'invoices',
                                element: <div>Hoá đơn</div>,
                            },
                        ],
                    },
                    {
                        path: '/rooms',
                        element: <RoomListPage />,
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
])