import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal'
import { BasicPaginator } from '../../components/base-components/paginators/BasicPaginator'
import { BasicButton } from '../../components/base-components/buttons/BasicButton'
import { useInvoiceList } from '../../hooks/invoice-hooks/useInvoiceList'
import type { Invoice } from '../../types/InvoiceType'
import { InvoiceSearchForm } from '../../components/search-forms/InvoiceSearchForm'
import { useTranslation } from 'react-i18next'
import { useDeleteInvoiceMutation } from '../../services/rtk/invoiceApiSlice'
import { PageLoadStatus } from '../../types/enums/PageLoadStatus'

const PAYMENT_STATUS_BADGE: Record<number, string> = {
  1: 'bg-secondary',
  2: 'bg-success',
  3: 'bg-warning text-dark',
  4: 'bg-danger',
}

export function InvoiceListPage() {
  const invoiceListHook = useInvoiceList()
  const { t } = useTranslation()
  const [deleteInvoice] = useDeleteInvoiceMutation()

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Hoá đơn</h1>
          <p className="text-body-secondary small mb-0">
            {t('messages.total_records', { total: invoiceListHook.total })}
          </p>
        </div>
      </div>

      <InvoiceSearchForm onSearch={invoiceListHook.handleSubmit} />

      {invoiceListHook.error ? (
        <div className="alert alert-danger" role="alert">
          {invoiceListHook.error}
        </div>
      ) : null}

      <div className="table-responsive border rounded">
        <table className="table table-hover table-striped mb-0 align-middle">
          <thead className="table-light">
            <tr>
              <th
                role="button"
                className="user-select-none"
                onClick={() => invoiceListHook.handleSort('id')}
              >
                {invoiceListHook.sortBy === 'id' ? (invoiceListHook.sortDir === 'asc' ? '▲ ' : '▼ ') : '↕ '}
                ID
              </th>
              <th>{t('models.room.room_number')}</th>
              <th>{t('models.invoice.representative_tenant_name')}</th>
              <th
                role="button"
                className="user-select-none"
                onClick={() => invoiceListHook.handleSort('total_amount')}
              >
                {invoiceListHook.sortBy === 'total_amount' ? (invoiceListHook.sortDir === 'asc' ? '▲ ' : '▼ ') : '↕ '}
                {t('models.invoice.total_amount')}
              </th>
              <th>{t('models.invoice.payment_status')}</th>
              <th>{t('models.invoice.note')}</th>
              <th>{t('tables.table_header.action')}</th>
            </tr>
          </thead>
          <tbody>
            {invoiceListHook.showLoadingPlaceholder ? (
              <tr>
                <td colSpan={7} className="text-center py-5 text-body-secondary">{t('btn.loading')}</td>
              </tr>
            ) : invoiceListHook.list.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-5 text-body-secondary">{t('messages.no_data')}</td>
              </tr>
            ) : (
              invoiceListHook.list.map((invoice: Invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>{invoice.room_number ?? invoice.room_id}</td>
                  <td>{invoice.representative_tenant_name ?? invoice.representative_tenant_id}</td>
                  <td>{invoice.total_amount}</td>
                  <td>
                    <span className={`badge ${PAYMENT_STATUS_BADGE[invoice.payment_status] ?? 'bg-secondary'}`}>
                      {t(`enums.invoice.payment_status.${invoice.payment_status}`)}
                    </span>
                  </td>
                  <td>{invoice.note ?? '—'}</td>
                  <td className="text-nowrap">
                    <BasicButton
                      onClick={() => invoiceListHook.modalDeleteConfirm.handleDelete(invoice.id)}
                      disabled={
                        invoiceListHook.status === PageLoadStatus.LOADING ||
                        invoiceListHook.showLoadingPlaceholder
                      }
                      className="btn btn-outline-danger btn-sm"
                    >
                      {t('btn.delete')}
                    </BasicButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <BasicPaginator
        effectivePage={invoiceListHook.effectivePage}
        pageCount={invoiceListHook.pageCount}
        status={invoiceListHook.status}
        showLoadingPlaceholder={invoiceListHook.showLoadingPlaceholder}
        setPageIndex={invoiceListHook.setPage}
      />

      <DeleteConfirmModal
        isOpen={invoiceListHook.modalDeleteConfirm.isDeleteModalOpen}
        onClose={() => invoiceListHook.modalDeleteConfirm.setIsDeleteModalOpen(false)}
        deleteId={invoiceListHook.modalDeleteConfirm.deleteId}
        domainObject="invoice"
        onDelete={async (id) => { await deleteInvoice(id) }}
      />
    </>
  )
}
