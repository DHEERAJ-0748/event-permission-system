import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// ---------- Global Styles & Animations ----------
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #f4f6f9;
  }

  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.94); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(24px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .section-enter {
    animation: fadeSlideIn 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .modal-enter {
    animation: scaleIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .card-hover {
    transition: transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s ease;
    cursor: pointer;
  }
  .card-hover:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(44,62,80,0.14) !important;
  }
  .nav-item {
    transition: background 0.22s ease, color 0.22s ease, transform 0.18s ease;
    border-radius: 10px;
    margin: 3px 10px;
    padding: 10px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #b0bec5;
  }
  .nav-item:hover {
    background: rgba(255,255,255,0.08);
    color: #fff;
    transform: translateX(3px);
  }
  .nav-item.active {
    background: rgba(255,255,255,0.13);
    color: #fff;
    font-weight: 600;
  }
  .btn-primary {
    background: #2c3e50;
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.22s ease, transform 0.18s ease, box-shadow 0.22s ease;
  }
  .btn-primary:hover {
    background: #34495e;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(44,62,80,0.25);
  }
  .btn-ghost {
    background: #f0f2f5;
    color: #555;
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.22s ease, transform 0.18s ease;
  }
  .btn-ghost:hover {
    background: #e2e6ea;
    transform: translateY(-1px);
  }
  .input-field {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #e0e4ea;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.22s ease, box-shadow 0.22s ease;
    background: #fff;
  }
  .input-field:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102,126,234,0.12);
  }
  .toggle-track {
    width: 46px;
    height: 24px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    position: relative;
    transition: background 0.28s ease;
    flex-shrink: 0;
  }
  .toggle-thumb {
    width: 18px;
    height: 18px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    top: 3px;
    transition: left 0.28s cubic-bezier(0.22,1,0.36,1);
    box-shadow: 0 1px 4px rgba(0,0,0,0.18);
  }
  .upload-drop-zone {
    border: 2.5px dashed #c8d0e7;
    border-radius: 16px;
    padding: 40px 20px;
    text-align: center;
    background: #f8f9ff;
    transition: border-color 0.22s ease, background 0.22s ease;
    cursor: pointer;
  }
  .upload-drop-zone.drag-over,
  .upload-drop-zone:hover {
    border-color: #667eea;
    background: #f0f3ff;
  }
  .file-pill {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f0f3ff;
    border: 1px solid #dce2f8;
    border-radius: 10px;
    padding: 10px 14px;
    animation: slideInRight 0.25s ease both;
  }
  .notification-badge {
    animation: pulse 2s ease-in-out infinite;
  }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #d0d5dd; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #adb5bd; }
