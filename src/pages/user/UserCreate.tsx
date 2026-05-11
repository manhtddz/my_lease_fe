import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clearUsersError, createUserThunk } from '../../reducers/userSlice'
import { useAppDispatch, useAppSelector } from '../../reducers/hooks'
import { BasicInput } from '../../components/forms/BasicInput'
import { PasswordInput } from '../../components/forms/inputs/PasswordInput'
import { BasicButton } from '../../components/buttons/BasicButton'
import { PageLoadStatus } from '../../types/enums/PageLoadStatus'
import { Select } from '../../components/forms/inputs/Select'

export function UserCreatePage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const status = useAppSelector((s) => s.users.status)
  const error = useAppSelector((s) => s.users.error)
  const validationErrors = useAppSelector((s) => s.users.validationErrors)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', status: undefined })

  useEffect(() => {
    dispatch(clearUsersError())
    return () => {
      dispatch(clearUsersError())
    }
  }, [dispatch])

  async function handleSubmit() {
    const name = String(formData.name).trim()
    const email = String(formData.email).trim()
    const password = String(formData.password)
    const status = Number(formData.status)

    const result = await dispatch(createUserThunk({ name, email, password, status }))
    if (createUserThunk.fulfilled.match(result)) {
      navigate('/users', { replace: true })
    }
  }

  const busy = status === PageLoadStatus.LOADING

  return (
    <>
      <h1 className="h3 mb-2">Thêm người dùng</h1>
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
          id="create-name"
          name="name"
          label="Tên"
          autoComplete="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={busy}
          validationErrors={validationErrors ? { name: validationErrors.name } : { name: [] }}
        />
        <BasicInput
          id="create-email"
          name="email"
          label="Email"
          autoComplete="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={busy}
          validationErrors={validationErrors ? { email: validationErrors.email } : { email: [] }}
        />
        <PasswordInput
          id="create-password"
          name="password"
          label="Mật khẩu"
          autoComplete="new-password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          disabled={busy}
          validationErrors={validationErrors ? { password: validationErrors.password } : { password: [] }}
          showPasswordToggle={false}
        />
        {/* <Radio
          name="status"
          label="Trạng thái"
          options={[{ value: '1', label: 'Hoạt động' }, { value: '0', label: 'Không hoạt động' }]}
          value={formData.status}
          onChange={(value) => setFormData({ ...formData, status: Number(value) })}
        /> */}
        {/* <Checkbox
          name="status"
          label="Trạng thái"
          optionLabel="Hoạt động"
          value={formData.status === 1}
          onChange={(value) => setFormData({ ...formData, status: value ? 1 : 0 })}
        /> */}
        <Select
          isSearch={true}
          value={formData.status}
          options={[{ value: '1', label: 'Hoạt động' }, { value: '0', label: 'Không hoạt động' }]}
          placeholder="Chọn trạng thái"
          name="status"
          onChange={(value) => setFormData({ ...formData, status: value })}
          validationErrors={validationErrors ? { status: validationErrors.status } : { status: [] }}
          showError={true}
        />
        <div className="d-flex flex-wrap gap-2 mt-4">
          <BasicButton
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={busy}
            children={busy ? 'Đang lưu…' : 'Tạo'}
          />
          <Link className="btn btn-outline-secondary" to="/users">
            Hủy
          </Link>
        </div>
      </form>
    </>
  )
}
