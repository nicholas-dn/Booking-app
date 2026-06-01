import { useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import RatingModal from '../../components/RatingModal'
import { useAuth } from '../../context/AuthContext'
import { useBooking } from '../../context/BookingContext'

const STATUS_COLOR = { confirmed: 'badge-green', pending: 'badge-gold', completed: 'badge-blue', cancelled: 'badge-red' }
const TABS = ['all', 'upcoming', 'completed', 'cancelled']

export default function MyBookingsPage() {
  const { user } = useAuth()
  const { getBookingsByCustomer, updateBookingStatus } = useBooking()
  const [activeTab, setActiveTab] = useState('all')
  const [cancelling, setCancelling] = useState(null)
  const [ratingBooking, setRatingBooking] = useState(null)

  const bookings = getBookingsByCustomer(user.id)

  const filtered = bookings.filter(b => {
    if (activeTab === 'all') return true
    if (activeTab === 'upcoming') return b.status === 'confirmed' || b.status === 'pending'
    return b.status === activeTab
  }).sort((a, b) => new Date(b.date) - new Date(a.date))

  function handleCancel(id) {
    updateBookingStatus(id, 'cancelled')
    setCancelling(null)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="customer" />
      <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>My Bookings</h1>
            <p style={{ color: '#9ca3af', marginTop: 4 }}>{bookings.length} total appointment{bookings.length !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/browse"><button className="btn-gold">+ New Booking</button></Link>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#111', borderRadius: 10, padding: 4, border: '1px solid #2a2a2a', width: 'fit-content' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.2s', textTransform: 'capitalize',
                background: activeTab === tab ? '#c9a84c' : 'transparent',
                color: activeTab === tab ? '#0f0f0f' : '#9ca3af',
              }}>
              {tab}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
            <p style={{ fontSize: 16, marginBottom: 16 }}>No {activeTab !== 'all' ? activeTab : ''} bookings found</p>
            <Link to="/browse"><button className="btn-gold">Book an Appointment</button></Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map(b => (
              <div key={b.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div className="avatar" style={{ border: '2px solid #2a2a2a' }}>{b.staffName[0]}</div>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: 16 }}>{b.service}</h3>
                      <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 2 }}>with {b.staffName}</p>
                      <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
                        <span style={{ color: '#9ca3af', fontSize: 13 }}>📅 {b.date}</span>
                        <span style={{ color: '#9ca3af', fontSize: 13 }}>⏰ {b.time}</span>
                        <span style={{ color: '#c9a84c', fontWeight: 700, fontSize: 14 }}>£{b.price}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                    <span className={`badge ${STATUS_COLOR[b.status]}`} style={{ fontSize: 12, padding: '4px 10px' }}>{b.status}</span>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {(b.status === 'confirmed' || b.status === 'pending') && (
                        cancelling === b.id ? (
                          <>
                            <button className="btn-danger" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => handleCancel(b.id)}>Confirm Cancel</button>
                            <button onClick={() => setCancelling(null)} style={{ fontSize: 12, padding: '6px 12px', background: '#2a2a2a', border: 'none', borderRadius: 6, color: '#9ca3af', cursor: 'pointer' }}>Keep</button>
                          </>
                        ) : (
                          <button onClick={() => setCancelling(b.id)} style={{ fontSize: 12, padding: '6px 12px', background: 'transparent', border: '1px solid #ef4444', borderRadius: 6, color: '#ef4444', cursor: 'pointer' }}>
                            Cancel
                          </button>
                        )
                      )}
                      {b.status === 'completed' && !b.rated && (
                        <button className="btn-gold" style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => setRatingBooking(b)}>
                          ⭐ Leave Review
                        </button>
                      )}
                      {b.status === 'completed' && b.rated && (
                        <span style={{ fontSize: 12, color: '#22c55e' }}>✓ Reviewed</span>
                      )}
                      {b.status === 'completed' && (
                        <Link to={`/book/${b.staffId}`}><button className="btn-outline" style={{ fontSize: 12, padding: '6px 12px' }}>Rebook</button></Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {ratingBooking && <RatingModal booking={ratingBooking} onClose={() => setRatingBooking(null)} />}
    </div>
  )
}
