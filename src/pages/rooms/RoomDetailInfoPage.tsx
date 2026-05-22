import { RoomDetailBasicInfoTab } from '../../components/tab-content/rooms/RoomDetailBasicInfoTab'
import {
  useGetRoomByIdQuery,
  useGetCurrentOccupantsQuery,
  useMoveOutTenantMutation,
  useMoveOutAllMutation,
} from '../../services/rtk/roomApiSlice'
import { useParams } from 'react-router-dom'

export function RoomDetailInfoPage() {
  const params = useParams()
  const roomId = Number(params.roomId)
  const skip = !Number.isFinite(roomId)

  // Cache hit — RoomDetailPage đã fetch room này rồi
  const { data: room, isLoading: isRoomLoading } = useGetRoomByIdQuery(roomId, { skip })

  const { data: currentOccupants, isLoading: isOccupantsLoading } = useGetCurrentOccupantsQuery(
    roomId,
    { skip },
  )

  const [moveOutTenant] = useMoveOutTenantMutation()
  const [moveOutAll] = useMoveOutAllMutation()

  const handleMoveOut = async (tenantId: number) => {
    await moveOutTenant({ roomId, tenantId })
  }

  const handleMoveOutAll = async () => {
    await moveOutAll(roomId)
  }

  return (
    <RoomDetailBasicInfoTab
      room={room ?? null}
      currentOccupants={currentOccupants ?? null}
      isLoading={isRoomLoading || isOccupantsLoading}
      handleMoveOut={handleMoveOut}
      handleMoveOutAll={handleMoveOutAll}
    />
  )
}
