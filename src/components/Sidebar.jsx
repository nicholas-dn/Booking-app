import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const STAFF_LINKS = [
  { to: '/staff', label: 'Dashboard', icon: '⊞' },
  { to: '/staff/bookings', label: 'My Bookings', icon: '📅' },
  { to: '/staff/schedule', label: 'Schedule', icon: '🗓' },
  { to: '/staff/services', label: 'Services', icon: '✂' },
  { to: '/staff/profile', label: 'My Profile', icon: '👤' },
]

const ADMIN_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: '⊞' },
  { to: '/admin/bookings', label: 'All Bookings', icon: '📅' },
  { to: '/admin/staff', label: 'Staff', icon: '✂' },
  { to: '/admin/users', label: 'Customers', icon: '👥' },
  { to: '/admin/support', label: 'Support', icon: '💬' },
]

const CUSTOMER_LINKS = [
  { to: '/dashboard', label: 'Overview', icon: '⊞' },
  { to: '/browse', label: 'Browse', icon: '🔍' },
  { to: '/my-bookings', label: 'My Bookings', icon: '📅' },
  { to: '/profile', label: 'Profile', icon: '👤' },
]

export default function Sidebar({ role }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const links = role === 'staff' ? STAFF_LINKS : role === 'admin' ? ADMIN_LINKS : CUSTOMER_LINKS

  function handleLogout() { logout(); navigate('/') }

  return (
    <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', padding: '0' }}>
      <div style={{ padding: '20px 16px', borderBottom: '1px solid #2a2a2a' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#c9a84c' }}>✂ TrimBook</span>
        </Link>
      </div>

      <div style={{ padding: '16px 12px', borderBottom: '1px solid #2a2a2a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="avatar">{user?.avatar}</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</p>
            <p style={{ fontSize: 11, color: '#9ca3af', textTransform: 'capitalize' }}>{user?.role}</p>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 8px' }}>
        {links.map(({ to, label, icon }) => {
          const isActive = location.pathname === to
          return (
            <Link key={to} to={to} className={`nav-link ${isActive ? 'active' : ''}`}>
              <span>{icon}</span>
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '12px 8px', borderTop: '1px solid #2a2a2a' }}>
        <button className="nav-link" onClick={handleLogout} style={{ width: '100%', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
          <span>🚪</span><span>Logout</span>
        </button>
      </div>
    </div>
  )
}
