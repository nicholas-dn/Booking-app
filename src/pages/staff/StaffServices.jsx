import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { useBooking } from '../../context/BookingContext'

export default function StaffServices() {
  const { user } = useAuth()
  const { services, staffList } = useBooking()
  const staffData = staffList.find(s => s.id === user.id)
  const [myServices, setMyServices] = useState(staffData?.services || [])
  const [saved, setSaved] = useState(false)

  function toggle(id) {
    setMyServices(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const myServiceDetails = services.filter(s => myServices.includes(s.id))
  const totalMin = myServiceDetails.reduce((sum, s) => sum + s.price, 0)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="staff" />
      <div className="sidebar-main" style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>My Services</h1>
          <p style={{ color: '#9ca3af', marginTop: 4 }}>Select the services you offer to clients</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, maxWidth: 900 }}>
          {/* Service Selection */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 6 }}>Available Services</h3>
            <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 20 }}>Check the services you provide</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {services.map(s => {
                const active = myServices.includes(s.id)
                return (
                  <div key={s.id} onClick={() => toggle(s.id)}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '14px 16px', borderRadius: 10, border: '2px solid', cursor: 'pointer', transition: 'all 0.2s',
                      borderColor: active ? '#c9a84c' : '#2a2a2a',
                      background: active ? 'rgba(201,168,76,0.07)' : '#111',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: 4, border: `2px solid ${active ? '#c9a84c' : '#2a2a2a'}`,
                        background: active ? '#c9a84c' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0,
                      }}>
                        {active && '✓'}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</p>
                        <p style={{ color: '#9ca3af', fontSize: 12 }}>{s.duration} min · <span style={{ textTransform: 'capitalize' }}>{s.category}</span></p>
                      </div>
                    </div>
                    <span style={{ color: '#c9a84c', fontWeight: 700 }}>£{s.price.toLocaleString()}</span>
                  </div>
                )
              })}
            </div>
            <button className="btn-gold" style={{ width: '100%', marginTop: 20 }} onClick={handleSave}>
              {saved ? '✓ Services Saved!' : 'Save My Services'}
            </button>
          </div>

          {/* Summary */}
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>My Service Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9ca3af', fontSize: 14 }}>Services offered</span>
                  <span style={{ fontWeight: 700 }}>{myServices.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9ca3af', fontSize: 14 }}>Price range</span>
                  <span style={{ fontWeight: 700, color: '#c9a84c', fontSize: 13 }}>
                    {myServiceDetails.length > 0
                      ? `£${Math.min(...myServiceDetails.map(s => s.price)).toLocaleString()} – £${Math.max(...myServiceDetails.map(s => s.price)).toLocaleString()}`
                      : '—'}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 14 }}>Active Services</h3>
              {myServiceDetails.length === 0 ? (
                <p style={{ color: '#6b7280', fontSize: 13 }}>No services selected yet</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {myServiceDetails.map(s => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <span style={{ color: '#d1d5db' }}>{s.name}</span>
                      <span style={{ color: '#c9a84c', fontWeight: 600 }}>£{s.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
