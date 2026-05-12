import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { clearAuthError, loginThunk } from '../reducers/authSlice'
import { useAppDispatch, useAppSelector } from '../reducers/hooks'
import { PasswordInput } from '../components/forms/inputs/PasswordInput'
import { BasicInput } from '../components/forms/BasicInput'
import { BasicButton } from '../components/buttons/BasicButton'
import { useTranslation } from 'react-i18next'
import { loginSchema } from '../validation/auth/loginSchema'
import { extractValidationErrors } from '../utils/form'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ??
    '/'

  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
  const isLoading = useAppSelector((s) => s.auth.isLoading)
  const error = useAppSelector((s) => s.auth.error)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [localErrors, setLocalErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    dispatch(clearAuthError())
    return () => {
      dispatch(clearAuthError())
    }
  }, [dispatch])

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit() {
    setLocalErrors({});

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors = extractValidationErrors(result.error, t);

      setLocalErrors(formattedErrors);
      return;
    }

    const email = String(formData.email).trim()
    const password = String(formData.password)

    const loginResult = await dispatch(loginThunk({ email, password }))
    if (loginThunk.fulfilled.match(loginResult)) {
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-body-secondary px-3 py-4">
      <div className="card shadow-sm w-100" style={{ maxWidth: 420 }}>
        <div className="card-body p-4">
          <h1 className="h4 text-center mb-4">{t('welcome')}</h1>

          {error ? (
            <div className="alert alert-danger" role="alert">
              {error}
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
