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
import { RoomDetailPage } from '../pages/rooms/RoomDetail'
import { RoomDetailInfoPage } from '../pages/rooms/RoomDetailInfoPage'
import { InvoiceListPage } from '../pages/invoices/InvoiceList'

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
                        path: '/invoices',
                        element: <InvoiceListPage />,
                    },
                    {
                        path: '/rooms',
                        element: <RoomListPage />,
                    },
                    {
                        path: '/rooms/detail/:roomId',
                        element: <RoomDetailPage />,
                        children: [
                            {
                                index: true,
                                element: <Navigate to="info" replace />,
                            },
                            {
                                path: 'info',
                                element: <RoomDetailInfoPage />,
                            },
                            {
                                path: 'consumptions',
                                element: (
                                    <div className="px-4 py-4 text-body-secondary small">
                                        Nội dung chỉ số tiêu thụ (đang phát triển).
                                    </div>
                                ),
                            },
                            {
                                path: 'invoices',
                                element: (
                                    <div className="px-4 py-4 text-body-secondary small">
                                        Nội dung hoá đơn (đang phát triển).
                                    </div>
                                ),
                            },
                        ],
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