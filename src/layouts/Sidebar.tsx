import { NavLink } from 'react-router-dom'

interface NavItem {
    to: string
    end?: boolean
    icon: string
    label: string
}

const NAV_ITEMS: NavItem[] = [
    { to: '/', end: true, icon: 'bi-speedometer2', label: 'Tổng quan' },
    { to: '/users', icon: 'bi-people', label: 'Người dùng' },
    { to: '/tenants', icon: 'bi-person-vcard', label: 'Khách hàng' },
    { to: '/rooms', icon: 'bi-house-fill', label: 'Phòng' },
    { to: '/invoices', icon: 'bi-receipt', label: 'Hoá đơn' },
]

interface SidebarProps {
    collapsed: boolean
    onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    return (
        <aside
            className="d-flex flex-column bg-body-tertiary border-end"
            style={{
                width: collapsed ? 56 : 220,
                flexShrink: 0,
                transition: 'width 0.25s ease',
                overflow: 'hidden',
            }}
        >
            {/* Toggle button */}
            <div
                className={`d-flex pt-2 ${collapsed ? 'justify-content-center px-0' : 'justify-content-end px-2'}`}
                style={{ height: 40 }}
            >
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary border-0"
                    onClick={onToggle}
                    title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
                >
                    <i
                        className={`bi ${collapsed ? 'bi-layout-sidebar' : 'bi-layout-sidebar-reverse'}`}
                        style={{ fontSize: 16 }}
                    />
                </button>
            </div>

            {/* Nav items */}
            <nav className="flex-grow-1 py-2">
                <ul className="nav flex-column px-2">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.to} className="nav-item">
                            <NavLink
                                to={item.to}
                                end={item.end}
                                title={collapsed ? item.label : undefined}
                                className={({ isActive }) =>
                                    `nav-link d-flex align-items-center gap-2 px-2 py-2 rounded-2 mb-1 ${isActive
                                        ? 'active bg-primary text-white'
                                        : 'text-body-secondary'
                                    }`
                                }
                            >
                                <i
                                    className={`bi ${item.icon} flex-shrink-0`}
                                    style={{ fontSize: 18, minWidth: 20, textAlign: 'center' }}
                                />
                                <span
                                    className="small fw-medium text-nowrap"
                                    style={{
                                        opacity: collapsed ? 0 : 1,
                                        transition: 'opacity 0.15s ease',
                                        pointerEvents: collapsed ? 'none' : 'auto',
                                    }}
                                >
                                    {item.label}
                                </span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}