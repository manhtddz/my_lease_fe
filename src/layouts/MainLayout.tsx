// import { NavLink, Outlet, useNavigate } from 'react-router-dom'
// import { logout } from '../reducers/authSlice'
// import { useAppDispatch, useAppSelector } from '../reducers/hooks'
// import { Checkbox } from '../components/forms/inputs/Checkbox'
// import { useTranslation } from 'react-i18next'

// export function MainLayout() {
//   const dispatch = useAppDispatch()
//   const { i18n } = useTranslation()
//   const navigate = useNavigate()
//   const currentUser = useAppSelector((s) => s.auth.currentUser)

//   function handleLogout() {
//     dispatch(logout())
//     navigate('/login', { replace: true })
//   }

//   const navLinkClass = ({ isActive }: { isActive: boolean }) =>
//     `nav-link${isActive ? ' active' : ''}`

//   return (
//     <div className="d-flex flex-column min-vh-100">
//       <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary border-bottom sticky-top">
//         <div className="container-fluid">
//           <NavLink className="navbar-brand fw-semibold text-primary" to="/" end>
//             My Lease
//           </NavLink>
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#mainNav"
//             aria-controls="mainNav"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon" />
//           </button>
//           <div className="collapse navbar-collapse" id="mainNav">
//             <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//               <li className="nav-item">
//                 <NavLink className={navLinkClass} to="/" end>
//                   Trang chủ
//                 </NavLink>
//               </li>
//               <li className="nav-item">
//                 <NavLink className={navLinkClass} to="/users">
//                   Người dùng
//                 </NavLink>
//               </li>
//               <li className="nav-item">
//                 <NavLink className={navLinkClass} to="/tenants">
//                   Khách hàng
//                 </NavLink>
//               </li>
//             </ul>
//             <div className="d-flex align-items-center gap-2 flex-wrap">
//               <Checkbox
//                 className="form-switch lang-switch mb-0" // Thêm class này của Bootstrap 5
//                 value={i18n.language === 'en'} // true nếu là tiếng Anh
//                 onChange={(isEn) => i18n.changeLanguage(isEn ? 'en' : 'vi')}
//               />
//               <span className="navbar-text small text-body-secondary">
//                 {currentUser?.name ?? currentUser?.email}
//               </span>
//               <button
//                 type="button"
//                 className="btn btn-outline-secondary btn-sm"
//                 onClick={handleLogout}
//               >
//                 Đăng xuất
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>
//       <main className="container py-4 flex-grow-1">
//         <Outlet />
//       </main>
//     </div>
//   )
// }

import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { useState } from 'react'

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className="d-flex flex-grow-1 overflow-hidden">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        <main className="flex-grow-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}