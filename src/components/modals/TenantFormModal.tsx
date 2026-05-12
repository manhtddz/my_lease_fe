import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../reducers/hooks"
import type { TenantFormData } from "../../validation/tenants/tenantSchema"
import { tenantSchema } from "../../validation/tenants/tenantSchema"
import { clearTenantsError, createTenantThunk, updateTenantThunk } from "../../reducers/tenantSlice"
import { Modal } from "./Modal"
import { extractValidationErrors, extractValidationServerErrors } from "../../utils/form"
import { useTranslation } from "react-i18next"
import { BasicButton } from "../buttons/BasicButton"
import { PageLoadStatus } from "../../types/enums/PageLoadStatus"
import { BasicInput } from "../forms/BasicInput"
// features/users/components/UserFormModal.tsx
type Props = {
  isOpen: boolean
  onClose: () => void
  defaultValues?: TenantFormData
  editingId?: number
}

export function TenantFormModal({ isOpen, onClose, defaultValues, editingId }: Props) {
  const dispatch = useAppDispatch()
  const isEditing = !!editingId
  const serverValidationErrors = useAppSelector(s => s.tenants.validationErrors)
  const status = useAppSelector((s) => s.tenants.status)

  const { t } = useTranslation()

  const [formData, setFormData] = useState<TenantFormData>(
    { name: '', phone_number: '', id_card_number: '' }
  )

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setFormData(defaultValues ?? { name: '', phone_number: '', id_card_number: '' })
  }, [defaultValues])

  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>({});

  const translatedServerErrors = useMemo(() => {
    if (!serverValidationErrors) return {};
    return extractValidationServerErrors(serverValidationErrors, t);
  }, [serverValidationErrors, t]);

  const displayErrors = {
    ...translatedServerErrors,
    ...clientErrors
  };

  const busy = status === PageLoadStatus.LOADING

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleClose = useCallback(() => {
    onClose()
    dispatch(clearTenantsError())
    setFormData({ name: '', phone_number: '', id_card_number: '' })
    setClientErrors({})
  }, [onClose, dispatch])

  const handleSubmit = async () => {
    setClientErrors({});
    dispatch(clearTenantsError());
    const result = tenantSchema.safeParse(formData)
    if (!result.success) {
      const formattedErrors = extractValidationErrors(result.error, t);
      setClientErrors(formattedErrors);
      return
    }
    if (isEditing) {
      const updateResult = await dispatch(updateTenantThunk({ ...formData, id: editingId }))
      if (updateTenantThunk.fulfilled.match(updateResult)) {
        handleClose()
      }
    } else {
      const createResult = await dispatch(createTenantThunk(formData))
      if (createTenantThunk.fulfilled.match(createResult)) {
        handleClose()
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? 'Sửa khách hàng' : 'Tạo khách hàng'}
      onClose={handleClose}
      footer={
        <>
          <BasicButton
            className="btn btn-outline-secondary btn-sm"
            onClick={handleClose}
            disabled={busy}
            children={t('cancel')}
          />
          <BasicButton
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={busy}
            children={busy ? t('saving') : isEditing ? t('update') : t('create')}
          />
        </>
      }
    >
      <BasicInput
        id="create-name"
        name="name"
        label={t('user.name')}
        autoComplete="name"
        value={formData.name}
        onChange={handleChange}
        required
        disabled={busy}
        validationErrors={displayErrors.name ? displayErrors : {}}
      />
      <BasicInput
        id="create-phone_number"
        name="phone_number"
        label={t('tenant.phone_number')}
        autoComplete="email"
        value={formData.phone_number}
        onChange={handleChange}
        required
        disabled={busy}
        validationErrors={displayErrors.phone_number ? displayErrors : {}}
      />
      <BasicInput
        id="create-id_card_number"
        name="id_card_number"
        label={t('tenant.id_card_number')}
        autoComplete="id_card_number"
        value={formData.id_card_number}
        onChange={handleChange}
        required
        disabled={busy}
        validationErrors={displayErrors.id_card_number ? displayErrors : {}}
      />
    </Modal>
  )
}