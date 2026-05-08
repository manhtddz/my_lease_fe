import type { PublicUser } from '../types/UserType'
import { axiosInstance } from './apiInstance';

export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<PublicUser> => {
    const response = await axiosInstance.post<PublicUser>('/auth/login', credentials);
    return response.data;
  },
}
