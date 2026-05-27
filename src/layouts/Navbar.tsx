import { NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../reducers/hooks'
import { useTranslation } from 'react-i18next'
import { logout } from '../reducers/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import { Checkbox } from '../components/base-components/forms/inputs/Checkbox'

export function Navbar() {
    const dispatch = useAppDispatch()
    const { i18n } = useTranslation()
    const navigate = useNavigate()
    const currentUser = useAppSelector((s) => s.auth.currentUser)

    function handleLogout() {
        dispatch(logout())
        navigate('/login', { replace: true })
    }

    return (
        <nav className="navbar bg-body-tertiary border-bottom px-3" style={{ height: 56 }}>
            <NavLink className="navbar-brand fw-semibold text-primary mb-0" to="/" end>
                <i className="bi bi-house-door-fill me-2" />
                My Lease
            </NavLink>

            <div className="d-flex align-items-center gap-3 ms-auto">
                <Checkbox
                    className="form-switch lang-switch mb-0"
                    value={i18n.language === 'en'}
                    onChange={(isEn) => i18n.changeLanguage(isEn ? 'en' : 'vi')}
                />

                <div className="d-flex align-items-center gap-2">
                    <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: 32, height: 32, fontSize: 13, fontWeight: 500 }}
                    >
                        {(currentUser?.name ?? currentUser?.email ?? 'U').slice(0, 1).toUpperCase()}
                    </div>
                    <span className="small text-body-secondary">
                        {currentUser?.name ?? currentUser?.email}
                    </span>
                </div>

                <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleLogout}
                >
                    <i className="bi bi-box-arrow-right me-1" />
                    Đăng xuất
                </button>
            </div>
        </nav>
    )
}