import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { useBooking } from '../../context/BookingContext'

const ALL_POSSIBLE_SLOTS = [
  '7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM',
  '11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM',
  '2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM',
  '5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM',
]

export default function AdminPricing() {
  const { services, timeSlots, updateService, updateTimeSlots } = useBooking()
  const [editingService, setEditingService] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [savedService, setSavedService] = useState(null)
  const [savedSlots, setSavedSlots] = useState(false)
  const [activeSlots, setActiveSlots] = useState(new Set(timeSlots))

  function startEdit(s) {
    setEditingService(s.id)
    setEditForm({ price: s.price, duration: s.duration, name: s.name })
  }

  function saveService() {
    updateService(editingService, {
      name: editForm.name,
      price: Number(editForm.price),
      duration: Number(editForm.duration),
    })
    setSavedService(editingService)
    setEditingService(null)
    setTimeout(() => setSavedService(null), 2000)
  }

  function toggleSlot(slot) {
    setActiveSlots(prev => {
      const next = new Set(prev)
      if (next.has(slot)) next.delete(slot)
      else next.add(slot)
      return next
    })
    setSavedSlots(false)
  }

  function saveSlots() {
    const ordered = ALL_POSSIBLE_SLOTS.filter(s => activeSlots.has(s))
    updateTimeSlots(ordered)
    setSavedSlots(true)
    setTimeout(() => setSavedSlots(false), 2000)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="admin" />
      <div className="sidebar-main" style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>Pricing & Schedule</h1>
          <p style={{ color: '#9ca3af', marginTop: 4 }}>Edit service prices, durations, and available booking time slots</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'start' }}>
          {/* Services */}
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Services</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {services.map(s => (
                <div key={s.id} className="card">
                  {editingService === s.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div>
                        <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 4 }}>Service Name</label>
                        <input className="input-dark" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                          <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 4 }}>Price (£)</label>
                          <input className="input-dark" type="number" min="1" value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} />
                        </div>
                        <div>
                          <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 4 }}>Duration (min)</label>
                          <input className="input-dark" type="number" min="5" step="5" value={editForm.duration} onChange={e => setEditForm(f => ({ ...f, duration: e.target.value }))} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-gold" style={{ flex: 2 }} onClick={saveService}>Save Changes</button>
                        <button className="btn-outline" style={{ flex: 1 }} onClick={() => setEditingService(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</p>
                        <p style={{ color: '#9ca3af', fontSize: 12, marginTop: 2 }}>{s.duration} min · <span style={{ textTransform: 'capitalize' }}>{s.category}</span></p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ color: '#e879a0', fontWeight: 800, fontSize: 16 }}>£{s.price}</span>
                        {savedService === s.id && <span style={{ color: '#22c55e', fontSize: 12 }}>✓ Saved</span>}
                        <button onClick={() => startEdit(s)} className="btn-outline" style={{ padding: '5px 14px', fontSize: 12 }}>Edit</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontWeight: 700, fontSize: 18 }}>Booking Time Slots</h2>
              <button className="btn-gold" style={{ padding: '8px 18px', fontSize: 13 }} onClick={saveSlots}>
                {savedSlots ? '✓ Saved!' : 'Save Slots'}
              </button>
            </div>
            <div className="card">
              <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 16 }}>
                Toggle which time slots are available for customers to book. Currently <span style={{ color: '#e879a0', fontWeight: 700 }}>{activeSlots.size}</span> slots active.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
                {ALL_POSSIBLE_SLOTS.map(slot => {
                  const active = activeSlots.has(slot)
                  return (
                    <button key={slot} onClick={() => toggleSlot(slot)}
                      style={{
                        padding: '9px 8px', borderRadius: 8, border: '1px solid', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
                        borderColor: active ? '#e879a0' : '#2a2a2a',
                        background: active ? 'rgba(232,121,160,0.12)' : '#111',
                        color: active ? '#e879a0' : '#6b7280',
                      }}>
                      {slot}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
