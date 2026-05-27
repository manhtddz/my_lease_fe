import { Link, NavLink, Outlet, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { RoomFormModal } from '../../components/modals/RoomFormModal'
import { useRoomModalForm } from '../../hooks/room-hooks/useRoomModalForm'
import { BasicButton } from '../../components/base-components/buttons/BasicButton'
import type { RoomFormData } from '../../validation/rooms/roomSchema'
import {
  useGetRoomByIdQuery,
  useUpdateRoomMutation,
} from '../../services/rtk/roomApiSlice'
import type { ApiError } from '../../types/ex/ApiError'

const TABS = [
  { to: 'info', icon: 'ti-door', label: 'Thông tin' },
  { to: 'consumptions', icon: 'ti-history', label: 'Chỉ số tiêu thụ' },
  { to: 'invoices', icon: 'ti-receipt', label: 'Hoá đơn' },
] as const

export function RoomDetailPage() {
  const params = useParams()
  const { t } = useTranslation()
  const roomId = Number(params.roomId)
  const roomIdInvalid = params.roomId != null && !Number.isFinite(roomId)

  const { data: room, isLoading, error: fetchError } = useGetRoomByIdQuery(roomId, {
    skip: roomIdInvalid,
  })

  const [updateRoom, { isLoading: isUpdating, error: updateError, reset: resetUpdate }] =
    useUpdateRoomMutation()

  const roomModalForm = useRoomModalForm()

  const serverValidationErrors =
    updateError && (updateError as ApiError).status === 422
      ? (updateError as ApiError).errors ?? null
      : null

  const fetchErrorMessage = fetchError ? (fetchError as ApiError).message ?? 'Đã có lỗi xảy ra.' : null

  const handleSubmit = async (data: RoomFormData): Promise<boolean> => {
    if (roomModalForm.editingRoom?.id !== undefined) {
      const result = await updateRoom({ ...data, id: roomModalForm.editingRoom.id })
      return !('error' in result)
    }
    return false
  }

  return (
    <>
      {roomIdInvalid ? (
        <div className="alert alert-warning m-3" role="alert">
          Mã phòng không hợp lệ.
        </div>
      ) : null}

      {fetchErrorMessage ? (
        <div className="alert alert-danger m-3" role="alert">
          {fetchErrorMessage}
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
            onClick={() => room && roomModalForm.openEditModal(room.id, room)}
            disabled={!room || isLoading}
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

      <RoomFormModal
        isOpen={roomModalForm.isModalOpen}
        onClose={() => roomModalForm.closeModal()}
        defaultValues={roomModalForm.editingRoom}
        editingId={roomModalForm.editingRoom?.id}
        isLoading={isUpdating}
        serverValidationErrors={serverValidationErrors}
        onSubmit={handleSubmit}
        onClearErrors={resetUpdate}
      />
    </>
  )
}
