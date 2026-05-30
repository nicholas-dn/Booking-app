import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { useBooking } from '../../context/BookingContext'

function Stars({ rating }) {
  return <span>{[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= Math.round(rating) ? '#c9a84c' : '#2a2a2a', fontSize: 16 }}>★</span>)}</span>
}

export default function StaffProfile() {
  const { user } = useAuth()
  const { getBookingsByStaff, staffList } = useBooking()
  const staffData = staffList.find(s => s.id === user.id)
  const bookings = getBookingsByStaff(user.id)

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: '+234 800 000 0001',
    bio: staffData?.bio || '',
    specialty: staffData?.specialty || '',
  })
  const [saved, setSaved] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const completed = bookings.filter(b => b.status === 'completed')
  const revenue = completed.reduce((sum, b) => sum + b.price, 0)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="staff" />
      <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>My Profile</h1>
          <p style={{ color: '#9ca3af', marginTop: 4 }}>Your public profile visible to clients</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 900 }}>
          {/* Profile overview */}
          <div className="card" style={{ gridColumn: '1 / -1', display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="avatar" style={{ width: 80, height: 80, fontSize: 30, border: '3px solid #c9a84c' }}>{user.avatar}</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>{user.name}</h2>
              <p style={{ color: '#c9a84c', fontWeight: 600, marginTop: 4 }}>{staffData?.specialty || 'Stylist'}</p>
              {staffData && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <Stars rating={staffData.rating} />
                  <span style={{ color: '#9ca3af', fontSize: 13 }}>{staffData.rating} · {staffData.reviews} reviews</span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 28 }}>
              {[
                ['Total Bookings', bookings.length, '#c9a84c'],
                ['Completed', completed.length, '#22c55e'],
                [`₦${revenue.toLocaleString()}`, 'Earned', '#c9a84c'],
              ].map(([val, label, color]) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color }}>{val}</div>
                  <div style={{ color: '#9ca3af', fontSize: 12 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Info */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Professional Info</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 6 }}>Full Name</label>
                <input className="input-dark" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 6 }}>Specialty</label>
                <select className="input-dark" value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))}>
                  <option value="Barber">Barber</option>
                  <option value="Hairdresser">Hairdresser</option>
                  <option value="Barber & Hairdresser">Barber & Hairdresser</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 6 }}>Phone Number</label>
                <input className="input-dark" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 6 }}>Bio (shown to clients)</label>
                <textarea className="input-dark" rows={4} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn-gold">{saved ? '✓ Saved!' : 'Save Changes'}</button>
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
              <button type="submit" className="btn-outline">Update Password</button>
            </form>

            <hr className="divider" />
            <h3 style={{ fontWeight: 700, marginBottom: 14 }}>Account Status</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#111', borderRadius: 8 }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>Profile Visibility</p>
                <p style={{ color: '#9ca3af', fontSize: 13 }}>Clients can find and book you</p>
              </div>
              <span className="badge badge-green">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
