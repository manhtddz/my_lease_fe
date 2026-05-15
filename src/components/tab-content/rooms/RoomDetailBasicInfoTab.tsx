import { useTranslation } from 'react-i18next'
import type { Room } from '../../../types/RoomType'
import { RoomStatus } from '../../../types/enums/rooms/RoomStatus'
import { RoomTypeEnum } from '../../../types/enums/rooms/RoomType'
import { RoomStatusEnum } from '../../../types/enums/rooms/RoomStatus'
import type { Tenant } from '../../../types/TenantType'
import { BasicButton } from '../../buttons/BasicButton'
import { IsPresentative, IsPresentativeEnum } from '../../../types/enums/tenant-room-history/IsPresentative'
import { MoveoutConfirmModal } from '../../modals/MoveoutConfirmModal'
import { useState } from 'react'

type Props = {
  room: Room | null
  currentOccupants: Tenant[] | null
  isLoading: boolean,
  handleMoveOut: (tenantId: number) => Promise<void>
  handleMoveOutAll: () => Promise<void>
}

// ── Avatar helpers ────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  { bg: '#EEEDFE', color: '#3C3489' },
  { bg: '#E1F5EE', color: '#085041' },
  { bg: '#FBEAF0', color: '#72243E' },
  { bg: '#FAEEDA', color: '#633806' },
  { bg: '#E6F1FB', color: '#0C447C' },
]

function getAvatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length]
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

// ── StatCard ──────────────────────────────────────────────────────────────────

type StatCardVariant = 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info'

const variantClass: Record<StatCardVariant, string> = {
  default: 'bg-body-secondary text-body-secondary',
  primary: 'bg-primary-subtle text-primary-emphasis',
  success: 'bg-success-subtle text-success-emphasis',
  danger: 'bg-danger-subtle text-danger-emphasis',
  warning: 'bg-warning-subtle text-warning-emphasis',
  info: 'bg-info-subtle text-info-emphasis',
}

interface StatCardProps {
  label: string
  children: React.ReactNode
  variant?: StatCardVariant
}

function StatCard({ label, children, variant = 'default' }: StatCardProps) {
  return (
    <div className="col-6 col-md-4">
      <div className={`rounded-2 px-3 py-3 h-100 ${variantClass[variant]}`}>
        <div className="mb-2 opacity-75" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </div>
        {children}
      </div>
    </div>
  )
}

// ── OccupantRow ───────────────────────────────────────────────────────────────

interface OccupantRowProps {
  tenant: Tenant
  isLast: boolean
  onEdit?: (tenantId: number) => void
  onMoveOut?: (tenantId: number) => void
}

