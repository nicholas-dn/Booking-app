import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { useBooking } from '../../context/BookingContext'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const STATUS_COLOR = { confirmed: '#22c55e', pending: '#c9a84c', completed: '#3b82f6', cancelled: '#ef4444' }

function getWeekDates(offset = 0) {
  const today = new Date()
  const day = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1) + offset * 7)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d.toISOString().split('T')[0]
  })
}

export default function StaffSchedule() {
  const { user } = useAuth()
  const { getBookingsByStaff } = useBooking()
  const [weekOffset, setWeekOffset] = useState(0)
  const [availability, setAvailability] = useState({ Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: false })

  const bookings = getBookingsByStaff(user.id)
  const weekDates = getWeekDates(weekOffset)

  function bookingsForDate(date) {
    return bookings.filter(b => b.date === date && b.status !== 'cancelled')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="staff" />
      <div className="sidebar-main" style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>My Schedule</h1>
          <p style={{ color: '#9ca3af', marginTop: 4 }}>Manage your weekly availability</p>
        </div>

        {/* Week Navigator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <button onClick={() => setWeekOffset(w => w - 1)} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '8px 16px', color: '#f5f5f5', cursor: 'pointer', fontSize: 14 }}>← Prev Week</button>
          <span style={{ fontWeight: 700, color: weekOffset === 0 ? '#c9a84c' : '#f5f5f5' }}>
            {weekOffset === 0 ? 'This Week' : weekOffset === 1 ? 'Next Week' : `Week ${weekOffset > 0 ? '+' : ''}${weekOffset}`}
          </span>
          <button onClick={() => setWeekOffset(w => w + 1)} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '8px 16px', color: '#f5f5f5', cursor: 'pointer', fontSize: 14 }}>Next Week →</button>
        </div>

        {/* Calendar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10, marginBottom: 32 }}>
          {DAYS.map((day, i) => {
            const date = weekDates[i]
            const dayBookings = bookingsForDate(date)
            const isToday = date === new Date().toISOString().split('T')[0]
            const isOff = !availability[day]

            return (
              <div key={day} style={{
                background: isOff ? '#0d0d0d' : '#1a1a1a',
                border: `1px solid ${isToday ? '#c9a84c' : '#2a2a2a'}`,
                borderRadius: 10, padding: 12, minHeight: 140,
                opacity: isOff ? 0.5 : 1,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>{day}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: isToday ? '#c9a84c' : '#f5f5f5' }}>
                      {new Date(date + 'T12:00:00').getDate()}
                    </div>
                  </div>
                  {isOff && <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 700 }}>OFF</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {dayBookings.map(b => (
                    <div key={b.id} style={{
                      fontSize: 11, padding: '4px 7px', borderRadius: 5, fontWeight: 600,
                      background: `${STATUS_COLOR[b.status]}20`,
                      color: STATUS_COLOR[b.status],
                      borderLeft: `3px solid ${STATUS_COLOR[b.status]}`,
                    }}>
                      {b.time} – {b.customerName.split(' ')[0]}
                    </div>
                  ))}
                  {dayBookings.length === 0 && !isOff && (
                    <p style={{ fontSize: 11, color: '#4b5563' }}>Free</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Availability Toggles */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Working Days</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {DAYS.map(day => (
              <button key={day} onClick={() => setAvailability(a => ({ ...a, [day]: !a[day] }))}
                style={{
                  padding: '10px 18px', borderRadius: 8, border: '2px solid', cursor: 'pointer', fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
                  borderColor: availability[day] ? '#c9a84c' : '#2a2a2a',
                  background: availability[day] ? 'rgba(201,168,76,0.1)' : '#111',
                  color: availability[day] ? '#c9a84c' : '#6b7280',
                }}>
                {day}
              </button>
            ))}
          </div>
          <p style={{ color: '#6b7280', fontSize: 12, marginTop: 12 }}>Click to toggle your working days. Customers can only book on your working days.</p>
        </div>
      </div>
    </div>
  )
}
