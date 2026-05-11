import { Link } from 'react-router-dom'
import { PageLoadStatus } from '../../types/enums/PageLoadStatus'
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal'
import { UserSearchForm } from '../../components/search-forms/UserSearchForm'
import { BasicPaginator } from '../../components/paginators/BasicPaginator'
import { BasicButton } from '../../components/buttons/BasicButton'
import { useUserList } from '../../hooks/user-hooks/useUserList'

export function UserListPage() {
  const userListHook = useUserList()

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Người dùng</h1>
          <p className="text-body-secondary small mb-0">
            Tổng {userListHook.total} bản ghi
          </p>
        </div>
        <Link className="btn btn-primary" to="/users/create">
          Thêm mới
        </Link>
      </div>
      <UserSearchForm onSearch={userListHook.handleSubmit} />

      {userListHook.error ? (
        <div className="alert alert-danger" role="alert">
          {userListHook.error}
        </div>
      ) : null}

      <div className="table-responsive border rounded">
        <table className="table table-hover table-striped mb-0 align-middle">
          <thead className="table-light">
            <tr>
              <th
                role="button"
                className="user-select-none"
                onClick={() => userListHook.handleSort('id')}
              >
                {userListHook.sortBy === 'id'
                  ? userListHook.sortDir === 'asc'
                    ? '▲ '
                    : '▼ '
                  : '↕ '}
                ID
              </th>
              <th
                role="button"
                className="user-select-none"
                onClick={() => userListHook.handleSort('name')}
              >
                {userListHook.sortBy === 'name'
                  ? userListHook.sortDir === 'asc'
                    ? '▲ '
                    : '▼ '
                  : '↕ '}
                Tên
              </th>
              <th
                role="button"
                className="user-select-none"
                onClick={() => userListHook.handleSort('email')}
              >
                {userListHook.sortBy === 'email'
                  ? userListHook.sortDir === 'asc'
                    ? '▲ '
                    : '▼ '
                  : '↕ '}
                Email
              </th>
              <th
                role="button"
                className="user-select-none"
                onClick={() => userListHook.handleSort('status')}
              >
                {userListHook.sortBy === 'status'
                  ? userListHook.sortDir === 'asc'
                    ? '▲ '
                    : '▼ '
                  : '↕ '}
                Trạng thái
              </th>
              <th style={{ width: 180 }} />
            </tr>
          </thead>
          <tbody>
            {userListHook.showLoadingPlaceholder ? (
              <tr>
                <td colSpan={4} className="text-center py-5 text-body-secondary">
                  Đang tải…
                </td>
              </tr>
            ) : userListHook.list.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-5 text-body-secondary">
                  Chưa có dữ liệu.
                </td>
              </tr>
            ) : (
              userListHook.list.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.status === 1 ? 'Hoạt động' : 'Không hoạt động'}</td>
                  <td className="text-end text-nowrap">
                    <Link
                      className="btn btn-outline-secondary btn-sm me-2"
                      to={`/users/update/${u.id}`}
                    >
                      Sửa
                    </Link>
                    <BasicButton
                      onClick={() =>
                        userListHook.modalDeleteConfirm.handleDelete(u.id)
                      }
                      disabled={
                        userListHook.status === PageLoadStatus.LOADING ||
                        userListHook.showLoadingPlaceholder
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
        effectivePage={userListHook.effectivePage}
        pageCount={userListHook.pageCount}
        status={userListHook.status}
        showLoadingPlaceholder={userListHook.showLoadingPlaceholder}
        setPageIndex={userListHook.setPageIndex}
      />

      <DeleteConfirmModal
        isOpen={userListHook.modalDeleteConfirm.isDeleteModalOpen}
        onClose={() =>
          userListHook.modalDeleteConfirm.setIsDeleteModalOpen(false)
        }
        userId={userListHook.modalDeleteConfirm.deleteId}
        domainObject="người dùng"
      />
    </>
  )
}
