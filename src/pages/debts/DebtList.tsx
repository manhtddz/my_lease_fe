import { useState } from 'react'
import { useDebtList } from '../../hooks/debt-hooks/useDebtList'
import { BasicPaginator } from '../../components/base-components/paginators/BasicPaginator'
import { useTranslation } from 'react-i18next'
import type { Debt, DebtSearchForm } from '../../types/DebtType'
import { DebtStatus, DebtStatusEnum } from '../../types/enums/debts/DebtStatus'
import { DebtTypeValue, DebtTypeEnum } from '../../types/enums/debts/DebtType'

const INITIAL_SEARCH: DebtSearchForm = { tenant_name: '', status: '', debt_type: '' }

function DebtStatusBadge({ status }: { status: Debt['status'] }) {
  const { t } = useTranslation()
  const isActive = status === DebtStatus.ACTIVE
  return (
    <span className={`badge ${isActive ? 'bg-success' : 'bg-secondary'}`}>
      {t(DebtStatusEnum[status])}
    </span>
  )
}

function DebtTypeBadge({ debtType }: { debtType: Debt['debt_type'] }) {
  const { t } = useTranslation()
  const isOwner = debtType === DebtTypeValue.OWNER_DEBT
  return (
    <span className={`badge ${isOwner ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>
      {t(DebtTypeEnum[debtType])}
    </span>
  )
}

export function DebtListPage() {
  const debtListHook = useDebtList()
  const { t } = useTranslation()
  const [searchForm, setSearchForm] = useState<DebtSearchForm>(INITIAL_SEARCH)

  const handleSearch = () => {
    debtListHook.handleSubmit(searchForm)
  }

  const handleReset = () => {
    setSearchForm(INITIAL_SEARCH)
    debtListHook.handleSubmit(INITIAL_SEARCH)
  }

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">{t('models.debt.title')}</h1>
          <p className="text-body-secondary small mb-0">
            {t('messages.total_records', { total: debtListHook.total })}
          </p>
        </div>
      </div>

      {/* Search form */}
      <div className="row g-2 align-items-end mb-4">
        <div className="col-md-4">
          <label className="form-label small mb-1" htmlFor="search-tenant_name">
            {t('models.tenant.name')}
          </label>
          <input
            id="search-tenant_name"
            className="form-control form-control-sm"
            placeholder="Nhập tên khách hàng..."
            value={searchForm.tenant_name}
            onChange={(e) => setSearchForm((prev) => ({ ...prev, tenant_name: e.target.value }))}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label small mb-1" htmlFor="search-status">
            {t('models.debt.status')}
          </label>
          <select
            id="search-status"
            className="form-select form-select-sm"
            value={searchForm.status}
            onChange={(e) =>
              setSearchForm((prev) => ({
                ...prev,
                status: e.target.value as DebtSearchForm['status'],
              }))
            }
          >
            <option value="">{t('models.debt.all_status')}</option>
            <option value={DebtStatus.ACTIVE}>{t(DebtStatusEnum[DebtStatus.ACTIVE])}</option>
            <option value={DebtStatus.CANCELLED}>{t(DebtStatusEnum[DebtStatus.CANCELLED])}</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label small mb-1" htmlFor="search-debt_type">
            {t('models.debt.debt_type')}
          </label>
          <select
            id="search-debt_type"
            className="form-select form-select-sm"
            value={searchForm.debt_type}
            onChange={(e) =>
              setSearchForm((prev) => ({
                ...prev,
                debt_type: e.target.value as DebtSearchForm['debt_type'],
              }))
            }
          >
            <option value="">{t('models.debt.all_debt_type')}</option>
            <option value={DebtTypeValue.OWNER_DEBT}>{t(DebtTypeEnum[DebtTypeValue.OWNER_DEBT])}</option>
            <option value={DebtTypeValue.TENANT_DEBT}>{t(DebtTypeEnum[DebtTypeValue.TENANT_DEBT])}</option>
          </select>
        </div>
        <div className="col-md-auto d-flex gap-2">
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleSearch}>
            {t('btn.search')}
          </button>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleReset}>
            {t('btn.reset')}
          </button>
        </div>
      </div>

      {debtListHook.error ? (
        <div className="alert alert-danger" role="alert">
          {debtListHook.error}
        </div>
      ) : null}

      <div className="table-responsive border rounded">
        <table className="table table-hover table-striped mb-0 align-middle">
          <thead className="table-light">
            <tr>
              <th
                role="button"
                className="user-select-none"
                onClick={() => debtListHook.handleSort('id')}
              >
                {debtListHook.sortBy === 'id' ? (debtListHook.sortDir === 'asc' ? '▲ ' : '▼ ') : '↕ '}
                ID
              </th>
              <th>{t('models.tenant.name')}</th>
              <th>{t('models.debt.invoice_id')}</th>
              <th>{t('models.debt.original_amount')}</th>
              <th>{t('models.debt.paid_amount')}</th>
              <th
                role="button"
                className="user-select-none"
                onClick={() => debtListHook.handleSort('remaining_amount')}
              >
                {debtListHook.sortBy === 'remaining_amount' ? (debtListHook.sortDir === 'asc' ? '▲ ' : '▼ ') : '↕ '}
                {t('models.debt.remaining_amount')}
              </th>
              <th
                role="button"
                className="user-select-none"
                onClick={() => debtListHook.handleSort('due_date')}
              >
                {debtListHook.sortBy === 'due_date' ? (debtListHook.sortDir === 'asc' ? '▲ ' : '▼ ') : '↕ '}
                {t('models.debt.due_date')}
              </th>
              <th>{t('models.debt.status')}</th>
              <th>{t('models.debt.debt_type')}</th>
              <th>{t('models.debt.penalty_amount')}</th>
            </tr>
          </thead>
          <tbody>
            {debtListHook.showLoadingPlaceholder ? (
              <tr>
                <td colSpan={10} className="text-center py-5 text-body-secondary">
                  {t('btn.loading')}
                </td>
              </tr>
            ) : debtListHook.list.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-5 text-body-secondary">
                  {t('messages.no_data')}
                </td>
              </tr>
            ) : (
              debtListHook.list.map((debt: Debt) => (
                <tr key={debt.id}>
                  <td>{debt.id}</td>
                  <td>{debt.tenant.name ?? debt.tenant_id}</td>
                  <td>{debt.invoice_id}</td>
                  <td>{debt.original_amount}</td>
                  <td>{debt.paid_amount}</td>
                  <td>{debt.remaining_amount}</td>
                  <td>{debt.due_date}</td>
                  <td><DebtStatusBadge status={debt.status} /></td>
                  <td><DebtTypeBadge debtType={debt.debt_type} /></td>
                  <td>{debt.penalty_amount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <BasicPaginator
        effectivePage={debtListHook.effectivePage}
        pageCount={debtListHook.pageCount}
        status={debtListHook.status}
        showLoadingPlaceholder={debtListHook.showLoadingPlaceholder}
        setPageIndex={debtListHook.setPage}
      />
    </>
  )
}
