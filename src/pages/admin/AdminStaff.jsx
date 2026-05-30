import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { useBooking } from '../../context/BookingContext'

function Stars({ rating }) {
  return <span>{[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= Math.round(rating) ? '#c9a84c' : '#2a2a2a', fontSize: 13 }}>★</span>)}</span>
}

export default function AdminStaff() {
  const { staffList, bookings } = useBooking()
  const [search, setSearch] = useState('')

  const filtered = staffList.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.specialty.toLowerCase().includes(search.toLowerCase()))

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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {filtered.map(s => {
            const staffBookings = bookings.filter(b => b.staffId === s.id)
            const completed = staffBookings.filter(b => b.status === 'completed')
            const revenue = completed.reduce((sum, b) => sum + b.price, 0)
            const upcoming = staffBookings.filter(b => b.status === 'confirmed' || b.status === 'pending')

            return (
              <div key={s.id} className="card">
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
                  <div className="avatar" style={{ width: 52, height: 52, fontSize: 20, border: '2px solid #c9a84c', flexShrink: 0 }}>{s.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 16 }}>{s.name}</h3>
                    <p style={{ color: '#c9a84c', fontSize: 13, fontWeight: 600 }}>{s.specialty}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <Stars rating={s.rating} />
                      <span style={{ color: '#9ca3af', fontSize: 12 }}>{s.rating} ({s.reviews})</span>
                    </div>
                  </div>
                  <span className="badge badge-green">Active</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                  {[
                    ['Bookings', staffBookings.length, '#c9a84c'],
                    ['Upcoming', upcoming.length, '#3b82f6'],
                    ['Revenue', `₦${(revenue/1000).toFixed(0)}k`, '#22c55e'],
                  ].map(([label, val, color]) => (
                    <div key={label} style={{ background: '#111', borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, color, fontSize: 15 }}>{val}</div>
                      <div style={{ color: '#6b7280', fontSize: 11 }}>{label}</div>
                    </div>
                  ))}
                </div>

                <p style={{ color: '#9ca3af', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>{s.bio}</p>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-outline" style={{ flex: 1, fontSize: 12, padding: '7px' }}>View Profile</button>
                  <button className="btn-danger" style={{ flex: 1, fontSize: 12 }}>Suspend</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
