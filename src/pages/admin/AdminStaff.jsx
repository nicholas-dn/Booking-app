import { useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { useBooking } from '../../context/BookingContext'

function Stars({ rating }) {
  return <span>{[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= Math.round(rating) ? '#c9a84c' : '#2a2a2a', fontSize: 13 }}>★</span>)}</span>
}

export default function AdminStaff() {
  const { staffList, bookings, toggleSuspend, isSuspended } = useBooking()
  const [search, setSearch] = useState('')
  const [confirmSuspend, setConfirmSuspend] = useState(null)

  const filtered = staffList.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.specialty.toLowerCase().includes(search.toLowerCase())
  )

  function handleSuspendToggle(id) {
    toggleSuspend(id)
    setConfirmSuspend(null)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="admin" />
      <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>Staff Management</h1>
            <p style={{ color: '#9ca3af', marginTop: 4 }}>{staffList.length} stylists on the platform</p>
          </div>
          <input className="input-dark" placeholder="🔍  Search staff..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 220 }} />
        </div>

        {/* Confirm suspend dialog */}
        {confirmSuspend && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '16px 20px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ color: '#ef4444', fontWeight: 600 }}>
              {isSuspended(confirmSuspend.id)
                ? `Reactivate ${confirmSuspend.name}? They will be able to receive bookings again.`
                : `Suspend ${confirmSuspend.name}? Their profile will be hidden from clients.`}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-danger" onClick={() => handleSuspendToggle(confirmSuspend.id)}>
                {isSuspended(confirmSuspend.id) ? 'Yes, Reactivate' : 'Yes, Suspend'}
              </button>
              <button onClick={() => setConfirmSuspend(null)} style={{ background: '#2a2a2a', border: 'none', borderRadius: 8, padding: '8px 16px', color: '#9ca3af', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {filtered.map(s => {
            const staffBookings = bookings.filter(b => b.staffId === s.id)
            const completed = staffBookings.filter(b => b.status === 'completed')
            const revenue = completed.reduce((sum, b) => sum + b.price, 0)
            const upcoming = staffBookings.filter(b => b.status === 'confirmed' || b.status === 'pending')
            const suspended = isSuspended(s.id)

            return (
              <div key={s.id} className="card" style={{ opacity: suspended ? 0.7 : 1 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
                  <div className="avatar" style={{ width: 52, height: 52, fontSize: 20, border: `2px solid ${suspended ? '#ef4444' : '#c9a84c'}`, flexShrink: 0 }}>{s.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 16 }}>{s.name}</h3>
                    <p style={{ color: '#c9a84c', fontSize: 13, fontWeight: 600 }}>{s.specialty}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <Stars rating={s.rating} />
                      <span style={{ color: '#9ca3af', fontSize: 12 }}>{s.rating} ({s.reviews})</span>
                    </div>
                  </div>
                  <span className={suspended ? 'badge badge-red' : 'badge badge-green'}>{suspended ? 'Suspended' : 'Active'}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                  {[
                    ['Bookings', staffBookings.length, '#c9a84c'],
                    ['Upcoming', upcoming.length, '#3b82f6'],
                    ['Revenue', `£${revenue}`, '#22c55e'],
                  ].map(([label, val, color]) => (
                    <div key={label} style={{ background: '#111', borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, color, fontSize: 14 }}>{val}</div>
                      <div style={{ color: '#6b7280', fontSize: 11 }}>{label}</div>
                    </div>
                  ))}
                </div>

                <p style={{ color: '#9ca3af', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>{s.bio}</p>

                <div style={{ display: 'flex', gap: 8 }}>
                  <Link to={`/staff-profile/${s.id}`} style={{ flex: 1 }}>
                    <button className="btn-outline" style={{ width: '100%', fontSize: 12, padding: '7px' }}>View Profile</button>
                  </Link>
                  <button
                    onClick={() => setConfirmSuspend(s)}
                    style={{
                      flex: 1, fontSize: 12, padding: '7px', borderRadius: 8, border: `1px solid ${suspended ? '#22c55e' : '#ef4444'}`,
                      background: 'transparent', color: suspended ? '#22c55e' : '#ef4444', cursor: 'pointer', fontWeight: 600,
                    }}>
                    {suspended ? 'Reactivate' : 'Suspend'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
