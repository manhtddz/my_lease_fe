import { PageLoadStatus } from '../../types/enums/PageLoadStatus'
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal'
import { BasicPaginator } from '../../components/paginators/BasicPaginator'
import { BasicButton } from '../../components/buttons/BasicButton'
import { useTenantList } from '../../hooks/tenant-hooks/useTenantList'
import type { Tenant } from '../../types/TenantType'
import { TenantSearchForm } from '../../components/search-forms/TenantSearchForm'
import { TenantFormModal } from '../../components/modals/TenantFormModal'
import { useTenantModalForm } from '../../hooks/tenant-hooks/useTenantModalForm'

export function TenantListPage() {
  const tenantListHook = useTenantList()
  const tenantModalForm = useTenantModalForm()
  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Khách hàng</h1>
          <p className="text-body-secondary small mb-0">
            Tổng {tenantListHook.total} bản ghi
          </p>
        </div>
        <BasicButton
          onClick={() => tenantModalForm.openCreateModal()}
          disabled={
            tenantListHook.status === PageLoadStatus.LOADING ||
            tenantListHook.showLoadingPlaceholder ||
            tenantModalForm.isModalOpen
          }
          className="btn btn-primary"
        >Thêm mới</BasicButton>
        {/* <Link className="btn btn-primary" to="/users/create">
          Thêm mới
        </Link> */}
      </div>
      <TenantSearchForm onSearch={tenantListHook.handleSubmit} />

      {tenantListHook.error ? (
        <div className="alert alert-danger" role="alert">
          {tenantListHook.error}
        </div>
      ) : null}

      <div className="table-responsive border rounded">
        <table className="table table-hover table-striped mb-0 align-middle">
          <thead className="table-light">
            <tr>
              <th
                role="button"
                className="user-select-none"
                onClick={() => tenantListHook.handleSort('id')}
              >
                {tenantListHook.sortBy === 'id'
                  ? tenantListHook.sortDir === 'asc'
                    ? '▲ '
                    : '▼ '
                  : '↕ '}
                ID
              </th>
              <th
                role="button"
                className="user-select-none"
                onClick={() => tenantListHook.handleSort('name')}
              >
                {tenantListHook.sortBy === 'name'
                  ? tenantListHook.sortDir === 'asc'
                    ? '▲ '
                    : '▼ '
                  : '↕ '}
                Tên
              </th>
              <th role="button" className="user-select-none">
                Số điện thoại
              </th>
              <th role="button" className="user-select-none">
                Số CMND/CCCD
              </th>
              <th style={{ width: 180 }} />
            </tr>
          </thead>
          <tbody>
            {tenantListHook.showLoadingPlaceholder ? (
              <tr>
                <td colSpan={4} className="text-center py-5 text-body-secondary">
                  Đang tải…
                </td>
              </tr>
            ) : tenantListHook.list.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-5 text-body-secondary">
                  Chưa có dữ liệu.
                </td>
              </tr>
            ) : (
              tenantListHook.list.map((u: Tenant) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.phone_number}</td>
                  <td>{u.id_card_number}</td>
                  <td className="text-end text-nowrap">
                    {/* <Link
                      className="btn btn-outline-secondary btn-sm me-2"
                      to={`/tenants/update/${u.id}`}
                    >
                      Sửa
                    </Link> */}

                    <BasicButton
                      onClick={() => { void tenantModalForm.openEditModal(u.id) }}
                      disabled={
                        tenantListHook.status === PageLoadStatus.LOADING ||
                        tenantListHook.showLoadingPlaceholder ||
                        tenantModalForm.isModalOpen
                      }
                      className="btn btn-outline-secondary btn-sm me-2"
                    >
                      Sửa
                    </BasicButton>

                    <BasicButton
                      onClick={() =>
                        tenantListHook.modalDeleteConfirm.handleDelete(u.id)
                      }
                      disabled={
                        tenantListHook.status === PageLoadStatus.LOADING ||
                        tenantListHook.showLoadingPlaceholder
                      }
                      className="btn btn-outline-danger btn-sm"
                    >
                      Xóa
                    </BasicButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <BasicPaginator
        effectivePage={tenantListHook.effectivePage}
        pageCount={tenantListHook.pageCount}
        status={tenantListHook.status}
        showLoadingPlaceholder={tenantListHook.showLoadingPlaceholder}
        setPageIndex={tenantListHook.setPageIndex}
      />

      <DeleteConfirmModal
        isOpen={tenantListHook.modalDeleteConfirm.isDeleteModalOpen}
        onClose={() =>
          tenantListHook.modalDeleteConfirm.setIsDeleteModalOpen(false)
        }
        userId={tenantListHook.modalDeleteConfirm.deleteId}
        domainObject="tenant"
      />

      <TenantFormModal
        isOpen={tenantModalForm.isModalOpen}
        onClose={() =>
          tenantModalForm.closeModal()
        }
        defaultValues={tenantModalForm.editingTenant}
        editingId={tenantModalForm.editingTenant?.id}
      />
    </>
  )
}
