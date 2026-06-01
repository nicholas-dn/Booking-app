import { useState, useRef } from 'react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { useBooking } from '../../context/BookingContext'

const MAX_FILE_SIZE_MB = 5

function Stars({ rating }) {
  return <span>{[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= Math.round(rating) ? '#c9a84c' : '#2a2a2a', fontSize: 16 }}>★</span>)}</span>
}

export default function StaffProfile() {
  const { user } = useAuth()
  const { getBookingsByStaff, staffList, staffPhotos, setStaffPhoto, removeStaffPhoto } = useBooking()
  const staffData = staffList.find(s => s.id === user.id)
  const bookings = getBookingsByStaff(user.id)
  const fileInputRef = useRef(null)

  const currentPhoto = staffPhotos[user.id] || null

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: '+44 7700 000 001',
    bio: staffData?.bio || '',
    specialty: staffData?.specialty || '',
  })
  const [saved, setSaved] = useState(false)
  const [photoError, setPhotoError] = useState('')
  const [photoLoading, setPhotoLoading] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handlePhotoSelect(e) {
    const file = e.target.files[0]
    if (!file) return
    setPhotoError('')

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select an image file (JPG, PNG, WebP, etc.)')
      return
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setPhotoError(`Image must be under ${MAX_FILE_SIZE_MB}MB.`)
      return
    }

    setPhotoLoading(true)
    const reader = new FileReader()
    reader.onload = (ev) => {
      // Draw onto a canvas to enforce a square crop at the centre,
      // then export at 400×400 so it always fits the circular avatar perfectly.
      const img = new Image()
      img.onload = () => {
        const size = Math.min(img.width, img.height)
        const offsetX = (img.width - size) / 2
        const offsetY = (img.height - size) / 2
        const canvas = document.createElement('canvas')
        canvas.width = 400
        canvas.height = 400
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, 400, 400)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
        setStaffPhoto(user.id, dataUrl)
        setPhotoLoading(false)
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
    // Reset input so the same file can be re-selected after delete
    e.target.value = ''
  }

  function handleRemovePhoto() {
    removeStaffPhoto(user.id)
    setPhotoError('')
  }

  const completed = bookings.filter(b => b.status === 'completed')
  const revenue = completed.reduce((sum, b) => sum + b.price, 0)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="staff" />
      <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>My Profile</h1>
          <p style={{ color: '#9ca3af', marginTop: 4 }}>Your public profile visible to clients</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 900 }}>

          {/* Profile overview */}
          <div className="card" style={{ gridColumn: '1 / -1', display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>

            {/* Photo upload section */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              {/* Avatar circle */}
              <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', border: '3px solid #c9a84c', flexShrink: 0, background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {photoLoading ? (
                  <span style={{ color: '#c9a84c', fontSize: 13 }}>...</span>
                ) : currentPhoto ? (
                  <img src={currentPhoto} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 36, fontWeight: 700, color: '#c9a84c' }}>{user.avatar}</span>
                )}
              </div>

              {/* Upload / Remove buttons */}
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{ fontSize: 12, padding: '6px 12px', borderRadius: 7, border: '1px solid #c9a84c', background: 'transparent', color: '#c9a84c', cursor: 'pointer', fontWeight: 600 }}>
                  {currentPhoto ? '🔄 Change' : '📷 Upload'}
                </button>
                {currentPhoto && (
                  <button
                    onClick={handleRemovePhoto}
                    style={{ fontSize: 12, padding: '6px 12px', borderRadius: 7, border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}>
                    🗑 Remove
                  </button>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoSelect}
              />

              {photoError && <p style={{ color: '#ef4444', fontSize: 12, textAlign: 'center', maxWidth: 140 }}>{photoError}</p>}
              <p style={{ color: '#6b7280', fontSize: 11, textAlign: 'center', maxWidth: 120 }}>Square image · Max {MAX_FILE_SIZE_MB}MB · Auto-cropped to fit</p>
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>{user.name}</h2>
              <p style={{ color: '#c9a84c', fontWeight: 600, marginTop: 4 }}>{staffData?.specialty || 'Stylist'}</p>
              {staffData && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <Stars rating={staffData.rating} />
                  <span style={{ color: '#9ca3af', fontSize: 13 }}>{staffData.rating} · {staffData.reviews} reviews</span>
                </div>
              )}
              <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 8 }}>
                Your photo is shown to clients on your profile, on the browse page, and on the homepage.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 28 }}>
              {[
                ['Total Bookings', bookings.length, '#c9a84c'],
                ['Completed', completed.length, '#22c55e'],
                [`£${revenue.toLocaleString()}`, 'Earned', '#c9a84c'],
              ].map(([val, label, color]) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color }}>{val}</div>
                  <div style={{ color: '#9ca3af', fontSize: 12 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Info */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Professional Info</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 6 }}>Full Name</label>
                <input className="input-dark" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 6 }}>Specialty</label>
                <select className="input-dark" value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))}>
                  <option value="Barber">Barber</option>
                  <option value="Hairdresser">Hairdresser</option>
                  <option value="Barber & Hairdresser">Barber & Hairdresser</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 6 }}>Phone Number</label>
                <input className="input-dark" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 6 }}>Bio (shown to clients)</label>
                <textarea className="input-dark" rows={4} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn-gold">{saved ? '✓ Saved!' : 'Save Changes'}</button>
            </form>
          </div>

          {/* Password */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Change Password</h3>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={e => e.preventDefault()}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 6 }}>Current Password</label>
                <input className="input-dark" type="password" placeholder="••••••••" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 6 }}>New Password</label>
                <input className="input-dark" type="password" placeholder="Min. 6 characters" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db', display: 'block', marginBottom: 6 }}>Confirm New Password</label>
                <input className="input-dark" type="password" placeholder="Re-enter new password" />
              </div>
              <button type="submit" className="btn-outline">Update Password</button>
            </form>

            <hr className="divider" />
            <h3 style={{ fontWeight: 700, marginBottom: 14 }}>Account Status</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#111', borderRadius: 8 }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>Profile Visibility</p>
                <p style={{ color: '#9ca3af', fontSize: 13 }}>Clients can find and book you</p>
              </div>
              <span className="badge badge-green">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
