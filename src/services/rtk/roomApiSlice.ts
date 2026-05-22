import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../axiosBaseQuery'
import type { Room, RoomDataListParams, RoomDataListResult } from '../../types/RoomType'
import type { Tenant } from '../../types/TenantType'

export const roomRtkApi = createApi({
  reducerPath: 'roomRtkApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Room', 'RoomDetail', 'Occupants'],
  endpoints: (builder) => ({
    getRooms: builder.query<RoomDataListResult, RoomDataListParams | undefined>({
      query: (params) => ({ url: '/rooms', params }),
      providesTags: ['Room'],
    }),

    getRoomById: builder.query<Room, number>({
      query: (id) => ({ url: `/rooms/${id}` }),
      providesTags: (_result, _err, id) => [{ type: 'RoomDetail', id }],
    }),

    createRoom: builder.mutation<Room, Omit<Room, 'id'>>({
      query: (data) => ({ url: '/rooms', method: 'POST', data }),
      invalidatesTags: ['Room'],
    }),

    updateRoom: builder.mutation<Room, Room>({
      query: (data) => ({ url: `/rooms/${data.id}`, method: 'PUT', data }),
      invalidatesTags: (_result, _err, arg) => [
        'Room',
        { type: 'RoomDetail', id: arg.id },
      ],
    }),

    deleteRoom: builder.mutation<void, number>({
      query: (id) => ({ url: `/rooms/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Room'],
    }),

    getCurrentOccupants: builder.query<Tenant[], number>({
      query: (roomId) => ({ url: `/rooms/${roomId}/current-occupants` }),
      transformResponse: (response: { data: Tenant[] }) => response.data,
      providesTags: (_result, _err, roomId) => [{ type: 'Occupants', id: roomId }],
    }),

    moveOutTenant: builder.mutation<boolean, { roomId: number; tenantId: number }>({
      query: ({ roomId, tenantId }) => ({
        url: `/rooms/${roomId}/tenants/${tenantId}/move-out`,
        method: 'PUT',
      }),
      invalidatesTags: (_result, _err, { roomId }) => [
        { type: 'Occupants', id: roomId },
        { type: 'RoomDetail', id: roomId },
      ],
    }),

    moveOutAll: builder.mutation<boolean, number>({
      query: (roomId) => ({ url: `/rooms/${roomId}/move-out-all`, method: 'PUT' }),
      invalidatesTags: (_result, _err, roomId) => [
        { type: 'Occupants', id: roomId },
        { type: 'RoomDetail', id: roomId },
      ],
    }),
  }),
})

export const {
  useGetRoomsQuery,
  useGetRoomByIdQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useGetCurrentOccupantsQuery,
  useMoveOutTenantMutation,
  useMoveOutAllMutation,
} = roomRtkApi
