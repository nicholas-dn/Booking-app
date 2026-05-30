import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../context/AuthContext'
import { useBooking } from '../../context/BookingContext'

const STEPS = ['Select Service', 'Choose Time', 'Confirm']

export default function BookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { staffList, services, timeSlots, createBooking } = useBooking()

  const staff = staffList.find(s => s.id === Number(id))
  const staffServices = staff ? services.filter(s => staff.services.includes(s.id)) : []

  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState({ service: null, date: '', time: '', note: '' })
  const [submitted, setSubmitted] = useState(false)
  const [booking, setBooking] = useState(null)

  if (!staff) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 48 }}>🔍</p>
          <h2 style={{ color: '#fff', marginBottom: 12 }}>Stylist not found</h2>
          <Link to="/browse"><button className="btn-gold">Back to Browse</button></Link>
        </div>
      </div>
    </div>
  )

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 48 }}>🔒</p>
          <h2 style={{ color: '#fff', marginBottom: 12 }}>Login to book</h2>
          <Link to="/login"><button className="btn-gold">Login</button></Link>
        </div>
      </div>
    </div>
  )

  function handleConfirm() {
    const newBooking = createBooking({
      customerId: user.id,
      customerName: user.name,
      staffId: staff.id,
      staffName: staff.name,
      service: selected.service.name,
      price: selected.service.price,
      date: selected.date,
      time: selected.time,
      note: selected.note,
    })
    setBooking(newBooking)
    setSubmitted(true)
  }

  if (submitted) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="card" style={{ maxWidth: 480, width: '100%', textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Booking Confirmed!</h2>
          <p style={{ color: '#9ca3af', marginBottom: 24 }}>Your appointment has been booked successfully.</p>
          <div style={{ background: '#111', borderRadius: 10, padding: 20, marginBottom: 24, textAlign: 'left' }}>
            {[
              ['Service', booking.service],
              ['With', staff.name],
              ['Date', booking.date],
              ['Time', booking.time],
              ['Total', `₦${booking.price.toLocaleString()}`],
              ['Status', 'Pending Confirmation'],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1f1f1f', fontSize: 14 }}>
                <span style={{ color: '#9ca3af' }}>{label}</span>
                <span style={{ fontWeight: 600, color: label === 'Total' ? '#c9a84c' : '#f5f5f5' }}>{val}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => navigate('/my-bookings')} className="btn-gold" style={{ flex: 1 }}>View My Bookings</button>
            <button onClick={() => navigate('/browse')} className="btn-outline" style={{ flex: 1 }}>Browse More</button>
          </div>
        </div>
      </div>
    </div>
  )

  const today = new Date().toISOString().split('T')[0]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, maxWidth: 700, margin: '0 auto', width: '100%', padding: '40px 24px' }}>
        <div style={{ marginBottom: 28 }}>
          <Link to={`/staff-profile/${staff.id}`} style={{ color: '#9ca3af', textDecoration: 'none', fontSize: 13 }}>← Back to {staff.name}'s profile</Link>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginTop: 10 }}>Book with {staff.name}</h1>
        </div>

        {/* Stepper */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 32 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 13, transition: 'all 0.3s',
                  background: i < step ? '#c9a84c' : i === step ? '#c9a84c' : '#2a2a2a',
                  color: i <= step ? '#0f0f0f' : '#9ca3af',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 11, color: i <= step ? '#c9a84c' : '#6b7280', marginTop: 6, fontWeight: 600 }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ height: 2, flex: 1, background: i < step ? '#c9a84c' : '#2a2a2a', marginBottom: 18 }} />}
            </div>
          ))}
        </div>

        {/* Step 0: Select Service */}
        {step === 0 && (
          <div className="card">
            <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Select a Service</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {staffServices.map(s => (
                <div key={s.id} onClick={() => setSelected(p => ({ ...p, service: s }))}
                  style={{
                    padding: '14px 16px', borderRadius: 10, border: '2px solid', cursor: 'pointer', transition: 'all 0.2s',
                    borderColor: selected.service?.id === s.id ? '#c9a84c' : '#2a2a2a',
                    background: selected.service?.id === s.id ? 'rgba(201,168,76,0.08)' : '#111',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 15 }}>{s.name}</p>
                    <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 2 }}>⏱ {s.duration} min</p>
                  </div>
                  <span style={{ color: '#c9a84c', fontWeight: 700, fontSize: 16 }}>₦{s.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <button className="btn-gold" onClick={() => setStep(1)} disabled={!selected.service} style={{ width: '100%', marginTop: 20, padding: '12px' }}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 1: Choose Date & Time */}
        {step === 1 && (
          <div className="card">
            <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Choose Date & Time</h2>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 8 }}>Select Date</label>
              <input className="input-dark" type="date" min={today} value={selected.date}
                onChange={e => setSelected(p => ({ ...p, date: e.target.value }))} />
            </div>
            {selected.date && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 8 }}>Select Time</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
                  {timeSlots.map(t => (
                    <button key={t} onClick={() => setSelected(p => ({ ...p, time: t }))}
                      style={{
                        padding: '9px 8px', borderRadius: 8, border: '1px solid', cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
                        borderColor: selected.time === t ? '#c9a84c' : '#2a2a2a',
                        background: selected.time === t ? 'rgba(201,168,76,0.1)' : '#111',
                        color: selected.time === t ? '#c9a84c' : '#9ca3af',
                      }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 8 }}>Special Note (optional)</label>
              <textarea className="input-dark" rows={3} placeholder="Any special requests or notes for your stylist..."
                value={selected.note} onChange={e => setSelected(p => ({ ...p, note: e.target.value }))}
                style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-outline" onClick={() => setStep(0)} style={{ flex: 1 }}>← Back</button>
              <button className="btn-gold" onClick={() => setStep(2)} disabled={!selected.date || !selected.time} style={{ flex: 2, padding: '12px' }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Confirm */}
        {step === 2 && (
          <div className="card">
            <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Confirm Booking</h2>
            <div style={{ background: '#111', borderRadius: 10, padding: 20, marginBottom: 20 }}>
              {[
                ['Stylist', staff.name],
                ['Service', selected.service?.name],
                ['Duration', `${selected.service?.duration} min`],
                ['Date', selected.date],
                ['Time', selected.time],
                ['Total', `₦${selected.service?.price.toLocaleString()}`],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1f1f1f', fontSize: 14 }}>
                  <span style={{ color: '#9ca3af' }}>{label}</span>
                  <span style={{ fontWeight: 700, color: label === 'Total' ? '#c9a84c' : '#f5f5f5', fontSize: label === 'Total' ? 16 : 14 }}>{val}</span>
                </div>
              ))}
              {selected.note && (
                <div style={{ marginTop: 12 }}>
                  <p style={{ color: '#9ca3af', fontSize: 13 }}>Note: <span style={{ color: '#d1d5db' }}>{selected.note}</span></p>
                </div>
              )}
            </div>
            <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: 12, fontSize: 13, color: '#c9a84c', marginBottom: 20 }}>
              ℹ Payment is made in-person at the salon. You'll receive confirmation from your stylist shortly.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-outline" onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</button>
              <button className="btn-gold" onClick={handleConfirm} style={{ flex: 2, padding: '12px' }}>Confirm Booking ✓</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
