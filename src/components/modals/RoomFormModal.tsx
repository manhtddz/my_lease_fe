import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Modal } from './Modal'
import { extractValidationErrors, extractValidationServerErrors } from '../../utils/form'
import { useTranslation } from 'react-i18next'
import { BasicButton } from '../buttons/BasicButton'
import { BasicInput } from '../forms/BasicInput'
import { roomSchema, type RoomFormData } from '../../validation/rooms/roomSchema'
import { RoomType, RoomTypeEnum } from '../../types/enums/rooms/RoomType'
import { NumberInput } from '../forms/inputs/NumberInput'
import { Select } from '../forms/inputs/Select'

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
    const numberFields = ['floor', 'room_price', 'max_occupants']
    setFormData((prev) => ({
      ...prev,
      [name]: numberFields.includes(name) ? (value === '' ? 0 : Number(value)) : value,
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
      <BasicInput
        id="create-name"
        name="room_number"
        label={t('models.room.room_number')}
        autoComplete="room_number"
        value={formData.room_number}
        onChange={handleChange}
        required
        disabled={isLoading}
        validationErrors={displayErrors.room_number ? displayErrors : {}}
      />
      <NumberInput
        id="create-floor"
        name="floor"
        label={t('models.room.floor')}
        value={(formData.floor ?? '').toString()}
        onChange={handleChange}
        min={1}
        required
        disabled={isLoading}
        validationErrors={displayErrors.floor ? displayErrors : {}}
      />
      <Select
        label={t('models.room.room_type')}
        value={formData.room_type}
        options={roomTypeOptions}
        placeholder={t('models.room.room_type')}
        name="room_type"
        onChange={(value) => setFormData({ ...formData, room_type: value })}
        validationErrors={displayErrors.room_type ? displayErrors : {}}
        showError={true}
      />
      <NumberInput
        id="create-room_price"
        name="room_price"
        label={t('models.room.room_price')}
        value={(formData.room_price ?? '').toString()}
        onChange={handleChange}
        required
        disabled={isLoading}
        validationErrors={displayErrors.room_price ? displayErrors : {}}
      />
      <NumberInput
        id="create-max_occupants"
        name="max_occupants"
        label={t('models.room.max_occupants')}
        value={(formData.max_occupants ?? '').toString()}
        onChange={handleChange}
        max={5}
        required
        disabled={isLoading}
        validationErrors={displayErrors.max_occupants ? displayErrors : {}}
      />
    </Modal>
  )
}