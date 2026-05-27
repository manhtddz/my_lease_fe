import { axiosInstance } from './apiInstance';
import type { Room, RoomDataListParams, RoomDataListResult } from '../types/RoomType';
import type { Tenant } from '../types/TenantType';

export const roomApi = {
  async getRoomDataList(params?: RoomDataListParams): Promise<RoomDataListResult> {
    const response = await axiosInstance.get<RoomDataListResult>('/rooms', { params });
    return response.data;
  },

  async getRoomById(id: number): Promise<Room> {
    const response = await axiosInstance.get<Room>(`/rooms/${id}`);
    return response.data;
  },

  async createRoom(payload: Omit<Room, 'id'>): Promise<Room> {
    const response = await axiosInstance.post<Room>('/rooms', payload);
    return response.data;
  },

  async updateRoom(id: number, payload: Room): Promise<Room> {
    const response = await axiosInstance.put<Room>(`/rooms/${id}`, payload);
    return response.data;
  },

  async deleteRoomById(id: number): Promise<Room> {
    const response = await axiosInstance.delete<Room>(`/rooms/${id}`);
    return response.data;
  },

  async getCurrentOccupantsById(id: number): Promise<Tenant[]> {
    const response = await axiosInstance.get<{ data: Tenant[] }>(`/rooms/${id}/current-occupants`);
    return response.data.data;
  },

  async moveOutTenant(roomId: number, tenantId: number): Promise<boolean> {
    const response = await axiosInstance.put<boolean>(`/rooms/${roomId}/tenants/${tenantId}/move-out`);
    return response.data;
  },

  async moveOutAll(roomId: number): Promise<boolean> {
    const response = await axiosInstance.put<boolean>(`/rooms/${roomId}/move-out-all`);
    return response.data;
  },
};