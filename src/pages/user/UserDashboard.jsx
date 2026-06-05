import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { useBooking } from '../../context/BookingContext'

export default function UserDashboard() {
  const { user } = useAuth()
  const { getBookingsByCustomer } = useBooking()
  const bookings = getBookingsByCustomer(user.id)

  const upcoming = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending')
  const completed = bookings.filter(b => b.status === 'completed')
  const cancelled = bookings.filter(b => b.status === 'cancelled')

  const statusColor = { confirmed: 'badge-green', pending: 'badge-gold', completed: 'badge-blue', cancelled: 'badge-red' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="customer" />
      <div className="sidebar-main" style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>Welcome back, {user.name.split(' ')[0]} 👋</h1>
          <p style={{ color: '#9ca3af', marginTop: 4 }}>Here's your booking overview</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Upcoming', value: upcoming.length, icon: '📅', color: '#e879a0' },
            { label: 'Completed', value: completed.length, icon: '✅', color: '#22c55e' },
            { label: 'Cancelled', value: cancelled.length, icon: '❌', color: '#ef4444' },
            { label: 'Total', value: bookings.length, icon: '📊', color: '#3b82f6' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ color: '#9ca3af', fontSize: 13 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ marginBottom: 28 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Quick Actions</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/browse"><button className="btn-gold">+ Book Appointment</button></Link>
            <Link to="/my-bookings"><button className="btn-outline">View All Bookings</button></Link>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700 }}>Upcoming Appointments ({upcoming.length})</h3>
            <Link to="/my-bookings" style={{ color: '#e879a0', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
          </div>
          {upcoming.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
              <p>No upcoming appointments</p>
              <Link to="/browse"><button className="btn-gold" style={{ marginTop: 12 }}>Book Now</button></Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {upcoming.map(b => (
                <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', borderRadius: 10, padding: '14px 16px', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div className="avatar">{b.staffName[0]}</div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>{b.service}</p>
                      <p style={{ color: '#9ca3af', fontSize: 13 }}>with {b.staffName}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>£{b.price.toLocaleString()}</p>
                    <p style={{ color: '#9ca3af', fontSize: 12 }}>{b.date} · {b.time}</p>
                    <span className={`badge ${statusColor[b.status]}`} style={{ marginTop: 4 }}>{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
