import { type FormEvent, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clearUsersError, createUserThunk } from '../../reducers/userSlice'
import { useAppDispatch, useAppSelector } from '../../reducers/hooks'

export function UserCreatePage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const status = useAppSelector((s) => s.users.status)
  const error = useAppSelector((s) => s.users.error)
  const validationErrors = useAppSelector((s) => s.users.validationErrors)

  useEffect(() => {
    dispatch(clearUsersError())
    return () => {
      dispatch(clearUsersError())
    }
  }, [dispatch])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const name = String(fd.get('name') ?? '').trim()
    const email = String(fd.get('email') ?? '').trim()
    const password = String(fd.get('password') ?? '')

    const result = await dispatch(
      createUserThunk({ name, email, password }),
    )
    if (createUserThunk.fulfilled.match(result)) {
      navigate('/users', { replace: true })
    }
  }

  const busy = status === 'loading'

  return (
    <>
      <h1 className="app-page-title">Thêm người dùng</h1>
      <p className="app-muted">Cập nhật chỉnh sửa sẽ bổ sung sau.</p>

      {error && status === 'failed' && (
        <div className="app-alert app-alert--error" role="alert">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: 440 }}
      >
        <div className="app-field">
          <label htmlFor="create-name">Tên</label>
          <input
            id="create-name"
            name="name"
            autoComplete="name"
            required
            disabled={busy}
          />
          {validationErrors?.name?.[0] && (
            <div className="app-field-error">{validationErrors.name[0]}</div>
          )}
        </div>
        <div className="app-field">
          <label htmlFor="create-email">Email</label>
          <input
            id="create-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={busy}
          />
          {validationErrors?.email?.[0] && (
            <div className="app-field-error">{validationErrors.email[0]}</div>
          )}
        </div>
        <div className="app-field">
          <label htmlFor="create-password">Mật khẩu</label>
          <input
            id="create-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            disabled={busy}
          />
          {validationErrors?.password?.[0] && (
            <div className="app-field-error">{validationErrors.password[0]}</div>
          )}
        </div>
        <div className="app-form-actions">
          <button
            type="submit"
            className="app-btn app-btn--primary"
            style={{ width: 'auto', minWidth: 120 }}
            disabled={busy}
          >
            {busy ? 'Đang lưu…' : 'Tạo'}
          </button>
          <Link className="app-btn" to="/users">
            Hủy
          </Link>
        </div>
      </form>
    </>
  )
}
