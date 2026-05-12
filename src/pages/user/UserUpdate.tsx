import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  clearUsersError,
  fetchUserByIdThunk,
  updateUserThunk,
} from '../../reducers/userSlice'
import { useAppDispatch, useAppSelector } from '../../reducers/hooks'
import type { User } from '../../types/UserType'
import { userApi } from '../../services/user'
import { BasicInput } from '../../components/forms/BasicInput'
import { PasswordInput } from '../../components/forms/inputs/PasswordInput'
import { BasicButton } from '../../components/buttons/BasicButton'
import { PageLoadStatus } from '../../types/enums/PageLoadStatus'
import { Checkbox } from '../../components/forms/inputs/Checkbox'

export function UserUpdatePage() {
  const { userId: userIdParam } = useParams<{ userId: string }>()
  const userIdNum = userIdParam ? parseInt(userIdParam, 10) : NaN
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [user, setUser] = useState<User>({
    id: Number.isFinite(userIdNum) ? userIdNum : 0,
    name: '',
    email: '',
    password: '',
    status: '',
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
    if (!Number.isFinite(userIdNum)) return
    const loadUser = async () => {
      const data = await userApi.getUserById(userIdNum)
      setUser(data)
    }
    void loadUser()
  }, [userIdNum])

  useEffect(() => {
    if (!Number.isFinite(userIdNum)) return
    void dispatch(fetchUserByIdThunk(userIdNum))
  }, [dispatch, userIdNum])

  async function handleSubmit() {
    const name = String(user.name).trim()
    const email = String(user.email).trim()
    const password = String(user.password)
    const status = String(user.status)

    const result = await dispatch(
      updateUserThunk({ id: userIdNum, name, email, password, status }),
    )
    if (updateUserThunk.fulfilled.match(result)) {
      navigate('/users', { replace: true })
    }
  }

  const busy = status === PageLoadStatus.LOADING

  return (
    <>
      <h1 className="h3 mb-2">Sửa người dùng</h1>
      <p className="text-body-secondary mb-4">
        Cập nhật chỉnh sửa sẽ bổ sung sau.
      </p>

      {error && status === PageLoadStatus.FAILED ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : null}

      <form
        className="mx-auto"
        style={{ maxWidth: 440 }}
      >
        <BasicInput
          id="update-name"
          name="name"
          label="Tên"
          autoComplete="name"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          required
          disabled={busy}
          validationErrors={validationErrors ? { name: validationErrors.name } : { name: [] }}
        />
        <BasicInput
          id="update-email"
          name="email"
          label="Email"
          autoComplete="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
          disabled={busy}
          validationErrors={validationErrors ? { email: validationErrors.email } : { email: [] }}
        />
        <PasswordInput
          id="update-password"
          name="password"
          label="Mật khẩu"
          autoComplete="new-password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          required
          disabled={busy}
          validationErrors={validationErrors ? { password: validationErrors.password } : { password: [] }}
          showPasswordToggle={false}
        />
        <Checkbox
          name="status"
          label="Trạng thái"
          optionLabel="Hoạt động"
          value={user.status === '1'}
          onChange={(value) => setUser({ ...user, status: value ? '1' : '0' })}
        />
        <div className="d-flex flex-wrap gap-2 mt-4">
          <BasicButton
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={busy}
            children={busy ? 'Đang lưu…' : 'Sửa'}
          />
          <Link className="btn btn-outline-secondary" to="/users">
            Hủy
          </Link>
        </div>
      </form>
    </>
  )
}
