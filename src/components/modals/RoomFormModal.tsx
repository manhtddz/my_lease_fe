import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../reducers/hooks"
import { Modal } from "./Modal"
import { extractValidationErrors, extractValidationServerErrors } from "../../utils/form"
import { useTranslation } from "react-i18next"
import { BasicButton } from "../buttons/BasicButton"
import { PageLoadStatus } from "../../types/enums/PageLoadStatus"
import { BasicInput } from "../forms/BasicInput"
import { roomSchema, type RoomFormData } from "../../validation/rooms/roomSchema"
import { RoomStatus, RoomStatusEnum } from "../../types/enums/rooms/RoomStatus"
import { RoomType, RoomTypeEnum } from "../../types/enums/rooms/RoomType"
import { clearRoomsError, createRoomThunk, updateRoomThunk } from "../../reducers/roomSlice"
import { NumberInput } from "../forms/inputs/NumberInput"
import { Select } from "../forms/inputs/Select"

type Props = {
  isOpen: boolean
  onClose: () => void
  defaultValues?: RoomFormData
  editingId?: number
}

export function RoomFormModal({ isOpen, onClose, defaultValues, editingId }: Props) {
  const dispatch = useAppDispatch()
  const isEditing = !!editingId
  const serverValidationErrors = useAppSelector(s => s.tenants.validationErrors)
  const status = useAppSelector((s) => s.tenants.status)

  const { t } = useTranslation()
  const DEFAULT_VALUES = { room_number: '', floor: '', room_type: RoomType.SINGLE, room_price: '', max_occupants: '' }
  const [formData, setFormData] = useState<RoomFormData>(DEFAULT_VALUES)

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
    }));
  }, [t]);

  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>({});

  const translatedServerErrors = useMemo(() => {
    if (!serverValidationErrors) return {};
    return extractValidationServerErrors(serverValidationErrors, t, 'room');
  }, [serverValidationErrors, t]);

  const displayErrors = {
    ...translatedServerErrors,
    ...clientErrors
  };

  const busy = status === PageLoadStatus.LOADING

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numberFields = ['floor', 'room_price', 'max_occupants']

    setFormData(prev => ({
      ...prev,
      [name]: numberFields.includes(name) ? (value === '' ? 0 : Number(value)) : value
    }))
  }

  const handleClose = useCallback(() => {
    onClose()
    dispatch(clearRoomsError())
    setFormData(DEFAULT_VALUES)
    setClientErrors({})
  }, [onClose, dispatch])

  const handleSubmit = async () => {
    setClientErrors({});
    dispatch(clearRoomsError());
    const result = roomSchema(t).safeParse(formData)
    if (!result.success) {
      const formattedErrors = extractValidationErrors(result.error);
      setClientErrors(formattedErrors);
      return
    }
    const data = result.data

    if (isEditing) {
      if (editingId === undefined) return
      const updateResult = await dispatch(updateRoomThunk({ ...data, id: editingId }))
      if (updateRoomThunk.fulfilled.match(updateResult)) {
        handleClose()
      }
    } else {
      const createResult = await dispatch(createRoomThunk(data))
      if (createRoomThunk.fulfilled.match(createResult)) {
        handleClose()
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? 'Sửa phòng' : 'Tạo phòng'}
      onClose={handleClose}
      footer={
        <>
          <BasicButton
            className="btn btn-outline-secondary btn-sm"
            onClick={handleClose}
            disabled={busy}
            children={t('btn.cancel')}
          />
          <BasicButton
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={busy}
            children={busy ? t('btn.saving') : t('btn.save')}
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
        disabled={busy}
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
        disabled={busy}
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
        disabled={busy}
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
        disabled={busy}
        validationErrors={displayErrors.max_occupants ? displayErrors : {}}
      />
    </Modal>
  )
}