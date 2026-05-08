import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { logout } from '../reducers/authSlice'
import { useAppDispatch, useAppSelector } from '../reducers/hooks'

export function MainLayout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const currentUser = useAppSelector((s) => s.auth.currentUser)

  function handleLogout() {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink to="/" className="app-brand" end>
          My Lease
        </NavLink>
        <nav className="app-nav" aria-label="Chính">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
            Trang chủ
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Người dùng
          </NavLink>
        </nav>
        <div className="app-header-actions">
          <span>{currentUser?.name ?? currentUser?.email}</span>
          <button type="button" className="app-btn" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
