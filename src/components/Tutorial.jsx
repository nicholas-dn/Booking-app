import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const CUSTOMER_STEPS = [
  { icon: '🔍', title: 'Browse Stylists', desc: 'Head to "Browse" to discover barbers and hairdressers. Filter by type, check their ratings, and view their full service menu.' },
  { icon: '📅', title: 'Book an Appointment', desc: 'Click "Book Now" on any stylist. Choose your service, pick a date and time that works for you, and confirm — all in under a minute.' },
  { icon: '✅', title: 'Manage Your Bookings', desc: 'Visit "My Bookings" to see upcoming appointments, cancel if needed, or rebook a favourite stylist with one click.' },
  { icon: '⭐', title: 'Rate Your Experience', desc: 'After your appointment is marked complete, you can leave a rating and review to help other clients find great stylists.' },
  { icon: '👤', title: 'Your Profile', desc: 'Update your name, email, phone number, and notification preferences from the Profile page anytime.' },
]

const STAFF_STEPS = [
  { icon: '⊞', title: 'Your Dashboard', desc: 'Your dashboard gives you a quick look at today\'s appointments, upcoming bookings, and your total revenue at a glance.' },
  { icon: '✂', title: 'Set Your Services', desc: 'Go to "Services" to choose which services you offer. Clients will only see and book the services you have selected.' },
  { icon: '🗓', title: 'Manage Your Schedule', desc: 'Use the "Schedule" page to toggle your working days on and off. Clients cannot book you on days you mark as off.' },
  { icon: '📅', title: 'Handle Bookings', desc: 'In "My Bookings" you can confirm pending requests, mark appointments as complete, or cancel if necessary.' },
  { icon: '👤', title: 'Your Public Profile', desc: 'Update your bio and specialty in "My Profile" — this is what clients see when browsing for a stylist.' },
]

export default function Tutorial() {
  const { user, dismissTutorial } = useAuth()
  const [step, setStep] = useState(0)
  const steps = user?.role === 'staff' ? STAFF_STEPS : CUSTOMER_STEPS
  const current = steps[step]
  const isLast = step === steps.length - 1

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 16, maxWidth: 480, width: '100%', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1a1208 0%, #0f0f0f 100%)', padding: '28px 28px 20px', textAlign: 'center', borderBottom: '1px solid #2a2a2a' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#e879a0', marginBottom: 6 }}>
            Welcome to TrimBook, {user?.name.split(' ')[0]}! 👋
          </div>
          <p style={{ color: '#9ca3af', fontSize: 13 }}>
            Let's take a quick tour so you know your way around.
          </p>
        </div>

        {/* Step Content */}
        <div style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>{current.icon}</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 12 }}>{current.title}</h2>
          <p style={{ color: '#9ca3af', fontSize: 15, lineHeight: 1.7 }}>{current.desc}</p>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, paddingBottom: 8 }}>
          {steps.map((_, i) => (
            <div key={i} onClick={() => setStep(i)} style={{
              width: i === step ? 24 : 8, height: 8, borderRadius: 4, cursor: 'pointer',
              background: i === step ? '#e879a0' : '#2a2a2a', transition: 'all 0.3s',
            }} />
          ))}
        </div>

        {/* Actions */}
        <div style={{ padding: '16px 28px 28px', display: 'flex', gap: 10 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="btn-outline" style={{ flex: 1 }}>← Back</button>
          )}
          {!isLast ? (
            <button onClick={() => setStep(s => s + 1)} className="btn-gold" style={{ flex: 2 }}>Next →</button>
          ) : (
            <button onClick={dismissTutorial} className="btn-gold" style={{ flex: 2 }}>Get Started ✓</button>
          )}
          <button onClick={dismissTutorial} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>
        <div style={{ textAlign: 'center', paddingBottom: 20 }}>
          <button onClick={dismissTutorial} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
            Skip tutorial
          </button>
        </div>
      </div>
    </div>
  )
}
