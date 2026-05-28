import { useState } from 'react'
import type { InvoiceSearchForm } from '../../types/InvoiceType'
import { useTranslation } from 'react-i18next'

type Props = {
  onSearch: (searchForm: InvoiceSearchForm) => void
}

const INITIAL_FORM: InvoiceSearchForm = {
  room_number: '',
  payment_status: '',
}

export function InvoiceSearchForm({ onSearch }: Props) {
  const { t } = useTranslation()
  const [searchForm, setSearchForm] = useState<InvoiceSearchForm>(INITIAL_FORM)

  const handleSubmit = () => {
    onSearch(searchForm)
  }

  const handleReset = () => {
    setSearchForm(INITIAL_FORM)
    onSearch(INITIAL_FORM)
  }

  return (
    <div className="row g-2 align-items-end mb-4">
      <div className="col-md-4">
        <label className="form-label small mb-1" htmlFor="search-room_number">
          {t('models.room.room_number')}
        </label>
        <input
          id="search-room_number"
          name="room_number"
          className="form-control form-control-sm"
          placeholder="Nhập số phòng..."
          value={searchForm.room_number}
          onChange={(e) => setSearchForm((prev) => ({ ...prev, room_number: e.target.value }))}
        />
      </div>

      <div className="col-md-3">
        <label className="form-label small mb-1" htmlFor="search-payment_status">
          {t('models.invoice.payment_status')}
        </label>
        <select
          id="search-payment_status"
          name="payment_status"
          className="form-select form-select-sm"
          value={searchForm.payment_status}
          onChange={(e) => setSearchForm((prev) => ({ ...prev, payment_status: e.target.value }))}
        >
          <option value="">{t('messages.all')}</option>
          <option value="1">{t('enums.invoice.payment_status.1')}</option>
          <option value="2">{t('enums.invoice.payment_status.2')}</option>
          <option value="3">{t('enums.invoice.payment_status.3')}</option>
          <option value="4">{t('enums.invoice.payment_status.4')}</option>
        </select>
      </div>

      <div className="col-md-auto d-flex gap-2">
        <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleSubmit}>
          {t('btn.search')}
        </button>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleReset}>
          {t('btn.reset')}
        </button>
      </div>
    </div>
  )
}
