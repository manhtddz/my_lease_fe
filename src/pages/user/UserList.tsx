import { Link } from 'react-router-dom'
import { PageLoadStatus } from '../../types/enums/PageLoadStatus'
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal'
import { UserSearchForm } from '../../components/search-forms/UserSearchForm'
import { BasicPaginator } from '../../components/paginators/BasicPaginator'
import { BasicButton } from '../../components/buttons/BasicButton'
import { useUserList } from '../../hooks/user-hooks/useUserList'

export function UserListPage() {

  const { list, total, status, setPageIndex, sortBy, sortDir, pageCount, effectivePage, showLoadingPlaceholder, handleSort, handleSubmit, modalDeleteConfirm, error } = useUserList()

  return (
    <>
      <div className="app-toolbar">
        <div>
          <h1 className="app-page-title" style={{ marginBottom: 4 }}>
            Người dùng
          </h1>
          <p className="app-muted" style={{ margin: 0 }}>
            Tổng {total} bản ghi
          </p>
        </div>
        <Link className="app-btn app-btn--primary" to="/users/create" style={{ width: 'auto' }}>
          Thêm mới
        </Link>
      </div>
      <UserSearchForm onSearch={handleSubmit} />

      {error && (
        <div className="app-alert app-alert--error" role="alert">
          {error}
        </div>
      )}

      <div className="app-table-wrap">
        <table className="app-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>{sortBy === 'id' ? (sortDir === 'asc' ? '▲' : '▼') : '↕'} ID</th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>{sortBy === 'name' ? (sortDir === 'asc' ? '▲' : '▼') : '↕'} Tên</th>
              <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>{sortBy === 'email' ? (sortDir === 'asc' ? '▲' : '▼') : '↕'} Email</th>
              <th style={{ width: 100 }}></th>
            </tr>
          </thead>
          <tbody>
            {showLoadingPlaceholder ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: 24 }}>
                  Đang tải…
                </td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: 24 }}>
                  Chưa có dữ liệu.
                </td>
              </tr>
            ) : (
              list.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <Link className="app-btn app-btn--secondary" to={`/users/update/${u.id}`} style={{ width: 'auto' }}>
                      Sửa
                    </Link>

                    <BasicButton onClick={() => modalDeleteConfirm.handleDelete(u.id)} disabled={status === PageLoadStatus.LOADING || showLoadingPlaceholder} className="app-btn app-btn--danger" >
                      Xóa
                    </BasicButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <BasicPaginator effectivePage={effectivePage} pageCount={pageCount} status={status} showLoadingPlaceholder={showLoadingPlaceholder} setPageIndex={setPageIndex} />

      <DeleteConfirmModal
        isOpen={modalDeleteConfirm.isDeleteModalOpen}
        onClose={() => modalDeleteConfirm.setIsDeleteModalOpen(false)}
        userId={modalDeleteConfirm.deleteId}
        domainObject="người dùng"
      />
    </>
  )
}