`

// Inject styles
const StyleInjector = () => {
  useEffect(() => {
    const el = document.createElement('style')
    el.textContent = globalStyles
    document.head.appendChild(el)
    return () => document.head.removeChild(el)
  }, [])
  return null
}

// ---------- SIDEBAR ----------
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '⬡' },
  { id: 'venues', label: 'Venues', icon: '🏛' },
  { id: 'calendar', label: 'Calendar', icon: '📅' },
  { id: 'approvals', label: 'Approvals', icon: '✅' },
  { id: 'statistics', label: 'Statistics', icon: '📊' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'upload-bills', label: 'Upload Bills', icon: '📎' },
]

function Sidebar({ selected, onSelect }) {
  return (
    <div style={{
      width: '220px',
      background: 'linear-gradient(175deg, #1a2535 0%, #2c3e50 100%)',
      color: '#ecf0f1',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 0 20px 0',
      boxShadow: '4px 0 24px rgba(0,0,0,0.12)',
      flexShrink: 0,
      zIndex: 10,
    }}>
      <div>
        {/* Logo */}
        <div style={{ padding: '0 20px 28px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '10px',
              background: 'linear-gradient(135deg,#667eea,#764ba2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', fontWeight: '700', color: '#fff', fontFamily: 'Syne, sans-serif'
            }}>C</div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '17px', color: '#fff', letterSpacing: '-0.3px' }}>ClubOS</span>
          </div>
        </div>

        {/* Menu label */}
        <div style={{ padding: '0 20px 8px 20px', fontSize: '11px', fontWeight: '600', color: '#546e7a', letterSpacing: '1px', textTransform: 'uppercase' }}>Menu</div>

        {NAV_ITEMS.map(item => (
          <div
            key={item.id}
            className={`nav-item ${selected === item.id ? 'active' : ''}`}
            onClick={() => onSelect(item.id)}
          >
            <span style={{ fontSize: '16px', width: '22px', textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
            {item.label}
            {item.id === 'notifications' && (
              <div className="notification-badge" style={{
                marginLeft: 'auto', background: '#ef4444', color: '#fff',
                borderRadius: '50%', width: '18px', height: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: '700'
              }}>5</div>
            )}
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
        <div
          className={`nav-item ${selected === 'settings' ? 'active' : ''}`}
          onClick={() => onSelect('settings')}
        >
          <span style={{ fontSize: '16px', width: '22px', textAlign: 'center' }}>⚙️</span>
          Settings
        </div>
      </div>
    </div>
  )
}

// ---------- NAVBAR ----------
function Navbar({ user, onSectionChange }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [placeholder, setPlaceholder] = useState("What's on your mind?")
  const [phIdx, setPhIdx] = useState(0)
  const placeholders = ["What's on your mind?", "Go back to past event", "Wanna know the status of the event?"]

  useEffect(() => {
    const interval = setInterval(() => {
      setPhIdx(i => (i + 1) % placeholders.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => { setPlaceholder(placeholders[phIdx]) }, [phIdx])

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'US'

  return (
    <div style={{
      height: '62px',
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      justifyContent: 'space-between',
      boxShadow: '0 1px 0 #e8edf3',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ position: 'relative', flex: 1, maxWidth: '560px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ position: 'absolute', left: '12px', color: '#9eaab8', fontSize: '15px', zIndex: 1 }}>🔍</span>
        <input
          className="input-field"
          type="text"
          placeholder={placeholder}
          style={{ paddingLeft: '36px', background: '#f7f9fc', border: '1.5px solid #edf0f5' }}
        />
        <button className="btn-primary" onClick={() => onSectionChange('create')} style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px' }}>＋</span> Create Event
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => onSectionChange('notifications')}>
          <span style={{ fontSize: '20px' }}>🔔</span>
          <div className="notification-badge" style={{
            position: 'absolute', top: '-6px', right: '-7px',
            background: '#ef4444', color: '#fff', borderRadius: '50%',
            width: '18px', height: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: '700', boxShadow: '0 2px 6px rgba(239,68,68,0.4)'
          }}>5</div>
        </div>

        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowProfileMenu(p => !p)}
            style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg,#2c3e50,#34495e)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontWeight: '700', fontSize: '13px',
              boxShadow: '0 2px 8px rgba(44,62,80,0.25)',
              transition: 'transform 0.18s ease',
              fontFamily: 'Syne, sans-serif'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >{initials}</div>

          {showProfileMenu && (
            <div className="modal-enter" style={{
              position: 'absolute', right: 0, top: '44px',
              background: '#fff', borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '1px solid #edf0f5',
              overflow: 'hidden', minWidth: '160px',
            }}>
              {[['👤', 'View Profile', 'profile'], ['⚙️', 'Settings', 'settings'], ['🚪', 'Logout', 'logout']].map(([ico, label, sec]) => (
                <div key={sec} onClick={() => { onSectionChange(sec); setShowProfileMenu(false) }}
                  style={{ padding: '12px 18px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.18s ease', color: sec === 'logout' ? '#ef4444' : '#333' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f7f9fc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                ><span>{ico}</span>{label}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------- SECTION WRAPPER (Animated) ----------
function SectionWrap({ children, key }) {
  return <div className="section-enter" style={{ height: '100%' }}>{children}</div>
}

// ---------- DASHBOARD SECTION ----------
function DashboardSection() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')

  const mockEvents = [
    { id: 1, name: 'Spring Fest', description: 'Annual spring celebration with cultural performances and food stalls.', venue: 'Outdoor Grounds', date: '2026-02-15', status: 'Approved', participants: 250, budget: 12000, recognition: 'Excellent', profit: 5000, budgetSpent: 12000, bestParticipant: 'John Doe', bestContender: 'Jane Smith', bestMoments: ['Dance Performance', 'Fashion Show', 'DJ Night'] },
    { id: 2, name: 'Tech Talk', description: 'Industry experts share insights on emerging technology trends.', venue: 'Hall B', date: '2026-01-20', status: 'Approved', participants: 180, budget: 8000, recognition: 'Good', profit: 3000, budgetSpent: 8000, bestParticipant: 'Alex Kumar', bestContender: 'Sarah Johnson', bestMoments: ['Keynote Speech', 'Q&A Session', 'Networking'] },
    { id: 3, name: 'Art Exhibition', description: 'Showcase of student artwork spanning painting, sculpture, and digital art.', venue: 'Hall A', date: '2025-12-05', status: 'Approved', participants: 320, budget: 10000, recognition: 'Outstanding', profit: 7500, budgetSpent: 10000, bestParticipant: 'Emma Wilson', bestContender: 'Michael Chen', bestMoments: ['Art Display', 'Live Painting', 'Gallery Walk'] },
    { id: 4, name: 'Sports Fest', description: 'Inter-college sports tournament covering cricket, volleyball, and athletics.', venue: 'Sports Ground', date: '2025-11-10', status: 'Pending', participants: 400, budget: 15000, recognition: 'Excellent', profit: 6000, budgetSpent: 15000, bestParticipant: 'David Lee', bestContender: 'Lisa Anderson', bestMoments: ['Cricket Match', 'Volleyball', 'Relay Race'] },
    { id: 5, name: 'Cultural Night', description: 'An evening of music, dance, and comedy celebrating diverse cultures.', venue: 'Hall A', date: '2025-10-22', status: 'Draft', participants: 290, budget: 9000, recognition: 'Very Good', profit: 4500, budgetSpent: 9000, bestParticipant: 'Priya Sharma', bestContender: 'Rohan Patel', bestMoments: ['Music Performance', 'Dance Battle', 'Comedy Show'] },
    { id: 6, name: 'Film Festival', description: 'Screening of short films and documentaries by student filmmakers.', venue: 'Conference Room', date: '2025-09-18', status: 'Rejected', participants: 150, budget: 7000, recognition: 'Good', profit: 2000, budgetSpent: 7000, bestParticipant: 'Olivia Brown', bestContender: 'Tom Harris', bestMoments: ['Documentary Screening', 'Short Films', 'Awards'] },
    { id: 7, name: 'Hackathon 3.0', description: '48-hour coding marathon with industry mentors and prize money.', venue: 'Hall B', date: '2025-08-12', status: 'Draft', participants: 120, budget: 20000, recognition: '—', profit: 0, budgetSpent: 0, bestParticipant: '—', bestContender: '—', bestMoments: ['Team Formation', 'Ideation', 'Final Demo'] },
  ]

  const bestEvent = mockEvents[2]

  const filters = ['All', 'Approved', 'Pending', 'Rejected', 'Draft']

  const statusConfig = {
    Approved: { bg: '#dcfce7', color: '#15803d', dot: '#22c55e', cardAccent: '#22c55e', cardBg: 'linear-gradient(135deg,#f0fdf4,#f7fef9)' },
    Pending:  { bg: '#fef9c3', color: '#a16207', dot: '#eab308', cardAccent: '#f59e0b', cardBg: 'linear-gradient(135deg,#fffdf0,#fefce8)' },
    Rejected: { bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444', cardAccent: '#ef4444', cardBg: 'linear-gradient(135deg,#fff5f5,#fef2f2)' },
    Draft:    { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8', cardAccent: '#94a3b8', cardBg: 'linear-gradient(135deg,#f8fafc,#f1f5f9)' },
  }

  const filtered = activeFilter === 'All' ? mockEvents : mockEvents.filter(e => e.status === activeFilter)

  const countByStatus = s => mockEvents.filter(e => e.status === s).length

  return (
    <div className="section-enter">

      {/* ── Best Event Card (untouched) ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1a2535 0%, #2c3e50 60%, #34495e 100%)',
        borderRadius: '18px', padding: '26px 30px', marginBottom: '28px',
        color: '#ecf0f1', boxShadow: '0 8px 28px rgba(44,62,80,0.18)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', right: '-30px', top: '-30px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', right: '40px', bottom: '-40px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <span style={{ fontSize: '22px' }}>🏆</span>
          <h3 style={{ margin: 0, fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '700', letterSpacing: '-0.2px' }}>Best Event Conducted So Far</h3>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '16px' }}>
          {[['Event Name', bestEvent.name], ['Participants', bestEvent.participants], ['Recognition', bestEvent.recognition], ['Profit Generated', `₹${bestEvent.profit}`]].map(([label, value]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '11px', margin: '0 0 5px', opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</p>
              <p style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0, fontFamily: 'Syne, sans-serif' }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ margin: '0 0 2px', fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '700', color: '#1a2535' }}>Previously Conducted Events</h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#8a96a3' }}>{filtered.length} event{filtered.length !== 1 ? 's' : ''} {activeFilter !== 'All' ? `· ${activeFilter}` : 'total'}</p>
        </div>
      </div>

      {/* ── Filter pill bar ── */}
      <div style={{
        display: 'inline-flex', gap: '6px',
        background: '#f1f4f9', borderRadius: '14px', padding: '5px 6px',
        marginBottom: '22px', flexWrap: 'wrap'
      }}>
        {filters.map(f => {
          const isActive = activeFilter === f
          const cfg = statusConfig[f]
          const count = f === 'All' ? mockEvents.length : countByStatus(f)
          return (
            <button key={f} onClick={() => setActiveFilter(f)}
              style={{
                padding: '7px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: '600', fontFamily: 'DM Sans, sans-serif',
                display: 'flex', alignItems: 'center', gap: '7px',
                transition: 'all 0.22s cubic-bezier(0.22,1,0.36,1)',
                background: isActive ? '#1a2535' : 'transparent',
                color: isActive ? '#fff' : '#5a6473',
                boxShadow: isActive ? '0 2px 10px rgba(26,37,53,0.22)' : 'none',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#e4e8f0'; e.currentTarget.style.color = '#1a2535' } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#5a6473' } }}
            >
              {/* Status dot for non-All */}
              {f !== 'All' && cfg && (
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: isActive ? '#fff' : cfg.dot, flexShrink: 0, opacity: isActive ? 0.7 : 1 }} />
              )}
              {f}
              {/* Count badge */}
              <span style={{
                fontSize: '11px', fontWeight: '700', minWidth: '18px', height: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '6px', padding: '0 4px',
                background: isActive ? 'rgba(255,255,255,0.18)' : '#e4e8f0',
                color: isActive ? '#fff' : '#5a6473',
              }}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* ── Event cards grid ── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '18px', border: '1px dashed #dde3ec' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗂️</div>
          <p style={{ margin: 0, color: '#8a96a3', fontSize: '15px', fontWeight: '500' }}>No {activeFilter.toLowerCase()} events found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '16px' }}>
          {filtered.map((e, i) => {
            const cfg = statusConfig[e.status] || statusConfig.Draft
            return (
              <div key={e.id}
                onClick={() => setSelectedEvent(e)}
                style={{
                  background: '#fff', borderRadius: '18px', overflow: 'hidden',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5',
                  cursor: 'pointer', transition: 'all 0.28s cubic-bezier(0.22,1,0.36,1)',
                  animationDelay: `${i * 0.045}s`, animation: 'fadeSlideIn 0.42s ease both',
                  display: 'flex', flexDirection: 'column',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 14px 32px rgba(0,0,0,0.1)` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)' }}
              >
                {/* Card top accent bar */}
                <div style={{ height: '4px', background: cfg.dot, width: '100%' }} />

                <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>

                  {/* Row 1: Name + Status badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                    <h3 style={{ margin: 0, fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '700', color: '#1a2535', lineHeight: '1.3', flex: 1 }}>{e.name}</h3>
                    <span style={{
                      flexShrink: 0, padding: '4px 11px', borderRadius: '20px',
                      fontSize: '11px', fontWeight: '700', letterSpacing: '0.2px',
                      background: cfg.bg, color: cfg.color,
                      display: 'flex', alignItems: 'center', gap: '5px'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.dot }} />
                      {e.status}
                    </span>
                  </div>

                  {/* Row 2: Description */}
                  <p style={{ margin: 0, fontSize: '13px', color: '#7a8694', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {e.description}
                  </p>

                  {/* Divider */}
                  <div style={{ height: '1px', background: '#f0f3f8' }} />

                  {/* Row 3: Date + Venue */}
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '14px', flexShrink: 0, color: '#667eea' }}>📅</span>
                      <span style={{ fontSize: '12px', color: '#5a6473', fontWeight: '500' }}>{e.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '14px', flexShrink: 0, color: '#667eea' }}>📍</span>
                      <span style={{ fontSize: '12px', color: '#5a6473', fontWeight: '500' }}>{e.venue}</span>
                    </div>
                  </div>

                  {/* Row 4: Participants + Budget */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1, padding: '10px 12px', background: '#f7f9fc', borderRadius: '10px', border: '1px solid #edf0f5' }}>
                      <p style={{ margin: '0 0 2px', fontSize: '10px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Participants</p>
                      <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1a2535', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontSize: '13px' }}>👥</span> {e.participants}
                      </p>
                    </div>
                    <div style={{ flex: 1, padding: '10px 12px', background: '#f7f9fc', borderRadius: '10px', border: '1px solid #edf0f5' }}>
                      <p style={{ margin: '0 0 2px', fontSize: '10px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Budget</p>
                      <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1a2535', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontSize: '13px' }}>💰</span> ₹{e.budget.toLocaleString()}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Detail Modal (existing logic unchanged) ── */}
      {selectedEvent && (
        <div className="section-enter" style={{
          position: 'fixed', inset: 0, background: 'rgba(15,20,30,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
        }} onClick={() => setSelectedEvent(null)}>
          <div className="modal-enter" style={{
            background: '#fff', borderRadius: '22px', padding: '0',
            maxWidth: '580px', width: '100%', boxShadow: '0 32px 72px rgba(0,0,0,0.22)',
            overflow: 'hidden'
          }} onClick={ev => ev.stopPropagation()}>

            {/* Modal header strip */}
            <div style={{
              padding: '24px 28px 20px',
              background: 'linear-gradient(135deg,#1a2535,#2c3e50)',
              color: '#fff', position: 'relative'
            }}>
              <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ margin: '0 0 6px', fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: '800', color: '#fff' }}>{selectedEvent.name}</h2>
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '5px' }}>📅 {selectedEvent.date}</span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '5px' }}>📍 {selectedEvent.venue}</span>
                    <span style={{
                      fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px',
                      background: (statusConfig[selectedEvent.status] || statusConfig.Draft).bg,
                      color: (statusConfig[selectedEvent.status] || statusConfig.Draft).color
                    }}>{selectedEvent.status}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedEvent(null)}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', color: '#fff', flexShrink: 0, transition: 'background 0.18s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>✕</button>
              </div>
            </div>

            {/* Modal body */}
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {[['Total Participants', `👥 ${selectedEvent.participants}`], ['Budget Spent', `💰 ₹${selectedEvent.budgetSpent.toLocaleString()}`], ['Best Participant', `🏅 ${selectedEvent.bestParticipant}`], ['Best Contender', `🥈 ${selectedEvent.bestContender}`]].map(([label, value]) => (
                  <div key={label} style={{ padding: '14px', background: '#f7f9fc', borderRadius: '12px', border: '1px solid #edf0f5' }}>
                    <p style={{ margin: '0 0 5px', fontSize: '10px', color: '#8a96a3', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{label}</p>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1a2535' }}>{value}</p>
                  </div>
                ))}
              </div>

              <div style={{ padding: '14px', background: '#f7f9fc', borderRadius: '12px', border: '1px solid #edf0f5', marginBottom: '20px' }}>
                <p style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '700', color: '#1a2535' }}>✨ Best Moments</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedEvent.bestMoments.map((m, idx) => (
                    <span key={idx} style={{ padding: '5px 13px', background: '#e8ecff', color: '#3d52d4', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>{m}</span>
                  ))}
                </div>
              </div>

              <button className="btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '12px' }} onClick={() => setSelectedEvent(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------- VENUES SECTION ----------
function VenuesSection() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const venues = [
    { id: 1, name: 'Hall A', type: 'Main Auditorium', icon: '🎭', capacity: 500, slotsToday: 2, events: { '2026-03-15': { status: 'booked', eventName: 'TechFest', date: 'Mar 15' }, '2026-03-20': { status: 'pending', eventName: 'Science Symposium', date: 'Mar 20' } } },
    { id: 2, name: 'Hall B', type: 'Seminar Room', icon: '📚', capacity: 200, slotsToday: 3, events: { '2026-03-12': { status: 'booked', eventName: 'Workshop', date: 'Mar 12' }, '2026-03-25': { status: 'pending', eventName: 'Orientation', date: 'Mar 25' } } },
    { id: 3, name: 'Conference Room', type: 'Meeting Space', icon: '💼', capacity: 50, slotsToday: 4, events: { '2026-03-10': { status: 'available', eventName: '', date: '' }, '2026-03-18': { status: 'booked', eventName: 'Board Meeting', date: 'Mar 18' } } },
    { id: 4, name: 'Outdoor Grounds', type: 'Open Field', icon: '🌳', capacity: 1000, slotsToday: 1, events: { '2026-03-22': { status: 'pending', eventName: 'Sports Day', date: 'Mar 22' } } },
  ]

  const getStatus = (venue, date) => {
    if (venue.events[date]) return venue.events[date].status
    const up = Object.keys(venue.events).filter(d => d >= date).sort()
    return up.length ? venue.events[up[0]].status : 'available'
  }
  const getNextEvent = (venue, date) => {
    const up = Object.keys(venue.events).filter(d => d >= date).sort()
    return up.length ? venue.events[up[0]] : null
  }
  const statusMap = { booked: { label: '🔴 Booked', color: '#ef4444', bg: '#fee2e2' }, pending: { label: '🟡 Pending', color: '#f59e0b', bg: '#fef3c7' }, available: { label: '🟢 Available', color: '#10b981', bg: '#d1fae5' } }

  return (
    <div className="section-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: '700', color: '#1a2535' }}>Venues</h2>
      </div>
      <div style={{ marginBottom: '24px', padding: '18px 22px', background: '#fff', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.055)', border: '1px solid #edf0f5', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <label style={{ fontWeight: '600', color: '#1a2535', fontSize: '14px', whiteSpace: 'nowrap' }}>📅 Select Date:</label>
        <input className="input-field" type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ maxWidth: '200px' }} />
        <span style={{ color: '#8a96a3', fontSize: '13px', marginLeft: 'auto' }}>
          {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '18px' }}>
        {venues.map(venue => {
          const st = getStatus(venue, selectedDate)
          const next = getNextEvent(venue, selectedDate)
          const info = statusMap[st] || statusMap.available
          return (
            <div key={venue.id} className="card-hover" style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #edf0f5', overflow: 'hidden' }}>
              <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f5f7fa' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '30px' }}>{venue.icon}</span>
                  <div>
                    <h3 style={{ margin: '0 0 3px', fontSize: '16px', fontWeight: '700', color: '#1a2535' }}>{venue.name}</h3>
                    <p style={{ margin: 0, color: '#8a96a3', fontSize: '13px' }}>{venue.type}</p>
                  </div>
                </div>
                <div style={{ background: info.bg, color: info.color, padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>{info.label}</div>
              </div>
              <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', borderBottom: '1px solid #f5f7fa' }}>
                {[['👥', 'Capacity', venue.capacity], ['🕐', 'Slots Today', venue.slotsToday]].map(([ico, label, val]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{ico}</span>
                    <div>
                      <p style={{ margin: 0, fontSize: '11px', color: '#8a96a3', fontWeight: '600' }}>{label}</p>
                      <p style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#1a2535' }}>{val}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '14px 20px', background: '#f9fafb' }}>
                <p style={{ margin: 0, fontSize: '13px', color: next ? '#555' : '#10b981', fontWeight: '500' }}>
                  {next ? <><span style={{ fontWeight: '600', color: '#1a2535' }}>Next:</span> {next.date} — {next.eventName}</> : '✓ No upcoming events'}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------- CALENDAR SECTION ----------
function CalendarSection() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 9))
  const [selectedDay, setSelectedDay] = useState(null)
  const mockEvents = { 5: [{ name: 'Spring Fest', status: 'approved', venue: 'Hall A', club: 'Cultural Club' }, { name: 'Guest Lecture', status: 'pending', venue: 'Conference Room', club: 'Tech Club' }], 9: [{ name: 'Tech Talk', status: 'approved', venue: 'Hall B', club: 'Tech Club' }], 12: [{ name: 'Workshop', status: 'draft', venue: 'Hall A', club: 'Coding Club' }], 15: [{ name: 'Cultural Fest', status: 'approved', venue: 'Outdoor Grounds', club: 'Cultural Club' }], 18: [{ name: 'Sports Meet', status: 'rejected', venue: 'Field', club: 'Sports Club' }], 22: [{ name: 'Debate Competition', status: 'pending', venue: 'Hall B', club: 'Debate Club' }] }
  const examDates = [3, 4, 10, 11, 25, 26, 27]
  const month = currentDate.getMonth(); const year = currentDate.getFullYear()
  const monthName = currentDate.toLocaleString('default', { month: 'long' })
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const statusMap = { approved: { color: '#10b981', bg: '#d1fae5', emoji: '🟢' }, pending: { color: '#f59e0b', bg: '#fef3c7', emoji: '🟡' }, rejected: { color: '#ef4444', bg: '#fee2e2', emoji: '🔴' }, draft: { color: '#8b8b8b', bg: '#f3f4f6', emoji: '⚫' } }
  const calDays = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  const legendItems = [{ emoji: '🟢', label: 'Approved' }, { emoji: '🟡', label: 'Pending' }, { emoji: '🔴', label: 'Rejected' }, { emoji: '⚫', label: 'Draft' }, { emoji: '🔵', label: 'Exam Block' }]

  return (
    <div className="section-enter" style={{ padding: '4px 0' }}>
      <div style={{ marginBottom: '22px', padding: '16px 20px', background: '#fff', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #edf0f5', display: 'flex', flexWrap: 'wrap', gap: '18px' }}>
        {legendItems.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ fontSize: '15px' }}>{item.emoji}</span>
            <span style={{ fontSize: '13px', color: '#555', fontWeight: '500' }}>{item.label}</span>
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', borderRadius: '18px', boxShadow: '0 4px 18px rgba(0,0,0,0.07)', border: '1px solid #edf0f5', overflow: 'hidden' }}>
        <div style={{ padding: '22px 26px', background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {[['← Prev', () => { setCurrentDate(new Date(year, month - 1, 1)); setSelectedDay(null) }], ['Next →', () => { setCurrentDate(new Date(year, month + 1, 1)); setSelectedDay(null) }]].map(([label, fn], i) => i === 0 ? (
            <button key={label} onClick={fn} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', padding: '8px 16px', borderRadius: '8px', transition: 'background 0.2s', fontFamily: 'DM Sans, sans-serif' }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.3)'} onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.2)'}>{label}</button>
          ) : null)}
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#fff', fontFamily: 'Syne, sans-serif' }}>{monthName} {year}</h2>
          {[['← Prev', () => {}], ['Next →', () => { setCurrentDate(new Date(year, month + 1, 1)); setSelectedDay(null) }]].map(([label, fn], i) => i === 1 ? (
            <button key={label} onClick={fn} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', padding: '8px 16px', borderRadius: '8px', transition: 'background 0.2s', fontFamily: 'DM Sans, sans-serif' }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.3)'} onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.2)'}>{label}</button>
          ) : null)}
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '8px', marginBottom: '8px' }}>
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontWeight: '700', color: '#667eea', fontSize: '11px', padding: '8px 0', letterSpacing: '0.5px' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '8px' }}>
            {calDays.map((day, idx) => {
              const isExam = day && examDates.includes(day)
              const events = day ? mockEvents[day] || [] : []
              const isSel = day === selectedDay
              return (
                <div key={idx} onClick={() => day && setSelectedDay(isSel ? null : day)}
                  style={{
                    aspectRatio: '1', borderRadius: '10px', padding: '7px',
                    border: isSel ? '2px solid #667eea' : '1px solid #edf0f5',
                    background: isExam ? '#fff0f0' : day ? '#fafbfc' : 'transparent',
                    cursor: day ? 'pointer' : 'default',
                    transition: 'all 0.2s ease', overflow: 'hidden',
                    boxShadow: isSel ? '0 0 0 3px rgba(102,126,234,0.15)' : 'none'
                  }}
                  onMouseEnter={e => { if (day) { e.currentTarget.style.background = isExam ? '#fecaca' : '#f0f3ff'; e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.08)' } }}
                  onMouseLeave={e => { e.currentTarget.style.background = isExam ? '#fff0f0' : (day ? '#fafbfc' : 'transparent'); e.currentTarget.style.boxShadow = isSel ? '0 0 0 3px rgba(102,126,234,0.15)' : 'none' }}
                >
                  {day && (<>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a2535', marginBottom: '3px' }}>{day}</div>
                    {isExam && <div style={{ fontSize: '9px', fontWeight: '600', color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '1px 3px', borderRadius: '3px', marginBottom: '2px', textAlign: 'center' }}>Exams</div>}
                    {events.slice(0, 2).map((ev, ei) => {
                      const si = statusMap[ev.status] || statusMap.draft
                      return <div key={ei} style={{ fontSize: '9px', fontWeight: '600', color: si.color, background: si.bg, padding: '1px 5px', borderRadius: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '2px' }}>{ev.name}</div>
                    })}
                    {events.length > 2 && <div style={{ fontSize: '9px', color: '#8a96a3' }}>+{events.length - 2}</div>}
                  </>)}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {selectedDay && (
        <div className="section-enter" style={{ marginTop: '24px', padding: '24px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)', borderLeft: '4px solid #667eea' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ margin: 0, fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: '700', color: '#1a2535' }}>Events on {monthName} {selectedDay}</h3>
            <button onClick={() => setSelectedDay(null)} style={{ background: '#f0f2f5', border: 'none', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>✕</button>
          </div>
          {examDates.includes(selectedDay) && <div style={{ marginBottom: '14px', padding: '12px', background: '#fee2e2', borderRadius: '8px', borderLeft: '4px solid #ef4444', color: '#dc2626', fontSize: '13px', fontWeight: '600' }}>🔵 Exam Block — No events can be scheduled on this date</div>}
          {(mockEvents[selectedDay] || []).length > 0 ? mockEvents[selectedDay].map((ev, i) => {
            const si = statusMap[ev.status] || statusMap.draft
            return (
              <div key={i} style={{ padding: '14px', background: '#f9fafb', borderRadius: '10px', border: `1px solid ${si.bg}`, marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1a2535' }}>{ev.name}</h4>
                  <span style={{ background: si.bg, color: si.color, padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>{si.emoji} {ev.status}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', color: '#666' }}>
                  <div><span style={{ fontWeight: '600', color: '#333' }}>🏢 Venue:</span> {ev.venue}</div>
                  <div><span style={{ fontWeight: '600', color: '#333' }}>🎯 Club:</span> {ev.club}</div>
                </div>
              </div>
            )
          }) : <p style={{ color: '#8a96a3', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No events scheduled</p>}
        </div>
      )}
    </div>
  )
}

// ---------- APPROVALS SECTION ----------
function ApprovalsSection({ user }) {
  const clubName = user?.email ? user.email.split('@')[0] : ''
  const approvals = [
    { id: 1, eventName: 'Spring Fest', budget: '₹40,000', submittedDate: 'Mar 1', status: 'Under Review', currentStage: 'faculty', rejectionReason: '' },
    { id: 2, eventName: 'Tech Talk', budget: '₹25,000', submittedDate: 'Feb 20', status: 'Approved', currentStage: 'principal', rejectionReason: '' },
    { id: 3, eventName: 'Art Exhibition', budget: '₹30,000', submittedDate: 'Feb 10', status: 'Rejected', currentStage: 'admin', rejectionReason: 'Insufficient budget details.' },
  ]
  const stageOrder = ['submitted', 'faculty', 'admin', 'principal']
  const stageState = (stage, current) => { const i = stageOrder.indexOf(stage), ci = stageOrder.indexOf(current); return i < ci ? 'completed' : i === ci ? 'current' : 'pending' }
  const stageColor = s => s === 'completed' ? '#10b981' : s === 'current' ? '#f59e0b' : '#d1d5db'

  return (
    <div className="section-enter">
      <h2 style={{ margin: '0 0 22px', fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: '700', color: '#1a2535' }}>Approvals{clubName ? ` — ${clubName}` : ''}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {approvals.map(app => (
          <div key={app.id} style={{ background: '#fff', borderRadius: '16px', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1a2535' }}>{app.eventName}</h3>
              <span style={{ fontWeight: '700', color: '#f59e0b', fontSize: '15px' }}>{app.budget}</span>
            </div>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#8a96a3' }}>Submitted {app.submittedDate}</p>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '14px' }}>
              {stageOrder.map((stage, i) => {
                const state = stageState(stage, app.currentStage)
                return (
                  <React.Fragment key={stage}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: stageColor(state), transition: 'background 0.3s', boxShadow: state === 'current' ? '0 0 0 4px rgba(245,158,11,0.2)' : 'none' }} />
                      <div style={{ fontSize: '10px', color: '#555', marginTop: '5px', textTransform: 'capitalize', fontWeight: '600' }}>{stage}</div>
                    </div>
                    {i < stageOrder.length - 1 && <div style={{ flex: 1, height: '2px', background: '#e8edf3', marginBottom: '16px' }} />}
                  </React.Fragment>
                )
              })}
            </div>
            {app.status === 'Rejected' && app.rejectionReason && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '10px' }}>Reason: {app.rejectionReason}</p>}
            <div style={{ textAlign: 'right' }}>
              <span style={{ padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: '#fff', background: app.status === 'Approved' ? '#10b981' : app.status === 'Rejected' ? '#ef4444' : app.status === 'Under Review' ? '#f59e0b' : '#d1d5db' }}>{app.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------- STATISTICS SECTION ----------
function StatisticsSection() {
  const metrics = [
    { title: 'Events This Semester', value: '24', change: '+12%', icon: '📊', color: '#667eea', bg: '#ede9fe' },
    { title: 'Avg. Approval Time', value: '3.2 days', change: '-18%', icon: '⏱️', color: '#10b981', bg: '#d1fae5' },
    { title: 'Venue Utilization', value: '72%', change: '+5%', icon: '🏢', color: '#f59e0b', bg: '#fef3c7' },
    { title: 'Budget Efficiency', value: '91%', change: '+3%', icon: '💰', color: '#ef4444', bg: '#fee2e2' },
  ]
  const budgetData = [{ month: 'Jan', amount: 35 }, { month: 'Feb', amount: 85 }, { month: 'Mar', amount: 120 }, { month: 'Apr', amount: 95 }, { month: 'May', amount: 45 }]
  const maxBudget = Math.max(...budgetData.map(d => d.amount))

  return (
    <div className="section-enter">
      <div style={{ marginBottom: '26px' }}>
        <h1 style={{ margin: '0 0 5px', fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: '800', color: '#1a2535' }}>Analytics</h1>
        <p style={{ margin: 0, color: '#8a96a3', fontSize: '14px' }}>Insights and performance metrics</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '16px', marginBottom: '30px' }}>
        {metrics.map((m, i) => (
          <div key={m.title} className="card-hover" style={{ background: '#fff', borderRadius: '16px', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5', animationDelay: `${i * 0.06}s`, animation: 'fadeSlideIn 0.4s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{ fontSize: '28px', background: m.bg, width: '52px', height: '52px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{m.icon}</div>
              <span style={{ color: m.change.startsWith('+') ? '#10b981' : '#ef4444', fontSize: '13px', fontWeight: '700', background: m.change.startsWith('+') ? '#d1fae5' : '#fee2e2', padding: '3px 8px', borderRadius: '6px' }}>{m.change}</span>
            </div>
            <p style={{ margin: '0 0 6px', color: '#8a96a3', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{m.title}</p>
            <p style={{ margin: 0, color: '#1a2535', fontSize: '26px', fontWeight: '700', fontFamily: 'Syne, sans-serif' }}>{m.value}</p>
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', borderRadius: '18px', padding: '26px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5' }}>
        <h2 style={{ margin: '0 0 24px', fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: '700', color: '#1a2535' }}>Monthly Budget Spending</h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '200px', paddingBottom: '12px', borderBottom: '1px solid #f0f2f5', marginBottom: '22px', gap: '14px' }}>
          {budgetData.map((d, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
              <div style={{ height: `${(d.amount / maxBudget) * 160}px`, width: '48px', background: 'linear-gradient(180deg,#667eea,#764ba2)', borderRadius: '8px 8px 0 0', transition: 'opacity 0.2s, transform 0.2s', cursor: 'pointer', position: 'relative' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.75'; e.currentTarget.style.transform = 'scaleY(1.04) translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none' }}
                title={`₹${d.amount}K`}
              />
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#8a96a3' }}>{d.month}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '16px' }}>
          {[['Total Budget', '₹380K', '#1a2535'], ['Average Monthly', '₹76K', '#1a2535'], ['Peak Month', '₹120K', '#1a2535'], ['Growth', '+18%', '#10b981']].map(([l, v, c]) => (
            <div key={l}><p style={{ margin: '0 0 3px', color: '#8a96a3', fontSize: '11px', fontWeight: '600' }}>{l}</p><p style={{ margin: 0, color: c, fontSize: '20px', fontWeight: '700', fontFamily: 'Syne, sans-serif' }}>{v}</p></div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------- NOTIFICATIONS SECTION ----------
function NotificationsSection({ onResubmitEvent, onReportIssue }) {
  const [selectedNotif, setSelectedNotif] = useState(null)
  const [filter, setFilter] = useState('all')
  const mockNotifications = [
    { id: 1, type: 'approved', title: 'Event Approved', message: 'Your event TechFest 2026 has been approved.', eventName: 'TechFest 2026', venue: 'Hall A', date: 'Mar 15, 2026', budget: '₹50,000', status: 'Approved', read: false, timestamp: '5 min ago' },
    { id: 2, type: 'rejected', title: 'Event Rejected', message: 'Your event Hackathon 3.0 has been rejected.', eventName: 'Hackathon 3.0', rejectedBy: 'Dr. Sharma (Faculty)', rejectionReason: 'Budget exceeds approved limit. Please reduce by 20% and resubmit.', read: false, timestamp: '2 hours ago' },
    { id: 3, type: 'pending', title: 'Approval Pending', message: 'Your event Cultural Night is awaiting approval.', eventName: 'Cultural Night', venue: 'Outdoor Grounds', date: 'Mar 22, 2026', budget: '₹35,000', stoppedAt: 'Faculty Review', contactEmail: 'faculty.chair@college.edu', contactPhone: '+91 9876543210', read: false, timestamp: '1 day ago' },
    { id: 4, type: 'alert', title: 'Budget Clarification Required', message: '⚠ Budget clarification required for TechFest.', alertDetails: 'Please provide itemized breakdown of budget allocation before final approval.', read: true, timestamp: '3 days ago' },
    { id: 5, type: 'alert', title: 'Upload Photos Reminder', message: '⚠ Please upload event photos for Spring Fest.', alertDetails: 'Event photos required for record keeping. Please upload before Mar 15, 2026.', read: true, timestamp: '4 days ago' },
  ]
  const filtered = filter === 'all' ? mockNotifications : filter === 'approvals' ? mockNotifications.filter(n => ['approved', 'rejected', 'pending'].includes(n.type)) : mockNotifications.filter(n => n.type === 'alert')
  const styleMap = { approved: { borderColor: '#10b981', bg: '#d1fae5', icon: '🟢', color: '#10b981' }, rejected: { borderColor: '#ef4444', bg: '#fee2e2', icon: '🔴', color: '#ef4444' }, pending: { borderColor: '#f59e0b', bg: '#fef3c7', icon: '🟡', color: '#f59e0b' }, alert: { borderColor: '#9ca3af', bg: '#f3f4f6', icon: '⚠️', color: '#666' } }

  return (
    <div className="section-enter" style={{ maxWidth: '820px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: '700', color: '#1a2535' }}>Notifications</h2>
      </div>
      <div style={{ display: 'flex', gap: '6px', borderBottom: '2px solid #edf0f5', marginBottom: '22px', paddingBottom: '0' }}>
        {[['all', 'All'], ['approvals', 'Approvals'], ['alerts', 'Alerts']].map(([t, l]) => (
          <button key={t} onClick={() => { setFilter(t); setSelectedNotif(null) }}
            style={{ background: 'none', border: 'none', padding: '10px 18px', fontSize: '14px', fontWeight: '600', color: filter === t ? '#667eea' : '#8a96a3', cursor: 'pointer', borderBottom: filter === t ? '2.5px solid #667eea' : '2.5px solid transparent', marginBottom: '-2px', transition: 'color 0.2s, border-color 0.2s', fontFamily: 'DM Sans, sans-serif' }}
          >{l}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map((n, i) => {
          const s = styleMap[n.type] || styleMap.alert
          const gradMap = { approved: 'linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%)', rejected: 'linear-gradient(135deg,#fff5f5 0%,#fee2e2 100%)', pending: 'linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%)', alert: 'linear-gradient(135deg,#f8fafc 0%,#f1f5f9 100%)' }
          const accentMap = { approved: '#10b981', rejected: '#ef4444', pending: '#f59e0b', alert: '#94a3b8' }
          const labelMap = { approved: 'Approved', rejected: 'Rejected', pending: 'Pending', alert: 'Alert' }
          const accent = accentMap[n.type] || accentMap.alert
          return (
            <div key={n.id} onClick={() => setSelectedNotif(n)}
              style={{ background: n.read ? '#fff' : gradMap[n.type], borderRadius: '16px', border: `1px solid ${n.read ? '#edf0f5' : accent + '44'}`, boxShadow: n.read ? '0 1px 6px rgba(0,0,0,0.05)' : `0 4px 16px ${accent}22`, cursor: 'pointer', transition: 'all 0.28s cubic-bezier(0.22,1,0.36,1)', overflow: 'hidden', animationDelay: `${i * 0.05}s`, animation: 'fadeSlideIn 0.4s ease both', display: 'flex' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${accent}30` }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = n.read ? '0 1px 6px rgba(0,0,0,0.05)' : `0 4px 16px ${accent}22` }}
            >
              <div style={{ width: '4px', background: accent, flexShrink: 0, borderRadius: '16px 0 0 16px' }} />
              <div style={{ flex: 1, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0, background: accent + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', border: `1.5px solid ${accent}33` }}>
                  {s.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: n.read ? '600' : '700', color: '#1a2535' }}>{n.title}</h3>
                    <span style={{ fontSize: '10px', fontWeight: '700', color: accent, background: accent + '18', padding: '2px 8px', borderRadius: '8px', letterSpacing: '0.3px', textTransform: 'uppercase', flexShrink: 0 }}>{labelMap[n.type]}</span>
                  </div>
                  <p style={{ margin: '0 0 6px', color: '#6b7280', fontSize: '13px', lineHeight: '1.45', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.message}</p>
                  <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#d1d5db', display: 'inline-block' }} />{n.timestamp}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                  {!n.read && <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: accent, boxShadow: `0 0 0 3px ${accent}33` }} />}
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#9ca3af' }}>›</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {selectedNotif && (
        <div className="section-enter" style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,30,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setSelectedNotif(null)}>
          <div className="modal-enter" style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 24px 60px rgba(0,0,0,0.2)', width: '100%', maxWidth: '480px', padding: '32px', position: 'relative', maxHeight: '85vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedNotif(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f0f2f5', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', transition: 'background 0.18s' }} onMouseEnter={e => e.currentTarget.style.background = '#e2e6ea'} onMouseLeave={e => e.currentTarget.style.background = '#f0f2f5'}>✕</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '28px' }}>{styleMap[selectedNotif.type]?.icon}</span>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1a2535', fontFamily: 'Syne, sans-serif' }}>{selectedNotif.title}</h2>
            </div>
            {selectedNotif.type === 'approved' && (<>
              <div style={{ background: '#d1fae5', padding: '14px', borderRadius: '10px', marginBottom: '20px', color: '#065f46', fontSize: '13px', fontWeight: '600', borderLeft: '4px solid #10b981' }}>{selectedNotif.message}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                {[['📅 Date', selectedNotif.date], ['🏢 Venue', selectedNotif.venue], ['💰 Budget', selectedNotif.budget], ['✅ Status', selectedNotif.status]].map(([l, v]) => (
                  <div key={l} style={{ padding: '12px', background: '#f7f9fc', borderRadius: '10px' }}><p style={{ margin: '0 0 4px', fontSize: '11px', color: '#8a96a3', fontWeight: '600', textTransform: 'uppercase' }}>{l}</p><p style={{ margin: 0, fontWeight: '700', color: '#1a2535' }}>{v}</p></div>
                ))}
              </div>
            </>)}
            {selectedNotif.type === 'rejected' && (<>
              <div style={{ background: '#fee2e2', padding: '14px', borderRadius: '10px', marginBottom: '20px', color: '#991b1b', fontSize: '13px', fontWeight: '600', borderLeft: '4px solid #ef4444' }}>{selectedNotif.message}</div>
              <div style={{ padding: '16px', background: '#fef2f2', borderRadius: '10px', marginBottom: '20px' }}>
                <p style={{ margin: '0 0 8px', color: '#8a96a3', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Rejected by</p>
                <p style={{ margin: '0 0 12px', fontWeight: '700', color: '#1a2535' }}>{selectedNotif.rejectedBy}</p>
                <p style={{ margin: '0 0 6px', color: '#8a96a3', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Reason</p>
                <p style={{ margin: 0, color: '#dc2626', fontWeight: '600', fontSize: '14px', lineHeight: '1.5' }}>{selectedNotif.rejectionReason}</p>
              </div>
              <button className="btn-primary" style={{ width: '100%', padding: '12px' }} onClick={() => { onResubmitEvent(''); setSelectedNotif(null) }}>Resubmit Event</button>
            </>)}
            {selectedNotif.type === 'pending' && (<>
              <div style={{ background: '#fef3c7', padding: '14px', borderRadius: '10px', marginBottom: '20px', color: '#92400e', fontSize: '13px', fontWeight: '600', borderLeft: '4px solid #f59e0b' }}>{selectedNotif.message}</div>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ margin: '0 0 4px', color: '#8a96a3', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Stopped at</p>
                <p style={{ margin: '0 0 16px', fontWeight: '700', color: '#f59e0b', fontSize: '15px' }}>{selectedNotif.stoppedAt}</p>
                <div style={{ padding: '14px', background: '#f5f3ff', borderRadius: '10px' }}>
                  <p style={{ margin: '0 0 10px', fontWeight: '700', fontSize: '14px', color: '#1a2535' }}>📞 Contact</p>
                  <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#667eea', fontWeight: '600' }}>{selectedNotif.contactEmail}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#333', fontWeight: '600' }}>{selectedNotif.contactPhone}</p>
                </div>
              </div>
              <button style={{ width: '100%', padding: '12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#dc2626'} onMouseLeave={e => e.currentTarget.style.background = '#ef4444'} onClick={() => { onReportIssue(selectedNotif); setSelectedNotif(null) }}>Report Issue</button>
            </>)}
            {selectedNotif.type === 'alert' && (<>
              <div style={{ background: '#f3f4f6', padding: '14px', borderRadius: '10px', marginBottom: '20px', color: '#374151', fontSize: '13px', fontWeight: '600', borderLeft: '4px solid #9ca3af' }}>{selectedNotif.message}</div>
              <div style={{ padding: '14px', background: '#f9fafb', borderRadius: '10px' }}><p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.6' }}>{selectedNotif.alertDetails}</p></div>
            </>)}
          </div>
        </div>
      )}
    </div>
  )
}

// ---------- UPLOAD BILLS SECTION ----------
function UploadBillsSection() {
  const [files, setFiles] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [activeSource, setActiveSource] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [eventName, setEventName] = useState('')
  const [billType, setBillType] = useState('')
  const [notes, setNotes] = useState('')
  const fileInputRef = useRef(null)
  const cameraRef = useRef(null)

  const billTypes = ['Venue Booking', 'Catering', 'Equipment', 'Decoration', 'Marketing', 'Miscellaneous']

  const processFiles = (incoming) => {
    const newFiles = Array.from(incoming).map(f => ({
      id: Date.now() + Math.random(),
      file: f,
      name: f.name,
      size: f.size,
      type: f.type,
      preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null
    }))
    setFiles(prev => [...prev, ...newFiles])
  }

  const handleDrop = e => { e.preventDefault(); setDragOver(false); processFiles(e.dataTransfer.files) }
  const handleDragOver = e => { e.preventDefault(); setDragOver(true) }
  const handleDragLeave = () => setDragOver(false)
  const removeFile = id => setFiles(prev => prev.filter(f => f.id !== id))
  const formatSize = bytes => bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`

  const getFileIcon = type => {
    if (type.startsWith('image/')) return '🖼️'
    if (type === 'application/pdf') return '📄'
    if (type.includes('word')) return '📝'
    if (type.includes('sheet') || type.includes('excel')) return '📊'
    return '📎'
  }

  const handleSubmit = () => {
    if (!eventName || !billType || files.length === 0) { alert('Please fill in event name, bill type, and attach at least one file.'); return }
    setSubmitting(true)
    setTimeout(() => { setSubmitting(false); setSubmitted(true) }, 1800)
  }

  if (submitted) {
    return (
      <div className="section-enter" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ background: '#fff', borderRadius: '24px', padding: '50px 40px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', maxWidth: '420px', width: '100%', border: '1px solid #edf0f5' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: '800', color: '#1a2535', margin: '0 0 10px' }}>Bills Uploaded!</h2>
          <p style={{ color: '#8a96a3', fontSize: '14px', marginBottom: '28px', lineHeight: '1.6' }}>{files.length} file{files.length !== 1 ? 's' : ''} submitted for <strong style={{ color: '#1a2535' }}>{eventName}</strong>. Our team will review and process them shortly.</p>
          <button className="btn-primary" style={{ width: '100%', padding: '12px' }} onClick={() => { setSubmitted(false); setFiles([]); setEventName(''); setBillType(''); setNotes('') }}>Upload More</button>
        </div>
      </div>
    )
  }

  return (
    <div className="section-enter" style={{ maxWidth: '760px' }}>
      <div style={{ marginBottom: '26px' }}>
        <h1 style={{ margin: '0 0 5px', fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: '800', color: '#1a2535' }}>Upload Bills</h1>
        <p style={{ margin: 0, color: '#8a96a3', fontSize: '14px' }}>Attach receipts, invoices, and event-related documents</p>
      </div>

      {/* Event Details */}
      <div style={{ background: '#fff', borderRadius: '18px', padding: '26px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 18px', fontSize: '16px', fontWeight: '700', color: '#1a2535' }}>Event Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', margin: '0 0 7px', fontSize: '13px', fontWeight: '600', color: '#555' }}>Event Name *</label>
            <input className="input-field" type="text" placeholder="e.g. Spring Fest 2026" value={eventName} onChange={e => setEventName(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', margin: '0 0 7px', fontSize: '13px', fontWeight: '600', color: '#555' }}>Bill Type *</label>
            <select className="input-field" value={billType} onChange={e => setBillType(e.target.value)} style={{ cursor: 'pointer' }}>
              <option value="">Select bill type</option>
              {billTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', margin: '0 0 7px', fontSize: '13px', fontWeight: '600', color: '#555' }}>Notes (optional)</label>
          <textarea className="input-field" rows={3} placeholder="Add any additional notes about the bills..." value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: 'vertical', minHeight: '80px' }} />
        </div>
      </div>

      {/* Upload Options */}
      <div style={{ background: '#fff', borderRadius: '18px', padding: '26px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 18px', fontSize: '16px', fontWeight: '700', color: '#1a2535' }}>Attach Files</h3>

        {/* Upload Source Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '22px' }}>
          {[
            { key: 'camera', icon: '📸', label: 'Camera', sub: 'Take a photo', accept: 'image/*', capture: 'environment' },
            { key: 'photos', icon: '🖼️', label: 'Photos', sub: 'Choose from gallery', accept: 'image/*', capture: null },
            { key: 'docs', icon: '📁', label: 'Documents', sub: 'PDF, Word, Excel', accept: '.pdf,.doc,.docx,.xls,.xlsx,.csv,image/*', capture: null },
          ].map(src => (
            <button key={src.key} onClick={() => {
              setActiveSource(src.key)
              const inp = document.createElement('input')
              inp.type = 'file'
              inp.accept = src.accept
              if (src.capture) inp.setAttribute('capture', src.capture)
              inp.multiple = src.key !== 'camera'
              inp.onchange = e => { if (e.target.files?.length) processFiles(e.target.files) }
              inp.click()
            }}
              style={{
                background: activeSource === src.key ? '#f0f3ff' : '#f7f9fc',
                border: activeSource === src.key ? '2px solid #667eea' : '2px solid #edf0f5',
                borderRadius: '14px', padding: '18px 12px', cursor: 'pointer', textAlign: 'center',
                transition: 'all 0.22s ease', fontFamily: 'DM Sans, sans-serif'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#667eea'; e.currentTarget.style.background = '#f0f3ff' }}
              onMouseLeave={e => { if (activeSource !== src.key) { e.currentTarget.style.borderColor = '#edf0f5'; e.currentTarget.style.background = '#f7f9fc' } }}
            >
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>{src.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a2535', marginBottom: '3px' }}>{src.label}</div>
              <div style={{ fontSize: '11px', color: '#8a96a3', fontWeight: '500' }}>{src.sub}</div>
            </button>
          ))}
        </div>

        {/* Drop Zone */}
        <div
          className={`upload-drop-zone ${dragOver ? 'drag-over' : ''}`}
          onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
          onClick={() => { const inp = document.createElement('input'); inp.type = 'file'; inp.multiple = true; inp.accept = 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv'; inp.onchange = e => { if (e.target.files?.length) processFiles(e.target.files) }; inp.click() }}
        >
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>☁️</div>
          <p style={{ margin: '0 0 5px', fontSize: '15px', fontWeight: '600', color: '#1a2535' }}>Drop files here or click to browse</p>
          <p style={{ margin: 0, fontSize: '13px', color: '#8a96a3' }}>Supports: JPG, PNG, PDF, DOC, XLS — Max 10MB each</p>
        </div>
      </div>

      {/* Attached Files */}
      {files.length > 0 && (
        <div style={{ background: '#fff', borderRadius: '18px', padding: '26px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1a2535' }}>Attached Files <span style={{ background: '#667eea', color: '#fff', borderRadius: '10px', padding: '2px 9px', fontSize: '12px', fontWeight: '700', marginLeft: '8px' }}>{files.length}</span></h3>
            <button onClick={() => setFiles([])} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Clear All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {files.map(f => (
              <div key={f.id} className="file-pill">
                {f.preview ? (
                  <img src={f.preview} alt="preview" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f0f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{getFileIcon(f.type)}</div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '600', color: '#1a2535', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#8a96a3' }}>{formatSize(f.size)}</p>
                </div>
                <button onClick={() => removeFile(f.id)} style={{ background: '#fee2e2', border: 'none', color: '#ef4444', width: '28px', height: '28px', borderRadius: '7px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.18s' }} onMouseEnter={e => e.currentTarget.style.background = '#fecaca'} onMouseLeave={e => e.currentTarget.style.background = '#fee2e2'}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit */}
      <button className="btn-primary" onClick={handleSubmit} disabled={submitting}
        style={{ width: '100%', padding: '14px', fontSize: '15px', borderRadius: '14px', opacity: submitting ? 0.75 : 1, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        {submitting ? (<><span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Uploading...</>) : (<>📤 Submit Bills</>)}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ---------- SETTINGS SECTION (Bug Fixed) ----------
function SettingsSection() {
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState({ clubName: 'Tech Innovation Club', email: 'techclub@university.edu', phone: '+1-234-567-8900', facultyInCharge: 'Dr. Sarah Johnson' })
  const [profileEditing, setProfileEditing] = useState(false)
  const [profileForm, setProfileForm] = useState({ ...profileData })
  const [accountSettings, setAccountSettings] = useState({ twoFactorEnabled: false })
  const [notifSettings, setNotifSettings] = useState({ emailNotifications: true, inAppNotifications: true, approvalUpdates: true, budgetNotifications: true, deadlineReminders: true })
  // Fix: Separate state from localStorage - don't use localStorage in React artifacts
  const [appearance, setAppearance] = useState({ darkMode: false, fontSize: 'medium', compactMode: false })
  const [securitySettings, setSecuritySettings] = useState({ loginAlerts: true })
  const [modals, setModals] = useState({ logout: false, password: false, export: false, contactAdmin: false, clearData: false })
  const openModal = k => setModals(p => ({ ...p, [k]: true }))
  const closeModal = k => setModals(p => ({ ...p, [k]: false }))

  const Toggle = ({ checked, onChange, label, sub }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sub ? '4px' : '16px' }}>
      <label style={{ fontSize: '14px', color: '#444', fontWeight: '500' }}>{label}</label>
      <button className="toggle-track" onClick={onChange} style={{ background: checked ? '#667eea' : '#d1d5db' }}>
        <div className="toggle-thumb" style={{ left: checked ? '25px' : '3px' }} />
      </button>
    </div>
  )

  const Card = ({ icon, title, children }) => (
    <div style={{ background: '#fff', borderRadius: '18px', padding: '26px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5', marginBottom: '18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <span style={{ fontSize: '24px' }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1a2535', fontFamily: 'Syne, sans-serif' }}>{title}</h3>
      </div>
      {children}
    </div>
  )

  const Modal = ({ title, children, onClose }) => (
    <div className="section-enter" style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,30,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }} onClick={onClose}>
      <div className="modal-enter" style={{ background: '#fff', borderRadius: '20px', padding: '32px', maxWidth: '420px', width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ margin: '0 0 18px', fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '700', color: '#1a2535' }}>{title}</h2>
        {children}
      </div>
    </div>
  )

  return (
    <div className="section-enter" style={{ maxWidth: '820px' }}>
      <h1 style={{ margin: '0 0 26px', fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: '800', color: '#1a2535' }}>Settings</h1>

      {/* Profile */}
      <Card icon="👤" title="Profile Settings">
        {!profileEditing ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              {[['CLUB NAME', profileData.clubName], ['EMAIL', profileData.email], ['PHONE', profileData.phone], ['FACULTY IN-CHARGE', profileData.facultyInCharge]].map(([l, v]) => (
                <div key={l} style={{ padding: '12px', background: '#f7f9fc', borderRadius: '10px' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '10px', color: '#8a96a3', fontWeight: '700', letterSpacing: '0.7px' }}>{l}</p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#1a2535', fontWeight: '600' }}>{v}</p>
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={() => { setProfileForm({ ...profileData }); setProfileEditing(true) }}>Edit Profile</button>
          </div>
        ) : (
          <div>
            {[['clubName', 'Club Name', 'text'], ['email', 'Email Address', 'email'], ['phone', 'Phone Number', 'tel'], ['facultyInCharge', 'Faculty In-Charge', 'text']].map(([k, l, t]) => (
              <div key={k} style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', margin: '0 0 6px', fontSize: '13px', fontWeight: '600', color: '#555' }}>{l}</label>
                <input className="input-field" type={t} value={profileForm[k]} onChange={e => setProfileForm(p => ({ ...p, [k]: e.target.value }))} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => { setProfileData({ ...profileForm }); setProfileEditing(false) }}>Save Changes</button>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => { setProfileEditing(false); setProfileForm({ ...profileData }) }}>Cancel</button>
            </div>
          </div>
        )}
      </Card>

      {/* Account */}
      <Card icon="🔐" title="Account Settings">
        <Toggle checked={accountSettings.twoFactorEnabled} onChange={() => setAccountSettings(p => ({ ...p, twoFactorEnabled: !p.twoFactorEnabled }))} label="Two-Factor Authentication" />
        <p style={{ margin: '-8px 0 18px', fontSize: '12px', color: '#8a96a3' }}>{accountSettings.twoFactorEnabled ? '2FA is enabled for your account' : 'Enhance your account security with 2FA'}</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-primary" onClick={() => openModal('password')}>Change Password</button>
          <button className="btn-ghost" onClick={() => navigate('/login')}>Logout All Devices</button>
        </div>
      </Card>

      {/* Notifications */}
      <Card icon="🔔" title="Notification Preferences">
        {[['emailNotifications', 'Email Notifications'], ['inAppNotifications', 'In-App Notifications'], ['approvalUpdates', 'Event Approval Updates'], ['budgetNotifications', 'Budget Notifications'], ['deadlineReminders', 'Deadline Reminders']].map(([k, l]) => (
          <Toggle key={k} checked={notifSettings[k]} onChange={() => setNotifSettings(p => ({ ...p, [k]: !p[k] }))} label={l} />
        ))}
      </Card>

      {/* Appearance — FIXED: no localStorage, no window.location.reload */}
      <Card icon="🎨" title="Appearance Settings">
        <Toggle checked={appearance.darkMode} onChange={() => setAppearance(p => ({ ...p, darkMode: !p.darkMode }))} label="Dark Mode" />
        <p style={{ margin: '-8px 0 16px', fontSize: '12px', color: '#8a96a3' }}>Dark mode preview applies to this settings panel only</p>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', margin: '0 0 8px', fontSize: '14px', fontWeight: '500', color: '#444' }}>Font Size</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Small', 'Medium', 'Large'].map(size => (
              <button key={size} onClick={() => setAppearance(p => ({ ...p, fontSize: size.toLowerCase() }))}
                style={{ flex: 1, padding: '8px', borderRadius: '10px', border: '2px solid', borderColor: appearance.fontSize === size.toLowerCase() ? '#667eea' : '#e0e4ea', background: appearance.fontSize === size.toLowerCase() ? '#f0f3ff' : '#f7f9fc', color: appearance.fontSize === size.toLowerCase() ? '#667eea' : '#555', fontWeight: '600', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s ease', fontFamily: 'DM Sans, sans-serif' }}>
                {size}
              </button>
            ))}
          </div>
        </div>
        <Toggle checked={appearance.compactMode} onChange={() => setAppearance(p => ({ ...p, compactMode: !p.compactMode }))} label="Compact Mode" />
        <div style={{ marginTop: '14px', padding: '14px', background: appearance.darkMode ? '#1a2535' : '#f7f9fc', borderRadius: '12px', border: '1px solid #edf0f5', transition: 'background 0.4s ease' }}>
          <p style={{ margin: 0, fontSize: appearance.fontSize === 'small' ? '12px' : appearance.fontSize === 'large' ? '16px' : '14px', color: appearance.darkMode ? '#ecf0f1' : '#444', transition: 'all 0.3s ease', fontWeight: '500' }}>Preview: This text adjusts based on your settings. {appearance.compactMode ? '(Compact)' : '(Standard)'}</p>
        </div>
      </Card>

      {/* Security */}
      <Card icon="🔒" title="Security Settings">
        <Toggle checked={securitySettings.loginAlerts} onChange={() => setSecuritySettings(p => ({ ...p, loginAlerts: !p.loginAlerts }))} label="Enable Login Alerts" />
        <h4 style={{ margin: '16px 0 12px', fontSize: '14px', fontWeight: '600', color: '#1a2535' }}>Recent Login Activity</h4>
        {[{ device: 'Chrome on Windows', date: 'Today at 10:30 AM', location: 'University Campus' }, { device: 'Safari on iPhone', date: 'Yesterday at 3:15 PM', location: 'Off-campus' }].map((l, i) => (
          <div key={i} style={{ background: '#f7f9fc', padding: '12px 14px', borderRadius: '10px', marginBottom: '8px', border: '1px solid #edf0f5' }}>
            <p style={{ margin: '0 0 2px', color: '#1a2535', fontWeight: '600', fontSize: '14px' }}>{l.device}</p>
            <p style={{ margin: 0, color: '#8a96a3', fontSize: '12px' }}>{l.date} · {l.location}</p>
          </div>
        ))}
      </Card>

      {/* Data */}
      <Card icon="💾" title="Data & Storage">
        <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#666' }}>Download all your event data or clear sensitive information.</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-primary" onClick={() => openModal('export')}>Export Data</button>
          <button style={{ padding: '10px 20px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'background 0.2s', fontFamily: 'DM Sans, sans-serif' }} onMouseEnter={e => e.currentTarget.style.background = '#fecaca'} onMouseLeave={e => e.currentTarget.style.background = '#fee2e2'} onClick={() => openModal('clearData')}>Clear Data</button>
        </div>
      </Card>

      {/* Help */}
      <Card icon="❓" title="Help & Support">
        <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#666' }}>Need help? Contact support or check FAQs.</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-primary" onClick={() => openModal('contactAdmin')}>Contact Admin</button>
        </div>
      </Card>

      {/* Logout */}
      <button onClick={() => openModal('logout')} style={{ width: '100%', padding: '14px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '14px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', transition: 'background 0.22s, transform 0.18s', marginTop: '8px', fontFamily: 'DM Sans, sans-serif' }} onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.transform = 'translateY(-1px)' }} onMouseLeave={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.transform = 'none' }}>Logout</button>

      {/* Modals */}
      {modals.logout && (
        <Modal title="Confirm Logout" onClose={() => closeModal('logout')}>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>Are you sure you want to logout?</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={() => closeModal('logout')}>Cancel</button>
            <button style={{ flex: 1, padding: '12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontFamily: 'DM Sans, sans-serif', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#dc2626'} onMouseLeave={e => e.currentTarget.style.background = '#ef4444'} onClick={() => navigate('/login')}>Logout</button>
          </div>
        </Modal>
      )}
      {modals.password && (
        <Modal title="Change Password" onClose={() => closeModal('password')}>
          {['Current Password', 'New Password', 'Confirm New Password'].map(l => (
            <div key={l} style={{ marginBottom: '14px' }}><label style={{ display: 'block', margin: '0 0 6px', fontSize: '13px', fontWeight: '600', color: '#555' }}>{l}</label><input className="input-field" type="password" placeholder={l} /></div>
          ))}
          <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={() => closeModal('password')}>Cancel</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => closeModal('password')}>Update</button>
          </div>
        </Modal>
      )}
      {modals.export && (
        <Modal title="Data Export" onClose={() => closeModal('export')}>
          <div style={{ textAlign: 'center', padding: '10px 0 20px' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>✅</span>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Your event data will be downloaded shortly as a CSV file.</p>
          </div>
          <button className="btn-primary" style={{ width: '100%', padding: '12px' }} onClick={() => closeModal('export')}>Done</button>
        </Modal>
      )}
      {modals.contactAdmin && (
        <Modal title="Admin Contact" onClose={() => closeModal('contactAdmin')}>
          <div style={{ background: '#f7f9fc', borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
            {[['ADMIN NAME', 'Dr. Michael Chen'], ['EMAIL', 'admin@university.edu'], ['PHONE', '+1-555-0123'], ['OFFICE', 'Admin Building, Room 201']].map(([l, v]) => (
              <div key={l} style={{ marginBottom: '12px' }}><p style={{ margin: '0 0 3px', fontSize: '10px', color: '#8a96a3', fontWeight: '700', letterSpacing: '0.7px' }}>{l}</p><p style={{ margin: 0, fontSize: '14px', color: '#1a2535', fontWeight: '600' }}>{v}</p></div>
            ))}
          </div>
          <button className="btn-primary" style={{ width: '100%', padding: '12px' }} onClick={() => closeModal('contactAdmin')}>Close</button>
        </Modal>
      )}
      {modals.clearData && (
        <Modal title="Clear Data Warning" onClose={() => closeModal('clearData')}>
          <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
            <span style={{ fontSize: '44px', display: 'block', marginBottom: '12px' }}>⚠️</span>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', marginBottom: '6px' }}>This will clear all saved preferences and notifications. Event records will NOT be deleted.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={() => closeModal('clearData')}>Cancel</button>
            <button style={{ flex: 1, padding: '12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontFamily: 'DM Sans, sans-serif' }} onClick={() => closeModal('clearData')}>Confirm</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ---------- CREATE EVENT PAGE ----------
function CreateEventPage({ onSectionChange, switchToDashboard, prefilledEventName }) {
  const [formData, setFormData] = useState({ name: prefilledEventName || '', venue: '', startDate: '', endDate: '', timeStart: '', timeEnd: '', budget: '', description: '' })
  const [errors, setErrors] = useState({})
  const [conflictMsg, setConflictMsg] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [docFiles, setDocFiles] = useState({})
  const venues = ['Hall A', 'Hall B', 'Conference Room']
  const booked = [{ venue: 'Hall A', date: '2026-03-10' }, { venue: 'Hall B', date: '2026-03-12' }]

  // Required documents list
  const requiredDocs = [
    { id: 'budget_sheet', label: 'Budget Sheet', icon: '📊', hint: 'Itemized budget breakdown (PDF/Excel)', required: true },
    
    { id: 'event_proposal', label: 'Event Proposal', icon: '📝', hint: 'Detailed proposal document (PDF/Word)', required: true },
    { id: 'sponsor_letter', label: 'Sponsorship Letter', icon: '🤝', hint: 'If sponsored — attach sponsor agreement', required: false },
    { id: 'insurance', label: 'Event Insurance', icon: '🛡️', hint: 'Liability insurance for large events', required: false },
  ]

  const handleDocUpload = (docId, files) => {
    if (!files?.length) return
    const f = files[0]
    setDocFiles(prev => ({
      ...prev,
      [docId]: { name: f.name, size: f.size, type: f.type, preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null }
    }))
  }

  const removeDoc = docId => setDocFiles(prev => { const n = { ...prev }; delete n[docId]; return n })

  const triggerDocInput = (docId) => {
    const inp = document.createElement('input')
    inp.type = 'file'
    inp.accept = 'image/*,.pdf,.doc,.docx,.xls,.xlsx'
    inp.onchange = e => handleDocUpload(docId, e.target.files)
    inp.click()
  }

  const formatSize = bytes => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`

  const validate = () => {
    const e = {}
    if (!formData.name) e.name = 'Event name required'
    if (!formData.venue) e.venue = 'Venue required'
    if (!formData.startDate) e.startDate = 'Start date required'
    if (!formData.endDate) e.endDate = 'End date required'
    if (formData.startDate === formData.endDate && formData.startDate) { if (!formData.timeStart) e.timeStart = 'Start time required'; if (!formData.timeEnd) e.timeEnd = 'End time required' }
    if (!formData.budget) e.budget = 'Budget required'
    setErrors(e); return Object.keys(e).length === 0
  }

  const checkConflict = () => {
    const c = booked.find(b => b.venue === formData.venue && (b.date === formData.startDate || b.date === formData.endDate))
    if (c) { setConflictMsg('This venue/date is already booked. Check Venues or Calendar for availability.'); return true }
    setConflictMsg(''); return false
  }

  const handleChange = e => { const { name, value } = e.target; setFormData(p => ({ ...p, [name]: value })); if (errors[name]) setErrors(p => ({ ...p, [name]: '' })) }

  const uploadedRequired = requiredDocs.filter(d => d.required && docFiles[d.id]).length
  const totalRequired = requiredDocs.filter(d => d.required).length

  if (showSummary) return (
    <div className="section-enter" style={{ padding: '30px', maxWidth: '640px' }}>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: '800', color: '#1a2535', marginBottom: '22px' }}>Review Event Details</h2>
      <div style={{ background: '#fff', borderRadius: '18px', padding: '26px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5' }}>
        {[['Event Name', formData.name], ['Venue', formData.venue], ['Start Date', formData.startDate], ['End Date', formData.endDate], ...(formData.startDate === formData.endDate ? [['Time', `${formData.timeStart} – ${formData.timeEnd}`]] : []), ['Budget', `₹${formData.budget}`], ['Description', formData.description || '—']].map(([l, v]) => (
          <div key={l} style={{ display: 'flex', gap: '14px', marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid #f0f2f5' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#8a96a3', minWidth: '130px' }}>{l}</span>
            <span style={{ fontSize: '14px', color: '#1a2535', fontWeight: '500' }}>{v}</span>
          </div>
        ))}
        <div style={{ marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #f0f2f5' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#8a96a3' }}>Documents</span>
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {requiredDocs.map(doc => (
              <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <span style={{ fontSize: '15px' }}>{doc.icon}</span>
                <span style={{ color: docFiles[doc.id] ? '#10b981' : '#ef4444', fontWeight: '600' }}>{doc.label}</span>
                <span style={{ color: docFiles[doc.id] ? '#10b981' : '#8a96a3', marginLeft: 'auto' }}>{docFiles[doc.id] ? `✓ ${docFiles[doc.id].name}` : (doc.required ? '✗ Missing' : '— Not uploaded')}</span>
              </div>
            ))}
          </div>
        </div>
        <button className="btn-primary" style={{ width: '100%', padding: '12px', marginTop: '8px' }} onClick={switchToDashboard}>Go to Dashboard</button>
      </div>
    </div>
  )

  const Field = ({ label, name, type = 'text' }) => (
    <div style={{ marginBottom: '18px' }}>
      <label style={{ display: 'block', margin: '0 0 7px', fontSize: '13px', fontWeight: '600', color: '#555' }}>{label}</label>
      <input className="input-field" type={type} name={name} value={formData[name]} onChange={handleChange} style={{ borderColor: errors[name] ? '#ef4444' : undefined }} />
      {errors[name] && <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#ef4444' }}>{errors[name]}</p>}
    </div>
  )

  return (
    <div className="section-enter" style={{ padding: '30px 24px', maxWidth: '720px' }}>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: '800', color: '#1a2535', marginBottom: '24px' }}>Create New Event</h2>

      {/* Main Form Card */}
      <div style={{ background: '#fff', borderRadius: '18px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5', marginBottom: '20px' }}>
        <Field label="Event Name" name="name" />
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', margin: '0 0 7px', fontSize: '13px', fontWeight: '600', color: '#555' }}>Venue</label>
          <select className="input-field" name="venue" value={formData.venue} onChange={handleChange} style={{ cursor: 'pointer', borderColor: errors.venue ? '#ef4444' : undefined }}>
            <option value="">Select venue</option>
            {venues.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          {errors.venue && <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#ef4444' }}>{errors.venue}</p>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="Start Date" name="startDate" type="date" />
          <Field label="End Date" name="endDate" type="date" />
        </div>
        {formData.startDate && formData.startDate === formData.endDate && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Start Time" name="timeStart" type="time" />
            <Field label="End Time" name="timeEnd" type="time" />
          </div>
        )}
        <Field label="Budget Required (₹)" name="budget" type="number" />
        <div style={{ marginBottom: '0' }}>
          <label style={{ display: 'block', margin: '0 0 7px', fontSize: '13px', fontWeight: '600', color: '#555' }}>Description</label>
          <textarea className="input-field" name="description" value={formData.description} onChange={handleChange} rows={4} style={{ resize: 'vertical', minHeight: '90px' }} />
        </div>
      </div>

      {/* Required Documents Card */}
      <div style={{ background: '#fff', borderRadius: '18px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5', marginBottom: '20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
          <div>
            <h3 style={{ margin: '0 0 4px', fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '700', color: '#1a2535' }}>Required Documents</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#8a96a3' }}>Upload supporting files before submitting</p>
          </div>
          {/* Progress pill */}
          <div style={{ background: uploadedRequired === totalRequired ? '#d1fae5' : '#fef3c7', color: uploadedRequired === totalRequired ? '#065f46' : '#92400e', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap', marginLeft: '12px', flexShrink: 0 }}>
            {uploadedRequired}/{totalRequired} required
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: '4px', background: '#f0f2f5', borderRadius: '4px', marginBottom: '22px', marginTop: '16px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(Object.keys(docFiles).length / requiredDocs.length) * 100}%`, background: 'linear-gradient(90deg,#667eea,#764ba2)', borderRadius: '4px', transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1)' }} />
        </div>

        {/* Document rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {requiredDocs.map((doc, i) => {
            const uploaded = docFiles[doc.id]
            return (
              <div key={doc.id} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 16px', borderRadius: '12px',
                background: uploaded ? 'linear-gradient(135deg,#f0fdf4,#dcfce7)' : '#f8f9fc',
                border: `1.5px solid ${uploaded ? '#86efac' : '#edf0f5'}`,
                transition: 'all 0.3s ease',
                animation: `fadeSlideIn 0.4s ease ${i * 0.05}s both`
              }}>
                {/* Icon bubble */}
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: uploaded ? '#dcfce7' : '#eef0f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, transition: 'background 0.3s' }}>
                  {uploaded ? '✅' : doc.icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a2535' }}>{doc.label}</span>
                    {doc.required && <span style={{ fontSize: '10px', fontWeight: '700', color: '#ef4444', background: '#fee2e2', padding: '1px 6px', borderRadius: '6px', letterSpacing: '0.3px' }}>REQUIRED</span>}
                    {!doc.required && <span style={{ fontSize: '10px', fontWeight: '600', color: '#8a96a3', background: '#f0f2f5', padding: '1px 6px', borderRadius: '6px' }}>OPTIONAL</span>}
                  </div>
                  {uploaded ? (
                    <p style={{ margin: 0, fontSize: '12px', color: '#16a34a', fontWeight: '500' }}>
                      📎 {uploaded.name} <span style={{ color: '#8a96a3' }}>· {formatSize(uploaded.size)}</span>
                    </p>
                  ) : (
                    <p style={{ margin: 0, fontSize: '12px', color: '#8a96a3' }}>{doc.hint}</p>
                  )}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '7px', flexShrink: 0 }}>
                  {/* Camera */}
                  <button onClick={() => { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.setAttribute('capture', 'environment'); inp.onchange = e => handleDocUpload(doc.id, e.target.files); inp.click() }}
                    title="Take photo"
                    style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1.5px solid #e0e4ea', background: '#fff', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#667eea'; e.currentTarget.style.background = '#f0f3ff' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e4ea'; e.currentTarget.style.background = '#fff' }}>
                    📷
                  </button>
                  {/* Upload */}
                  <button onClick={() => triggerDocInput(doc.id)}
                    title="Upload file"
                    style={{ height: '34px', padding: '0 12px', borderRadius: '8px', border: '1.5px solid', borderColor: uploaded ? '#86efac' : '#e0e4ea', background: uploaded ? '#f0fdf4' : '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: uploaded ? '#16a34a' : '#555', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.18s ease', fontFamily: 'DM Sans, sans-serif' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#667eea'; e.currentTarget.style.background = '#f0f3ff'; e.currentTarget.style.color = '#667eea' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = uploaded ? '#86efac' : '#e0e4ea'; e.currentTarget.style.background = uploaded ? '#f0fdf4' : '#fff'; e.currentTarget.style.color = uploaded ? '#16a34a' : '#555' }}>
                    {uploaded ? '↺ Replace' : '↑ Upload'}
                  </button>
                  {/* Remove */}
                  {uploaded && (
                    <button onClick={() => removeDoc(doc.id)} title="Remove"
                      style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1.5px solid #fecaca', background: '#fff5f5', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s ease', color: '#ef4444' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff5f5' }}>
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Tip */}
        <div style={{ marginTop: '16px', padding: '12px 14px', background: '#f0f3ff', borderRadius: '10px', border: '1px solid #dde3fc', display: 'flex', alignItems: 'flex-start', gap: '9px' }}>
          <span style={{ fontSize: '15px', flexShrink: 0 }}>💡</span>
          <p style={{ margin: 0, fontSize: '12px', color: '#4c63b6', lineHeight: '1.55', fontWeight: '500' }}>
            You can upload photos via camera, or attach PDF, Word, or Excel files. Required documents must be uploaded before the event can be approved.
          </p>
        </div>
      </div>

      {conflictMsg && <div style={{ padding: '12px 14px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '10px', color: '#dc2626', fontSize: '13px', fontWeight: '600', marginBottom: '16px' }}>{conflictMsg}</div>}
      <button className="btn-primary" style={{ width: '100%', padding: '13px', fontSize: '15px', borderRadius: '12px' }} onClick={() => { if (validate() && !checkConflict()) setShowConfirm(true) }}>Submit Event</button>

      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,30,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-enter" style={{ background: '#fff', borderRadius: '20px', padding: '32px', maxWidth: '380px', width: '90%', textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
            <p style={{ fontSize: '15px', color: '#555', marginBottom: '22px', lineHeight: '1.6' }}>Please review your event details before submitting.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => { setShowConfirm(false); setShowSummary(true) }}>Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------- REPORT ISSUE ----------
function ReportIssueSection({ pendingNotification, onCancel }) {
  const [recipient, setRecipient] = useState('admin')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  if (success) return (
    <div className="section-enter" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ background: '#fff', borderRadius: '24px', padding: '48px 40px', textAlign: 'center', maxWidth: '400px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid #edf0f5' }}>
        <span style={{ fontSize: '52px', display: 'block', marginBottom: '14px' }}>✅</span>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '800', color: '#1a2535', margin: '0 0 10px' }}>Issue Reported</h2>
        <p style={{ color: '#8a96a3', fontSize: '14px', marginBottom: '26px', lineHeight: '1.6' }}>Submitted to {recipient === 'admin' ? 'Admin' : 'Principal'}. We'll review it shortly.</p>
        <button className="btn-primary" style={{ width: '100%', padding: '12px' }} onClick={onCancel}>Back to Notifications</button>
      </div>
    </div>
  )

  return (
    <div className="section-enter" style={{ maxWidth: '680px' }}>
      <button onClick={onCancel} style={{ background: 'none', border: 'none', color: '#667eea', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'DM Sans, sans-serif' }}>← Back to Notifications</button>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: '800', color: '#1a2535', margin: '0 0 6px' }}>Report Issue</h2>
      <p style={{ color: '#8a96a3', fontSize: '14px', margin: '0 0 24px' }}>Regarding: <strong style={{ color: '#1a2535' }}>{pendingNotification?.eventName}</strong></p>
      <div style={{ background: '#fff', borderRadius: '18px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5' }}>
        <div style={{ marginBottom: '18px' }}><label style={{ display: 'block', margin: '0 0 7px', fontSize: '13px', fontWeight: '600', color: '#555' }}>Send To</label><select className="input-field" value={recipient} onChange={e => setRecipient(e.target.value)} style={{ cursor: 'pointer' }}><option value="admin">Admin</option><option value="principal">Principal</option></select></div>
        <div style={{ marginBottom: '18px' }}><label style={{ display: 'block', margin: '0 0 7px', fontSize: '13px', fontWeight: '600', color: '#555' }}>Subject</label><input className="input-field" type="text" placeholder="Subject..." value={subject} onChange={e => setSubject(e.target.value)} /></div>
        <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', margin: '0 0 7px', fontSize: '13px', fontWeight: '600', color: '#555' }}>Message</label><textarea className="input-field" rows={5} placeholder="Describe the issue..." value={message} onChange={e => setMessage(e.target.value)} style={{ resize: 'vertical', minHeight: '120px' }} /></div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-primary" style={{ flex: 1, padding: '12px' }} onClick={() => { if (!subject.trim() || !message.trim()) { alert('Please fill in all fields'); return }; setSuccess(true) }}>Send</button>
          <button className="btn-ghost" style={{ flex: 1, padding: '12px' }} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ---------- LOGOUT MODAL ----------
function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="section-enter" style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,30,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
      <div className="modal-enter" style={{ background: '#fff', borderRadius: '20px', padding: '32px', maxWidth: '380px', width: '90%', textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
        <span style={{ fontSize: '44px', display: 'block', marginBottom: '14px' }}>👋</span>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '800', color: '#1a2535', margin: '0 0 10px' }}>Leaving so soon?</h2>
        <p style={{ color: '#8a96a3', fontSize: '14px', marginBottom: '24px' }}>Are you sure you want to logout?</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-ghost" style={{ flex: 1, padding: '12px' }} onClick={onCancel}>Cancel</button>
          <button style={{ flex: 1, padding: '12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontFamily: 'DM Sans, sans-serif', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#dc2626'} onMouseLeave={e => e.currentTarget.style.background = '#ef4444'} onClick={onConfirm}>Logout</button>
        </div>
      </div>
    </div>
  )
}

// ---------- MAIN DASHBOARD ----------
function ClubDashboard({ user, onLogout }) {
  const navigate = useNavigate()
  const [active, setActive] = useState('dashboard')
  const [showLogout, setShowLogout] = useState(false)
  const [prefilledEventName, setPrefilledEventName] = useState('')
  const [reportNotif, setReportNotif] = useState(null)

  const handleSection = sec => {
    if (sec === 'logout') { setShowLogout(true); return }
    setActive(sec)
  }

  const sectionMap = {
    dashboard: <DashboardSection />,
    venues: <VenuesSection />,
    calendar: <CalendarSection />,
    approvals: <ApprovalsSection user={user} />,
    statistics: <StatisticsSection />,
    notifications: <NotificationsSection onResubmitEvent={n => { setPrefilledEventName(n); setActive('create') }} onReportIssue={n => { setReportNotif(n); setActive('report-issue') }} />,
    'upload-bills': <UploadBillsSection />,
    settings: <SettingsSection />,
    create: <CreateEventPage onSectionChange={handleSection} switchToDashboard={() => setActive('dashboard')} prefilledEventName={prefilledEventName} />,
    'report-issue': <ReportIssueSection pendingNotification={reportNotif} onCancel={() => { setReportNotif(null); setActive('notifications') }} />,
    profile: <div className="section-enter"><h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', color: '#1a2535' }}>Profile</h2><p style={{ color: '#8a96a3' }}>Profile details coming soon...</p></div>,
  }

  const noNav = ['create', 'report-issue']

  return (
    <>
      <StyleInjector />
      <div style={{ display: 'flex', height: '100vh', fontFamily: 'DM Sans, sans-serif', background: '#f4f6f9' }}>
        <Sidebar selected={active} onSelect={handleSection} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {!noNav.includes(active) && <Navbar user={user} onSectionChange={handleSection} />}
          <div key={active} style={{ flex: 1, overflowY: 'auto', padding: noNav.includes(active) ? '0' : '26px 28px' }}>
            {sectionMap[active] || sectionMap.dashboard}
          </div>
        </div>
        {showLogout && <LogoutModal onConfirm={() => { setShowLogout(false); onLogout?.(); navigate('/') }} onCancel={() => setShowLogout(false)} />}
      </div>
    </>
  )
}

export default ClubDashboard