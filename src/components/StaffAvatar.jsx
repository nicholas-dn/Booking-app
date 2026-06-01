import { useBooking } from '../context/BookingContext'

export default function StaffAvatar({ staffId, initial, size = 40, border = false }) {
  const { staffPhotos } = useBooking()
  const photo = staffPhotos[staffId]

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      overflow: 'hidden',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#2a2a2a',
      border: border ? `3px solid #c9a84c` : 'none',
    }}>
      {photo
        ? <img src={photo} alt="staff" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        : <span style={{ fontSize: size * 0.4, fontWeight: 700, color: '#c9a84c' }}>{initial}</span>
      }
    </div>
  )
}
