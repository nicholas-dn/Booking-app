import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { useBooking } from '../../context/BookingContext'

const STATUS_COLOR = { confirmed: 'badge-green', pending: 'badge-gold', completed: 'badge-blue', cancelled: 'badge-red' }
const TABS = ['all', 'pending', 'confirmed', 'completed', 'cancelled']

export default function AdminBookings() {
  const { bookings, updateBookingStatus } = useBooking()
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = bookings
    .filter(b => activeTab === 'all' || b.status === activeTab)
    .filter(b =>
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.staffName.toLowerCase().includes(search.toLowerCase()) ||
      b.service.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const totalRevenue = bookings.filter(b => b.status === 'completed').reduce((s, b) => s + b.price, 0)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="admin" />
      <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>All Bookings</h1>
            <p style={{ color: '#9ca3af', marginTop: 4 }}>Total Revenue: <span style={{ color: '#c9a84c', fontWeight: 700 }}>₦{totalRevenue.toLocaleString()}</span></p>
          </div>
          <input className="input-dark" placeholder="🔍  Search bookings..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 240 }} />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#111', borderRadius: 10, padding: 4, border: '1px solid #2a2a2a', width: 'fit-content', flexWrap: 'wrap' }}>
          {TABS.map(tab => {
            const count = tab === 'all' ? bookings.length : bookings.filter(b => b.status === tab).length
            return (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.2s', textTransform: 'capitalize',
                  background: activeTab === tab ? '#c9a84c' : 'transparent',
                  color: activeTab === tab ? '#0f0f0f' : '#9ca3af',
                }}>
                {tab} ({count})
              </button>
            )
          })}
        </div>

        {/* Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table-dark">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Staff</th>
                <th>Date & Time</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>No bookings found</td></tr>
              ) : filtered.map(b => (
                <tr key={b.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ width: 30, height: 30, fontSize: 12 }}>{b.customerName[0]}</div>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{b.customerName}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 14 }}>{b.service}</td>
                  <td style={{ fontSize: 14, color: '#9ca3af' }}>{b.staffName}</td>
                  <td style={{ fontSize: 13, color: '#9ca3af' }}>{b.date}<br />{b.time}</td>
                  <td style={{ fontWeight: 700, color: '#c9a84c' }}>₦{b.price.toLocaleString()}</td>
                  <td><span className={`badge ${STATUS_COLOR[b.status]}`}>{b.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {b.status === 'pending' && (
                        <button className="btn-gold" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => updateBookingStatus(b.id, 'confirmed')}>Confirm</button>
                      )}
                      {b.status === 'confirmed' && (
                        <button className="btn-gold" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => updateBookingStatus(b.id, 'completed')}>Complete</button>
                      )}
                      {(b.status === 'pending' || b.status === 'confirmed') && (
                        <button className="btn-danger" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => updateBookingStatus(b.id, 'cancelled')}>Cancel</button>
                      )}
                      {(b.status === 'completed' || b.status === 'cancelled') && (
                        <span style={{ color: '#4b5563', fontSize: 12 }}>—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
