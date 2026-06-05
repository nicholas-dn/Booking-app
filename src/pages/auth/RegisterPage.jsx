import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const defaultRole = searchParams.get('role') || 'customer'

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: defaultRole })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (form.password !== form.confirm) return setError('Passwords do not match')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    setTimeout(() => {
      const result = register(form.name, form.email, form.password, form.role)
      setLoading(false)
      if (result.success) {
        if (result.role === 'staff') navigate('/staff')
        else navigate('/dashboard')
      } else {
        setError(result.message)
      }
    }, 500)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#0f0f0f' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#e879a0', marginBottom: 8 }}>✂ TrimBook</div>
          </Link>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>Create your account</h2>
          <p style={{ color: '#9ca3af', marginTop: 6 }}>Join thousands of happy clients</p>
        </div>

        <div className="card">
          {/* Role Toggle */}
          <div style={{ display: 'flex', background: '#111', borderRadius: 10, padding: 4, marginBottom: 20, border: '1px solid #2a2a2a' }}>
            {[['customer', '👤 Customer'], ['staff', '✂ Stylist / Barber']].map(([val, label]) => (
              <button key={val} onClick={() => setForm(f => ({ ...f, role: val }))}
                style={{
                  flex: 1, padding: '10px 8px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                  background: form.role === val ? '#e879a0' : 'transparent',
                  color: form.role === val ? '#0f0f0f' : '#9ca3af',
                }}>
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 6 }}>Full Name</label>
              <input className="input-dark" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 6 }}>Email Address</label>
              <input className="input-dark" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 6 }}>Password</label>
              <input className="input-dark" type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 6 }}>Confirm Password</label>
              <input className="input-dark" type="password" name="confirm" placeholder="Re-enter password" value={form.confirm} onChange={handleChange} required />
            </div>

            {form.role === 'staff' && (
              <div style={{ background: 'rgba(232,121,160,0.08)', border: '1px solid rgba(232,121,160,0.2)', borderRadius: 8, padding: '12px 14px', fontSize: 13, color: '#e879a0' }}>
                ✂ You're signing up as a Stylist. Your account will be reviewed before going live.
              </div>
            )}

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#ef4444', fontSize: 13 }}>
                {error}
              </div>
            )}

            <button className="btn-gold" type="submit" disabled={loading} style={{ width: '100%', padding: '12px', fontSize: 15, marginTop: 4 }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: 14, marginTop: 20 }}>
          Already have an account? <Link to="/login" style={{ color: '#e879a0', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
