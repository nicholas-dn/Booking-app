import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { useBooking } from '../../context/BookingContext'

export default function UserProfilePage() {
  const { user } = useAuth()
  const { getBookingsByCustomer } = useBooking()
  const bookings = getBookingsByCustomer(user.id)

  const [form, setForm] = useState({ name: user.name, email: user.email, phone: '+234 800 000 0000' })
  const [saved, setSaved] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const completed = bookings.filter(b => b.status === 'completed').length
  const totalSpent = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="customer" />
      <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>My Profile</h1>
          <p style={{ color: '#9ca3af', marginTop: 4 }}>Manage your account information</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 900 }}>
          {/* Profile Card */}
          <div className="card" style={{ gridColumn: '1 / -1', display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="avatar" style={{ width: 80, height: 80, fontSize: 30, border: '3px solid #c9a84c' }}>{user.avatar}</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>{user.name}</h2>
              <p style={{ color: '#9ca3af', marginTop: 4 }}>{user.email}</p>
              <span className="badge badge-gold" style={{ marginTop: 8 }}>Customer</span>
            </div>
            <div style={{ display: 'flex', gap: 28 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#c9a84c' }}>{bookings.length}</div>
                <div style={{ color: '#9ca3af', fontSize: 12 }}>Total Bookings</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#22c55e' }}>{completed}</div>
                <div style={{ color: '#9ca3af', fontSize: 12 }}>Completed</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#c9a84c' }}>£{totalSpent.toLocaleString()}</div>
                <div style={{ color: '#9ca3af', fontSize: 12 }}>Total Spent</div>
              </div>
            </div>
          </div>

          {/* Edit Info */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Personal Information</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 6 }}>Full Name</label>
                <input className="input-dark" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 6 }}>Email Address</label>
                <input className="input-dark" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 6 }}>Phone Number</label>
                <input className="input-dark" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <button type="submit" className="btn-gold" style={{ marginTop: 4 }}>
                {saved ? '✓ Saved!' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Password */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Change Password</h3>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={e => e.preventDefault()}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 6 }}>Current Password</label>
                <input className="input-dark" type="password" placeholder="••••••••" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 6 }}>New Password</label>
                <input className="input-dark" type="password" placeholder="Min. 6 characters" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 6 }}>Confirm New Password</label>
                <input className="input-dark" type="password" placeholder="Re-enter new password" />
              </div>
              <button type="submit" className="btn-outline" style={{ marginTop: 4 }}>Update Password</button>
            </form>
          </div>

          {/* Notifications */}
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Notification Preferences</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['Booking Confirmations', 'Get notified when your booking is confirmed', true],
                ['Appointment Reminders', 'Reminders 24hrs and 1hr before your appointment', true],
                ['Promotions & Offers', 'Special deals from your favourite stylists', false],
              ].map(([title, desc, checked]) => (
                <div key={title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#111', borderRadius: 8 }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{title}</p>
                    <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 2 }}>{desc}</p>
                  </div>
                  <div style={{
                    width: 44, height: 24, borderRadius: 12, background: checked ? '#c9a84c' : '#2a2a2a', cursor: 'pointer', position: 'relative', transition: 'all 0.2s',
                  }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: checked ? 23 : 3, transition: 'all 0.2s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
