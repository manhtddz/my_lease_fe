import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { User } from '../../types/UserType'
import { BasicInput } from '../../components/base-components/forms/inputs/BasicInput'
import { PasswordInput } from '../../components/base-components/forms/inputs/PasswordInput'
import { BasicButton } from '../../components/base-components/buttons/BasicButton'
import { Checkbox } from '../../components/base-components/forms/inputs/Checkbox'
import { useGetUserByIdQuery, useUpdateUserMutation } from '../../services/rtk/userApiSlice'
import type { ApiError } from '../../types/ex/ApiError'

export function UserUpdatePage() {
  const { userId: userIdParam } = useParams<{ userId: string }>()
  const userIdNum = userIdParam ? parseInt(userIdParam, 10) : NaN
  const navigate = useNavigate()

  const { data: fetchedUser } = useGetUserByIdQuery(userIdNum, {
    skip: !Number.isFinite(userIdNum),
  })

  const [updateUser, { isLoading, error: serverError, reset }] = useUpdateUserMutation()

  const validationErrors =
    serverError && (serverError as ApiError).status === 422
      ? (serverError as ApiError).errors ?? null
      : null

  const [user, setUser] = useState<User>({
    id: Number.isFinite(userIdNum) ? userIdNum : 0,
    name: '',
    email: '',
    password: '',
    status: '',
  })

  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser)
    }
  }, [fetchedUser])

  async function handleSubmit() {
    reset()
    const result = await updateUser({
      id: userIdNum,
      name: String(user.name).trim(),
      email: String(user.email).trim(),
      password: String(user.password),
      status: String(user.status),
    })
    if (!('error' in result)) {
      navigate('/users', { replace: true })
    }
  }

  const generalError =
    serverError && (serverError as ApiError).status !== 422
      ? ((serverError as ApiError).message ?? 'Đã có lỗi xảy ra.')
      : null

  return (
    <>
      <h1 className="h3 mb-2">Sửa người dùng</h1>
      <p className="text-body-secondary mb-4">
        Cập nhật chỉnh sửa sẽ bổ sung sau.
      </p>

      {generalError ? (
        <div className="alert alert-danger" role="alert">
          {generalError}
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
          disabled={isLoading}
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
          disabled={isLoading}
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
          disabled={isLoading}
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
            disabled={isLoading}
            children={isLoading ? 'Đang lưu…' : 'Sửa'}
          />
          <Link className="btn btn-outline-secondary" to="/users">
            Hủy
          </Link>
        </div>
      </form>
    </>
  )
}