function OccupantRow({ tenant, isLast, onEdit, onMoveOut }: OccupantRowProps) {
  const { t } = useTranslation()
  const { bg, color } = getAvatarColor(tenant.id)
  const pivot = tenant.pivot

  const moveInDate = pivot?.move_in_date
    ? new Date(pivot.move_in_date).toLocaleDateString('vi-VN')
    : '—'

  const isRepresentative = pivot?.is_representative == IsPresentative.TRUE

  return (
    <div className={`d-flex align-items-center gap-3 py-2 px-1 ${!isLast ? 'border-bottom' : ''}`}>
      {/* Avatar */}
      <div
        className="rounded-circle d-flex align-items-center justify-content-center fw-medium flex-shrink-0"
        style={{ width: 36, height: 36, fontSize: 12, background: bg, color }}
      >
        {getInitials(tenant.name)}
      </div>

      {/* Info */}
      <div className="flex-grow-1 overflow-hidden">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="fw-medium small text-truncate">{tenant.name}</span>
          {isRepresentative && (
            <span
              className="badge rounded-pill fw-normal"
              style={{ fontSize: 11, background: bg, color }}
            >
              {t(IsPresentativeEnum[pivot?.is_representative])}
            </span>
          )}
        </div>
        <div className="text-body-secondary" style={{ fontSize: 11 }}>
          {t('models.tenant.id_card_number')}: {tenant.id_card_number}
          {' · '}
          {tenant.phone_number}
          {' · '}
          {t('models.tenant_room_history.move_in_date')}: {moveInDate}
        </div>
      </div>

      {/* Actions */}
      <div className="d-flex gap-2 flex-shrink-0">
        <BasicButton
          onClick={() => onEdit?.(tenant.id)}
          disabled={false}
          className="btn btn-sm btn-outline-secondary me-2"
        >
          <i className="ti ti-edit" style={{ fontSize: 13 }} aria-hidden="true" />
          {t('btn.edit')}
        </BasicButton>
        <BasicButton
          onClick={() => onMoveOut?.(tenant.id)}
          disabled={false}
          className="btn btn-sm btn-outline-danger"
        >
          <i className="ti ti-logout" style={{ fontSize: 13 }} aria-hidden="true" />
          {t('btn.move_out')}
        </BasicButton>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function RoomDetailBasicInfoTab({ room, currentOccupants, isLoading, handleMoveOut, handleMoveOutAll }: Props) {
  const { t } = useTranslation()
  const [modalMoveoutConfirm, setModalMoveoutConfirm] = useState(false)
  const [tenantIdToMoveOut, setTenantIdToMoveOut] = useState<number | null>(null)
  if (isLoading) {
    return (
      <div className="px-4 py-5 text-center text-body-secondary small">
        {t('btn.loading')}
      </div>
    )
  }

  if (!room) {
    return (
      <div className="px-4 py-5 text-center text-body-secondary small">
        {t('messages.no_data')}
      </div>
    )
  }

  const typeKey = RoomTypeEnum[room.room_type as keyof typeof RoomTypeEnum]
  const statusKey = RoomStatusEnum[room.status as keyof typeof RoomStatusEnum]

  const statusVariant: StatCardVariant = (() => {
    switch (room.status) {
      case RoomStatus.AVAILABLE: return 'success'
      case RoomStatus.PARTIALLY_OCCUPIED: return 'info'
      case RoomStatus.FULLY_OCCUPIED: return 'danger'
      case RoomStatus.RESERVED: return 'warning'
      default: return 'default'
    }
  })()

  const occupants = currentOccupants ?? []

  const handleMoveOutModalOpen = (tenantId: number) => {
    setTenantIdToMoveOut(tenantId)
    setModalMoveoutConfirm(true)
  }

  const handleMoveOutAllModalOpen = () => {
    setTenantIdToMoveOut(null)
    setModalMoveoutConfirm(true)
  }

  return (
    <div className="px-3 px-md-4 py-4 d-flex flex-column gap-4">

      {/* ── Thông tin cơ bản ── */}
      <div>
        <p
          className="text-uppercase text-body-secondary fw-semibold mb-3"
          style={{ fontSize: 11, letterSpacing: '0.04em' }}
        >
          {t('common.basic_info')}
        </p>
        <div className="row g-3">
          <StatCard label={t('models.room.room_number')}>
            <div className="fs-5 fw-medium">{room.room_number}</div>
          </StatCard>

          <StatCard label={t('models.room.floor')}>
            <div className="fs-5 fw-medium">{room.floor}</div>
          </StatCard>

          <StatCard label={t('models.room.room_type')}>
            <div className="fs-5 fw-medium">
              {typeKey ? t(typeKey) : room.room_type}
            </div>
          </StatCard>

          <StatCard label={t('models.room.room_price')}>
            <div className="fs-5 fw-medium">{room.room_price}</div>
          </StatCard>

          <StatCard label={t('models.room.max_occupants')}>
            <div className="fs-5 fw-medium">{room.max_occupants}</div>
          </StatCard>

          <StatCard label={t('models.room.status')} variant={statusVariant}>
            <div className="fs-5 fw-medium">
              {statusKey ? t(statusKey) : room.status}
            </div>
          </StatCard>
        </div>
      </div>

      {/* ── Người đang ở ── */}
      <div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <p
            className="text-uppercase text-body-secondary fw-semibold mb-0"
            style={{ fontSize: 11, letterSpacing: '0.04em' }}
          >
            {t('models.room.current_occupants')}
            <span className="badge rounded-pill bg-body-secondary text-body-secondary fw-normal ms-2" style={{ fontSize: 11 }}>
              {occupants.length}
            </span>
          </p>
          <BasicButton
            onClick={handleMoveOutAllModalOpen}
            disabled={false}
            className="btn btn-sm btn-outline-danger"
          >
            <i className="ti ti-plus me-1" style={{ fontSize: 13 }} aria-hidden="true" />
            {t('btn.move_out')}
          </BasicButton>
        </div>

        {occupants.length === 0 ? (
          <div className="text-center text-body-secondary small py-4 bg-body-secondary rounded-2">
            {t('messages.no_data')}
          </div>
        ) : (
          <div className="card border">
            <div className="card-body py-1 px-3">
              {occupants.map((tenant, index) => (
                <OccupantRow
                  key={tenant.id}
                  tenant={tenant}
                  isLast={index === occupants.length - 1}
                  // onEdit={handleEdit}
                  onMoveOut={handleMoveOutModalOpen}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <MoveoutConfirmModal
        isOpen={modalMoveoutConfirm}
        onClose={() =>
          setModalMoveoutConfirm(false)
        }
        tenantId={tenantIdToMoveOut}
        roomId={room.id}
        onMoveOut={async () => {
          if (tenantIdToMoveOut) {
            await handleMoveOut(tenantIdToMoveOut)
          } else {
            await handleMoveOutAll()
          }
        }}
      />
    </div>
  )
}