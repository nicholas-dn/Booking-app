import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  function getDashboardLink() {
    if (!user) return '/login'
    if (user.role === 'admin') return '/admin'
    if (user.role === 'staff') return '/staff'
    return '/dashboard'
  }

  return (
    <nav style={{ background: '#111', borderBottom: '1px solid #2a2a2a', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#c9a84c' }}>✂ TrimBook</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!user ? (
            <>
              <Link to="/login"><button className="btn-outline" style={{ padding: '8px 18px' }}>Login</button></Link>
              <Link to="/register"><button className="btn-gold" style={{ padding: '8px 18px' }}>Sign Up</button></Link>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="avatar" style={{ width: 36, height: 36, fontSize: 14 }}>{user.avatar}</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{user.name}</p>
                <p style={{ fontSize: 11, color: '#9ca3af', textTransform: 'capitalize' }}>{user.role}</p>
              </div>
              <Link to={getDashboardLink()}>
                <button className="btn-outline" style={{ padding: '7px 14px', fontSize: 13 }}>Dashboard</button>
              </Link>
              <button className="btn-danger" style={{ padding: '8px 16px', fontSize: 13, borderRadius: 8 }} onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
