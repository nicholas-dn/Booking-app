import { useState } from 'react'
import Sidebar from '../../components/Sidebar'

const INITIAL_TICKETS = [
  { id: 1, customer: 'Tunde Bello', subject: 'Cannot cancel my booking', message: "I tried to cancel my booking for tomorrow but the cancel button isn't working. Please help.", status: 'open', priority: 'high', date: '2026-05-29', replies: [] },
  { id: 2, customer: 'Ngozi Adeyemi', subject: 'Stylist was 30 minutes late', message: 'I had a 10AM appointment with Amaka Nwosu but she showed up at 10:30AM. I would like a discount on my next booking.', status: 'in-progress', priority: 'medium', date: '2026-05-28', replies: [{ from: 'Admin', text: 'We are sorry for the inconvenience. We are looking into this.', date: '2026-05-28' }] },
  { id: 3, customer: 'Emeka Obi', subject: 'Wrong service charged', message: 'I was charged for a Weave Installation but I only got a hair wash. Please refund the difference.', status: 'open', priority: 'high', date: '2026-05-27', replies: [] },
  { id: 4, customer: 'Bayo Adewale', subject: 'Great experience!', message: 'Just wanted to say James did an amazing job. Best haircut I have had in years!', status: 'closed', priority: 'low', date: '2026-05-25', replies: [{ from: 'Admin', text: "Thank you for the feedback! We'll pass this along to James.", date: '2026-05-25' }] },
]

const PRIORITY_COLOR = { high: 'badge-red', medium: 'badge-gold', low: 'badge-gray' }
const STATUS_COLOR = { open: 'badge-red', 'in-progress': 'badge-gold', closed: 'badge-gray' }

export default function AdminSupport() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS)
  const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = tickets.filter(t => filterStatus === 'all' || t.status === filterStatus)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  function sendReply() {
    if (!reply.trim()) return
    setTickets(prev => prev.map(t =>
      t.id === selected.id
        ? { ...t, status: 'in-progress', replies: [...t.replies, { from: 'Admin', text: reply, date: new Date().toISOString().split('T')[0] }] }
        : t
    ))
    setSelected(prev => ({ ...prev, status: 'in-progress', replies: [...prev.replies, { from: 'Admin', text: reply, date: new Date().toISOString().split('T')[0] }] }))
    setReply('')
  }

  function closeTicket(id) {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'closed' } : t))
    if (selected?.id === id) setSelected(prev => ({ ...prev, status: 'closed' }))
  }

  const openCount = tickets.filter(t => t.status === 'open').length

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="admin" />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Ticket List */}
        <div style={{ width: 340, borderRight: '1px solid #2a2a2a', overflowY: 'auto', flexShrink: 0 }}>
          <div style={{ padding: '20px 16px', borderBottom: '1px solid #2a2a2a' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>Support Tickets</h2>
            {openCount > 0 && <span className="badge badge-red" style={{ marginTop: 6 }}>{openCount} open</span>}
            <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
              {['all', 'open', 'in-progress', 'closed'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  style={{
                    padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
                    background: filterStatus === s ? '#c9a84c' : '#1a1a1a',
                    color: filterStatus === s ? '#0f0f0f' : '#9ca3af',
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            {filtered.map(t => (
              <div key={t.id} onClick={() => setSelected(t)}
                style={{
                  padding: '14px 16px', borderBottom: '1px solid #1f1f1f', cursor: 'pointer', transition: 'background 0.15s',
                  background: selected?.id === t.id ? '#1a1a1a' : 'transparent',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{t.customer}</span>
                  <span className={`badge ${PRIORITY_COLOR[t.priority]}`} style={{ fontSize: 10 }}>{t.priority}</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#d1d5db', marginBottom: 4 }}>{t.subject}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge ${STATUS_COLOR[t.status]}`} style={{ fontSize: 10 }}>{t.status}</span>
                  <span style={{ color: '#6b7280', fontSize: 11 }}>{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket Detail */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
          {!selected ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 48 }}>💬</div>
              <p>Select a ticket to view details</p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 800 }}>{selected.subject}</h2>
                  <div style={{ display: 'flex', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
                    <span style={{ color: '#9ca3af', fontSize: 13 }}>From: <strong style={{ color: '#f5f5f5' }}>{selected.customer}</strong></span>
                    <span className={`badge ${STATUS_COLOR[selected.status]}`}>{selected.status}</span>
                    <span className={`badge ${PRIORITY_COLOR[selected.priority]}`}>{selected.priority} priority</span>
                  </div>
                </div>
                {selected.status !== 'closed' && (
                  <button className="btn-outline" style={{ fontSize: 12, padding: '8px 16px' }} onClick={() => closeTicket(selected.id)}>Close Ticket ✓</button>
                )}
              </div>

              {/* Original Message */}
              <div style={{ background: '#111', borderRadius: 10, padding: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                  <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{selected.customer[0]}</div>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{selected.customer}</span>
                    <span style={{ color: '#6b7280', fontSize: 12, marginLeft: 10 }}>{selected.date}</span>
                  </div>
                </div>
                <p style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.7 }}>{selected.message}</p>
              </div>

              {/* Replies */}
              {selected.replies.map((r, i) => (
                <div key={i} style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <div className="avatar" style={{ width: 32, height: 32, fontSize: 12, background: '#c9a84c', color: '#0f0f0f' }}>A</div>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 13, color: '#c9a84c' }}>Admin (You)</span>
                      <span style={{ color: '#6b7280', fontSize: 12, marginLeft: 10 }}>{r.date}</span>
                    </div>
                  </div>
                  <p style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.7 }}>{r.text}</p>
                </div>
              ))}

              {/* Reply Box */}
              {selected.status !== 'closed' && (
                <div className="card">
                  <h4 style={{ fontWeight: 700, marginBottom: 12 }}>Send Reply</h4>
                  <textarea className="input-dark" rows={4} placeholder="Type your response to the customer..." value={reply} onChange={e => setReply(e.target.value)} style={{ resize: 'vertical', marginBottom: 12 }} />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn-gold" onClick={sendReply} disabled={!reply.trim()}>Send Reply</button>
                    <button className="btn-outline" onClick={() => closeTicket(selected.id)}>Resolve & Close</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
