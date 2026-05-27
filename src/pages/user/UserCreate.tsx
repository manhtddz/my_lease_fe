import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BasicInput } from '../../components/base-components/forms/inputs/BasicInput'
import { PasswordInput } from '../../components/base-components/forms/inputs/PasswordInput'
import { BasicButton } from '../../components/base-components/buttons/BasicButton'
import { Select } from '../../components/base-components/forms/inputs/Select'
import { useTranslation } from 'react-i18next'
import { extractValidationErrors, extractValidationServerErrors } from '../../utils/form'
import { userSchema } from '../../validation/users/userSchema'
import { UserStatusEnum } from '../../types/enums/users/UserStatus'
import { useCreateUserMutation } from '../../services/rtk/userApiSlice'
import type { ApiError } from '../../types/ex/ApiError'

export function UserCreatePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [createUser, { isLoading, error: serverError, reset }] = useCreateUserMutation()

  const serverValidationErrors =
    serverError && (serverError as ApiError).status === 422
      ? (serverError as ApiError).errors ?? null
      : null

  const [formData, setFormData] = useState({ name: '', email: '', password: '', status: '' })
  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>({})

  const statusOptions = useMemo(() => {
    return Object.entries(UserStatusEnum).map(([key, value]) => ({
      value: key,
      label: t(value),
    }))
  }, [t])

  const translatedServerErrors = useMemo(() => {
    if (!serverValidationErrors) return {}
    return extractValidationServerErrors(serverValidationErrors, t)
  }, [serverValidationErrors, t])

  const displayErrors = { ...translatedServerErrors, ...clientErrors }

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  async function handleSubmit() {
    setClientErrors({})
    reset()

    const result = userSchema.safeParse(formData)
    if (!result.success) {
      setClientErrors(extractValidationErrors(result.error))
      return
    }

    const createResult = await createUser(result.data)
    if (!('error' in createResult)) {
      navigate('/users', { replace: true })
    }
  }

  const generalError =
    serverError && (serverError as ApiError).status !== 422
      ? ((serverError as ApiError).message ?? 'Đã có lỗi xảy ra.')
      : null

  return (
    <>
      <h1 className="h3 mb-2">Thêm người dùng</h1>
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
          id="create-name"
          name="name"
          label={t('user.name')}
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isLoading}
          validationErrors={displayErrors.name ? displayErrors : {}}
        />
        <BasicInput
          id="create-email"
          name="email"
          label={t('user.email')}
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading}
          validationErrors={displayErrors.email ? displayErrors : {}}
        />
        <PasswordInput
          id="create-password"
          name="password"
          label={t('user.password')}
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={isLoading}
          validationErrors={displayErrors.password ? displayErrors : {}}
          showPasswordToggle={false}
        />
        <Select
          isSearch={true}
          value={formData.status}
          options={statusOptions}
          placeholder={t('user.status')}
          name="status"
          onChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
          validationErrors={displayErrors.status ? displayErrors : {}}
          showError={true}
        />
        <div className="d-flex flex-wrap gap-2 mt-4">
          <BasicButton
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isLoading}
            children={isLoading ? t('saving') : t('create')}
          />
          <Link className="btn btn-outline-secondary" to="/users">
            {t('cancel')}
          </Link>
        </div>
      </form>
    </>
  )
}
