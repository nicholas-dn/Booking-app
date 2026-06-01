import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { useBooking } from '../../context/BookingContext'

const STATUS_COLOR = { confirmed: 'badge-green', pending: 'badge-gold', completed: 'badge-blue', cancelled: 'badge-red' }
const TABS = ['all', 'pending', 'confirmed', 'completed', 'cancelled']

export default function StaffBookings() {
  const { user } = useAuth()
  const { getBookingsByStaff, updateBookingStatus } = useBooking()
  const [activeTab, setActiveTab] = useState('all')

  const bookings = getBookingsByStaff(user.id)
  const filtered = bookings.filter(b => activeTab === 'all' || b.status === activeTab)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="staff" />
      <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>My Bookings</h1>
          <p style={{ color: '#9ca3af', marginTop: 4 }}>{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#111', borderRadius: 10, padding: 4, border: '1px solid #2a2a2a', width: 'fit-content', flexWrap: 'wrap' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.2s', textTransform: 'capitalize',
                background: activeTab === tab ? '#c9a84c' : 'transparent',
                color: activeTab === tab ? '#0f0f0f' : '#9ca3af',
              }}>
              {tab} {activeTab === tab ? `(${filtered.length})` : ''}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
            <p>No {activeTab !== 'all' ? activeTab : ''} bookings</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map(b => (
              <div key={b.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div className="avatar">{b.customerName[0]}</div>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: 15 }}>{b.customerName}</h3>
                      <p style={{ color: '#c9a84c', fontSize: 13, fontWeight: 600, marginTop: 2 }}>{b.service}</p>
                      <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
                        <span style={{ color: '#9ca3af', fontSize: 13 }}>📅 {b.date}</span>
                        <span style={{ color: '#9ca3af', fontSize: 13 }}>⏰ {b.time}</span>
                        <span style={{ color: '#c9a84c', fontWeight: 700 }}>£{b.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <span className={`badge ${STATUS_COLOR[b.status]}`}>{b.status}</span>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {b.status === 'pending' && (
                        <button className="btn-gold" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => updateBookingStatus(b.id, 'confirmed')}>Confirm</button>
                      )}
                      {b.status === 'confirmed' && (
                        <button className="btn-gold" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => updateBookingStatus(b.id, 'completed')}>Mark Complete</button>
                      )}
                      {(b.status === 'pending' || b.status === 'confirmed') && (
                        <button className="btn-danger" style={{ padding: '6px 14px' }} onClick={() => updateBookingStatus(b.id, 'cancelled')}>Cancel</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
