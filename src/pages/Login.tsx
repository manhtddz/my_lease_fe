import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { setAuthenticated, clearAuthError } from '../reducers/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../reducers/hooks'
import { PasswordInput } from '../components/base-components/forms/inputs/PasswordInput'
import { BasicInput } from '../components/base-components/forms/inputs/BasicInput'
import { BasicButton } from '../components/base-components/buttons/BasicButton'
import { useTranslation } from 'react-i18next'
import { loginSchema } from '../validation/auth/loginSchema'
import { extractValidationErrors } from '../utils/form'
import { useLoginMutation } from '../services/rtk/authApiSlice'
import type { ApiError } from '../types/ex/ApiError'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ??
    '/'

  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
  const [login, { isLoading, error: serverError }] = useLoginMutation()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [localErrors, setLocalErrors] = useState<Record<string, string[]>>({})

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const serverErrorMessage =
    serverError ? ((serverError as ApiError).message ?? 'Đã có lỗi xảy ra.') : null

  async function handleSubmit() {
    setLocalErrors({})
    dispatch(clearAuthError())

    const result = loginSchema.safeParse(formData)
    if (!result.success) {
      setLocalErrors(extractValidationErrors(result.error))
      return
    }

    const loginResult = await login({
      email: String(formData.email).trim(),
      password: String(formData.password),
    })
    if (!('error' in loginResult)) {
      dispatch(setAuthenticated(loginResult.data))
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-body-secondary px-3 py-4">
      <div className="card shadow-sm w-100" style={{ maxWidth: 420 }}>
        <div className="card-body p-4">
          <h1 className="h4 text-center mb-4">{t('welcome')}</h1>

          {serverErrorMessage ? (
            <div className="alert alert-danger" role="alert">
              {serverErrorMessage}
            </div>
          ) : null}

          <BasicInput
            id="login-email"
            name="email"
            label={t('login.email')}
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            autoComplete="email"
            required
            disabled={isLoading}
            validationErrors={localErrors.email ? localErrors : {}}
          />
          <PasswordInput
            id="login-password"
            name="password"
            label={t('login.password')}
            autoComplete="current-password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={isLoading}
            validationErrors={localErrors.password ? localErrors : {}}
          />
          <BasicButton
            className="btn btn-primary w-100"
            onClick={handleSubmit}
            disabled={isLoading}
            children={isLoading ? t('login.loading') : t('login.submit')}
          />
        </div>
      </div>
    </div>
  )
}
