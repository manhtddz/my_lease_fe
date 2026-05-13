import { useCallback } from 'react'
import { Modal } from './Modal'
import { useTranslation } from 'react-i18next'

type Props = {
  isOpen: boolean
  onClose: () => void
  deleteId: number
  domainObject: string
  onDelete: (id: number) => Promise<void>
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  deleteId,
  domainObject,
  onDelete,
}: Props) {

  const { t } = useTranslation()

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const handleDelete = async () => {
    await onDelete(deleteId)
    handleClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Xóa dữ liệu"
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
          <button type="button" className="btn btn-danger" onClick={handleDelete}>
            {t('btn.delete')}
          </button>
        </>
      }
    >
      <p className="mb-0">
        Xóa đối tượng {domainObject} số {deleteId} này không?
      </p>
    </Modal>
  )
}
