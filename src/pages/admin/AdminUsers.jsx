import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { useBooking } from '../../context/BookingContext'

export default function AdminUsers() {
  const { allUsers, toggleUserActive } = useAuth()
  const { getBookingsByCustomer } = useBooking()
  const [search, setSearch] = useState('')
  const [viewUser, setViewUser] = useState(null)
  const [confirmSuspend, setConfirmSuspend] = useState(null)

  const customers = allUsers.filter(u =>
    u.role === 'customer' &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  )

  function handleSuspendToggle(user) {
    toggleUserActive(user.id)
    setConfirmSuspend(null)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="admin" />
      <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>Customer Management</h1>
            <p style={{ color: '#9ca3af', marginTop: 4 }}>{customers.length} registered customer{customers.length !== 1 ? 's' : ''}</p>
          </div>
          <input className="input-dark" placeholder="🔍  Search customers..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 240 }} />
        </div>

        {/* Confirm suspend */}
        {confirmSuspend && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '16px 20px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ color: '#ef4444', fontWeight: 600 }}>
              {confirmSuspend.active
                ? `Suspend ${confirmSuspend.name}? They will not be able to log in.`
                : `Reactivate ${confirmSuspend.name}? They will regain access.`}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-danger" onClick={() => handleSuspendToggle(confirmSuspend)}>
                {confirmSuspend.active ? 'Yes, Suspend' : 'Yes, Reactivate'}
              </button>
              <button onClick={() => setConfirmSuspend(null)} style={{ background: '#2a2a2a', border: 'none', borderRadius: 8, padding: '8px 16px', color: '#9ca3af', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
            </div>
          </div>
        )}

        {/* User Detail Modal */}
        {viewUser && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div className="card" style={{ maxWidth: 480, width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontWeight: 700, fontSize: 18 }}>Customer Details</h3>
                <button onClick={() => setViewUser(null)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 20 }}>✕</button>
              </div>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 20 }}>
                <div className="avatar" style={{ width: 56, height: 56, fontSize: 22, border: '2px solid #c9a84c' }}>{viewUser.avatar}</div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: 16 }}>{viewUser.name}</h4>
                  <p style={{ color: '#9ca3af', fontSize: 13 }}>{viewUser.email}</p>
                  <span className={viewUser.active ? 'badge badge-green' : 'badge badge-red'} style={{ marginTop: 4 }}>
                    {viewUser.active ? 'Active' : 'Suspended'}
                  </span>
                </div>
              </div>
              {(() => {
                const bookings = getBookingsByCustomer(viewUser.id)
                const completed = bookings.filter(b => b.status === 'completed')
                const spent = completed.reduce((s, b) => s + b.price, 0)
                return (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                      {[['Total', bookings.length], ['Completed', completed.length], [`£${spent}`, 'Spent']].map(([val, label]) => (
                        <div key={label} style={{ background: '#111', borderRadius: 8, padding: '12px', textAlign: 'center' }}>
                          <div style={{ fontWeight: 800, color: '#c9a84c', fontSize: 18 }}>{val}</div>
                          <div style={{ color: '#9ca3af', fontSize: 12 }}>{label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', marginBottom: 8 }}>Recent Bookings</p>
                      {bookings.slice(0, 3).map(b => (
                        <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1f1f1f', fontSize: 13 }}>
                          <span style={{ color: '#9ca3af' }}>{b.service} · {b.date}</span>
                          <span style={{ color: '#c9a84c', fontWeight: 600 }}>£{b.price}</span>
                        </div>
                      ))}
                      {bookings.length === 0 && <p style={{ color: '#6b7280', fontSize: 13 }}>No bookings yet</p>}
                    </div>
                  </>
                )
              })()}
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setViewUser(null)} className="btn-outline" style={{ flex: 1 }}>Close</button>
                <button onClick={() => { setConfirmSuspend(viewUser); setViewUser(null) }}
                  style={{ flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${viewUser.active ? '#ef4444' : '#22c55e'}`, background: 'transparent', color: viewUser.active ? '#ef4444' : '#22c55e', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                  {viewUser.active ? 'Suspend User' : 'Reactivate User'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table-dark">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Total Bookings</th>
                <th>Completed</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>No customers found</td></tr>
              ) : customers.map(u => {
                const userBookings = getBookingsByCustomer(u.id)
                const completed = userBookings.filter(b => b.status === 'completed')
                const spent = completed.reduce((s, b) => s + b.price, 0)
                return (
                  <tr key={u.id} style={{ opacity: u.active ? 1 : 0.6 }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar" style={{ width: 32, height: 32, fontSize: 13 }}>{u.avatar}</div>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: '#9ca3af' }}>{u.email}</td>
                    <td style={{ fontWeight: 700 }}>{userBookings.length}</td>
                    <td style={{ fontWeight: 700, color: '#22c55e' }}>{completed.length}</td>
                    <td style={{ fontWeight: 700, color: '#c9a84c' }}>£{spent}</td>
                    <td><span className={u.active ? 'badge badge-green' : 'badge badge-red'}>{u.active ? 'Active' : 'Suspended'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn-outline" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => setViewUser(u)}>View</button>
                        <button onClick={() => setConfirmSuspend(u)}
                          style={{ padding: '4px 10px', fontSize: 11, borderRadius: 6, border: `1px solid ${u.active ? '#ef4444' : '#22c55e'}`, background: 'transparent', color: u.active ? '#ef4444' : '#22c55e', cursor: 'pointer', fontWeight: 600 }}>
                          {u.active ? 'Suspend' : 'Reactivate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
