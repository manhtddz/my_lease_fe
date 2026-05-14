import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clearUsersError, createUserThunk } from '../../reducers/userSlice'
import { useAppDispatch, useAppSelector } from '../../reducers/hooks'
import { BasicInput } from '../../components/forms/BasicInput'
import { PasswordInput } from '../../components/forms/inputs/PasswordInput'
import { BasicButton } from '../../components/buttons/BasicButton'
import { PageLoadStatus } from '../../types/enums/PageLoadStatus'
import { Select } from '../../components/forms/inputs/Select'
import { useTranslation } from 'react-i18next'
import { extractValidationErrors, extractValidationServerErrors } from '../../utils/form'
import { userSchema } from '../../validation/users/userSchema'
import { UserStatusEnum } from '../../types/enums/users/UserStatus'

export function UserCreatePage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const status = useAppSelector((s) => s.users.status)
  const error = useAppSelector((s) => s.users.error)
  const serverValidationErrors = useAppSelector((s) => s.users.validationErrors)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', status: '' })
  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>({});

  const statusOptions = useMemo(() => {
    return Object.entries(UserStatusEnum).map(([key, value]) => ({
      value: key,
      label: t(value),
    }));
  }, [t]);

  const translatedServerErrors = useMemo(() => {
    if (!serverValidationErrors) return {};
    return extractValidationServerErrors(serverValidationErrors, t);
  }, [serverValidationErrors, t]);

  const displayErrors = {
    ...translatedServerErrors,
    ...clientErrors
  };

  useEffect(() => {
    dispatch(clearUsersError())
  }, [dispatch])

  async function handleSubmit() {
    setClientErrors({}); // Reset lỗi client cũ
    dispatch(clearUsersError()); // Reset lỗi server cũ

    const result = userSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors = extractValidationErrors(result.error);
      setClientErrors(formattedErrors);
      return;
    }

    const createResult = await dispatch(createUserThunk(formData))
    if (createUserThunk.fulfilled.match(createResult)) {
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
          label={t('user.name')}
          autoComplete="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={busy}
          validationErrors={displayErrors.name ? displayErrors : {}}
        />
        <BasicInput
          id="create-email"
          name="email"
          label={t('user.email')}
          autoComplete="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={busy}
          validationErrors={displayErrors.email ? displayErrors : {}}
        />
        <PasswordInput
          id="create-password"
          name="password"
          label={t('user.password')}
          autoComplete="new-password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          disabled={busy}
          validationErrors={displayErrors.password ? displayErrors : {}}
          showPasswordToggle={false}
        />
        {/* <Radio
          name="status"
          label={t('user.status')}
          options={[{ value: '1', label: 'Hoạt động' }, { value: '0', label: 'Không hoạt động' }]}
          value={formData.status}
          onChange={(value) => setFormData({ ...formData, status: Number(value) })}
        /> */}
        {/* <Checkbox
          name="status"
          label={t('user.status')}
          optionLabel="Hoạt động"
          value={formData.status === 1}
          onChange={(value) => setFormData({ ...formData, status: value ? 1 : 0 })}
        /> */}
        <Select
          isSearch={true}
          value={formData.status}
          options={statusOptions}
          placeholder={t('user.status')}
          name="status"
          onChange={(value) => setFormData({ ...formData, status: value })}
          validationErrors={displayErrors.status ? displayErrors : {}}
          showError={true}
        />
        <div className="d-flex flex-wrap gap-2 mt-4">
          <BasicButton
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={busy}
            children={busy ? t('saving') : t('create')}
          />
          <Link className="btn btn-outline-secondary" to="/users">
            {t('cancel')}
          </Link>
        </div>
      </form>
    </>
  )
}
