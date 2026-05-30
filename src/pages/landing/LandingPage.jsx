import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const FEATURES = [
  { icon: '📅', title: 'Easy Booking', desc: 'Book your appointment in under 60 seconds. Choose your stylist, service, and preferred time.' },
  { icon: '✂', title: 'Top Stylists', desc: 'Browse verified barbers and hairdressers with real ratings and reviews from actual clients.' },
  { icon: '🔔', title: 'Reminders', desc: 'Get automatic reminders before your appointment so you never miss a session.' },
  { icon: '⭐', title: 'Rate & Review', desc: 'After every visit, rate your experience and help others find great stylists.' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Create an Account', desc: 'Sign up in seconds as a customer. No credit card required.' },
  { step: '02', title: 'Browse Stylists', desc: 'Filter by service type, rating, and availability to find your perfect match.' },
  { step: '03', title: 'Book a Slot', desc: 'Pick a date and time that works for you. Instant confirmation.' },
  { step: '04', title: 'Show Up & Look Good', desc: 'Walk in, get the service, and leave looking fresh.' },
]

const STAFF = [
  { name: 'James Okafor', specialty: 'Master Barber', rating: 4.8, reviews: 89, avatar: 'J', tags: ['Fades', 'Designs', 'Beard'] },
  { name: 'Amaka Nwosu', specialty: 'Senior Hairdresser', rating: 4.9, reviews: 134, avatar: 'A', tags: ['Braiding', 'Natural Hair', 'Styling'] },
  { name: 'Chidi Eze', specialty: 'Barber', rating: 4.7, reviews: 56, avatar: 'C', tags: ['Cuts', 'Shave', 'Dreadlocks'] },
]

const TESTIMONIALS = [
  { name: 'Tunde B.', text: "TrimBook made it so easy to find a great barber near me. I've been going to James every two weeks now!", avatar: 'T' },
  { name: 'Ngozi A.', text: "Amaka is amazing! I found her on TrimBook and she's been doing my hair for months. The booking process is seamless.", avatar: 'N' },
  { name: 'Emeka O.', text: "As a busy professional, I love that I can book in advance and get reminders. No more waiting in line.", avatar: 'E' },
]

function Stars({ rating }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#c9a84c' : '#2a2a2a', fontSize: 14 }}>★</span>
      ))}
    </span>
  )
}

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1208 100%)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="badge badge-gold" style={{ marginBottom: 20, fontSize: 13 }}>🇳🇬 Nigeria's #1 Salon Booking Platform</div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20, color: '#fff' }}>
            Book Your Next<br />
            <span style={{ color: '#c9a84c' }}>Perfect Look</span><br />
            In Seconds
          </h1>
          <p style={{ color: '#9ca3af', fontSize: 18, marginBottom: 36, lineHeight: 1.7 }}>
            Connect with top barbers and hairdressers in your area. Real-time availability, instant confirmation, zero hassle.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register"><button className="btn-gold" style={{ fontSize: 16, padding: '14px 32px' }}>Book Now — It's Free</button></Link>
            <Link to="/browse"><button className="btn-outline" style={{ fontSize: 16, padding: '14px 32px' }}>Browse Stylists</button></Link>
          </div>
          <p style={{ color: '#6b7280', fontSize: 13, marginTop: 20 }}>No credit card required · Cancel anytime</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 60, flexWrap: 'wrap' }}>
          {[['2,400+', 'Bookings Made'], ['48', 'Expert Stylists'], ['4.8★', 'Average Rating'], ['98%', 'Satisfaction Rate']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#c9a84c' }}>{val}</div>
              <div style={{ color: '#9ca3af', fontSize: 14 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', background: '#0f0f0f' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>Why Choose <span style={{ color: '#c9a84c' }}>TrimBook</span>?</h2>
            <p style={{ color: '#9ca3af', marginTop: 12 }}>Everything you need for a seamless salon experience</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {FEATURES.map(f => (
              <div key={f.title} className="card card-hover" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 24px', background: '#0a0a0a' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>How It <span style={{ color: '#c9a84c' }}>Works</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {HOW_IT_WORKS.map((h, i) => (
              <div key={h.step} className="card" style={{ position: 'relative' }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: 'rgba(201,168,76,0.15)', position: 'absolute', top: 12, right: 16 }}>{h.step}</div>
                <div style={{ color: '#c9a84c', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>STEP {h.step}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 10 }}>{h.title}</h3>
                <p style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.7 }}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stylists */}
      <section style={{ padding: '80px 24px', background: '#0f0f0f' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>Meet Our <span style={{ color: '#c9a84c' }}>Top Stylists</span></h2>
            <p style={{ color: '#9ca3af', marginTop: 12 }}>Talented professionals ready to make you look your best</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {STAFF.map(s => (
              <div key={s.name} className="card card-hover" style={{ textAlign: 'center' }}>
                <div className="avatar" style={{ width: 72, height: 72, fontSize: 28, margin: '0 auto 16px', border: '3px solid #c9a84c' }}>{s.avatar}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{s.name}</h3>
                <p style={{ color: '#c9a84c', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>{s.specialty}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14 }}>
                  <Stars rating={s.rating} />
                  <span style={{ color: '#9ca3af', fontSize: 13 }}>{s.rating} ({s.reviews} reviews)</span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {s.tags.map(t => <span key={t} className="badge badge-gold">{t}</span>)}
                </div>
                <Link to="/browse" style={{ display: 'block', marginTop: 16 }}>
                  <button className="btn-gold" style={{ width: '100%' }}>Book Now</button>
                </Link>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/browse"><button className="btn-outline">View All Stylists →</button></Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 24px', background: '#0a0a0a' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>What Our <span style={{ color: '#c9a84c' }}>Clients Say</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card">
                <div style={{ color: '#c9a84c', fontSize: 28, marginBottom: 12 }}>"</div>
                <p style={{ color: '#d1d5db', lineHeight: 1.7, fontSize: 15, marginBottom: 20 }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="avatar" style={{ width: 36, height: 36, fontSize: 14 }}>{t.avatar}</div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</p>
                    <Stars rating={5} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #1a1208 0%, #0f0f0f 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 40, fontWeight: 900, color: '#fff', marginBottom: 16 }}>
            Ready to Look <span style={{ color: '#c9a84c' }}>Amazing</span>?
          </h2>
          <p style={{ color: '#9ca3af', marginBottom: 32, fontSize: 16 }}>
            Join thousands of customers already using TrimBook to manage their salon experience.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register"><button className="btn-gold" style={{ fontSize: 16, padding: '14px 32px' }}>Get Started Free</button></Link>
            <Link to="/register?role=staff"><button className="btn-outline" style={{ fontSize: 16, padding: '14px 32px' }}>Join as a Stylist</button></Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
