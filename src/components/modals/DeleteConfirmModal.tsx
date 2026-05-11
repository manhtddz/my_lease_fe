import { useCallback } from 'react'
import { Modal } from './Modal'
import { useAppDispatch } from '../../reducers/hooks'
import { deleteUserThunk } from '../../reducers/userSlice'

type Props = {
  isOpen: boolean
  onClose: () => void
  userId: number
  domainObject: string
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  userId,
  domainObject,
}: Props) {
  const dispatch = useAppDispatch()

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const onDelete = async () => {
    await dispatch(deleteUserThunk(userId))
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
            Huỷ
          </button>
          <button type="button" className="btn btn-danger" onClick={onDelete}>
            Xóa
          </button>
        </>
      }
    >
      <p className="mb-0">
        Xóa đối tượng {domainObject} số {userId} này không?
      </p>
    </Modal>
  )
}
