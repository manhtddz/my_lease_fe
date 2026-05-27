import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { TenantFormData } from '../../validation/tenants/tenantSchema'
import { tenantSchema } from '../../validation/tenants/tenantSchema'
import { Modal } from '../base-components/modals/Modal'
import { extractValidationErrors, extractValidationServerErrors } from '../../utils/form'
import { useTranslation } from 'react-i18next'
import { BasicButton } from '../base-components/buttons/BasicButton'
import { BasicInput } from '../base-components/forms/inputs/BasicInput'
import { FormInput } from '../base-components/forms/inputs/FormInput'
import { useCreateTenantMutation, useUpdateTenantMutation } from '../../services/rtk/tenantApiSlice'
import type { ApiError } from '../../types/ex/ApiError'

type Props = {
  isOpen: boolean
  onClose: () => void
  defaultValues?: TenantFormData
  editingId?: number
}

export function TenantFormModal({ isOpen, onClose, defaultValues, editingId }: Props) {
  const isEditing = !!editingId
  const { t } = useTranslation()

  const [createTenant, { isLoading: isCreating, error: createError, reset: resetCreate }] =
    useCreateTenantMutation()
  const [updateTenant, { isLoading: isUpdating, error: updateError, reset: resetUpdate }] =
    useUpdateTenantMutation()

  const isBusy = isCreating || isUpdating
  const activeError = updateError ?? createError
  const serverValidationErrors =
    activeError && (activeError as ApiError).status === 422
      ? (activeError as ApiError).errors ?? null
      : null

  const [formData, setFormData] = useState<TenantFormData>({
    name: '', phone_number: '', id_card_number: '',
  })
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setFormData(defaultValues ?? { name: '', phone_number: '', id_card_number: '' })
  }, [defaultValues])

  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>({})

  const translatedServerErrors = useMemo(() => {
    if (!serverValidationErrors) return {}
    return extractValidationServerErrors(serverValidationErrors, t, 'tenant')
  }, [serverValidationErrors, t])

  const displayErrors = { ...translatedServerErrors, ...clientErrors }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleClose = useCallback(() => {
    onClose()
    resetCreate()
    resetUpdate()
    setFormData({ name: '', phone_number: '', id_card_number: '' })
    setClientErrors({})
  }, [onClose, resetCreate, resetUpdate])

  const handleSubmit = async () => {
    setClientErrors({})
    resetCreate()
    resetUpdate()
    const result = tenantSchema(t).safeParse(formData)
    if (!result.success) {
      setClientErrors(extractValidationErrors(result.error))
      return
    }
    const data = result.data
    if (isEditing) {
      if (editingId === undefined) return
      const updateResult = await updateTenant({ ...data, id: editingId })
      if (!('error' in updateResult)) handleClose()
    } else {
      const createResult = await createTenant(data)
      if (!('error' in createResult)) handleClose()
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
            disabled={isBusy}
            children={t('btn.cancel')}
          />
          <BasicButton
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isBusy}
            children={isBusy ? t('btn.saving') : t('btn.save')}
          />
        </>
      }
    >
      <FormInput
        idlabel="create-name"
        label={t('models.tenant.name')}
        error={displayErrors.name ? (Array.isArray(displayErrors.name) ? displayErrors.name : [displayErrors.name]) : []}
        labelClass="form-label fw-medium"
        errorClass="text-danger small mt-1"
        required={true}
      >
        <BasicInput
          id="create-name"
          name="name"
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isBusy}
        />
      </FormInput>

      <FormInput
        idlabel="create-phone_number"
        label={t('models.tenant.phone_number')}
        error={displayErrors.phone_number ? (Array.isArray(displayErrors.phone_number) ? displayErrors.phone_number : [displayErrors.phone_number]) : []}
        labelClass="form-label fw-medium"
        errorClass="text-danger small mt-1"
        required={true}
      >
        <BasicInput
          id="create-phone_number"
          name="phone_number"
          autoComplete="off"
          value={formData.phone_number}
          onChange={handleChange}
          required
          disabled={isBusy}
        />
      </FormInput>

      <FormInput
        idlabel="create-id_card_number"
        label={t('models.tenant.id_card_number')}
        error={displayErrors.id_card_number ? (Array.isArray(displayErrors.id_card_number) ? displayErrors.id_card_number : [displayErrors.id_card_number]) : []}
        labelClass="form-label fw-medium"
        errorClass="text-danger small mt-1"
        required={true}
      >
        <BasicInput
          id="create-id_card_number"
          name="id_card_number"
          autoComplete="off"
          value={formData.id_card_number}
          onChange={handleChange}
          required
          disabled={isBusy}
        />
      </FormInput>
    </Modal>
  )
}
