import { axiosInstance } from './apiInstance';
import type { Tenant, TenantDataListParams, TenantDataListResult } from '../types/TenantType';

export const tenantApi = {
  async getTenantDataList(params?: TenantDataListParams): Promise<TenantDataListResult> {
    const response = await axiosInstance.get<TenantDataListResult>('/tenants', { params });
    return response.data;
  },

  async getTenantById(id: number): Promise<Tenant> {
    const response = await axiosInstance.get<Tenant>(`/tenants/${id}`);
    return response.data;
  },

  async createTenant(payload: Omit<Tenant, 'id'>): Promise<Tenant> {
    const response = await axiosInstance.post<Tenant>('/tenants', payload);
    return response.data;
  },

  async updateTenant(id: number, payload: Tenant): Promise<Tenant> {
    const response = await axiosInstance.put<Tenant>(`/tenants/${id}`, payload);
    return response.data;
  },

  async deleteTenantById(id: number): Promise<Tenant> {
    const response = await axiosInstance.delete<Tenant>(`/tenants/${id}`);
    return response.data;
  }
};