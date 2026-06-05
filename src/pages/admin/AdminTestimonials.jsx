import Sidebar from '../../components/Sidebar'
import { useBooking } from '../../context/BookingContext'

function Stars({ rating }) {
  return <span>{[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= rating ? '#e879a0' : '#2a2a2a', fontSize: 14 }}>★</span>)}</span>
}

export default function AdminTestimonials() {
  const { ratings, approveRating, toggleShowOnLanding, removeRating, staffList } = useBooking()

  const pending = ratings.filter(r => !r.approved)
  const approved = ratings.filter(r => r.approved)
  const onLanding = ratings.filter(r => r.approved && r.showOnLanding)

  function getStaffName(staffId) {
    return staffList.find(s => s.id === staffId)?.name || 'Unknown'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="admin" />
      <div className="sidebar-main" style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>Reviews & Testimonials</h1>
          <p style={{ color: '#9ca3af', marginTop: 4 }}>
            Approve reviews and choose which ones appear on the landing page.
            <span style={{ color: '#e879a0', fontWeight: 600 }}> {onLanding.length}</span> currently shown on homepage.
          </p>
        </div>

        {/* Pending Approval */}
        {pending.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
              Pending Approval <span className="badge badge-red" style={{ marginLeft: 8 }}>{pending.length}</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pending.map(r => (
                <div key={r.id} className="card" style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{r.customerName[0]}</div>
                        <div>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{r.customerName}</span>
                          <span style={{ color: '#9ca3af', fontSize: 12, marginLeft: 10 }}>for {getStaffName(r.staffId)} · {r.date}</span>
                        </div>
                        <Stars rating={r.rating} />
                      </div>
                      {r.comment && <p style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.6 }}>{r.comment}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button className="btn-gold" style={{ padding: '7px 16px', fontSize: 13 }} onClick={() => approveRating(r.id)}>✓ Approve</button>
                      <button className="btn-danger" style={{ padding: '7px 12px', fontSize: 13 }} onClick={() => removeRating(r.id)}>✕ Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approved Reviews */}
        <div>
          <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
            Approved Reviews <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: 14 }}>({approved.length})</span>
          </h2>
          {approved.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
              <p>No approved reviews yet. Reviews will appear here once clients submit them after appointments.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {approved.map(r => (
                <div key={r.id} className="card" style={{ borderColor: r.showOnLanding ? 'rgba(232,121,160,0.4)' : '#2a2a2a' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                        <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{r.customerName[0]}</div>
                        <div>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{r.customerName}</span>
                          <span style={{ color: '#9ca3af', fontSize: 12, marginLeft: 10 }}>for {getStaffName(r.staffId)} · {r.date}</span>
                        </div>
                        <Stars rating={r.rating} />
                        {r.showOnLanding && <span className="badge badge-gold">📌 On Homepage</span>}
                      </div>
                      {r.comment && <p style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.6 }}>{r.comment}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexDirection: 'column', alignItems: 'flex-end' }}>
                      <button onClick={() => toggleShowOnLanding(r.id)}
                        style={{
                          padding: '7px 14px', fontSize: 12, borderRadius: 8, border: '2px solid', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s',
                          borderColor: r.showOnLanding ? '#e879a0' : '#2a2a2a',
                          background: r.showOnLanding ? 'rgba(232,121,160,0.1)' : '#111',
                          color: r.showOnLanding ? '#e879a0' : '#9ca3af',
                        }}>
                        {r.showOnLanding ? '📌 Remove from Homepage' : '📌 Show on Homepage'}
                      </button>
                      <button className="btn-danger" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => removeRating(r.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
