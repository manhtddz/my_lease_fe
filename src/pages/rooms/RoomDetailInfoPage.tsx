import { useAppDispatch, useAppSelector } from '../../reducers/hooks'
import { RoomDetailBasicInfoTab } from '../../components/tab-content/rooms/RoomDetailBasicInfoTab'
import { fetchCurrentOccupantsByIdThunk, moveOutAllThunk, moveOutTenantThunk, removeAllOccupants } from '../../reducers/rooms/roomDetailSlice'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export function RoomDetailInfoPage() {
  const room = useAppSelector((s) => s.roomDetail.room)
  const currentOccupants = useAppSelector((s) => s.roomDetail.currentOccupants)
  const isLoading = useAppSelector((s) => s.roomDetail.isLoading)
  const dispatch = useAppDispatch()
  const params = useParams()

  useEffect(() => {
    const id = Number(params.roomId)
    if (!Number.isFinite(id)) return
    void dispatch(fetchCurrentOccupantsByIdThunk(id))
  }, [dispatch, params.roomId])

  const handleMoveOut = async (tenantId: number) => {
    const result = await dispatch(moveOutTenantThunk({ roomId: room.id, tenantId }))

    if (moveOutTenantThunk.fulfilled.match(result)) {
      void dispatch(fetchCurrentOccupantsByIdThunk(room.id))
    }
  }

  const handleMoveOutAll = async () => {
    const result = await dispatch(moveOutAllThunk({ roomId: room.id }))
    if (moveOutAllThunk.fulfilled.match(result)) {
      void dispatch(removeAllOccupants())
    }
  }

  return <RoomDetailBasicInfoTab
    room={room}
    currentOccupants={currentOccupants}
    isLoading={isLoading} handleMoveOut={handleMoveOut} 
    handleMoveOutAll={handleMoveOutAll}
  />
}
