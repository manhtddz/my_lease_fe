import { axiosInstance } from './apiInstance';
import type { User, UserDataListParams, UserDataListResult } from '../types/UserType';

export const userApi = {
  async getUserDataList(params?: UserDataListParams): Promise<UserDataListResult> {
    const response = await axiosInstance.get<UserDataListResult>('/users', { params });
    return response.data;
  },

  async getUserById(id: number): Promise<User> {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  },

  async createUser(payload: Omit<User, 'id'>): Promise<User> {
    const response = await axiosInstance.post<User>('/users', payload);
    return response.data;
  },

  async updateUser(id: number, payload: User): Promise<User> {
    const response = await axiosInstance.put<User>(`/users/${id}`, payload);
    return response.data;
  },

  async deleteUserById(id: number): Promise<User> {
    const response = await axiosInstance.delete<User>(`/users/${id}`);
    return response.data;
  }
};