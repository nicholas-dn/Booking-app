import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  function getDashboardLink() {
    if (!user) return '/login'
    if (user.role === 'admin') return '/admin'
    if (user.role === 'staff') return '/staff'
    return '/dashboard'
  }

  return (
    <nav style={{ background: '#111', borderBottom: '1px solid #2a2a2a', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link to="/" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#e879a0' }}>✂ TrimBook</span>
        </Link>

        {/* Desktop nav */}
        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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

        {/* Mobile hamburger */}
        <button className="nav-hamburger" onClick={() => setMenuOpen(m => !m)} aria-label="Menu">
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{ background: '#111', borderTop: '1px solid #2a2a2a', padding: '16px' }}>
          {!user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <button className="btn-outline" style={{ width: '100%' }}>Login</button>
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                <button className="btn-gold" style={{ width: '100%' }}>Sign Up</button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 12, borderBottom: '1px solid #2a2a2a' }}>
                <div className="avatar" style={{ width: 36, height: 36, fontSize: 14 }}>{user.avatar}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</p>
                  <p style={{ fontSize: 11, color: '#9ca3af', textTransform: 'capitalize' }}>{user.role}</p>
                </div>
              </div>
              <Link to={getDashboardLink()} onClick={() => setMenuOpen(false)}>
                <button className="btn-outline" style={{ width: '100%' }}>Dashboard</button>
              </Link>
              <button className="btn-danger" style={{ width: '100%', borderRadius: 8, padding: '10px 16px' }} onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
