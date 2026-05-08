import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import type { ApiError } from '../types/ex/ApiError'

type AxiosErrorBody = {
  message?: string
  errors?: Record<string, string[]>
}

function parseAxiosErrorBody(data: unknown): AxiosErrorBody {
  if (!data || typeof data !== 'object') return {}
  const o = data as Record<string, unknown>
  const errors = o.errors
  return {
    message: typeof o.message === 'string' ? o.message : undefined,
    errors:
      errors && typeof errors === 'object' && !Array.isArray(errors)
        ? (errors as Record<string, string[]>)
        : undefined,
  }
}

/** Map Axios/Mock Adapter errors sang `ApiError` dùng chung trong slice (`reject`). */
export function axiosErrorToApiError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status ?? 0
    const { message: bodyMessage, errors } = parseAxiosErrorBody(err.response?.data)
    return {
      status: status || 500,
      message: bodyMessage ?? err.message ?? 'Đã có lỗi xảy ra.',
      ...(errors !== undefined ? { errors } : {}),
    }
  }
  if (err instanceof Error) {
    return {
      status: 500,
      message: err.message || 'Đã có lỗi xảy ra.',
    }
  }
  return {
    status: 500,
    message: 'Đã có lỗi xảy ra.',
  }
}

export const createApiThunk = <Returned, ThunkArg = void>(
  typePrefix: string,
  fn: (arg: ThunkArg, getState: () => unknown) => Promise<Returned>,
) =>
  createAsyncThunk<Returned, ThunkArg, { rejectValue: ApiError }>(
    typePrefix,
    async (arg, { rejectWithValue, getState }) => {
      try {
        return await fn(arg, getState)
      } catch (err: unknown) {
        return rejectWithValue(axiosErrorToApiError(err))
      }
    },
  )
