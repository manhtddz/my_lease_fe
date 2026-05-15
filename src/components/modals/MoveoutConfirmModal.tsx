import { useCallback } from 'react'
import { Modal } from './Modal'
import { useTranslation } from 'react-i18next'

type Props = {
  isOpen: boolean
  onClose: () => void
  tenantId?: number
  roomId: number
  onMoveOut: (tenantId: number) => Promise<void>
}

export function MoveoutConfirmModal({
  isOpen,
  onClose,
  tenantId,
  roomId,
  onMoveOut,
}: Props) {

  const { t } = useTranslation()

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const handleMoveOut = async () => {
    await onMoveOut(tenantId)
    handleClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Xác nhận chuyển đi"
      onClose={handleClose}
      footer={
        <>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
          >
            {t('btn.cancel')}
          </button>
          <button type="button" className="btn btn-danger" onClick={handleMoveOut}>
            {t('btn.move_out')}
          </button>
        </>
      }
    >
      <p className="mb-0">
        {tenantId ? `Chuyển đi người thuê phòng ${tenantId} khỏi phòng ${roomId} này không?` : `Chuyển đi tất cả người thuê khỏi phòng ${roomId} này không?`}
      </p>
    </Modal>
  )
}
