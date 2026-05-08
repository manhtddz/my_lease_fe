import { type FormEvent, useEffect } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { clearAuthError, loginThunk } from '../reducers/authSlice'
import { useAppDispatch, useAppSelector } from '../reducers/hooks'

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

  useEffect(() => {
    dispatch(clearAuthError())
    return () => {
      dispatch(clearAuthError())
    }
  }, [dispatch])

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const email = String(fd.get('email') ?? '').trim()
    const password = String(fd.get('password') ?? '')

    const result = await dispatch(
      loginThunk({ email, password }),
    )
    if (loginThunk.fulfilled.match(result)) {
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="app-auth-center">
      <div className="app-card">
        <h1>Đăng nhập</h1>

        {error && (
          <div className="app-alert app-alert--error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="app-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isLoading}
            />
            {validationErrors?.email?.[0] && (
              <div className="app-field-error">{validationErrors.email[0]}</div>
            )}
          </div>
          <div className="app-field">
            <label htmlFor="login-password">Mật khẩu</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={isLoading}
            />
            {validationErrors?.password?.[0] && (
              <div className="app-field-error">{validationErrors.password[0]}</div>
            )}
          </div>
          <button
            type="submit"
            className="app-btn app-btn--primary"
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng nhập…' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  )
}
