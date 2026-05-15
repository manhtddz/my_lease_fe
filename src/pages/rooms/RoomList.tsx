import { PageLoadStatus } from '../../types/enums/PageLoadStatus'
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal'
import { BasicPaginator } from '../../components/paginators/BasicPaginator'
import { BasicButton } from '../../components/buttons/BasicButton'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useRoomList } from '../../hooks/room-hooks/useRoomList'
import { useRoomModalForm } from '../../hooks/room-hooks/useRoomModalForm'
import type { Room } from '../../types/RoomType'
import {
  clearRoomsError,
  createRoomThunk,
  deleteRoomThunk,
  updateRoomThunk,
} from '../../reducers/rooms/roomSlice'
import { useAppDispatch, useAppSelector } from '../../reducers/hooks'
import { RoomFormModal } from '../../components/modals/RoomFormModal'
import { RoomSearchForm } from '../../components/search-forms/RoomSearchForm'
import { RoomTypeEnum } from '../../types/enums/rooms/RoomType'
import { RoomStatusEnum } from '../../types/enums/rooms/RoomStatus'
import type { RoomFormData } from '../../validation/rooms/roomSchema'

export function RoomListPage() {
  const roomListHook = useRoomList()
  const roomModalForm = useRoomModalForm()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  // ── đọc state từ đúng slice ──
  const isLoading = useAppSelector((s) => s.rooms.status === PageLoadStatus.LOADING)
  const serverValidationErrors = useAppSelector((s) => s.rooms.validationErrors)

  const handleSubmit = async (data: RoomFormData): Promise<boolean> => {
    if (roomModalForm.editingRoom?.id !== undefined) {
      const result = await dispatch(updateRoomThunk({ ...data, id: roomModalForm.editingRoom.id }))
      return updateRoomThunk.fulfilled.match(result)
    }
    const result = await dispatch(createRoomThunk(data))
    return createRoomThunk.fulfilled.match(result)
  }

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Khách hàng</h1>
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
        onDelete={async (id) => { await roomListHook.dispatch(deleteRoomThunk(id)) }}
      />

      <RoomFormModal
        isOpen={roomModalForm.isModalOpen}
        onClose={() => roomModalForm.closeModal()}
        defaultValues={roomModalForm.editingRoom}
        editingId={roomModalForm.editingRoom?.id}
        isLoading={isLoading}
        serverValidationErrors={serverValidationErrors}
        onSubmit={handleSubmit}
        onClearErrors={() => dispatch(clearRoomsError())}
      />
    </>
  )
}