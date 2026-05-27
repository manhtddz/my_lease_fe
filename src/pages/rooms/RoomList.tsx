import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal'
import { BasicPaginator } from '../../components/base-components/paginators/BasicPaginator'
import { BasicButton } from '../../components/base-components/buttons/BasicButton'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useRoomList } from '../../hooks/room-hooks/useRoomList'
import { useRoomModalForm } from '../../hooks/room-hooks/useRoomModalForm'
import type { Room } from '../../types/RoomType'
import { RoomFormModal } from '../../components/modals/RoomFormModal'
import { RoomSearchForm } from '../../components/search-forms/RoomSearchForm'
import { RoomTypeEnum } from '../../types/enums/rooms/RoomType'
import { RoomStatusEnum } from '../../types/enums/rooms/RoomStatus'
import type { RoomFormData } from '../../validation/rooms/roomSchema'
import {
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} from '../../services/rtk/roomApiSlice'
import type { ApiError } from '../../types/ex/ApiError'
import { PageLoadStatus } from '../../types/enums/PageLoadStatus'

export function RoomListPage() {
  const roomListHook = useRoomList()
  const roomModalForm = useRoomModalForm()
  const { t } = useTranslation()

  const [createRoom, { isLoading: isCreating, error: createError, reset: resetCreate }] = useCreateRoomMutation()
  const [updateRoom, { isLoading: isUpdating, error: updateError, reset: resetUpdate }] = useUpdateRoomMutation()
  const [deleteRoom] = useDeleteRoomMutation()

  const isMutating = isCreating || isUpdating
  const activeError = updateError ?? createError
  const serverValidationErrors =
    activeError && (activeError as ApiError).status === 422
      ? (activeError as ApiError).errors ?? null
      : null

  const handleSubmit = async (data: RoomFormData): Promise<boolean> => {
    if (roomModalForm.editingRoom?.id !== undefined) {
      const result = await updateRoom({ ...data, id: roomModalForm.editingRoom.id })
      return !('error' in result)
    }
    const result = await createRoom(data)
    return !('error' in result)
  }

  const handleClearErrors = () => {
    resetCreate()
    resetUpdate()
  }

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Phòng</h1>
          <p className="text-body-secondary small mb-0">
            {t('messages.total_records', { total: roomListHook.total })}
          </p>
        </div>
        <BasicButton
          onClick={() => roomModalForm.openCreateModal()}
          disabled={
            roomListHook.status === PageLoadStatus.LOADING ||
            roomListHook.showLoadingPlaceholder ||
            roomModalForm.isModalOpen
          }
          className="btn btn-primary"
        >
          {t('btn.create')}
        </BasicButton>
      </div>

      <RoomSearchForm onSearch={roomListHook.handleSubmit} />

      {roomListHook.error ? (
        <div className="alert alert-danger" role="alert">
          {roomListHook.error}
        </div>
      ) : null}

      <div className="table-responsive border rounded">
        <table className="table table-hover table-striped mb-0 align-middle">
          <thead className="table-light">
            <tr>
              <th role="button" className="user-select-none" onClick={() => roomListHook.handleSort('id')}>
                {roomListHook.sortBy === 'id' ? (roomListHook.sortDir === 'asc' ? '▲ ' : '▼ ') : '↕ '}
                ID
              </th>
              <th role="button" className="user-select-none" onClick={() => roomListHook.handleSort('room_number')}>
                {roomListHook.sortBy === 'room_number' ? (roomListHook.sortDir === 'asc' ? '▲ ' : '▼ ') : '↕ '}
                {t('models.room.room_number')}
              </th>
              <th>{t('models.room.floor')}</th>
              <th>{t('models.room.room_type')}</th>
              <th>{t('models.room.room_price')}</th>
              <th>{t('models.room.max_occupants')}</th>
              <th>{t('models.room.status')}</th>
              <th>{t('tables.table_header.action')}</th>
            </tr>
          </thead>
          <tbody>
            {roomListHook.showLoadingPlaceholder ? (
              <tr>
                <td colSpan={8} className="text-center py-5 text-body-secondary">{t('btn.loading')}</td>
              </tr>
            ) : roomListHook.list.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-5 text-body-secondary">{t('messages.no_data')}</td>
              </tr>
            ) : (
              roomListHook.list.map((r: Room) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.room_number}</td>
                  <td>{r.floor}</td>
                  <td>{t(RoomTypeEnum[r.room_type])}</td>
                  <td>{r.room_price}</td>
                  <td>{r.max_occupants}</td>
                  <td>{t(RoomStatusEnum[r.status])}</td>
                  <td className="text-nowrap">
                    <Link className="btn btn-outline-secondary btn-sm me-2" to={`/rooms/detail/${r.id}`}>
                      {t('btn.detail')}
                    </Link>
                    <BasicButton
                      onClick={() => { void roomModalForm.openEditModal(r.id) }}
                      disabled={
                        roomListHook.status === PageLoadStatus.LOADING ||
                        roomListHook.showLoadingPlaceholder ||
                        roomModalForm.isModalOpen
                      }
                      className="btn btn-outline-secondary btn-sm me-2"
                    >
                      {t('btn.edit')}
                    </BasicButton>
                    <BasicButton
                      onClick={() => roomListHook.modalDeleteConfirm.handleDelete(r.id)}
                      disabled={
                        roomListHook.status === PageLoadStatus.LOADING ||
                        roomListHook.showLoadingPlaceholder
                      }
                      className="btn btn-outline-danger btn-sm"
                    >
                      {t('btn.delete')}
                    </BasicButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <BasicPaginator
        effectivePage={roomListHook.effectivePage}
        pageCount={roomListHook.pageCount}
        status={roomListHook.status}
        showLoadingPlaceholder={roomListHook.showLoadingPlaceholder}
        setPageIndex={roomListHook.setPage}
      />

      <DeleteConfirmModal
        isOpen={roomListHook.modalDeleteConfirm.isDeleteModalOpen}
        onClose={() => roomListHook.modalDeleteConfirm.setIsDeleteModalOpen(false)}
        deleteId={roomListHook.modalDeleteConfirm.deleteId}
        domainObject="room"
        onDelete={async (id) => { await deleteRoom(id) }}
      />

      <RoomFormModal
        isOpen={roomModalForm.isModalOpen}
        onClose={() => roomModalForm.closeModal()}
        defaultValues={roomModalForm.editingRoom}
        editingId={roomModalForm.editingRoom?.id}
        isLoading={isMutating}
        serverValidationErrors={serverValidationErrors}
        onSubmit={handleSubmit}
        onClearErrors={handleClearErrors}
      />
    </>
  )
}
