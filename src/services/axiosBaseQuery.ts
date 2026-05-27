import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import type { AxiosRequestConfig } from 'axios'
import { axiosInstance } from './apiInstance'
import { axiosErrorToApiError } from '../utils/thunks'
import type { ApiError } from '../types/ex/ApiError'

export type AxiosBaseQueryArgs = {
  url: string
  method?: AxiosRequestConfig['method']
  data?: unknown
  params?: unknown
}

export const axiosBaseQuery: BaseQueryFn<AxiosBaseQueryArgs, unknown, ApiError> = async ({
  url,
  method = 'GET',
  data,
  params,
}) => {
  try {
    const result = await axiosInstance({ url, method, data, params })
    return { data: result.data }
  } catch (err) {
    return { error: axiosErrorToApiError(err) }
  }
}
