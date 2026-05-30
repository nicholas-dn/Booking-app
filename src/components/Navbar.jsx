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
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#c9a84c' }}>✂ TrimBook</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!user ? (
            <>
              <Link to="/login"><button className="btn-outline" style={{ padding: '8px 18px' }}>Login</button></Link>
              <Link to="/register"><button className="btn-gold" style={{ padding: '8px 18px' }}>Sign Up</button></Link>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Link to={getDashboardLink()} style={{ textDecoration: 'none' }}>
                <button className="btn-outline" style={{ padding: '8px 18px' }}>Dashboard</button>
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="avatar" style={{ width: 36, height: 36, fontSize: 14 }}>{user.avatar}</div>
                <div style={{ display: 'none' }}>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</p>
                  <p style={{ fontSize: 11, color: '#9ca3af', textTransform: 'capitalize' }}>{user.role}</p>
                </div>
              </div>
              <button className="btn-danger" style={{ padding: '8px 16px', fontSize: 13 }} onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
