import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import StaffAvatar from '../../components/StaffAvatar'
import { useBooking } from '../../context/BookingContext'

function Stars({ rating }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#e879a0' : '#2a2a2a', fontSize: 14 }}>★</span>
      ))}
    </span>
  )
}

export default function BrowsePage() {
  const { staffList, services } = useBooking()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = staffList.filter(s => {
    const matchType = filter === 'all' || s.specialty.toLowerCase().includes(filter)
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, maxWidth: 1100, margin: '0 auto', width: '100%', padding: '40px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff' }}>Browse Stylists</h1>
          <p style={{ color: '#9ca3af', marginTop: 6 }}>Find the perfect barber or hairdresser for your next visit</p>
        </div>

        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
          <input className="input-dark" placeholder="🔍  Search by name..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            {[['all', 'All'], ['barber', 'Barbers'], ['hairdresser', 'Hairdressers']].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)}
                style={{
                  padding: '10px 18px', borderRadius: 8, border: '1px solid', cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.2s',
                  borderColor: filter === val ? '#e879a0' : '#2a2a2a',
                  background: filter === val ? 'rgba(232,121,160,0.1)' : '#1a1a1a',
                  color: filter === val ? '#e879a0' : '#9ca3af',
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Staff Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {filtered.map(staff => {
            const staffServices = services.filter(s => staff.services.includes(s.id))
            return (
              <div key={staff.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 16 }}>
                  <StaffAvatar staffId={staff.id} initial={staff.avatar} size={60} border />
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: 16 }}>{staff.name}</h3>
                    <p style={{ color: '#e879a0', fontSize: 13, fontWeight: 600 }}>{staff.specialty}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <Stars rating={staff.rating} />
                      <span style={{ color: '#9ca3af', fontSize: 12 }}>{staff.rating} ({staff.reviews})</span>
                    </div>
                  </div>
                </div>

                <p style={{ color: '#9ca3af', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>{staff.bio}</p>

                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Services</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {staffServices.slice(0, 4).map(s => (
                      <span key={s.id} className="badge badge-gray">{s.name} · £{s.price.toLocaleString()}</span>
                    ))}
                    {staffServices.length > 4 && <span className="badge badge-gray">+{staffServices.length - 4} more</span>}
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
                  <Link to={`/staff-profile/${staff.id}`} style={{ flex: 1 }}>
                    <button className="btn-outline" style={{ width: '100%' }}>View Profile</button>
                  </Link>
                  <Link to={`/book/${staff.id}`} style={{ flex: 1 }}>
                    <button className="btn-gold" style={{ width: '100%' }}>Book Now</button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 18 }}>No stylists found matching your search</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
