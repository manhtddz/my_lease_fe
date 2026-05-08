import { Link } from 'react-router-dom'
import { useAppSelector } from '../reducers/hooks'

export function HomePage() {
  const name = useAppSelector((s) => s.auth.currentUser?.name)

  return (
    <>
      <h1 className="app-page-title">
        Xin chào{name ? `, ${name}` : ''}
      </h1>
      <p className="app-muted">Chọn mục bên dưới để quản lý dữ liệu.</p>
      <div className="app-home-grid">
        <Link className="app-home-card" to="/users">
          <strong>Người dùng</strong>
          <span>Xem danh sách, thêm và xóa người dùng.</span>
        </Link>
      </div>
    </>
  )
}
