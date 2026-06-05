import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'

export default function RatingModal({ booking, onClose }) {
  const { user } = useAuth()
  const { addRating } = useBooking()
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit() {
    if (rating === 0) return
    addRating({
      bookingId: booking.id,
      staffId: booking.staffId,
      customerId: user.id,
      customerName: user.name,
      rating,
      comment,
    })
    setSubmitted(true)
    setTimeout(onClose, 1800)
  }

  if (submitted) return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: 380, textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <h3 style={{ fontSize: 20, fontWeight: 800 }}>Thank you!</h3>
        <p style={{ color: '#9ca3af', marginTop: 8 }}>Your review has been submitted and will appear once approved.</p>
      </div>
    </div>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card" style={{ maxWidth: 440, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800 }}>Rate Your Experience</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 16px', background: '#111', borderRadius: 10, marginBottom: 20 }}>
          <div className="avatar">{booking.staffName[0]}</div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 14 }}>{booking.staffName}</p>
            <p style={{ color: '#9ca3af', fontSize: 13 }}>{booking.service} · {booking.date}</p>
          </div>
        </div>

        <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>How was your experience?</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, justifyContent: 'center' }}>
          {[1,2,3,4,5].map(i => (
            <span key={i}
              onClick={() => setRating(i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(0)}
              style={{ fontSize: 40, cursor: 'pointer', color: i <= (hovered || rating) ? '#e879a0' : '#2a2a2a', transition: 'color 0.15s' }}>
              ★
            </span>
          ))}
        </div>
        {rating > 0 && (
          <p style={{ textAlign: 'center', color: '#e879a0', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
            {['','Poor','Fair','Good','Great','Excellent!'][rating]}
          </p>
        )}

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 8 }}>Leave a comment (optional)</label>
          <textarea className="input-dark" rows={3} placeholder="Tell others about your visit..." value={comment} onChange={e => setComment(e.target.value)} style={{ resize: 'vertical' }} />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-outline" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
          <button className="btn-gold" onClick={handleSubmit} disabled={rating === 0} style={{ flex: 2 }}>Submit Review ⭐</button>
        </div>
      </div>
    </div>
  )
}
