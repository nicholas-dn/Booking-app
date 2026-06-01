import { Link, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import StaffAvatar from '../../components/StaffAvatar'
import { useBooking } from '../../context/BookingContext'

function Stars({ rating, size = 16 }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#c9a84c' : '#2a2a2a', fontSize: size }}>★</span>
      ))}
    </span>
  )
}

export default function StaffProfilePage() {
  const { id } = useParams()
  const { staffList, services, getRatingsByStaff, staffAvailability } = useBooking()
  const staff = staffList.find(s => s.id === Number(id))

  if (!staff) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 48 }}>🔍</p>
        <h2 style={{ color: '#fff', marginBottom: 12 }}>Stylist not found</h2>
        <Link to="/browse"><button className="btn-gold">Back to Browse</button></Link>
      </div>
    </div>
  )

  const staffServices = services.filter(s => staff.services.includes(s.id))
  const reviews = getRatingsByStaff(staff.id)
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : staff.rating

  // Build availability display from context
  const avail = staffAvailability[staff.id]
  const DAYS_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const DAY_LABELS = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' }
  const DEFAULT_HOURS = { Mon: '8:00 AM – 6:00 PM', Tue: '8:00 AM – 6:00 PM', Wed: '8:00 AM – 6:00 PM', Thu: '8:00 AM – 6:00 PM', Fri: '8:00 AM – 7:00 PM', Sat: '9:00 AM – 5:00 PM', Sun: 'Closed' }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, maxWidth: 900, margin: '0 auto', width: '100%', padding: '40px 24px' }}>

        {/* Profile Header */}
        <div className="card" style={{ display: 'flex', gap: 28, alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap' }}>
          <StaffAvatar staffId={staff.id} initial={staff.avatar} size={100} border />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{staff.name}</h1>
                <p style={{ color: '#c9a84c', fontWeight: 600, fontSize: 15, marginTop: 4 }}>{staff.specialty}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                  <Stars rating={Number(avgRating)} />
                  <span style={{ color: '#9ca3af', fontSize: 14 }}>{avgRating} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <Link to={`/book/${staff.id}`}>
                <button className="btn-gold" style={{ fontSize: 15, padding: '12px 28px' }}>Book Appointment</button>
              </Link>
            </div>
            <p style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.7, marginTop: 16 }}>{staff.bio}</p>
            <div style={{ display: 'flex', gap: 24, marginTop: 16, flexWrap: 'wrap' }}>
              {[['Reviews', reviews.length], ['Rating', avgRating], ['Services', staff.services.length]].map(([label, val]) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#c9a84c' }}>{val}</div>
                  <div style={{ color: '#9ca3af', fontSize: 12 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Services */}
          <div className="card">
            <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Services & Pricing</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {staffServices.map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#111', borderRadius: 8 }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</p>
                    <p style={{ color: '#9ca3af', fontSize: 12 }}>{s.duration} min</p>
                  </div>
                  <span style={{ color: '#c9a84c', fontWeight: 700, fontSize: 15 }}>£{s.price}</span>
                </div>
              ))}
            </div>
            <Link to={`/book/${staff.id}`} style={{ display: 'block', marginTop: 16 }}>
              <button className="btn-gold" style={{ width: '100%' }}>Book a Service</button>
            </Link>
          </div>

          {/* Availability */}
          <div className="card">
            <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Availability</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {DAYS_ORDER.map(day => {
                const isWorking = avail ? avail[day] : day !== 'Sun'
                return (
                  <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1f1f1f', fontSize: 14 }}>
                    <span style={{ color: '#d1d5db' }}>{DAY_LABELS[day]}</span>
                    <span style={{ color: isWorking ? '#9ca3af' : '#ef4444' }}>
                      {isWorking ? DEFAULT_HOURS[day] : 'Unavailable'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="card" style={{ marginTop: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>
            Client Reviews {reviews.length > 0 && <span style={{ color: '#9ca3af', fontSize: 14, fontWeight: 400 }}>({reviews.length})</span>}
          </h2>
          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>⭐</div>
              <p>No reviews yet. Be the first to book and leave a review!</p>
              <Link to={`/book/${staff.id}`}><button className="btn-gold" style={{ marginTop: 16 }}>Book Now</button></Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {reviews.map(r => (
                <div key={r.id} style={{ padding: '16px', background: '#111', borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{r.customerName[0]}</div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{r.customerName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Stars rating={r.rating} size={14} />
                      <span style={{ color: '#6b7280', fontSize: 12 }}>{r.date}</span>
                    </div>
                  </div>
                  {r.comment && <p style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.6 }}>{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
