import { useEffect } from 'react'
import { Link, NavLink, Outlet, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../../reducers/hooks'
import { fetchRoomByIdThunk } from '../../reducers/rooms/roomDetailSlice'
import { RoomFormModal } from '../../components/modals/RoomFormModal'
import { useRoomModalForm } from '../../hooks/room-hooks/useRoomModalForm'
import { BasicButton } from '../../components/buttons/BasicButton'

const TABS = [
  { to: 'info', icon: 'ti-door', label: 'Thông tin' },
  { to: 'consumptions', icon: 'ti-history', label: 'Chỉ số tiêu thụ' },
  { to: 'invoices', icon: 'ti-receipt', label: 'Hoá đơn' },
] as const

export function RoomDetailPage() {
  const { room, error, isLoading } = useAppSelector((state) => state.roomDetail)
  const roomModalForm = useRoomModalForm()
  const params = useParams()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  useEffect(() => {
    const id = Number(params.roomId)
    if (!Number.isFinite(id)) return
    void dispatch(fetchRoomByIdThunk(id))
  }, [dispatch, params.roomId])

  const roomIdInvalid = params.roomId != null && !Number.isFinite(Number(params.roomId))

  return (
    <>
      {roomIdInvalid ? (
        <div className="alert alert-warning m-3" role="alert">
          Mã phòng không hợp lệ.
        </div>
      ) : null}

      {error ? (
        <div className="alert alert-danger m-3" role="alert">
          {error}
        </div>
      ) : null}

      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 px-3 py-3 bg-body-tertiary border-bottom">
        <div className="d-flex align-items-center gap-3 min-w-0">
          <div
            className="rounded d-flex align-items-center justify-content-center flex-shrink-0 bg-primary-subtle text-primary"
            style={{ width: 44, height: 44 }}
            aria-hidden
          >
            <i className="ti ti-door" style={{ fontSize: 22 }} />
          </div>
          <div className="min-w-0">
            <h1 className="h5 fw-semibold mb-1 text-truncate">
              {isLoading ? '…' : room?.room_number ?? '—'}
            </h1>
            <p className="text-body-secondary small mb-0">
              {isLoading || !room?.floor
                ? ''
                : `${t('models.room.floor')}: ${room.floor}`}
            </p>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <Link to="/rooms" className="btn btn-sm btn-outline-secondary">
            <i className="ti ti-arrow-left me-1" aria-hidden />
            Danh sách phòng
          </Link>
          <BasicButton
            onClick={() => roomModalForm.openEditModal(room.id)}
            disabled={false}
            className="btn btn-sm btn-outline-secondary"
          >
            <i className="ti ti-edit me-1" aria-hidden />
            {t('btn.edit')}
          </BasicButton>
        </div>
      </div>

      <ul className="nav nav-tabs bg-body border-bottom px-3 px-md-4 mb-0">
        {TABS.map((tab) => (
          <li key={tab.to} className="nav-item">
            <NavLink
              to={tab.to}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2${isActive ? ' active' : ''}`
              }
            >
              <i className={`ti ${tab.icon}`} style={{ fontSize: 14 }} aria-hidden />
              {tab.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <Outlet />
    </>
  )
}
