import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { useBooking } from '../../context/BookingContext'

export default function AdminUsers() {
  const { allUsers } = useAuth()
  const { getBookingsByCustomer } = useBooking()
  const [search, setSearch] = useState('')

  const customers = allUsers.filter(u => u.role === 'customer' && u.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="admin" />
      <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>Customer Management</h1>
            <p style={{ color: '#9ca3af', marginTop: 4 }}>{customers.length} registered customer{customers.length !== 1 ? 's' : ''}</p>
          </div>
          <input className="input-dark" placeholder="🔍  Search customers..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 220 }} />
        </div>

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
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar" style={{ width: 32, height: 32, fontSize: 13 }}>{u.avatar}</div>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: '#9ca3af' }}>{u.email}</td>
                    <td style={{ fontWeight: 700 }}>{userBookings.length}</td>
                    <td style={{ fontWeight: 700, color: '#22c55e' }}>{completed.length}</td>
                    <td style={{ fontWeight: 700, color: '#c9a84c' }}>₦{spent.toLocaleString()}</td>
                    <td><span className="badge badge-green">Active</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn-outline" style={{ padding: '4px 10px', fontSize: 11 }}>View</button>
                        <button className="btn-danger" style={{ padding: '4px 10px', fontSize: 11 }}>Suspend</button>
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
