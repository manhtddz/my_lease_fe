import { NavLink, Outlet, useParams } from 'react-router-dom'
import { useGetTenantByIdQuery } from '../../services/rtk/tenantApiSlice'

const TABS = [
  { to: 'room', icon: 'ti-door', label: 'Phòng' },
  { to: 'history', icon: 'ti-history', label: 'Lịch sử' },
  { to: 'invoices', icon: 'ti-receipt', label: 'Hoá đơn' },
]

export function TenantDetailPage() {
  const params = useParams()
  const tenantId = Number(params.tenantId)

  const { data: tenant, error } = useGetTenantByIdQuery(tenantId, {
    skip: !Number.isFinite(tenantId),
  })

  const errorMessage = error ? (error as { message?: string })?.message ?? 'Đã có lỗi xảy ra.' : null

  return (
    <>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <div className="d-flex align-items-center justify-content-between px-3 py-3 bg-body-tertiary border-bottom">
        <div className="d-flex align-items-center gap-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center fw-medium flex-shrink-0"
            style={{ width: 44, height: 44, fontSize: 15, background: '#EEEDFE', color: '#3C3489' }}
          >
            NA
          </div>
          <div>
            <h2 className="h6 fw-medium mb-1 d-flex align-items-center gap-2">
              {tenant?.name}
              <span className="badge rounded-pill bg-success-subtle text-success-emphasis fw-normal" style={{ fontSize: 11 }}>
                <i className="ti ti-circle-check me-1" aria-hidden="true" />
                Đang thuê
              </span>
            </h2>
            <div className="d-flex gap-3">
              <span className="text-secondary small d-flex align-items-center gap-1">
                <i className="ti ti-phone" style={{ fontSize: 13 }} aria-hidden="true" />
                {tenant?.phone_number}
              </span>
              <span className="text-secondary small d-flex align-items-center gap-1">
                <i className="ti ti-mail" style={{ fontSize: 13 }} aria-hidden="true" />
                {tenant?.id_card_number}
              </span>
            </div>
          </div>
        </div>
        <button className="btn btn-sm btn-outline-secondary">
          <i className="ti ti-edit me-1" aria-hidden="true" />
          Chỉnh sửa
        </button>
      </div>
      <ul className="nav nav-tabs bg-body border-bottom px-4 mb-0">
        {TABS.map((tab) => (
          <li key={tab.to} className="nav-item">
            <NavLink
              to={tab.to}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2${isActive ? ' active' : ''}`
              }
            >
              <i className={`ti ${tab.icon}`} style={{ fontSize: 14 }} aria-hidden="true" />
              {tab.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <Outlet />
    </>
  )
}
