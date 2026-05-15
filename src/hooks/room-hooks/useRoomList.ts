import { useBaseList } from "../base/useBaseList"
import type { RoomDataListParams, RoomSearchForm } from "../../types/RoomType"
import { fetchRoomsThunk } from "../../reducers/rooms/roomSlice"

const initialSearchForm: RoomSearchForm = { room_number: '', room_type: [], status: [] }

export function useRoomList() {

    return useBaseList<RoomSearchForm, RoomDataListParams>({
        initialSearchForm,
        selectSlice: (s) => s.rooms,
        fetchThunk: fetchRoomsThunk,
        buildParams: (base, searchForm): RoomDataListParams => ({
            page: base.page,
            size: base.pageSize,
            sort_by: base.sortBy as RoomDataListParams['sort_by'],
            sort_dir: base.sortDir as RoomDataListParams['sort_dir'],
            room_number: searchForm.room_number,
            room_type: searchForm.room_type,
            status: searchForm.status,
        })
    })
}