import { useTranslation } from 'react-i18next'
import { useTenantList } from '../../hooks/tenant-hooks/useTenantList'
import { useTenantModalForm } from '../../hooks/tenant-hooks/useTenantModalForm'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const TABS = [
  { to: 'room', icon: 'ti-door', label: 'Phòng' },
  { to: 'history', icon: 'ti-history', label: 'Lịch sử' },
  { to: 'invoices', icon: 'ti-receipt', label: 'Hoá đơn' },
]

export function TenantDetailPage() {
  const tenantListHook = useTenantList()
  const tenantModalForm = useTenantModalForm()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<string>('room')

  return (
    <>
      <div className="d-flex align-items-center justify-content-between px-3 py-3 bg-body-tertiary border-bottom">
        <div className="d-flex align-items-center gap-3">
          {/* Avatar */}
          <div
            className="rounded-circle d-flex align-items-center justify-content-center fw-medium flex-shrink-0"
            style={{ width: 44, height: 44, fontSize: 15, background: '#EEEDFE', color: '#3C3489' }}
          >
            NA
          </div>

          {/* Tên + meta */}
          <div>
            <h2 className="h6 fw-medium mb-1 d-flex align-items-center gap-2">
              Nguyễn Văn An
              <span className="badge rounded-pill bg-success-subtle text-success-emphasis fw-normal" style={{ fontSize: 11 }}>
                <i className="ti ti-circle-check me-1" aria-hidden="true" />
                Đang thuê
              </span>
            </h2>
            <div className="d-flex gap-3">
              <span className="text-secondary small d-flex align-items-center gap-1">
                <i className="ti ti-phone" style={{ fontSize: 13 }} aria-hidden="true" />
                0912 345 678
              </span>
              <span className="text-secondary small d-flex align-items-center gap-1">
                <i className="ti ti-mail" style={{ fontSize: 13 }} aria-hidden="true" />
                an.nguyen@gmail.com
              </span>
            </div>
          </div>
        </div>

        <button className="btn btn-sm btn-outline-secondary">
          <i className="ti ti-edit me-1" aria-hidden="true" />
          Chỉnh sửa
        </button>
      </div>
      {/* Tab bar */}
      <ul className="nav nav-tabs bg-body border-bottom px-4 mb-0">
        {TABS.map((tab) => (
          <li key={tab.to} className="nav-item">
            {/* relative path — tự resolve thành /tenants/detail/:tenantId/room ... */}
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
      <div className="content">
        <div className="d-flex flex-column gap-4">

          {/* ── Phòng hiện tại ── */}
          <div>
            <p className="text-uppercase text-secondary fw-semibold mb-2" style={{ fontSize: 11, letterSpacing: '.4px' }}>
              Phòng hiện tại
            </p>
            <div className="card border">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <i className="ti ti-door text-primary" style={{ fontSize: 15 }} aria-hidden="true" />
                    <span className="fw-medium">Phòng 302 — Toà A</span>
                    <span className="badge rounded-pill bg-info-subtle text-info-emphasis">Đang ở</span>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-secondary">
                      <i className="ti ti-arrow-right me-1" aria-hidden="true" />
                      Chuyển phòng
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      <i className="ti ti-logout me-1" aria-hidden="true" />
                      Trả phòng
                    </button>
                  </div>
                </div>

                <div className="row g-0">
                  <div className="col-6">
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-secondary small">Ngày vào</span>
                      <span className="fw-medium small">01/01/2025</span>
                    </div>
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-secondary small">Hạn hợp đồng</span>
                      <span className="fw-medium small">31/12/2025</span>
                    </div>
                    <div className="d-flex justify-content-between py-2">
                      <span className="text-secondary small">Diện tích</span>
                      <span className="fw-medium small">25 m²</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Người ở cùng phòng ── */}
          <div>
            <p className="text-uppercase text-secondary fw-semibold mb-2" style={{ fontSize: 11, letterSpacing: '.4px' }}>
              Người ở cùng phòng
            </p>
            <div className="card border">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <i className="ti ti-users" style={{ fontSize: 15, color: '#0F6E56' }} aria-hidden="true" />
                    <span className="fw-medium small">2 người</span>
                  </div>
                  <button className="btn btn-sm btn-outline-primary">
                    <i className="ti ti-plus me-1" aria-hidden="true" />
                    Thêm người
                  </button>
                </div>

                <div className="d-flex align-items-center gap-3 py-2">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-medium"
                    style={{ width: 32, height: 32, fontSize: 12, background: '#FBEAF0', color: '#72243E' }}
                  >
                    LM
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-medium small">Lê Minh</div>
                    <div className="text-secondary" style={{ fontSize: 11 }}>CCCD: 079300009012 · Người thân</div>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-secondary">
                      <i className="ti ti-edit" aria-hidden="true" />
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      <i className="ti ti-trash" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Chỉ số tiêu thụ ── */}
          <div>
            <p className="text-uppercase text-secondary fw-semibold mb-2" style={{ fontSize: 11, letterSpacing: '.4px' }}>
              Chỉ số tiêu thụ — Tháng 5/2025
            </p>
            <div className="card border">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <i className="ti ti-chart-bar" style={{ fontSize: 15, color: '#854F0B' }} aria-hidden="true" />
                    <span className="fw-medium small">Kỳ ghi: 01/05 – 31/05</span>
                  </div>
                  <button className="btn btn-sm btn-outline-secondary">
                    <i className="ti ti-pencil me-1" aria-hidden="true" />
                    Nhập chỉ số
                  </button>
                </div>

                <div className="row g-3">
                  {/* Điện */}
                  <div className="col-6">
                    <div className="rounded-2 p-3 bg-body-secondary">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <i className="ti ti-bolt" style={{ fontSize: 16, color: '#854F0B' }} aria-hidden="true" />
                        <span className="fw-medium small">Điện</span>
                      </div>
                      <div className="d-flex justify-content-between py-1">
                        <span className="text-secondary" style={{ fontSize: 11 }}>Chỉ số đầu</span>
                        <span className="fw-medium" style={{ fontSize: 11 }}>1.240 kWh</span>
                      </div>
                      <div className="d-flex justify-content-between py-1">
                        <span className="text-secondary" style={{ fontSize: 11 }}>Chỉ số cuối</span>
                        <span className="fw-medium" style={{ fontSize: 11 }}>1.354 kWh</span>
                      </div>
                      <div className="d-flex justify-content-between py-1">
                        <span className="text-secondary" style={{ fontSize: 11 }}>Đơn giá</span>
                        <span className="fw-medium" style={{ fontSize: 11 }}>3.500đ / kWh</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center border-top mt-2 pt-2">
                        <span className="text-secondary" style={{ fontSize: 11 }}>Tiêu thụ: 114 kWh</span>
                        <span className="fw-medium text-primary">399.000đ</span>
                      </div>
                    </div>
                  </div>

                  {/* Nước */}
                  <div className="col-6">
                    <div className="rounded-2 p-3 bg-body-secondary">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <i className="ti ti-droplet" style={{ fontSize: 16, color: '#185FA5' }} aria-hidden="true" />
                        <span className="fw-medium small">Nước</span>
                      </div>
                      <div className="d-flex justify-content-between py-1">
                        <span className="text-secondary" style={{ fontSize: 11 }}>Chỉ số đầu</span>
                        <span className="fw-medium" style={{ fontSize: 11 }}>320 m³</span>
                      </div>
                      <div className="d-flex justify-content-between py-1">
                        <span className="text-secondary" style={{ fontSize: 11 }}>Chỉ số cuối</span>
                        <span className="fw-medium" style={{ fontSize: 11 }}>334 m³</span>
                      </div>
                      <div className="d-flex justify-content-between py-1">
                        <span className="text-secondary" style={{ fontSize: 11 }}>Đơn giá</span>
                        <span className="fw-medium" style={{ fontSize: 11 }}>15.000đ / m³</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center border-top mt-2 pt-2">
                        <span className="text-secondary" style={{ fontSize: 11 }}>Tiêu thụ: 14 m³</span>
                        <span className="fw-medium text-primary">210.000đ</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-secondary text-end mt-2 mb-0" style={{ fontSize: 11 }}>
                  <i className="ti ti-clock me-1" aria-hidden="true" />
                  Cập nhật lần cuối: 31/05/2025 bởi Admin
                </p>
              </div>
            </div>
          </div>

          {/* ── Ghi chú nội bộ ── */}
          <div>
            <p className="text-uppercase text-secondary fw-semibold mb-2 d-flex align-items-center gap-2" style={{ fontSize: 11, letterSpacing: '.4px' }}>
              Ghi chú nội bộ
              <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis fw-normal" style={{ fontSize: 11 }}>
                <i className="ti ti-eye-off me-1" aria-hidden="true" />
                Chỉ quản lý thấy
              </span>
            </p>
            <div className="card border">
              <div className="card-body d-flex flex-column gap-0">

                {/* Note 1 */}
                <div className="py-3 border-bottom">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center fw-medium flex-shrink-0"
                      style={{ width: 24, height: 24, fontSize: 10, background: '#E1F5EE', color: '#085041' }}
                    >
                      QA
                    </div>
                    <span className="fw-medium small">Quản lý A</span>
                    <span className="text-secondary" style={{ fontSize: 11 }}>· 10/05/2025, 09:15</span>
                  </div>
                  <p className="small mb-2">Tenant hay thanh toán trễ 3–5 ngày, đã nhắc nhở. Cần theo dõi thêm tháng 6.</p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-secondary">
                      <i className="ti ti-edit me-1" aria-hidden="true" />Sửa
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      <i className="ti ti-trash me-1" aria-hidden="true" />Xoá
                    </button>
                  </div>
                </div>

                {/* Note 2 */}
                <div className="py-3 border-bottom">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center fw-medium flex-shrink-0"
                      style={{ width: 24, height: 24, fontSize: 10, background: '#EEEDFE', color: '#3C3489' }}
                    >
                      QB
                    </div>
                    <span className="fw-medium small">Quản lý B</span>
                    <span className="text-secondary" style={{ fontSize: 11 }}>· 02/04/2025, 14:30</span>
                  </div>
                  <p className="small mb-2">Đã ký hợp đồng gia hạn đến 31/12/2025. Bản gốc lưu tại văn phòng.</p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-secondary">
                      <i className="ti ti-edit me-1" aria-hidden="true" />Sửa
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      <i className="ti ti-trash me-1" aria-hidden="true" />Xoá
                    </button>
                  </div>
                </div>

                {/* Input ghi chú mới */}
                <div className="d-flex gap-2 pt-3">
                  <textarea
                    className="form-control form-control-sm"
                    rows={2}
                    placeholder="Thêm ghi chú mới..."
                  />
                  <button className="btn btn-primary btn-sm align-self-end">
                    <i className="ti ti-send me-1" aria-hidden="true" />
                    Gửi
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}