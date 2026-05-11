import { Link } from 'react-router-dom'
import { useAppSelector } from '../reducers/hooks'

export function HomePage() {
  const name = useAppSelector((s) => s.auth.currentUser?.name)

  return (
    <>
      <h1 className="h3 mb-2">
        Xin chào{name ? `, ${name}` : ''}
      </h1>
      <p className="text-body-secondary mb-4">
        Chọn mục bên dưới để quản lý dữ liệu.
      </p>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
        <div className="col">
          <Link className="card h-100 text-decoration-none shadow-sm" to="/users">
            <div className="card-body">
              <strong className="d-block text-primary mb-2">Người dùng</strong>
              <span className="text-body-secondary small">
                Xem danh sách, thêm và xóa người dùng.
              </span>
            </div>
          </Link>
        </div>
      </div>
    </>
  )
}
