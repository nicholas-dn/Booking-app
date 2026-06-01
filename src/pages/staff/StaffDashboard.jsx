import Sidebar from '../../components/Sidebar'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useBooking } from '../../context/BookingContext'

const STATUS_COLOR = { confirmed: 'badge-green', pending: 'badge-gold', completed: 'badge-blue', cancelled: 'badge-red' }

export default function StaffDashboard() {
  const { user } = useAuth()
  const { getBookingsByStaff, updateBookingStatus } = useBooking()
  const bookings = getBookingsByStaff(user.id)

  const today = new Date().toISOString().split('T')[0]
  const todayBookings = bookings.filter(b => b.date === today)
  const upcoming = bookings.filter(b => (b.status === 'confirmed' || b.status === 'pending') && b.date >= today)
  const completed = bookings.filter(b => b.status === 'completed')
  const revenue = completed.reduce((sum, b) => sum + b.price, 0)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="staff" />
      <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>Welcome, {user.name.split(' ')[0]} ✂</h1>
          <p style={{ color: '#9ca3af', marginTop: 4 }}>Here's your schedule overview</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: "Today's Appts", value: todayBookings.length, icon: '📅', color: '#c9a84c' },
            { label: 'Upcoming', value: upcoming.length, icon: '⏳', color: '#3b82f6' },
            { label: 'Completed', value: completed.length, icon: '✅', color: '#22c55e' },
            { label: 'Total Revenue', value: `£${revenue.toLocaleString()}`, icon: '💰', color: '#c9a84c' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: s.label === 'Total Revenue' ? 20 : 28, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ color: '#9ca3af', fontSize: 13 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Today's Schedule */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700 }}>Today's Schedule</h3>
            <Link to="/staff/schedule" style={{ color: '#c9a84c', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>Full schedule →</Link>
          </div>
          {todayBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🎉</div>
              <p>No appointments today — enjoy your day off!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {todayBookings.sort((a, b) => a.time.localeCompare(b.time)).map(b => (
                <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', borderRadius: 10, padding: '14px 16px', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div className="avatar" style={{ width: 36, height: 36, fontSize: 14 }}>{b.customerName[0]}</div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>{b.customerName}</p>
                      <p style={{ color: '#9ca3af', fontSize: 12 }}>{b.service} · {b.time}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: '#c9a84c', fontWeight: 700 }}>£{b.price.toLocaleString()}</span>
                    <span className={`badge ${STATUS_COLOR[b.status]}`}>{b.status}</span>
                    {b.status === 'pending' && (
                      <button className="btn-gold" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => updateBookingStatus(b.id, 'confirmed')}>Confirm</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700 }}>Upcoming Bookings</h3>
            <Link to="/staff/bookings" style={{ color: '#c9a84c', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
          </div>
          {upcoming.slice(0, 5).map(b => (
            <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #1f1f1f' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{b.customerName}</p>
                <p style={{ color: '#9ca3af', fontSize: 13 }}>{b.service} · {b.date} at {b.time}</p>
              </div>
              <span className={`badge ${STATUS_COLOR[b.status]}`}>{b.status}</span>
            </div>
          ))}
          {upcoming.length === 0 && <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>No upcoming bookings</p>}
        </div>
      </div>
    </div>
  )
}
