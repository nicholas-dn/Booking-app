import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { useBooking } from '../../context/BookingContext'
import { useAuth } from '../../context/AuthContext'

const STATUS_COLOR = { confirmed: 'badge-green', pending: 'badge-gold', completed: 'badge-blue', cancelled: 'badge-red' }

export default function AdminDashboard() {
  const { bookings, staffList } = useBooking()
  const { allUsers } = useAuth()

  const customers = allUsers.filter(u => u.role === 'customer')
  const revenue = bookings.filter(b => b.status === 'completed').reduce((s, b) => s + b.price, 0)
  const today = new Date().toISOString().split('T')[0]
  const todayBookings = bookings.filter(b => b.date === today)
  const pending = bookings.filter(b => b.status === 'pending')

  const recentBookings = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="admin" />
      <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>Admin Dashboard</h1>
          <p style={{ color: '#9ca3af', marginTop: 4 }}>TrimBook platform overview</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Bookings', value: bookings.length, icon: '📅', color: '#c9a84c' },
            { label: "Today's Bookings", value: todayBookings.length, icon: '📆', color: '#3b82f6' },
            { label: 'Pending Review', value: pending.length, icon: '⏳', color: '#f59e0b' },
            { label: 'Total Revenue', value: `₦${revenue.toLocaleString()}`, icon: '💰', color: '#22c55e' },
            { label: 'Active Staff', value: staffList.length, icon: '✂', color: '#c9a84c' },
            { label: 'Customers', value: customers.length, icon: '👥', color: '#8b5cf6' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: s.label === 'Total Revenue' ? 18 : 26, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ color: '#9ca3af', fontSize: 12 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Alerts */}
        {pending.length > 0 && (
          <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10, padding: '14px 18px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#f59e0b', fontSize: 14 }}>⚠ {pending.length} booking{pending.length > 1 ? 's' : ''} awaiting confirmation by staff</span>
            <Link to="/admin/bookings"><button className="btn-gold" style={{ padding: '6px 14px', fontSize: 13 }}>Review</button></Link>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Recent Bookings */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700 }}>Recent Bookings</h3>
              <Link to="/admin/bookings" style={{ color: '#c9a84c', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentBookings.map(b => (
                <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#111', borderRadius: 8 }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13 }}>{b.customerName}</p>
                    <p style={{ color: '#9ca3af', fontSize: 12 }}>{b.service} · {b.date}</p>
                  </div>
                  <span className={`badge ${STATUS_COLOR[b.status]}`}>{b.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Staff Performance */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700 }}>Staff Performance</h3>
              <Link to="/admin/staff" style={{ color: '#c9a84c', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {staffList.map(s => {
                const staffBookings = bookings.filter(b => b.staffId === s.id)
                const staffRevenue = staffBookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0)
                return (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="avatar" style={{ width: 36, height: 36, fontSize: 14 }}>{s.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</span>
                        <span style={{ color: '#c9a84c', fontSize: 13, fontWeight: 700 }}>₦{staffRevenue.toLocaleString()}</span>
                      </div>
                      <div style={{ height: 4, background: '#2a2a2a', borderRadius: 2 }}>
                        <div style={{ height: '100%', background: '#c9a84c', borderRadius: 2, width: `${Math.min((staffBookings.length / bookings.length) * 100 * 2, 100)}%` }} />
                      </div>
                      <p style={{ color: '#6b7280', fontSize: 11, marginTop: 3 }}>{staffBookings.length} bookings · ⭐ {s.rating}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
