import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const STAFF_LINKS = [
  { to: '/staff', label: 'Dashboard', icon: '⊞' },
  { to: '/staff/bookings', label: 'Bookings', icon: '📅' },
  { to: '/staff/schedule', label: 'Schedule', icon: '🗓' },
  { to: '/staff/services', label: 'Services', icon: '✂' },
  { to: '/staff/profile', label: 'Profile', icon: '👤' },
]

const ADMIN_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: '⊞' },
  { to: '/admin/bookings', label: 'Bookings', icon: '📅' },
  { to: '/admin/staff', label: 'Staff', icon: '✂' },
  { to: '/admin/users', label: 'Customers', icon: '👥' },
  { to: '/admin/pricing', label: 'Pricing', icon: '💷' },
  { to: '/admin/testimonials', label: 'Reviews', icon: '⭐' },
  { to: '/admin/support', label: 'Support', icon: '💬' },
]

const CUSTOMER_LINKS = [
  { to: '/dashboard', label: 'Overview', icon: '⊞' },
  { to: '/browse', label: 'Browse', icon: '🔍' },
  { to: '/my-bookings', label: 'Bookings', icon: '📅' },
  { to: '/profile', label: 'Profile', icon: '👤' },
]

export default function Sidebar({ role }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const links = role === 'staff' ? STAFF_LINKS : role === 'admin' ? ADMIN_LINKS : CUSTOMER_LINKS

  function handleLogout() { logout(); navigate('/') }

  useEffect(() => {
    document.body.classList.add('has-bottom-nav')
    return () => document.body.classList.remove('has-bottom-nav')
  }, [])

  return (
    <div className="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="sidebar-header" style={{ padding: '20px 16px', borderBottom: '1px solid #2a2a2a' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#e879a0' }}>✂ TrimBook</span>
        </Link>
      </div>

      <div className="sidebar-user" style={{ padding: '16px 12px', borderBottom: '1px solid #2a2a2a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="avatar">{user?.avatar}</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</p>
            <p style={{ fontSize: 11, color: '#9ca3af', textTransform: 'capitalize' }}>{user?.role}</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav" style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {links.map(({ to, label, icon }) => {
          const isActive = location.pathname === to
          return (
            <Link key={to} to={to} className={`nav-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">{icon}</span>
              <span className="nav-label">{label}</span>
            </Link>
          )
        })}
        {/* Mobile-only logout tab — hidden on desktop via CSS */}
        <button className="nav-logout-tab" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          <span>Logout</span>
        </button>
      </nav>

      <div className="sidebar-logout" style={{ padding: '12px 8px', borderTop: '1px solid #2a2a2a' }}>
        <button onClick={handleLogout}
          style={{ width: '100%', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 16px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, fontSize: 14 }}>
          <span>🚪</span><span>Logout</span>
        </button>
      </div>
    </div>
  )
}
