import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const result = login(form.email, form.password)
      setLoading(false)
      if (result.success) {
        if (result.role === 'admin') navigate('/admin')
        else if (result.role === 'staff') navigate('/staff')
        else navigate('/dashboard')
      } else {
        setError(result.message)
      }
    }, 500)
  }

  const DEMO_ACCOUNTS = [
    { label: 'Customer', email: 'user@trimbook.com', password: 'user123' },
    { label: 'Barber (James)', email: 'james@trimbook.com', password: 'staff123' },
    { label: 'Admin', email: 'admin@trimbook.com', password: 'admin123' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#0f0f0f' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#c9a84c', marginBottom: 8 }}>✂ TrimBook</div>
          </Link>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>Welcome back</h2>
          <p style={{ color: '#9ca3af', marginTop: 6 }}>Sign in to your account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 6 }}>Email Address</label>
              <input className="input-dark" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 6 }}>Password</label>
              <input className="input-dark" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#ef4444', fontSize: 13 }}>
                {error}
              </div>
            )}
            <button className="btn-gold" type="submit" disabled={loading} style={{ width: '100%', padding: '12px', fontSize: 15 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Demo accounts */}
        <div className="card" style={{ marginTop: 16 }}>
          <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Login (Demo)</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DEMO_ACCOUNTS.map(acc => (
              <button key={acc.label} onClick={() => setForm({ email: acc.email, password: acc.password })}
                style={{ background: '#2a2a2a', border: '1px solid #333', borderRadius: 8, padding: '8px 12px', color: '#d1d5db', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                <span style={{ fontWeight: 600 }}>{acc.label}</span>
                <span style={{ color: '#6b7280' }}>{acc.email}</span>
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: 14, marginTop: 20 }}>
          Don't have an account? <Link to="/register" style={{ color: '#c9a84c', textDecoration: 'none', fontWeight: 600 }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}
