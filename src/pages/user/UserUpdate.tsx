import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { clearUsersError, fetchUserByIdThunk, updateUserThunk } from '../../reducers/userSlice'
import { useAppDispatch, useAppSelector } from '../../reducers/hooks'
import type { User } from '../../types/UserType'
import { userApi } from '../../services/user'

export function UserUpdatePage() {
  const { userId } = useParams<{ userId: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [user, setUser] = useState<User>({
    id: parseInt(userId),
    name: '',
    email: '',
    password: '',
  })

  const status = useAppSelector((s) => s.users.status)
  const error = useAppSelector((s) => s.users.error)
  const validationErrors = useAppSelector((s) => s.users.validationErrors)

  useEffect(() => {
    dispatch(clearUsersError())
    return () => {
      dispatch(clearUsersError())
    }
  }, [dispatch])

  useEffect(() => {
    const loadUser = async () => {
      const data = await userApi.getUserById(parseInt(userId)); // Gọi thẳng API từ service
      setUser(data);
    };

    loadUser();
  }, [userId]);

  useEffect(() => {
    dispatch(fetchUserByIdThunk(parseInt(userId)))
  }, [dispatch, userId])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const name = String(fd.get('name') ?? '').trim()
    const email = String(fd.get('email') ?? '').trim()
    const password = String(fd.get('password') ?? '')

    const result = await dispatch(
      updateUserThunk({ id: parseInt(userId), name, email, password }),
    )
    if (updateUserThunk.fulfilled.match(result)) {
      navigate('/users', { replace: true })
    }
  }

  const busy = status === 'loading'

  return (
    <>
      <h1 className="app-page-title">Sửa người dùng</h1>
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
            value={user?.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
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
            value={user?.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
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
            value={user?.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
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
            {busy ? 'Đang lưu…' : 'Sửa'}
          </button>
          <Link className="app-btn" to="/users">
            Hủy
          </Link>
        </div>
      </form>
    </>
  )
}
