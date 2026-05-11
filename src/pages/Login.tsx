import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { clearAuthError, loginThunk } from '../reducers/authSlice'
import { useAppDispatch, useAppSelector } from '../reducers/hooks'
import { PasswordInput } from '../components/forms/inputs/PasswordInput'
import { BasicInput } from '../components/forms/BasicInput'
import { BasicButton } from '../components/buttons/BasicButton'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ??
    '/'

  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
  const isLoading = useAppSelector((s) => s.auth.isLoading)
  const error = useAppSelector((s) => s.auth.error)
  const validationErrors = useAppSelector((s) => s.auth.validationErrors)
  const [formData, setFormData] = useState({ email: '', password: '' })

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
    const email = String(formData.email).trim()
    const password = String(formData.password)

    const result = await dispatch(loginThunk({ email, password }))
    if (loginThunk.fulfilled.match(result)) {
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-body-secondary px-3 py-4">
      <div className="card shadow-sm w-100" style={{ maxWidth: 420 }}>
        <div className="card-body p-4">
          <h1 className="h4 text-center mb-4">Đăng nhập</h1>

          {error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : null}

          <BasicInput
            id="login-email"
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            autoComplete="email"
            required
            disabled={isLoading}
            validationErrors={validationErrors ? { email: validationErrors.email } : {}}
          />
          <PasswordInput
            id="login-password"
            name="password"
            label="Mật khẩu"
            autoComplete="current-password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={isLoading}
            validationErrors={validationErrors ? { password: validationErrors.password } : {}}
          />
          <BasicButton
            className="btn btn-primary w-100"
            onClick={handleSubmit}
            disabled={isLoading}
            children={isLoading ? 'Đang đăng nhập…' : 'Đăng nhập'}
          />
        </div>
      </div>
    </div>
  )
}
