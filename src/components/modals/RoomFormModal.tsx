import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Modal } from '../base-components/modals/Modal'
import { extractValidationErrors, extractValidationServerErrors } from '../../utils/form'
import { useTranslation } from 'react-i18next'
import { BasicButton } from '../base-components/buttons/BasicButton'
import { BasicInput } from '../base-components/forms/inputs/BasicInput'
import { roomSchema, type RoomFormData } from '../../validation/rooms/roomSchema'
import { RoomType, RoomTypeEnum } from '../../types/enums/rooms/RoomType'
import { NumberInput } from '../base-components/forms/inputs/NumberInput'
import { Select } from '../base-components/forms/inputs/Select'
import { FormInput } from '../base-components/forms/inputs/FormInput'

type Props = {
  isOpen: boolean
  onClose: () => void
  defaultValues?: RoomFormData
  editingId?: number
  // ── lifted từ slice ──
  isLoading?: boolean
  serverValidationErrors?: Record<string, string[]> | null
  onSubmit: (data: RoomFormData) => Promise<boolean> // true = thành công, modal tự đóng
  onClearErrors?: () => void
}

export function RoomFormModal({
  isOpen,
  onClose,
  defaultValues,
  editingId,
  isLoading = false,
  serverValidationErrors,
  onSubmit,
  onClearErrors,
}: Props) {
  const isEditing = !!editingId
  const { t } = useTranslation()

  const DEFAULT_VALUES: RoomFormData = {
    room_number: '',
    floor: '',
    room_type: RoomType.SINGLE,
    room_price: '',
    max_occupants: '',
  }

  const [formData, setFormData] = useState<RoomFormData>(DEFAULT_VALUES)
  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>({})
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setFormData(defaultValues ?? DEFAULT_VALUES)
  }, [defaultValues])

  const roomTypeOptions = useMemo(() => {
    return Object.entries(RoomTypeEnum).map(([key, value]) => ({
      value: key,
      label: t(value),
    }))
  }, [t])

  const translatedServerErrors = useMemo(() => {
    if (!serverValidationErrors) return {}
    return extractValidationServerErrors(serverValidationErrors, t, 'room')
  }, [serverValidationErrors, t])

  const displayErrors = { ...translatedServerErrors, ...clientErrors }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleClose = useCallback(() => {
    onClose()
    onClearErrors?.()
    setFormData(DEFAULT_VALUES)
    setClientErrors({})
  }, [onClose, onClearErrors])

  const handleSubmit = async () => {
    setClientErrors({})
    onClearErrors?.()

    const result = roomSchema(t).safeParse(formData)
    if (!result.success) {
      setClientErrors(extractValidationErrors(result.error))
      return
    }

    const success = await onSubmit(result.data)
    if (success) handleClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? t('btn.edit') : t('btn.create')}
      onClose={handleClose}
      footer={
        <>
          <BasicButton
            className="btn btn-outline-secondary btn-sm"
            onClick={handleClose}
            disabled={isLoading}
            children={t('btn.cancel')}
          />
          <BasicButton
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isLoading}
            children={isLoading ? t('btn.saving') : t('btn.save')}
          />
        </>
      }
    >
      <FormInput
        idlabel="create-room_number"
        label={t('models.room.room_number')}
        error={
          displayErrors.room_number
            ? (Array.isArray(displayErrors.room_number) ? displayErrors.room_number : [displayErrors.room_number])
            : []
        }
        labelClass="form-label fw-medium"
        errorClass="text-danger small mt-1"
        required={true}>
        <BasicInput
          id="create-room_number"
          name="room_number"
          autoComplete="room_number"
          value={formData.room_number}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </FormInput>

      <FormInput
        idlabel="create-floor"
        label={t('models.room.floor')}
        error={
          displayErrors.floor
            ? (Array.isArray(displayErrors.floor) ? displayErrors.floor : [displayErrors.floor])
            : []
        }
        labelClass="form-label fw-medium"
        errorClass="text-danger small mt-1"
        required={true}>
        <NumberInput
          id="create-floor"
          name="floor"
          value={(formData.floor ?? '').toString()}
          onChange={handleChange}
          min={1}
          max={5}
          required
          disabled={isLoading}
        />
      </FormInput>

      <FormInput
        idlabel="create-room_type"
        label={t('models.room.room_type')}
        error={
          displayErrors.room_type
            ? (Array.isArray(displayErrors.room_type) ? displayErrors.room_type : [displayErrors.room_type])
            : []
        }
        labelClass="form-label fw-medium"
        errorClass="text-danger small mt-1"
        required={true}>
        <Select
          value={formData.room_type}
          options={roomTypeOptions}
          placeholder={t('models.room.room_type')}
          name="room_type"
          onChange={(value) => setFormData({ ...formData, room_type: value })}
        />
      </FormInput>

      <FormInput
        idlabel="create-room_price"
        label={t('models.room.room_price')}
        error={
          displayErrors.room_price
            ? (Array.isArray(displayErrors.room_price) ? displayErrors.room_price : [displayErrors.room_price])
            : []
        }
        labelClass="form-label fw-medium"
        errorClass="text-danger small mt-1"
        required={true}>
        <NumberInput
          id="create-room_price"
          name="room_price"
          value={(formData.room_price ?? '').toString()}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </FormInput>

      <FormInput
        idlabel="create-max_occupants"
        label={t('models.room.max_occupants')}
        error={
          displayErrors.max_occupants
            ? (Array.isArray(displayErrors.max_occupants) ? displayErrors.max_occupants : [displayErrors.max_occupants])
            : []
        }
        labelClass="form-label fw-medium"
        errorClass="text-danger small mt-1"
        required={true}>
        <NumberInput
          id="create-max_occupants"
          name="max_occupants"
          value={(formData.max_occupants ?? '').toString()}
          onChange={handleChange}
          max={5}
          required
          disabled={isLoading}
        />
      </FormInput>
    </Modal>
  )
}