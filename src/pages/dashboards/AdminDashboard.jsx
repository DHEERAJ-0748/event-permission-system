import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// ─────────────────────────────────────────────
// Reuse the same global styles as ClubDashboard
// ─────────────────────────────────────────────
const adminGlobalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #f4f6f9; }

  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.94); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }

  .adm-section-enter { animation: fadeSlideIn 0.38s cubic-bezier(0.22,1,0.36,1) both; }
  .adm-modal-enter   { animation: scaleIn 0.28s cubic-bezier(0.22,1,0.36,1) both; }

  .adm-nav-item {
    transition: background 0.22s ease, color 0.22s ease, transform 0.18s ease;
    border-radius: 10px; margin: 3px 10px; padding: 10px 16px;
    cursor: pointer; display: flex; align-items: center; gap: 11px;
    font-size: 14px; font-weight: 500; color: rgba(236,240,241,0.72);
  }
  .adm-nav-item:hover { background: rgba(255,255,255,0.08); color: #ecf0f1; transform: translateX(3px); }
  .adm-nav-item.active {
    background: linear-gradient(90deg,rgba(102,126,234,0.28),rgba(102,126,234,0.1));
    color: #fff; font-weight: 600;
    box-shadow: inset 3px 0 0 #667eea;
  }
  .adm-card-hover {
    transition: transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s ease;
    cursor: pointer;
  }
  .adm-card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 36px rgba(44,62,80,0.13) !important;
  }
  .adm-btn-primary {
    background: linear-gradient(135deg,#667eea,#764ba2);
    color: #fff; border: none; border-radius: 10px;
    padding: 9px 18px; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans',sans-serif;
    transition: opacity 0.2s, transform 0.15s;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .adm-btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
  .adm-btn-ghost {
    background: transparent; color: #667eea;
    border: 1.5px solid #667eea; border-radius: 10px;
    padding: 9px 18px; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans',sans-serif;
    transition: background 0.2s;
  }
  .adm-btn-ghost:hover { background: #f0f3ff; }
  .adm-btn-danger {
    background: #fff0f0; color: #ef4444;
    border: 1.5px solid #fecaca; border-radius: 10px;
    padding: 9px 18px; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans',sans-serif;
    transition: background 0.2s;
  }
  .adm-btn-danger:hover { background: #fee2e2; }
  .adm-btn-amber {
    background: #fffbeb; color: #d97706;
    border: 1.5px solid #fde68a; border-radius: 10px;
    padding: 9px 18px; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans',sans-serif;
    transition: background 0.2s;
  }
  .adm-btn-amber:hover { background: #fef3c7; }
  .adm-btn-green {
    background: #f0fdf4; color: #16a34a;
    border: 1.5px solid #86efac; border-radius: 10px;
    padding: 9px 18px; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans',sans-serif;
    transition: background 0.2s;
  }
  .adm-btn-green:hover { background: #dcfce7; }
  .adm-input {
    width: 100%; padding: 10px 14px; border-radius: 10px;
    border: 1.5px solid #e2e8f0; background: #f8f9fc;
    font-size: 14px; font-family: 'DM Sans',sans-serif;
    outline: none; transition: border-color 0.22s;
    color: #1a2535;
  }
  .adm-input:focus { border-color: #667eea; background: #fff; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #d0d5dd; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #adb5bd; }
`

const AdminStyleInjector = () => {
  useEffect(() => {
    const el = document.createElement('style')
    el.setAttribute('data-admin-styles', '1')
    el.textContent = adminGlobalStyles
    document.head.appendChild(el)
    return () => document.head.removeChild(el)
  }, [])
  return null
}

// ─────────────────────────────────────────────
// Shared tokens
// ─────────────────────────────────────────────
const C = {
  dark: '#1a2535', sidebar: '#2c3e50',
  accent: '#667eea', accentPurple: '#764ba2',
  green: '#10b981', red: '#ef4444', amber: '#f59e0b',
  textMuted: '#8a96a3', border: '#edf0f5', bg: '#f4f6f9',
}

const statusCfg = {
  Approved: { bg: '#dcfce7', color: '#15803d', dot: '#22c55e' },
  Pending:  { bg: '#fef9c3', color: '#a16207', dot: '#eab308' },
  Rejected: { bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444' },
  Draft:    { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' },
}

function StatusBadge({ status }) {
  const cfg = statusCfg[status] || statusCfg.Draft
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
      background: cfg.bg, color: cfg.color, flexShrink: 0
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.dot }} />
      {status}
    </span>
  )
}

// ─────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────
const ADMIN_NAV = [
  { id: 'dashboard',    label: 'Dashboard',          icon: '⬡' },
  { id: 'events',       label: 'Event Requests',      icon: '📋' },
  { id: 'venues',       label: 'Venues',              icon: '🏛' },
  { id: 'calendar',     label: 'Academic Calendar',   icon: '📅' },
  { id: 'clubs',        label: 'Clubs',               icon: '🏫' },
  { id: 'approvals',    label: 'Approvals Monitoring',icon: '✅' },
  { id: 'notifications',label: 'Notifications',       icon: '🔔' },
  { id: 'analytics',    label: 'Analytics',           icon: '📊' },
]

function AdminSidebar({ selected, onSelect }) {
  return (
    <div style={{
      width: '230px', background: `linear-gradient(175deg, ${C.dark} 0%, ${C.sidebar} 100%)`,
      color: '#ecf0f1', display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', padding: '24px 0 20px 0',
      boxShadow: '4px 0 24px rgba(0,0,0,0.12)', flexShrink: 0, zIndex: 10,
    }}>
      <div>
        <div style={{ padding: '0 20px 28px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '10px',
              background: 'linear-gradient(135deg,#ef4444,#dc2626)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', fontWeight: '700', color: '#fff', fontFamily: 'Syne, sans-serif'
            }}>A</div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '16px', color: '#fff', letterSpacing: '-0.3px' }}>ClubOS Admin</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '1px' }}>Control Panel</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 20px 8px 20px', fontSize: '11px', fontWeight: '600', color: '#546e7a', letterSpacing: '1px', textTransform: 'uppercase' }}>Menu</div>

        {ADMIN_NAV.map(item => (
          <div key={item.id} className={`adm-nav-item ${selected === item.id ? 'active' : ''}`} onClick={() => onSelect(item.id)}>
            <span style={{ fontSize: '15px', width: '22px', textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
            {item.label}
            {item.id === 'notifications' && (
              <div className="pulse" style={{ marginLeft: 'auto', background: C.red, color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700' }}>4</div>
            )}
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
        <div className={`adm-nav-item ${selected === 'settings' ? 'active' : ''}`} onClick={() => onSelect('settings')}>
          <span style={{ fontSize: '15px', width: '22px', textAlign: 'center' }}>⚙️</span> Settings
        </div>
        <div className="adm-nav-item" onClick={() => onSelect('logout')}>
          <span style={{ fontSize: '15px', width: '22px', textAlign: 'center' }}>🚪</span> Logout
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────
function AdminNavbar({ admin, onSectionChange }) {
  const [showMenu, setShowMenu] = useState(false)
  return (
    <div style={{
      height: '60px', background: '#fff', borderBottom: '1px solid #edf0f5',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', flexShrink: 0, boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
      position: 'sticky', top: 0, zIndex: 9
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '12px', fontWeight: '700', background: '#fee2e2', color: '#ef4444', padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.5px' }}>ADMIN</span>
        <span style={{ fontSize: '13px', color: C.textMuted }}>Welcome back, {admin?.name || 'Administrator'}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button className="adm-btn-primary" onClick={() => onSectionChange('events')}>
          + Review Requests
        </button>
        <div style={{ position: 'relative' }}>
          <button style={{ background: '#f4f6f9', border: 'none', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => onSectionChange('notifications')}>
            🔔
            <span style={{ position: 'absolute', top: '-3px', right: '-3px', background: C.red, color: '#fff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '9px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>4</span>
          </button>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#ef4444,#dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: '#fff', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }} onClick={() => setShowMenu(m => !m)}>AD</div>
          {showMenu && (
            <div className="adm-modal-enter" style={{ position: 'absolute', right: 0, top: '44px', background: '#fff', borderRadius: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.13)', border: '1px solid #edf0f5', padding: '8px', minWidth: '170px', zIndex: 100 }}>
              {[['⚙️', 'Settings', 'settings'], ['🚪', 'Logout', 'logout']].map(([ico, lbl, id]) => (
                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 12px', borderRadius: '9px', cursor: 'pointer', fontSize: '13px', color: C.dark, fontWeight: '500', transition: 'background 0.18s' }} onMouseEnter={e => e.currentTarget.style.background = '#f4f6f9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} onClick={() => { setShowMenu(false); onSectionChange(id) }}>
                  <span>{ico}</span> {lbl}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// 1. DASHBOARD OVERVIEW
// ─────────────────────────────────────────────
function AdminDashboardSection({ onNavigate }) {
  const stats = [
    { label: 'Total Events This Semester', value: '47', icon: '🎪', color: '#667eea', bg: '#eef1ff', change: '+12%' },
    { label: 'Pending Approvals',           value: '8',  icon: '⏳', color: C.amber,   bg: '#fffbeb', change: '3 urgent' },
    { label: 'Venues Booked Today',         value: '5',  icon: '🏛', color: C.green,   bg: '#f0fdf4', change: '2 conflicts' },
    { label: 'Active Clubs',                value: '23', icon: '🏫', color: '#8b5cf6', bg: '#f5f3ff', change: '+2 new' },
  ]

  const recentRequests = [
    { id: 1, name: 'Annual Tech Fest', club: 'Tech Club', status: 'Pending', date: '2026-03-18', venue: 'Hall A' },
    { id: 2, name: 'Drama Night',      club: 'Arts Club', status: 'Approved', date: '2026-03-22', venue: 'Auditorium' },
    { id: 3, name: 'Cricket Tournament', club: 'Sports Club', status: 'Pending', date: '2026-03-25', venue: 'Sports Ground' },
    { id: 4, name: 'Coding Marathon',  club: 'CS Club', status: 'Rejected', date: '2026-03-15', venue: 'Hall B' },
    { id: 5, name: 'Cultural Fest',    club: 'Cultural Club', status: 'Draft', date: '2026-04-01', venue: 'Open Ground' },
  ]

  const upcomingEvents = [
    { name: 'Spring Fair',       date: 'Mar 18', club: 'General',      venue: 'Campus Lawn',   participants: 400 },
    { name: 'Industry Connect',  date: 'Mar 20', club: 'CS Club',      venue: 'Hall A',        participants: 180 },
    { name: 'Photography Walk',  date: 'Mar 23', club: 'Photo Club',   venue: 'Campus',        participants: 60  },
    { name: 'Debate Championship', date: 'Mar 27', club: 'Debate Club', venue: 'Conference Room', participants: 120 },
  ]

  return (
    <div className="adm-section-enter">
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: '16px', marginBottom: '28px' }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{ background: '#fff', borderRadius: '16px', padding: '20px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.055)', border: '1px solid #edf0f5', animation: `fadeSlideIn 0.4s ease ${i * 0.06}s both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{s.icon}</div>
              <span style={{ fontSize: '11px', fontWeight: '600', color: C.green, background: '#f0fdf4', padding: '3px 8px', borderRadius: '8px' }}>{s.change}</span>
            </div>
            <p style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: '800', color: C.dark, fontFamily: 'Syne, sans-serif' }}>{s.value}</p>
            <p style={{ margin: 0, fontSize: '13px', color: C.textMuted, fontWeight: '500' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent Requests */}
        <div style={{ background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.055)', border: '1px solid #edf0f5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '700', color: C.dark, margin: 0 }}>Recent Event Requests</h3>
            <button onClick={() => onNavigate('events')} style={{ background: 'none', border: 'none', color: C.accent, fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>View all →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentRequests.map((r, i) => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 14px', borderRadius: '10px', background: '#f8f9fc', border: '1px solid #edf0f5', animation: `fadeSlideIn 0.4s ease ${i * 0.05}s both` }}>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: C.dark }}>{r.name}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: C.textMuted }}>📅 {r.date} · 🏛 {r.venue}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <StatusBadge status={r.status} />
                  <span style={{ fontSize: '11px', color: C.textMuted }}>{r.club}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div style={{ background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.055)', border: '1px solid #edf0f5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '700', color: C.dark, margin: 0 }}>Upcoming Approved Events</h3>
            <span style={{ fontSize: '12px', color: C.textMuted, fontWeight: '500' }}>{upcomingEvents.length} events</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {upcomingEvents.map((e, i) => (
              <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '10px', background: '#f8f9fc', border: '1px solid #edf0f5', animation: `fadeSlideIn 0.4s ease ${i * 0.05}s both` }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg,#667eea22,#764ba222)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: C.accent, fontFamily: 'Syne, sans-serif', textAlign: 'center', lineHeight: '1.2' }}>{e.date.split(' ')[0]}<br />{e.date.split(' ')[1]}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: C.dark }}>{e.name}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: C.textMuted }}>📍 {e.venue} · 👥 {e.participants}</p>
                </div>
                <span style={{ fontSize: '11px', color: C.textMuted, background: '#f0f3ff', padding: '3px 8px', borderRadius: '7px', fontWeight: '500', whiteSpace: 'nowrap' }}>{e.club}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// 2. EVENT REQUESTS
// ─────────────────────────────────────────────
function EventRequestsSection() {
  const [filter, setFilter] = useState('All')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventStatuses, setEventStatuses] = useState({})

  const allEvents = [
    { id: 1, name: 'Annual Tech Fest', club: 'Tech Club', description: 'A two-day technology festival with workshops, hackathons, and industry talks.', venue: 'Hall A', date: '2026-03-18', participants: 350, budget: 45000, status: 'Pending' },
    { id: 2, name: 'Drama Night',       club: 'Arts Club', description: 'Student drama performance showcasing original one-act plays.', venue: 'Auditorium', date: '2026-03-22', participants: 200, budget: 18000, status: 'Approved' },
    { id: 3, name: 'Cricket Tournament', club: 'Sports Club', description: 'Inter-department cricket tournament over two weekends.', venue: 'Sports Ground', date: '2026-03-25', participants: 150, budget: 12000, status: 'Pending' },
    { id: 4, name: 'Coding Marathon',   club: 'CS Club', description: '24-hour competitive coding event with prizes from sponsors.', venue: 'Hall B', date: '2026-03-15', participants: 80, budget: 25000, status: 'Rejected' },
    { id: 5, name: 'Cultural Fest',     club: 'Cultural Club', description: 'Annual multicultural celebration with food, music, and art.', venue: 'Open Ground', date: '2026-04-01', participants: 500, budget: 60000, status: 'Draft' },
    { id: 6, name: 'Photography Exhibition', club: 'Photo Club', description: 'Display of student photography from across the semester.', venue: 'Gallery Hall', date: '2026-04-05', participants: 100, budget: 8000, status: 'Approved' },
    { id: 7, name: 'Startup Summit',    club: 'Entrepreneurship Club', description: 'Pitch competition for student startup ideas with investor panels.', venue: 'Conference Room', date: '2026-04-10', participants: 120, budget: 30000, status: 'Pending' },
  ]

  const getStatus = id => eventStatuses[id] || allEvents.find(e => e.id === id)?.status
  const setStatus = (id, s) => setEventStatuses(prev => ({ ...prev, [id]: s }))

  const filters = ['All', 'Pending', 'Approved', 'Rejected', 'Draft']
  const displayed = filter === 'All' ? allEvents : allEvents.filter(e => getStatus(e.id) === filter)

  return (
    <div className="adm-section-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '700', color: C.dark, margin: '0 0 3px' }}>Event Requests</h2>
          <p style={{ margin: 0, fontSize: '13px', color: C.textMuted }}>{displayed.length} requests {filter !== 'All' ? `· ${filter}` : 'total'}</p>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'inline-flex', gap: '6px', background: '#f1f4f9', borderRadius: '14px', padding: '5px 6px', marginBottom: '22px', flexWrap: 'wrap' }}>
        {filters.map(f => {
          const isActive = filter === f
          const cfg = statusCfg[f]
          const count = f === 'All' ? allEvents.length : allEvents.filter(e => getStatus(e.id) === f).length
          return (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '7px', transition: 'all 0.22s cubic-bezier(0.22,1,0.36,1)', background: isActive ? C.dark : 'transparent', color: isActive ? '#fff' : '#5a6473', boxShadow: isActive ? '0 2px 10px rgba(26,37,53,0.22)' : 'none' }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#e4e8f0' } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent' } }}>
              {f !== 'All' && cfg && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: isActive ? '#fff' : cfg.dot, flexShrink: 0, opacity: isActive ? 0.7 : 1 }} />}
              {f}
              <span style={{ fontSize: '11px', fontWeight: '700', minWidth: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', padding: '0 4px', background: isActive ? 'rgba(255,255,255,0.18)' : '#e4e8f0', color: isActive ? '#fff' : '#5a6473' }}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '16px' }}>
        {displayed.map((e, i) => {
          const status = getStatus(e.id)
          const cfg = statusCfg[status] || statusCfg.Draft
          return (
            <div key={e.id} style={{ background: '#fff', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5', display: 'flex', flexDirection: 'column', animation: `fadeSlideIn 0.4s ease ${i * 0.045}s both` }}>
              <div style={{ height: '4px', background: cfg.dot }} />
              <div style={{ padding: '18px 20px', flex: 1 }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '6px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 3px', fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: '700', color: C.dark }}>{e.name}</h3>
                    <span style={{ fontSize: '12px', color: C.textMuted, background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', fontWeight: '500' }}>{e.club}</span>
                  </div>
                  <StatusBadge status={status} />
                </div>
                <p style={{ margin: '10px 0 12px', fontSize: '13px', color: '#7a8694', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{e.description}</p>
                <div style={{ height: '1px', background: '#f0f3f8', marginBottom: '12px' }} />
                <div style={{ display: 'flex', gap: '14px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', color: '#5a6473', display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ color: C.accent }}>📅</span>{e.date}</span>
                  <span style={{ fontSize: '12px', color: '#5a6473', display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ color: C.accent }}>📍</span>{e.venue}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ flex: 1, padding: '9px 12px', background: '#f7f9fc', borderRadius: '10px', border: '1px solid #edf0f5' }}>
                    <p style={{ margin: '0 0 2px', fontSize: '10px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Participants</p>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: C.dark }}>👥 {e.participants}</p>
                  </div>
                  <div style={{ flex: 1, padding: '9px 12px', background: '#f7f9fc', borderRadius: '10px', border: '1px solid #edf0f5' }}>
                    <p style={{ margin: '0 0 2px', fontSize: '10px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Budget</p>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: C.dark }}>₹{e.budget.toLocaleString()}</p>
                  </div>
                </div>
                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                  <button onClick={() => setSelectedEvent({ ...e, liveStatus: status })} className="adm-btn-ghost" style={{ flex: 1, padding: '7px 10px', fontSize: '12px' }}>View Details</button>
                  {status !== 'Approved' && <button onClick={() => setStatus(e.id, 'Approved')} className="adm-btn-green" style={{ flex: 1, padding: '7px 10px', fontSize: '12px' }}>✓ Approve</button>}
                  {status !== 'Rejected' && <button onClick={() => setStatus(e.id, 'Rejected')} className="adm-btn-danger" style={{ flex: 1, padding: '7px 10px', fontSize: '12px' }}>✕ Reject</button>}
                  {status !== 'Draft' && <button onClick={() => setStatus(e.id, 'Draft')} className="adm-btn-amber" style={{ flex: '0 0 auto', padding: '7px 10px', fontSize: '12px' }}>↩ Send Back</button>}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Detail Modal */}
      {selectedEvent && (
        <div className="adm-section-enter" style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,30,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setSelectedEvent(null)}>
          <div className="adm-modal-enter" style={{ background: '#fff', borderRadius: '22px', padding: 0, maxWidth: '580px', width: '100%', boxShadow: '0 32px 72px rgba(0,0,0,0.22)', overflow: 'hidden' }} onClick={ev => ev.stopPropagation()}>
            <div style={{ padding: '24px 28px 20px', background: 'linear-gradient(135deg,#1a2535,#2c3e50)', color: '#fff', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ margin: '0 0 6px', fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '800' }}>{selectedEvent.name}</h2>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>🏫 {selectedEvent.club}</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>📅 {selectedEvent.date}</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>📍 {selectedEvent.venue}</span>
                    <StatusBadge status={selectedEvent.liveStatus || selectedEvent.status} />
                  </div>
                </div>
                <button onClick={() => setSelectedEvent(null)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', color: '#fff', flexShrink: 0 }}>✕</button>
              </div>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <p style={{ fontSize: '14px', color: '#5a6473', lineHeight: '1.6', marginBottom: '18px' }}>{selectedEvent.description}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                {[['Expected Participants', `👥 ${selectedEvent.participants}`], ['Budget Requested', `₹${selectedEvent.budget?.toLocaleString()}`]].map(([l, v]) => (
                  <div key={l} style={{ padding: '14px', background: '#f7f9fc', borderRadius: '12px', border: '1px solid #edf0f5' }}>
                    <p style={{ margin: '0 0 4px', fontSize: '10px', color: C.textMuted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{l}</p>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: C.dark }}>{v}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="adm-btn-green" style={{ flex: 1, padding: '11px' }} onClick={() => { setStatus(selectedEvent.id, 'Approved'); setSelectedEvent(null) }}>✓ Approve Event</button>
                <button className="adm-btn-danger" style={{ flex: 1, padding: '11px' }} onClick={() => { setStatus(selectedEvent.id, 'Rejected'); setSelectedEvent(null) }}>✕ Reject Event</button>
                <button className="adm-btn-amber" style={{ flex: 1, padding: '11px' }} onClick={() => { setStatus(selectedEvent.id, 'Draft'); setSelectedEvent(null) }}>↩ Send Back</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// 3. VENUE MANAGEMENT
// ─────────────────────────────────────────────
function AdminVenuesSection() {
  const [venues, setVenues] = useState([
    { id: 1, name: 'Hall A', type: 'Main Auditorium', icon: '🎭', capacity: 500, status: 'available', nextEvent: 'Tech Fest — Mar 18' },
    { id: 2, name: 'Hall B', type: 'Seminar Room', icon: '📚', capacity: 200, status: 'booked', nextEvent: 'Drama Night — Mar 22' },
    { id: 3, name: 'Conference Room', type: 'Meeting Space', icon: '💼', capacity: 50, status: 'available', nextEvent: 'None' },
    { id: 4, name: 'Outdoor Grounds', type: 'Open Field', icon: '🌳', capacity: 1000, status: 'pending', nextEvent: 'Cultural Fest — Apr 1' },
    { id: 5, name: 'Sports Ground', type: 'Athletics', icon: '⚽', capacity: 800, status: 'booked', nextEvent: 'Cricket Tournament — Mar 25' },
    { id: 6, name: 'Gallery Hall', type: 'Exhibition Space', icon: '🖼️', capacity: 150, status: 'unavailable', nextEvent: 'Under maintenance' },
  ])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editVenue, setEditVenue] = useState(null)
  const [newVenue, setNewVenue] = useState({ name: '', type: '', capacity: '', icon: '🏢' })

  const statusMap = {
    available:   { label: 'Available',   color: C.green, bg: '#d1fae5' },
    booked:      { label: 'Booked',      color: C.red,   bg: '#fee2e2' },
    pending:     { label: 'Pending',     color: C.amber,  bg: '#fef3c7' },
    unavailable: { label: 'Unavailable', color: '#475569', bg: '#f1f5f9' },
  }

  const addVenue = () => {
    if (!newVenue.name || !newVenue.type) return
    setVenues(prev => [...prev, { id: Date.now(), ...newVenue, capacity: parseInt(newVenue.capacity) || 100, status: 'available', nextEvent: 'None' }])
    setNewVenue({ name: '', type: '', capacity: '', icon: '🏢' })
    setShowAddModal(false)
  }

  const toggleUnavailable = id => setVenues(prev => prev.map(v => v.id === id ? { ...v, status: v.status === 'unavailable' ? 'available' : 'unavailable' } : v))

  return (
    <div className="adm-section-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '700', color: C.dark, margin: '0 0 3px' }}>Venue Management</h2>
          <p style={{ margin: 0, fontSize: '13px', color: C.textMuted }}>{venues.length} venues registered</p>
        </div>
        <button className="adm-btn-primary" onClick={() => setShowAddModal(true)}>+ Add Venue</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '16px' }}>
        {venues.map((v, i) => {
          const sm = statusMap[v.status] || statusMap.available
          return (
            <div key={v.id} className="adm-card-hover" style={{ background: '#fff', borderRadius: '18px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5', animation: `fadeSlideIn 0.4s ease ${i * 0.05}s both` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{v.icon}</div>
                  <div>
                    <h3 style={{ margin: '0 0 3px', fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: '700', color: C.dark }}>{v.name}</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: C.textMuted }}>{v.type}</p>
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 9px', borderRadius: '8px', background: sm.bg, color: sm.color }}>{sm.label}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div style={{ padding: '9px', background: '#f7f9fc', borderRadius: '10px' }}>
                  <p style={{ margin: '0 0 2px', fontSize: '10px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase' }}>Capacity</p>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: C.dark }}>👥 {v.capacity}</p>
                </div>
                <div style={{ padding: '9px', background: '#f7f9fc', borderRadius: '10px' }}>
                  <p style={{ margin: '0 0 2px', fontSize: '10px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase' }}>Next Event</p>
                  <p style={{ margin: 0, fontSize: '11px', fontWeight: '600', color: C.dark, lineHeight: '1.3' }}>{v.nextEvent}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '7px' }}>
                <button onClick={() => setEditVenue(v)} className="adm-btn-ghost" style={{ flex: 1, padding: '7px', fontSize: '12px' }}>✏️ Edit</button>
                <button onClick={() => toggleUnavailable(v.id)} className={v.status === 'unavailable' ? 'adm-btn-green' : 'adm-btn-danger'} style={{ flex: 1, padding: '7px', fontSize: '12px' }}>
                  {v.status === 'unavailable' ? '✓ Enable' : '🚫 Disable'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Venue Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,30,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setShowAddModal(false)}>
          <div className="adm-modal-enter" style={{ background: '#fff', borderRadius: '20px', padding: '28px', maxWidth: '400px', width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: '700', color: C.dark, marginBottom: '20px' }}>Add New Venue</h3>
            {[['name', 'Venue Name', 'text'], ['type', 'Venue Type', 'text'], ['capacity', 'Capacity', 'number'], ['icon', 'Icon (emoji)', 'text']].map(([k, l, t]) => (
              <div key={k} style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#555' }}>{l}</label>
                <input className="adm-input" type={t} value={newVenue[k]} onChange={e => setNewVenue(p => ({ ...p, [k]: e.target.value }))} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button className="adm-btn-primary" style={{ flex: 1, padding: '11px' }} onClick={addVenue}>Add Venue</button>
              <button className="adm-btn-ghost" style={{ flex: 1, padding: '11px' }} onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Venue Modal */}
      {editVenue && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,30,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setEditVenue(null)}>
          <div className="adm-modal-enter" style={{ background: '#fff', borderRadius: '20px', padding: '28px', maxWidth: '400px', width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: '700', color: C.dark, marginBottom: '20px' }}>Edit Venue</h3>
            {[['name', 'Venue Name', 'text'], ['type', 'Venue Type', 'text'], ['capacity', 'Capacity', 'number']].map(([k, l, t]) => (
              <div key={k} style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#555' }}>{l}</label>
                <input className="adm-input" type={t} value={editVenue[k]} onChange={e => setEditVenue(p => ({ ...p, [k]: e.target.value }))} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button className="adm-btn-primary" style={{ flex: 1, padding: '11px' }} onClick={() => { setVenues(prev => prev.map(v => v.id === editVenue.id ? { ...editVenue, capacity: parseInt(editVenue.capacity) || editVenue.capacity } : v)); setEditVenue(null) }}>Save Changes</button>
              <button className="adm-btn-ghost" style={{ flex: 1, padding: '11px' }} onClick={() => setEditVenue(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// 4. ACADEMIC CALENDAR
// ─────────────────────────────────────────────
function AcademicCalendarSection() {
  const [year, setYear] = useState(2026)
  const [month, setMonth] = useState(2) // 0-indexed March
  const [blockedDates, setBlockedDates] = useState(['2026-03-14', '2026-03-15', '2026-03-28', '2026-03-29'])
  const [examDates, setExamDates] = useState(['2026-03-20', '2026-03-21', '2026-03-22', '2026-03-23', '2026-03-24'])
  const [specialDates, setSpecialDates] = useState(['2026-03-08', '2026-03-17'])
  const [selectedDay, setSelectedDay] = useState(null)
  const [addModal, setAddModal] = useState(null) // 'exam' | 'block' | 'special'
  const [addDate, setAddDate] = useState('')
  const [addLabel, setAddLabel] = useState('')

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const fullMonthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const fmt = d => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  const isBlocked = d => blockedDates.includes(fmt(d))
  const isExam = d => examDates.includes(fmt(d))
  const isSpecial = d => specialDates.includes(fmt(d))

  const today = new Date()

  const addEntry = () => {
    if (!addDate) return
    if (addModal === 'block') setBlockedDates(p => [...p.filter(d => d !== addDate), addDate])
    if (addModal === 'exam') setExamDates(p => [...p.filter(d => d !== addDate), addDate])
    if (addModal === 'special') setSpecialDates(p => [...p.filter(d => d !== addDate), addDate])
    setAddModal(null); setAddDate(''); setAddLabel('')
  }

  const removeDate = (type, date) => {
    if (type === 'block') setBlockedDates(p => p.filter(d => d !== date))
    if (type === 'exam') setExamDates(p => p.filter(d => d !== date))
    if (type === 'special') setSpecialDates(p => p.filter(d => d !== date))
  }

  return (
    <div className="adm-section-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '700', color: C.dark, margin: 0 }}>Academic Calendar</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="adm-btn-danger" style={{ padding: '8px 14px', fontSize: '12px' }} onClick={() => setAddModal('block')}>🚫 Block Date</button>
          <button className="adm-btn-amber" style={{ padding: '8px 14px', fontSize: '12px' }} onClick={() => setAddModal('exam')}>📝 Exam Period</button>
          <button className="adm-btn-primary" style={{ padding: '8px 14px', fontSize: '12px' }} onClick={() => setAddModal('special')}>⭐ Special Event</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
        {/* Calendar grid */}
        <div style={{ background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button onClick={() => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px' }}>←</button>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: '700', color: C.dark }}>{fullMonthNames[month]} {year}</h3>
            <button onClick={() => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px' }}>→</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px', marginBottom: '8px' }}>
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: '700', color: C.textMuted, padding: '6px 0', textTransform: 'uppercase' }}>{d}</div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px' }}>
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1
              const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year
              const blocked = isBlocked(d); const exam = isExam(d); const special = isSpecial(d)
              const isSel = selectedDay === d
              return (
                <div key={d} onClick={() => setSelectedDay(isSel ? null : d)} style={{
                  aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                  position: 'relative', transition: 'all 0.18s ease',
                  background: isSel ? C.dark : blocked ? '#fee2e2' : exam ? '#fef9c3' : special ? '#f0f3ff' : 'transparent',
                  color: isSel ? '#fff' : blocked ? C.red : exam ? '#a16207' : special ? C.accent : isToday ? C.accent : C.dark,
                  outline: isToday && !isSel ? `2px solid ${C.accent}` : 'none',
                  outlineOffset: '-2px',
                }}
                  onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = '#f1f5f9' }}
                  onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = blocked ? '#fee2e2' : exam ? '#fef9c3' : special ? '#f0f3ff' : 'transparent' }}
                >
                  {d}
                  {(blocked || exam || special) && <span style={{ position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', borderRadius: '50%', background: blocked ? C.red : exam ? C.amber : C.accent }} />}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '18px', flexWrap: 'wrap' }}>
            {[['#fee2e2', C.red, 'Blocked'], ['#fef9c3', C.amber, 'Exam Period'], ['#f0f3ff', C.accent, 'Special Event']].map(([bg, color, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: bg, border: `1px solid ${color}33` }} />
                <span style={{ fontSize: '11px', color: C.textMuted, fontWeight: '500' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dates management panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { title: '🚫 Blocked Dates', type: 'block', dates: blockedDates, color: C.red, bg: '#fee2e2' },
            { title: '📝 Exam Periods', type: 'exam', dates: examDates, color: C.amber, bg: '#fef9c3' },
            { title: '⭐ Special Events', type: 'special', dates: specialDates, color: C.accent, bg: '#f0f3ff' },
          ].map(({ title, type, dates, color, bg }) => (
            <div key={type} style={{ background: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.055)', border: '1px solid #edf0f5' }}>
              <h4 style={{ fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: '700', color: C.dark, margin: '0 0 10px' }}>{title}</h4>
              {dates.length === 0 ? <p style={{ fontSize: '12px', color: C.textMuted, margin: 0 }}>No dates set</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {dates.map(date => (
                    <div key={date} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderRadius: '8px', background: bg, border: `1px solid ${color}33` }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', color }}>{date}</span>
                      <button onClick={() => removeDate(type, date)} style={{ background: 'none', border: 'none', color, cursor: 'pointer', fontSize: '13px', fontWeight: '700', lineHeight: 1 }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add modal */}
      {addModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,30,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setAddModal(null)}>
          <div className="adm-modal-enter" style={{ background: '#fff', borderRadius: '20px', padding: '28px', maxWidth: '360px', width: '90%', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '17px', fontWeight: '700', color: C.dark, marginBottom: '18px' }}>
              Add {addModal === 'block' ? '🚫 Blocked Date' : addModal === 'exam' ? '📝 Exam Date' : '⭐ Special Event'}
            </h3>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#555' }}>Date</label>
              <input className="adm-input" type="date" value={addDate} onChange={e => setAddDate(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="adm-btn-primary" style={{ flex: 1, padding: '11px' }} onClick={addEntry}>Add</button>
              <button className="adm-btn-ghost" style={{ flex: 1, padding: '11px' }} onClick={() => setAddModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// 5. CLUB MANAGEMENT
// ─────────────────────────────────────────────
function ClubManagementSection() {
  const [clubs, setClubs] = useState([
    { id: 1, name: 'Tech Club', faculty: 'Dr. Ramesh Kumar', events: 12, status: 'Active', icon: '💻', members: 45 },
    { id: 2, name: 'Arts Club', faculty: 'Prof. Priya Nair', events: 8, status: 'Active', icon: '🎨', members: 30 },
    { id: 3, name: 'Sports Club', faculty: 'Dr. Suresh Mehta', events: 15, status: 'Active', icon: '⚽', members: 80 },
    { id: 4, name: 'CS Club', faculty: 'Prof. Anand Rao', events: 6, status: 'Active', icon: '🖥️', members: 55 },
    { id: 5, name: 'Cultural Club', faculty: 'Dr. Kavitha S', events: 10, status: 'Pending Approval', icon: '🎭', members: 40 },
    { id: 6, name: 'Photo Club', faculty: 'Prof. Ravi S', events: 4, status: 'Active', icon: '📷', members: 25 },
    { id: 7, name: 'Entrepreneurship Club', faculty: 'Dr. Meera Patel', events: 3, status: 'Pending Approval', icon: '🚀', members: 35 },
    { id: 8, name: 'Debate Club', faculty: 'Prof. Vikram Bose', events: 7, status: 'Inactive', icon: '🎤', members: 22 },
  ])
  const [historyClub, setHistoryClub] = useState(null)

  const setClubStatus = (id, status) => setClubs(prev => prev.map(c => c.id === id ? { ...c, status } : c))

  const mockHistory = club => [
    { name: 'Annual Showcase', date: '2025-11-15', status: 'Approved', participants: 200 },
    { name: 'Workshop Series', date: '2025-10-08', status: 'Approved', participants: 80 },
    { name: 'Guest Lecture', date: '2025-09-20', status: 'Rejected', participants: 0 },
  ]

  const clubStatusCfg = {
    'Active': { bg: '#dcfce7', color: '#15803d' },
    'Pending Approval': { bg: '#fef9c3', color: '#a16207' },
    'Inactive': { bg: '#f1f5f9', color: '#475569' },
  }

  return (
    <div className="adm-section-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '700', color: C.dark, margin: '0 0 3px' }}>Club Management</h2>
          <p style={{ margin: 0, fontSize: '13px', color: C.textMuted }}>{clubs.length} clubs registered · {clubs.filter(c => c.status === 'Pending Approval').length} pending</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '16px' }}>
        {clubs.map((club, i) => {
          const scfg = clubStatusCfg[club.status] || clubStatusCfg['Inactive']
          return (
            <div key={club.id} className="adm-card-hover" style={{ background: '#fff', borderRadius: '18px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5', animation: `fadeSlideIn 0.4s ease ${i * 0.05}s both` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>{club.icon}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 2px', fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: '700', color: C.dark }}>{club.name}</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: C.textMuted }}>{club.faculty}</p>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 9px', borderRadius: '8px', background: scfg.bg, color: scfg.color, whiteSpace: 'nowrap' }}>{club.status}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px', marginBottom: '14px' }}>
                <div style={{ padding: '9px', background: '#f7f9fc', borderRadius: '10px' }}>
                  <p style={{ margin: '0 0 2px', fontSize: '10px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase' }}>Events</p>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: C.dark }}>🎪 {club.events}</p>
                </div>
                <div style={{ padding: '9px', background: '#f7f9fc', borderRadius: '10px' }}>
                  <p style={{ margin: '0 0 2px', fontSize: '10px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase' }}>Members</p>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: C.dark }}>👥 {club.members}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '7px' }}>
                <button onClick={() => setHistoryClub(club)} className="adm-btn-ghost" style={{ flex: 1, padding: '7px', fontSize: '12px' }}>📋 History</button>
                {club.status === 'Pending Approval' && <button onClick={() => setClubStatus(club.id, 'Active')} className="adm-btn-green" style={{ flex: 1, padding: '7px', fontSize: '12px' }}>✓ Approve</button>}
                {club.status === 'Active' && <button onClick={() => setClubStatus(club.id, 'Inactive')} className="adm-btn-danger" style={{ flex: 1, padding: '7px', fontSize: '12px' }}>🚫 Deactivate</button>}
                {club.status === 'Inactive' && <button onClick={() => setClubStatus(club.id, 'Active')} className="adm-btn-green" style={{ flex: 1, padding: '7px', fontSize: '12px' }}>✓ Reactivate</button>}
              </div>
            </div>
          )
        })}
      </div>

      {/* History Modal */}
      {historyClub && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,30,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setHistoryClub(null)}>
          <div className="adm-modal-enter" style={{ background: '#fff', borderRadius: '20px', padding: 0, maxWidth: '480px', width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '22px 24px', background: 'linear-gradient(135deg,#1a2535,#2c3e50)', color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><p style={{ margin: '0 0 2px', fontSize: '11px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Event History</p><h3 style={{ margin: 0, fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: '700' }}>{historyClub.name}</h3></div>
                <button onClick={() => setHistoryClub(null)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', color: '#fff', fontSize: '14px' }}>✕</button>
              </div>
            </div>
            <div style={{ padding: '20px 24px' }}>
              {mockHistory(historyClub).map((ev, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: '10px', background: '#f8f9fc', border: '1px solid #edf0f5', marginBottom: '8px' }}>
                  <div><p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: C.dark }}>{ev.name}</p><p style={{ margin: 0, fontSize: '11px', color: C.textMuted }}>📅 {ev.date} · 👥 {ev.participants}</p></div>
                  <StatusBadge status={ev.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// 6. APPROVALS MONITORING
// ─────────────────────────────────────────────
function ApprovalsMonitoringSection() {
  const requests = [
    { id: 1, event: 'Annual Tech Fest', club: 'Tech Club', submitted: '2026-03-01', stages: ['done', 'done', 'pending', 'pending'], approvers: [{ name: 'Dr. Ramesh', role: 'Faculty', date: 'Mar 2' }, { name: 'Dr. Priya', role: 'HOD', date: 'Mar 4' }, null, null] },
    { id: 2, event: 'Cultural Night', club: 'Cultural Club', submitted: '2026-03-03', stages: ['done', 'rejected', 'pending', 'pending'], approvers: [{ name: 'Prof. Ravi', role: 'Faculty', date: 'Mar 4' }, { name: 'Dr. Mehta', role: 'HOD', date: 'Mar 5', rejected: true }, null, null] },
    { id: 3, event: 'Startup Summit', club: 'Entrepreneurship Club', submitted: '2026-02-28', stages: ['done', 'done', 'done', 'pending'], approvers: [{ name: 'Dr. Meera', role: 'Faculty', date: 'Mar 1' }, { name: 'Dr. Kapoor', role: 'HOD', date: 'Mar 2' }, { name: 'Admin', role: 'Admin', date: 'Mar 5' }, null] },
    { id: 4, event: 'Photography Exhibition', club: 'Photo Club', submitted: '2026-02-25', stages: ['done', 'done', 'done', 'done'], approvers: [{ name: 'Prof. Suresh', role: 'Faculty', date: 'Feb 26' }, { name: 'Dr. Nair', role: 'HOD', date: 'Feb 27' }, { name: 'Admin', role: 'Admin', date: 'Feb 28' }, { name: 'Principal', role: 'Principal', date: 'Mar 1' }] },
  ]

  const stageLabels = ['Club', 'Faculty/HOD', 'Admin', 'Principal']
  const stageIcons = ['🏫', '👨‍🏫', '🏢', '🎓']

  return (
    <div className="adm-section-enter">
      <div style={{ marginBottom: '22px' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '700', color: C.dark, margin: '0 0 3px' }}>Approvals Monitoring</h2>
        <p style={{ margin: 0, fontSize: '13px', color: C.textMuted }}>Live approval pipeline status for all event requests</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {requests.map((req, i) => {
          const stuckIdx = req.stages.findIndex(s => s === 'pending')
          return (
            <div key={req.id} style={{ background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5', animation: `fadeSlideIn 0.4s ease ${i * 0.06}s both` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '700', color: C.dark }}>{req.event}</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: C.textMuted }}>🏫 {req.club} · Submitted {req.submitted}</p>
                </div>
                {stuckIdx === -1 ? (
                  <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', background: '#dcfce7', color: '#15803d' }}>✓ Fully Approved</span>
                ) : req.stages[stuckIdx - 1] === 'rejected' ? (
                  <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', background: '#fee2e2', color: '#b91c1c' }}>Rejected at Stage {stuckIdx}</span>
                ) : (
                  <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', background: '#fef9c3', color: '#a16207' }}>⏳ Awaiting {stageLabels[stuckIdx]}</span>
                )}
              </div>

              {/* Pipeline */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {req.stages.map((stage, si) => {
                  const approver = req.approvers[si]
                  const isDone = stage === 'done'
                  const isRejected = stage === 'rejected'
                  const isPending = stage === 'pending'
                  const isStuck = isPending && si === stuckIdx
                  const circleColor = isDone ? C.green : isRejected ? C.red : isStuck ? C.amber : '#e2e8f0'
                  const circleBg = isDone ? '#dcfce7' : isRejected ? '#fee2e2' : isStuck ? '#fef9c3' : '#f1f5f9'

                  return (
                    <React.Fragment key={si}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: circleBg, border: `2px solid ${circleColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '8px', position: 'relative' }}>
                          {stageIcons[si]}
                          {isDone && <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '16px', height: '16px', borderRadius: '50%', background: C.green, color: '#fff', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', border: '2px solid #fff' }}>✓</div>}
                          {isRejected && <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '16px', height: '16px', borderRadius: '50%', background: C.red, color: '#fff', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', border: '2px solid #fff' }}>✕</div>}
                        </div>
                        <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: '700', color: C.dark, textAlign: 'center' }}>{stageLabels[si]}</p>
                        {approver ? (
                          <p style={{ margin: 0, fontSize: '10px', color: approver.rejected ? C.red : C.green, textAlign: 'center', fontWeight: '600' }}>{approver.name} · {approver.date}</p>
                        ) : (
                          <p style={{ margin: 0, fontSize: '10px', color: isStuck ? C.amber : '#c0c6cf', textAlign: 'center', fontWeight: '500' }}>{isStuck ? 'Awaiting...' : 'Not yet'}</p>
                        )}
                      </div>
                      {si < req.stages.length - 1 && (
                        <div style={{ height: '2px', flex: '0 0 32px', background: isDone ? C.green : '#e2e8f0', margin: '0 4px', marginBottom: '28px' }} />
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// 7. NOTIFICATIONS CENTER
// ─────────────────────────────────────────────
function AdminNotificationsSection() {
  const [filter, setFilter] = useState('All')
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'submission', title: 'New Event Submitted', body: 'Tech Club submitted "Annual Tech Fest" for approval.', time: '2 hours ago', read: false, club: 'Tech Club' },
    { id: 2, type: 'conflict', title: 'Venue Conflict Detected', body: 'Hall A is double-booked on March 18. Tech Fest and Drama Night overlap.', time: '3 hours ago', read: false, club: 'System' },
    { id: 3, type: 'budget', title: 'Budget Clarification Required', body: 'Cultural Fest budget (₹60,000) exceeds standard limit. Approval required.', time: '5 hours ago', read: true, club: 'Cultural Club' },
    { id: 4, type: 'deadline', title: 'Approval Deadline Approaching', body: 'Startup Summit needs admin approval within 24 hours.', time: '6 hours ago', read: false, club: 'Entrepreneurship Club' },
    { id: 5, type: 'submission', title: 'New Event Submitted', body: 'Photo Club submitted "Photography Exhibition" for approval.', time: '1 day ago', read: true, club: 'Photo Club' },
    { id: 6, type: 'conflict', title: 'Venue Conflict Resolved', body: 'Drama Night has been rescheduled. Hall A conflict resolved.', time: '1 day ago', read: true, club: 'System' },
  ])
  const [composeModal, setComposeModal] = useState(false)
  const [composeTo, setComposeTo] = useState('')
  const [composeMsg, setComposeMsg] = useState('')
  const [composeSubject, setComposeSubject] = useState('')

  const typeCfg = {
    submission: { icon: '📋', color: C.accent, bg: '#eef1ff', label: 'NEW EVENT' },
    conflict:   { icon: '⚠️', color: C.red,   bg: '#fee2e2', label: 'CONFLICT' },
    budget:     { icon: '💰', color: C.amber,  bg: '#fffbeb', label: 'BUDGET' },
    deadline:   { icon: '⏰', color: '#8b5cf6', bg: '#f5f3ff', label: 'DEADLINE' },
  }

  const filterTabs = ['All', 'Unread', 'Events', 'Conflicts', 'Budget']
  const filtered = notifications.filter(n => {
    if (filter === 'All') return true
    if (filter === 'Unread') return !n.read
    if (filter === 'Events') return n.type === 'submission'
    if (filter === 'Conflicts') return n.type === 'conflict'
    if (filter === 'Budget') return n.type === 'budget'
    return true
  })

  const markRead = id => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n))
  const markAllRead = () => setNotifications(p => p.map(n => ({ ...n, read: true })))
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="adm-section-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '700', color: C.dark, margin: '0 0 3px' }}>Notifications</h2>
          <p style={{ margin: 0, fontSize: '13px', color: C.textMuted }}>{unreadCount} unread · {notifications.length} total</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {unreadCount > 0 && <button className="adm-btn-ghost" style={{ padding: '8px 14px', fontSize: '12px' }} onClick={markAllRead}>✓ Mark all read</button>}
          <button className="adm-btn-primary" onClick={() => setComposeModal(true)}>✉️ Notify Club</button>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', background: '#f1f4f9', borderRadius: '12px', padding: '5px 6px', width: 'fit-content' }}>
        {filterTabs.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', fontFamily: 'DM Sans, sans-serif', background: filter === f ? C.dark : 'transparent', color: filter === f ? '#fff' : '#5a6473', transition: 'all 0.2s' }}>
            {f}{f === 'Unread' && unreadCount > 0 && <span style={{ marginLeft: '5px', background: C.red, color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '700' }}>{unreadCount}</span>}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map((n, i) => {
          const cfg = typeCfg[n.type] || typeCfg.submission
          return (
            <div key={n.id} onClick={() => markRead(n.id)} style={{
              background: n.read ? '#fff' : `linear-gradient(135deg, ${cfg.bg}, #fff)`,
              borderRadius: '14px', padding: '16px 18px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.055)',
              border: `1px solid ${n.read ? '#edf0f5' : cfg.color + '33'}`,
              display: 'flex', gap: '14px', alignItems: 'flex-start',
              cursor: 'pointer', transition: 'all 0.22s ease',
              animation: `fadeSlideIn 0.4s ease ${i * 0.04}s both`,
              borderLeft: `4px solid ${n.read ? '#edf0f5' : cfg.color}`,
            }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: cfg.bg, border: `1px solid ${cfg.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{cfg.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: C.dark }}>{n.title}</span>
                    <span style={{ fontSize: '9px', fontWeight: '800', padding: '2px 7px', borderRadius: '6px', background: cfg.bg, color: cfg.color, letterSpacing: '0.5px' }}>{cfg.label}</span>
                    {!n.read && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: cfg.color, boxShadow: `0 0 0 3px ${cfg.color}33`, flexShrink: 0 }} />}
                  </div>
                  <span style={{ fontSize: '11px', color: C.textMuted, whiteSpace: 'nowrap', marginLeft: '8px' }}>{n.time}</span>
                </div>
                <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#5a6473', lineHeight: '1.5' }}>{n.body}</p>
                <span style={{ fontSize: '11px', color: C.textMuted, fontWeight: '500' }}>From: {n.club}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Compose modal */}
      {composeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,30,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setComposeModal(false)}>
          <div className="adm-modal-enter" style={{ background: '#fff', borderRadius: '20px', padding: '28px', maxWidth: '420px', width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '17px', fontWeight: '700', color: C.dark, margin: '0 0 18px' }}>✉️ Notify a Club</h3>
            {[['To (Club)', 'composeTo', setComposeTo, composeTo, 'e.g. Tech Club'], ['Subject', 'composeSubject', setComposeSubject, composeSubject, 'Subject of notification']].map(([l, _, setter, val, ph]) => (
              <div key={l} style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#555' }}>{l}</label>
                <input className="adm-input" placeholder={ph} value={val} onChange={e => setter(e.target.value)} />
              </div>
            ))}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#555' }}>Message</label>
              <textarea className="adm-input" rows={4} style={{ resize: 'vertical', minHeight: '100px' }} placeholder="Write your message..." value={composeMsg} onChange={e => setComposeMsg(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="adm-btn-primary" style={{ flex: 1, padding: '11px' }} onClick={() => { alert(`Notification sent to ${composeTo || 'Club'}`); setComposeModal(false); setComposeTo(''); setComposeSubject(''); setComposeMsg('') }}>Send Notification</button>
              <button className="adm-btn-ghost" style={{ flex: 1, padding: '11px' }} onClick={() => setComposeModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// 8. ANALYTICS
// ─────────────────────────────────────────────
function AdminAnalyticsSection() {
  const monthlyData = [
    { month: 'Aug', events: 3, budget: 45000 },
    { month: 'Sep', events: 5, budget: 72000 },
    { month: 'Oct', events: 8, budget: 110000 },
    { month: 'Nov', events: 7, budget: 95000 },
    { month: 'Dec', events: 4, budget: 60000 },
    { month: 'Jan', events: 6, budget: 88000 },
    { month: 'Feb', events: 9, budget: 130000 },
    { month: 'Mar', events: 5, budget: 74000 },
  ]
  const maxEvents = Math.max(...monthlyData.map(d => d.events))
  const maxBudget = Math.max(...monthlyData.map(d => d.budget))

  const venueData = [
    { name: 'Hall A', usage: 85, color: C.accent },
    { name: 'Hall B', usage: 72, color: '#8b5cf6' },
    { name: 'Outdoor', usage: 60, color: C.green },
    { name: 'Conference', usage: 45, color: C.amber },
    { name: 'Sports', usage: 78, color: C.red },
    { name: 'Gallery', usage: 30, color: '#ec4899' },
  ]

  const kpis = [
    { label: 'Avg Approval Time', value: '4.2 days', icon: '⏱️', color: C.accent, change: '-0.8 days' },
    { label: 'Budget Utilization', value: '78%', icon: '💰', color: C.green, change: '+5%' },
    { label: 'Event Success Rate', value: '91%', icon: '🎯', color: '#8b5cf6', change: '+3%' },
    { label: 'Venue Utilization', value: '67%', icon: '🏛', color: C.amber, change: '+12%' },
  ]

  return (
    <div className="adm-section-enter">
      <div style={{ marginBottom: '22px' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '700', color: C.dark, margin: '0 0 3px' }}>Analytics</h2>
        <p style={{ margin: 0, fontSize: '13px', color: C.textMuted }}>Semester overview · Academic Year 2025–26</p>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '14px', marginBottom: '24px' }}>
        {kpis.map((k, i) => (
          <div key={k.label} style={{ background: '#fff', borderRadius: '16px', padding: '18px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.055)', border: '1px solid #edf0f5', animation: `fadeSlideIn 0.4s ease ${i * 0.06}s both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: k.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{k.icon}</div>
              <span style={{ fontSize: '11px', fontWeight: '600', color: C.green, background: '#f0fdf4', padding: '2px 7px', borderRadius: '7px' }}>{k.change}</span>
            </div>
            <p style={{ margin: '0 0 3px', fontSize: '26px', fontWeight: '800', color: C.dark, fontFamily: 'Syne, sans-serif' }}>{k.value}</p>
            <p style={{ margin: 0, fontSize: '12px', color: C.textMuted, fontWeight: '500' }}>{k.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Monthly Events Bar Chart */}
        <div style={{ background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: '700', color: C.dark, margin: '0 0 18px' }}>Monthly Event Count</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '140px' }}>
            {monthlyData.map(d => (
              <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: C.dark }}>{d.events}</span>
                <div style={{ width: '100%', background: `linear-gradient(180deg, ${C.accent}, ${C.accentPurple})`, borderRadius: '6px 6px 0 0', height: `${(d.events / maxEvents) * 100}%`, minHeight: '4px', transition: 'height 0.6s cubic-bezier(0.22,1,0.36,1)' }} />
                <span style={{ fontSize: '10px', color: C.textMuted, fontWeight: '500' }}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Chart */}
        <div style={{ background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: '700', color: C.dark, margin: '0 0 18px' }}>Budget Spending (₹)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '140px' }}>
            {monthlyData.map(d => (
              <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: C.dark }}>{(d.budget / 1000).toFixed(0)}k</span>
                <div style={{ width: '100%', background: `linear-gradient(180deg, ${C.green}, #059669)`, borderRadius: '6px 6px 0 0', height: `${(d.budget / maxBudget) * 100}%`, minHeight: '4px', transition: 'height 0.6s cubic-bezier(0.22,1,0.36,1)' }} />
                <span style={{ fontSize: '10px', color: C.textMuted, fontWeight: '500' }}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Venue Utilization */}
      <div style={{ background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5' }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: '700', color: C.dark, margin: '0 0 18px' }}>Venue Utilization Rate</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {venueData.map(v => (
            <div key={v.name} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: C.dark, minWidth: '90px' }}>{v.name}</span>
              <div style={{ flex: 1, height: '10px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${v.usage}%`, background: `linear-gradient(90deg, ${v.color}, ${v.color}bb)`, borderRadius: '10px', transition: 'width 0.8s cubic-bezier(0.22,1,0.36,1)' }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: C.dark, minWidth: '36px', textAlign: 'right' }}>{v.usage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// 9. ADMIN SETTINGS
// ─────────────────────────────────────────────
function AdminSettingsSection() {
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState({ name: 'Administrator', email: 'admin@clubos.edu', phone: '+91 98765 43210', dept: 'Student Affairs' })
  const [notifPrefs, setNotifPrefs] = useState({ newEvents: true, conflicts: true, budgetAlerts: true, deadlines: true, clubRegistrations: false })
  const [appearance, setAppearance] = useState({ fontSize: 'medium', compactMode: false })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'data', label: 'Data', icon: '💾' },
    { id: 'help', label: 'Help', icon: '❓' },
  ]

  const Toggle = ({ on, toggle }) => (
    <button onClick={toggle} style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer', position: 'relative', background: on ? C.accent : '#d1d9e0', transition: 'background 0.28s ease', flexShrink: 0 }}>
      <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: on ? '23px' : '3px', transition: 'left 0.28s cubic-bezier(0.22,1,0.36,1)', boxShadow: '0 1px 4px rgba(0,0,0,0.18)' }} />
    </button>
  )

  return (
    <div className="adm-section-enter" style={{ maxWidth: '780px' }}>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '700', color: C.dark, margin: '0 0 22px' }}>Settings</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Tab sidebar */}
        <div style={{ width: '180px', flexShrink: 0 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.055)', border: '1px solid #edf0f5' }}>
            {tabs.map(tab => (
              <div key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === tab.id ? '700' : '500', color: activeTab === tab.id ? C.accent : C.dark, background: activeTab === tab.id ? '#f0f3ff' : 'transparent', transition: 'all 0.18s' }}>
                <span style={{ fontSize: '15px' }}>{tab.icon}</span> {tab.label}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, background: '#fff', borderRadius: '18px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5' }}>
          {activeTab === 'profile' && (
            <div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '700', color: C.dark, margin: '0 0 18px' }}>Profile Settings</h3>
              {[['name', 'Full Name'], ['email', 'Email Address'], ['phone', 'Phone Number'], ['dept', 'Department']].map(([k, l]) => (
                <div key={k} style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#555' }}>{l}</label>
                  <input className="adm-input" value={profile[k]} onChange={e => setProfile(p => ({ ...p, [k]: e.target.value }))} />
                </div>
              ))}
              <button className="adm-btn-primary" style={{ marginTop: '4px', padding: '10px 22px' }} onClick={() => alert('Profile saved!')}>Save Changes</button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '700', color: C.dark, margin: '0 0 18px' }}>Notification Preferences</h3>
              {[
                ['newEvents', '📋 New Event Submissions', 'Notify when a club submits a new event'],
                ['conflicts', '⚠️ Venue Conflicts', 'Notify when booking conflicts are detected'],
                ['budgetAlerts', '💰 Budget Alerts', 'Notify when event budgets exceed limits'],
                ['deadlines', '⏰ Approval Deadlines', 'Remind me when approvals are due'],
                ['clubRegistrations', '🏫 Club Registrations', 'Notify when new clubs register'],
              ].map(([k, label, hint]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f0f3f8' }}>
                  <div><p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '600', color: C.dark }}>{label}</p><p style={{ margin: 0, fontSize: '12px', color: C.textMuted }}>{hint}</p></div>
                  <Toggle on={notifPrefs[k]} toggle={() => setNotifPrefs(p => ({ ...p, [k]: !p[k] }))} />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'appearance' && (
            <div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '700', color: C.dark, margin: '0 0 18px' }}>Appearance Settings</h3>
              <div style={{ padding: '16px 0', borderBottom: '1px solid #f0f3f8', marginBottom: '18px' }}>
                <p style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: '600', color: C.dark }}>Font Size</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['small', 'medium', 'large'].map(s => (
                    <button key={s} onClick={() => setAppearance(p => ({ ...p, fontSize: s }))} style={{ padding: '7px 16px', borderRadius: '10px', border: `1.5px solid ${appearance.fontSize === s ? C.accent : '#e2e8f0'}`, background: appearance.fontSize === s ? '#f0f3ff' : '#f8f9fc', color: appearance.fontSize === s ? C.accent : C.dark, fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', textTransform: 'capitalize' }}>{s}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0' }}>
                <div><p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '600', color: C.dark }}>⊟ Compact Mode</p><p style={{ margin: 0, fontSize: '12px', color: C.textMuted }}>Reduce spacing for denser information display</p></div>
                <Toggle on={appearance.compactMode} toggle={() => setAppearance(p => ({ ...p, compactMode: !p.compactMode }))} />
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '700', color: C.dark, margin: '0 0 18px' }}>Data Management</h3>
              {[['📥 Export All Events', 'Download complete event history as CSV'], ['📊 Export Analytics', 'Download analytics report as PDF'], ['🗑️ Clear Draft Events', 'Remove all draft event submissions']].map(([l, h]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f0f3f8' }}>
                  <div><p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '600', color: C.dark }}>{l}</p><p style={{ margin: 0, fontSize: '12px', color: C.textMuted }}>{h}</p></div>
                  <button className="adm-btn-ghost" style={{ padding: '7px 14px', fontSize: '12px' }} onClick={() => alert(`${l} — coming soon`)}>Action</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'help' && (
            <div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '700', color: C.dark, margin: '0 0 18px' }}>Help & Support</h3>
              {[['📖 Admin Documentation', 'Full guide for using the admin dashboard'], ['🐛 Report a Bug', 'Something not working? Let us know'], ['📞 Contact Support', 'Get help from the ClubOS technical team']].map(([l, h]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f0f3f8' }}>
                  <div><p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '600', color: C.dark }}>{l}</p><p style={{ margin: 0, fontSize: '12px', color: C.textMuted }}>{h}</p></div>
                  <button className="adm-btn-ghost" style={{ padding: '7px 14px', fontSize: '12px' }} onClick={() => alert(`${l} — coming soon`)}>Open</button>
                </div>
              ))}
              <div style={{ marginTop: '20px', padding: '16px', background: '#f0f3ff', borderRadius: '12px', border: '1px solid #dde3fc' }}>
                <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '700', color: C.accent }}>ℹ️ ClubOS Admin Panel</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#4c63b6', lineHeight: '1.55' }}>Version 2.0 · For technical support contact support@clubos.edu</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// LOGOUT MODAL
// ─────────────────────────────────────────────
function AdminLogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="adm-section-enter" style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,30,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
      <div className="adm-modal-enter" style={{ background: '#fff', borderRadius: '20px', padding: '32px', maxWidth: '360px', width: '90%', textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
        <span style={{ fontSize: '44px', display: 'block', marginBottom: '14px' }}>👋</span>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '800', color: C.dark, margin: '0 0 10px' }}>Leaving so soon?</h2>
        <p style={{ color: C.textMuted, fontSize: '14px', marginBottom: '24px' }}>Are you sure you want to logout from the admin panel?</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="adm-btn-ghost" style={{ flex: 1, padding: '12px' }} onClick={onCancel}>Cancel</button>
          <button style={{ flex: 1, padding: '12px', background: C.red, color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontFamily: 'DM Sans, sans-serif' }} onClick={onConfirm}>Logout</button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN ADMIN DASHBOARD
// ─────────────────────────────────────────────
function AdminDashboard({ admin, onLogout }) {
  const navigate = useNavigate()
  const [active, setActive] = useState('dashboard')
  const [showLogout, setShowLogout] = useState(false)

  const handleSection = sec => {
    if (sec === 'logout') { setShowLogout(true); return }
    setActive(sec)
  }

  const sectionMap = {
    dashboard:     <AdminDashboardSection onNavigate={handleSection} />,
    events:        <EventRequestsSection />,
    venues:        <AdminVenuesSection />,
    calendar:      <AcademicCalendarSection />,
    clubs:         <ClubManagementSection />,
    approvals:     <ApprovalsMonitoringSection />,
    notifications: <AdminNotificationsSection />,
    analytics:     <AdminAnalyticsSection />,
    settings:      <AdminSettingsSection />,
  }

  return (
    <>
      <AdminStyleInjector />
      <div style={{ display: 'flex', height: '100vh', fontFamily: 'DM Sans, sans-serif', background: C.bg }}>
        <AdminSidebar selected={active} onSelect={handleSection} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <AdminNavbar admin={admin} onSectionChange={handleSection} />
          <div key={active} className="adm-section-enter" style={{ flex: 1, overflowY: 'auto', padding: '26px 28px' }}>
            {sectionMap[active] || sectionMap.dashboard}
          </div>
        </div>
        {showLogout && <AdminLogoutModal onConfirm={() => { setShowLogout(false); onLogout?.(); navigate('/') }} onCancel={() => setShowLogout(false)} />}
      </div>
    </>
  )
}

export default AdminDashboard