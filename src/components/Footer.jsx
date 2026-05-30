import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: '#111', borderTop: '1px solid #2a2a2a', padding: '48px 24px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#c9a84c', marginBottom: 12 }}>✂ TrimBook</div>
            <p style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.7 }}>
              The premium booking platform for salons, barbers, and hairdressers across Nigeria.
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: 14 }}>Services</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Haircut & Styling', 'Beard Grooming', 'Hair Braiding', 'Relaxer & Treatment', 'Weave Installation'].map(s => (
                <span key={s} style={{ color: '#9ca3af', fontSize: 14 }}>{s}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: 14 }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['About Us', '/about'], ['How It Works', '/'], ['For Stylists', '/register'], ['Contact', '/contact']].map(([label, to]) => (
                <Link key={label} to={to} style={{ color: '#9ca3af', fontSize: 14, textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: 14 }}>Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ color: '#9ca3af', fontSize: 14 }}>📞 +234 800 TRIMBOOK</span>
              <span style={{ color: '#9ca3af', fontSize: 14 }}>✉ support@trimbook.com</span>
              <span style={{ color: '#9ca3af', fontSize: 14 }}>🕐 Mon–Sat, 8AM–8PM</span>
            </div>
          </div>
        </div>
        <div className="divider" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: '#6b7280', fontSize: 13 }}>© 2026 TrimBook. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service'].map(t => (
              <span key={t} style={{ color: '#6b7280', fontSize: 13, cursor: 'pointer' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
