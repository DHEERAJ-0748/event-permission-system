import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// ─────────────────────────────────────────────
// Global Styles (same system as Admin/Club)
// ─────────────────────────────────────────────
const principalGlobalStyles = `
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

  .prc-section-enter { animation: fadeSlideIn 0.38s cubic-bezier(0.22,1,0.36,1) both; }
  .prc-modal-enter   { animation: scaleIn 0.28s cubic-bezier(0.22,1,0.36,1) both; }

  .prc-nav-item {
    transition: background 0.22s ease, color 0.22s ease, transform 0.18s ease;
    border-radius: 10px; margin: 3px 10px; padding: 10px 16px;
    cursor: pointer; display: flex; align-items: center; gap: 11px;
    font-size: 14px; font-weight: 500; color: rgba(236,240,241,0.72);
  }
  .prc-nav-item:hover { background: rgba(255,255,255,0.08); color: #ecf0f1; transform: translateX(3px); }
  .prc-nav-item.active {
    background: linear-gradient(90deg,rgba(16,185,129,0.28),rgba(16,185,129,0.1));
    color: #fff; font-weight: 600;
    box-shadow: inset 3px 0 0 #10b981;
  }
  .prc-card-hover {
    transition: transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s ease;
    cursor: pointer;
  }
  .prc-card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 36px rgba(44,62,80,0.13) !important;
  }
  .prc-btn-primary {
    background: linear-gradient(135deg,#10b981,#059669);
    color: #fff; border: none; border-radius: 10px;
    padding: 9px 18px; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans',sans-serif;
    transition: opacity 0.2s, transform 0.15s;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .prc-btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
  .prc-btn-ghost {
    background: transparent; color: #10b981;
    border: 1.5px solid #10b981; border-radius: 10px;
    padding: 9px 18px; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans',sans-serif;
    transition: background 0.2s;
  }
  .prc-btn-ghost:hover { background: #f0fdf4; }
  .prc-btn-danger {
    background: #fff0f0; color: #ef4444;
    border: 1.5px solid #fecaca; border-radius: 10px;
    padding: 9px 18px; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans',sans-serif;
    transition: background 0.2s;
  }
  .prc-btn-danger:hover { background: #fee2e2; }
  .prc-btn-amber {
    background: #fffbeb; color: #d97706;
    border: 1.5px solid #fde68a; border-radius: 10px;
    padding: 9px 18px; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans',sans-serif;
    transition: background 0.2s;
  }
  .prc-btn-amber:hover { background: #fef3c7; }
  .prc-input {
    width: 100%; padding: 10px 14px; border-radius: 10px;
    border: 1.5px solid #e2e8f0; background: #f8f9fc;
    font-size: 14px; font-family: 'DM Sans',sans-serif;
    outline: none; transition: border-color 0.22s;
    color: #1a2535;
  }
  .prc-input:focus { border-color: #10b981; background: #fff; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #d0d5dd; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #adb5bd; }
`

const PrincipalStyleInjector = () => {
  useEffect(() => {
    const el = document.createElement('style')
    el.setAttribute('data-principal-styles', '1')
    el.textContent = principalGlobalStyles
    document.head.appendChild(el)
    return () => document.head.removeChild(el)
  }, [])
  return null
}

// ─────────────────────────────────────────────
// Shared design tokens
// ─────────────────────────────────────────────
const C = {
  dark: '#1a2535', sidebar: '#2c3e50',
  accent: '#10b981', accentDark: '#059669',
  blue: '#667eea', purple: '#764ba2',
  red: '#ef4444', amber: '#f59e0b',
  textMuted: '#8a96a3', border: '#edf0f5', bg: '#f4f6f9',
}

const statusCfg = {
  Approved:  { bg: '#dcfce7', color: '#15803d', dot: '#22c55e' },
  Pending:   { bg: '#fef9c3', color: '#a16207', dot: '#eab308' },
  Rejected:  { bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444' },
  Draft:     { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' },
  Clarification: { bg: '#f5f3ff', color: '#6d28d9', dot: '#8b5cf6' },
}

function StatusBadge({ status }) {
  const cfg = statusCfg[status] || statusCfg.Draft
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
      background: cfg.bg, color: cfg.color, flexShrink: 0,
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.dot }} />
      {status}
    </span>
  )
}

// ─────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────
const PRINCIPAL_NAV = [
  { id: 'dashboard',    label: 'Dashboard',          icon: '⬡' },
  { id: 'approvals',    label: 'Final Approvals',     icon: '🎓' },
  { id: 'major-events', label: 'Major Events',        icon: '🎪' },
  { id: 'budget',       label: 'Budget Oversight',    icon: '💰' },
  { id: 'calendar',     label: 'Academic Calendar',   icon: '📅' },
  { id: 'analytics',    label: 'Analytics',           icon: '📊' },
  { id: 'notifications',label: 'Notifications',       icon: '🔔' },
]

function PrincipalSidebar({ selected, onSelect, unreadCount }) {
  return (
    <div style={{
      width: '230px',
      background: `linear-gradient(175deg, ${C.dark} 0%, ${C.sidebar} 100%)`,
      color: '#ecf0f1', display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', padding: '24px 0 20px 0',
      boxShadow: '4px 0 24px rgba(0,0,0,0.12)', flexShrink: 0, zIndex: 10,
    }}>
      <div>
        {/* Logo */}
        <div style={{ padding: '0 20px 28px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '10px',
              background: 'linear-gradient(135deg,#10b981,#059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', fontWeight: '700', color: '#fff', fontFamily: 'Syne, sans-serif'
            }}>P</div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '16px', color: '#fff', letterSpacing: '-0.3px' }}>ClubOS</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '1px' }}>Principal's Office</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 20px 8px 20px', fontSize: '11px', fontWeight: '600', color: '#546e7a', letterSpacing: '1px', textTransform: 'uppercase' }}>Menu</div>

        {PRINCIPAL_NAV.map(item => (
          <div key={item.id} className={`prc-nav-item ${selected === item.id ? 'active' : ''}`} onClick={() => onSelect(item.id)}>
            <span style={{ fontSize: '15px', width: '22px', textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
            {item.label}
            {item.id === 'notifications' && unreadCount > 0 && (
              <div style={{ marginLeft: 'auto', background: C.red, color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', animation: 'pulse 2s ease-in-out infinite' }}>{unreadCount}</div>
            )}
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
        <div className={`prc-nav-item ${selected === 'settings' ? 'active' : ''}`} onClick={() => onSelect('settings')}>
          <span style={{ fontSize: '15px', width: '22px', textAlign: 'center' }}>⚙️</span> Settings
        </div>
        <div className="prc-nav-item" onClick={() => onSelect('logout')}>
          <span style={{ fontSize: '15px', width: '22px', textAlign: 'center' }}>🚪</span> Logout
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────
function PrincipalNavbar({ principal, onSectionChange }) {
  const [showMenu, setShowMenu] = useState(false)
  return (
    <div style={{
      height: '60px', background: '#fff', borderBottom: '1px solid #edf0f5',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', flexShrink: 0, boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
      position: 'sticky', top: 0, zIndex: 9,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '12px', fontWeight: '700', background: '#d1fae5', color: '#065f46', padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.5px' }}>PRINCIPAL</span>
        <span style={{ fontSize: '13px', color: C.textMuted }}>Welcome back, {principal?.name || 'Principal'}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button className="prc-btn-primary" onClick={() => onSectionChange('approvals')}>
          🎓 Final Approvals
        </button>
        <div style={{ position: 'relative' }}>
          <button style={{ background: '#f4f6f9', border: 'none', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }} onClick={() => onSectionChange('notifications')}>
            🔔
            <span style={{ position: 'absolute', top: '-3px', right: '-3px', background: C.red, color: '#fff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '9px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
          </button>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: '#fff', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }} onClick={() => setShowMenu(m => !m)}>PR</div>
          {showMenu && (
            <div className="prc-modal-enter" style={{ position: 'absolute', right: 0, top: '44px', background: '#fff', borderRadius: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.13)', border: '1px solid #edf0f5', padding: '8px', minWidth: '170px', zIndex: 100 }}>
              {[['⚙️', 'Settings', 'settings'], ['🚪', 'Logout', 'logout']].map(([ico, lbl, id]) => (
                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 12px', borderRadius: '9px', cursor: 'pointer', fontSize: '13px', color: C.dark, fontWeight: '500', transition: 'background 0.18s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f4f6f9'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => { setShowMenu(false); onSectionChange(id) }}>
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
// MOCK DATA (shared across sections)
// ─────────────────────────────────────────────
const MOCK_EVENTS = [
  { id: 1, name: 'Annual Tech Fest', club: 'Tech Club', description: 'A two-day technology festival with workshops, hackathons, and industry talks from leading companies.', venue: 'Hall A', date: '2026-03-18', participants: 350, budget: 45000, adminStatus: 'Approved', principalStatus: 'Pending', major: true, type: 'Technical Festival' },
  { id: 2, name: 'Drama Night', club: 'Arts Club', description: 'Student drama performance showcasing original one-act plays written and directed by students.', venue: 'Auditorium', date: '2026-03-22', participants: 200, budget: 18000, adminStatus: 'Approved', principalStatus: 'Approved', major: false, type: 'Cultural' },
  { id: 3, name: 'Startup Summit', club: 'Entrepreneurship Club', description: 'Pitch competition for student startup ideas with investor panels and seed funding opportunities.', venue: 'Conference Room', date: '2026-04-10', participants: 120, budget: 30000, adminStatus: 'Approved', principalStatus: 'Pending', major: true, type: 'Hackathon' },
  { id: 4, name: 'Cultural Fest', club: 'Cultural Club', description: 'Annual multicultural celebration with food, music, art, and performances from 12 states.', venue: 'Open Ground', date: '2026-04-01', participants: 500, budget: 60000, adminStatus: 'Approved', principalStatus: 'Pending', major: true, type: 'Cultural Festival' },
  { id: 5, name: 'Photography Exhibition', club: 'Photo Club', description: 'Display of student photography with awards and print sales to support club activities.', venue: 'Gallery Hall', date: '2026-04-05', participants: 100, budget: 8000, adminStatus: 'Approved', principalStatus: 'Approved', major: false, type: 'Exhibition' },
  { id: 6, name: 'Inter-College Cricket', club: 'Sports Club', description: 'Three-day inter-college cricket tournament with teams from 8 partner institutions.', venue: 'Sports Ground', date: '2026-04-15', participants: 300, budget: 35000, adminStatus: 'Approved', principalStatus: 'Pending', major: true, type: 'Inter-College Event' },
  { id: 7, name: 'Science Symposium', club: 'Science Club', description: 'Research paper presentations and poster sessions from undergraduate and postgraduate students.', venue: 'Hall B', date: '2026-04-20', participants: 180, budget: 22000, adminStatus: 'Approved', principalStatus: 'Rejected', major: false, type: 'Academic' },
  { id: 8, name: 'National Hackathon', club: 'CS Club', description: '36-hour open national hackathon with participants from colleges across the country.', venue: 'Hall A + Hall B', date: '2026-05-01', participants: 250, budget: 75000, adminStatus: 'Approved', principalStatus: 'Pending', major: true, type: 'Hackathon' },
]

// ─────────────────────────────────────────────
// 1. DASHBOARD OVERVIEW
// ─────────────────────────────────────────────
function PrincipalDashboardSection({ onNavigate, eventStatuses }) {
  const pending = MOCK_EVENTS.filter(e => (eventStatuses[e.id] || e.principalStatus) === 'Pending').length
  const approved = MOCK_EVENTS.filter(e => (eventStatuses[e.id] || e.principalStatus) === 'Approved')
  const totalBudgetApproved = approved.reduce((s, e) => s + e.budget, 0)
  const upcomingMajor = MOCK_EVENTS.filter(e => e.major && (eventStatuses[e.id] || e.principalStatus) === 'Approved').length

  const stats = [
    { label: 'Total Events This Semester', value: '47', icon: '🎪', bg: '#eef1ff', color: C.blue, change: '+12%' },
    { label: 'Pending Final Approvals',    value: String(pending), icon: '⏳', bg: '#fffbeb', color: C.amber, change: `${pending} urgent` },
    { label: 'Total Budget Approved',      value: `₹${(totalBudgetApproved / 1000).toFixed(0)}k`, icon: '💰', bg: '#f0fdf4', color: C.accent, change: '+8%' },
    { label: 'Upcoming Major Events',      value: String(upcomingMajor), icon: '🌟', bg: '#f5f3ff', color: '#8b5cf6', change: 'This month' },
  ]

  const recentlyApproved = MOCK_EVENTS.filter(e => (eventStatuses[e.id] || e.principalStatus) === 'Approved').slice(0, 5)
  const upcoming = MOCK_EVENTS.filter(e => (eventStatuses[e.id] || e.principalStatus) !== 'Rejected').slice(0, 4)

  return (
    <div className="prc-section-enter">
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: '16px', marginBottom: '28px' }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{ background: '#fff', borderRadius: '16px', padding: '20px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.055)', border: '1px solid #edf0f5', animation: `fadeSlideIn 0.4s ease ${i * 0.06}s both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{s.icon}</div>
              <span style={{ fontSize: '11px', fontWeight: '600', color: C.accent, background: '#f0fdf4', padding: '3px 8px', borderRadius: '8px' }}>{s.change}</span>
            </div>
            <p style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: '800', color: C.dark, fontFamily: 'Syne, sans-serif' }}>{s.value}</p>
            <p style={{ margin: 0, fontSize: '13px', color: C.textMuted, fontWeight: '500' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recently Approved */}
        <div style={{ background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.055)', border: '1px solid #edf0f5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '700', color: C.dark, margin: 0 }}>Recently Approved Events</h3>
            <button onClick={() => onNavigate('approvals')} style={{ background: 'none', border: 'none', color: C.accent, fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>View all →</button>
          </div>
          {recentlyApproved.length === 0 ? (
            <p style={{ fontSize: '13px', color: C.textMuted, textAlign: 'center', padding: '20px 0' }}>No approved events yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentlyApproved.map((e, i) => (
                <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 14px', borderRadius: '10px', background: '#f8f9fc', border: '1px solid #edf0f5', animation: `fadeSlideIn 0.4s ease ${i * 0.05}s both` }}>
                  <div>
                    <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: C.dark }}>{e.name}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: C.textMuted }}>📅 {e.date} · 🏛 {e.venue}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <StatusBadge status="Approved" />
                    <span style={{ fontSize: '11px', color: C.textMuted }}>{e.club}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div style={{ background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.055)', border: '1px solid #edf0f5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '700', color: C.dark, margin: 0 }}>Upcoming Events</h3>
            <span style={{ fontSize: '12px', color: C.textMuted, fontWeight: '500' }}>{upcoming.length} events</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {upcoming.map((e, i) => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '10px', background: '#f8f9fc', border: '1px solid #edf0f5', animation: `fadeSlideIn 0.4s ease ${i * 0.05}s both` }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg,#10b98122,#05996922)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: C.accent, fontFamily: 'Syne, sans-serif', textAlign: 'center', lineHeight: '1.2' }}>
                    {e.date.split('-')[2]}<br />{['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(e.date.split('-')[1])]}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: C.dark }}>{e.name}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: C.textMuted }}>📍 {e.venue} · 👥 {e.participants}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <StatusBadge status={eventStatuses[e.id] || e.principalStatus} />
                  {e.major && <span style={{ fontSize: '10px', fontWeight: '700', background: '#fef9c3', color: '#a16207', padding: '1px 6px', borderRadius: '5px' }}>MAJOR</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// 2. FINAL APPROVALS
// ─────────────────────────────────────────────
function FinalApprovalsSection({ eventStatuses, setEventStatus }) {
  const [filter, setFilter] = useState('All')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [clarifyModal, setClarifyModal] = useState(null)
  const [clarifyNote, setClarifyNote] = useState('')

  const pendingFirst = [...MOCK_EVENTS].sort((a, b) => {
    const sa = eventStatuses[a.id] || a.principalStatus
    const sb = eventStatuses[b.id] || b.principalStatus
    if (sa === 'Pending' && sb !== 'Pending') return -1
    if (sb === 'Pending' && sa !== 'Pending') return 1
    return 0
  })

  const filters = ['All', 'Pending', 'Approved', 'Rejected', 'Clarification']
  const displayed = filter === 'All' ? pendingFirst : pendingFirst.filter(e => (eventStatuses[e.id] || e.principalStatus) === filter)

  const countOf = s => s === 'All' ? MOCK_EVENTS.length : MOCK_EVENTS.filter(e => (eventStatuses[e.id] || e.principalStatus) === s).length

  return (
    <div className="prc-section-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '700', color: C.dark, margin: '0 0 3px' }}>Final Approvals</h2>
          <p style={{ margin: 0, fontSize: '13px', color: C.textMuted }}>Events cleared by Admin · awaiting your final decision</p>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'inline-flex', gap: '6px', background: '#f1f4f9', borderRadius: '14px', padding: '5px 6px', marginBottom: '22px', flexWrap: 'wrap' }}>
        {filters.map(f => {
          const isActive = filter === f
          const cfg = statusCfg[f]
          const count = countOf(f)
          return (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '7px', transition: 'all 0.22s cubic-bezier(0.22,1,0.36,1)', background: isActive ? C.dark : 'transparent', color: isActive ? '#fff' : '#5a6473', boxShadow: isActive ? '0 2px 10px rgba(26,37,53,0.22)' : 'none' }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#e4e8f0' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}>
              {f !== 'All' && cfg && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: isActive ? '#fff' : cfg.dot, flexShrink: 0, opacity: isActive ? 0.7 : 1 }} />}
              {f}
              <span style={{ fontSize: '11px', fontWeight: '700', minWidth: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', padding: '0 4px', background: isActive ? 'rgba(255,255,255,0.18)' : '#e4e8f0', color: isActive ? '#fff' : '#5a6473' }}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Event cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px,1fr))', gap: '16px' }}>
        {displayed.map((e, i) => {
          const status = eventStatuses[e.id] || e.principalStatus
          const cfg = statusCfg[status] || statusCfg.Draft
          return (
            <div key={e.id} style={{ background: '#fff', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5', display: 'flex', flexDirection: 'column', animation: `fadeSlideIn 0.4s ease ${i * 0.045}s both` }}>
              <div style={{ height: '4px', background: cfg.dot }} />
              <div style={{ padding: '18px 20px', flex: 1 }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '6px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 3px', fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: '700', color: C.dark }}>{e.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '12px', color: C.textMuted, background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', fontWeight: '500' }}>{e.club}</span>
                      {e.major && <span style={{ fontSize: '10px', fontWeight: '700', background: '#fef9c3', color: '#a16207', padding: '2px 7px', borderRadius: '6px' }}>MAJOR</span>}
                    </div>
                  </div>
                  <StatusBadge status={status} />
                </div>

                <p style={{ margin: '10px 0 12px', fontSize: '13px', color: '#7a8694', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{e.description}</p>

                <div style={{ height: '1px', background: '#f0f3f8', marginBottom: '12px' }} />

                <div style={{ display: 'flex', gap: '14px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', color: '#5a6473', display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ color: C.accent }}>📅</span>{e.date}</span>
                  <span style={{ fontSize: '12px', color: '#5a6473', display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ color: C.accent }}>📍</span>{e.venue}</span>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ flex: 1, padding: '9px 12px', background: '#f7f9fc', borderRadius: '10px', border: '1px solid #edf0f5' }}>
                    <p style={{ margin: '0 0 2px', fontSize: '10px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Participants</p>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: C.dark }}>👥 {e.participants}</p>
                  </div>
                  <div style={{ flex: 1, padding: '9px 12px', background: '#f7f9fc', borderRadius: '10px', border: '1px solid #edf0f5' }}>
                    <p style={{ margin: '0 0 2px', fontSize: '10px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Budget</p>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: C.dark }}>₹{e.budget.toLocaleString()}</p>
                  </div>
                </div>

                {/* Admin clearance indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 10px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac33', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px' }}>✅</span>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#15803d' }}>Admin Approved · Awaiting Principal Sign-off</span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button onClick={() => setSelectedEvent({ ...e, liveStatus: status })} className="prc-btn-ghost" style={{ flex: 1, padding: '7px 8px', fontSize: '12px' }}>📄 Details</button>
                  {status !== 'Approved' && <button onClick={() => setEventStatus(e.id, 'Approved')} className="prc-btn-primary" style={{ flex: 1, padding: '7px 8px', fontSize: '12px' }}>✓ Approve</button>}
                  {status !== 'Rejected' && <button onClick={() => setEventStatus(e.id, 'Rejected')} className="prc-btn-danger" style={{ flex: 1, padding: '7px 8px', fontSize: '12px' }}>✕ Reject</button>}
                  <button onClick={() => { setClarifyModal(e); setClarifyNote('') }} className="prc-btn-amber" style={{ flex: '0 0 auto', padding: '7px 8px', fontSize: '12px' }}>💬 Clarify</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Detail Modal */}
      {selectedEvent && (
        <div className="prc-section-enter" style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,30,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setSelectedEvent(null)}>
          <div className="prc-modal-enter" style={{ background: '#fff', borderRadius: '22px', overflow: 'hidden', maxWidth: '580px', width: '100%', boxShadow: '0 32px 72px rgba(0,0,0,0.22)' }} onClick={ev => ev.stopPropagation()}>
            <div style={{ padding: '24px 28px 20px', background: 'linear-gradient(135deg,#1a2535,#2c3e50)', color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ margin: '0 0 6px', fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '800' }}>{selectedEvent.name}</h2>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>🏫 {selectedEvent.club}</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>📅 {selectedEvent.date}</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>📍 {selectedEvent.venue}</span>
                    <StatusBadge status={selectedEvent.liveStatus} />
                  </div>
                </div>
                <button onClick={() => setSelectedEvent(null)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', color: '#fff', flexShrink: 0 }}>✕</button>
              </div>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <p style={{ fontSize: '14px', color: '#5a6473', lineHeight: '1.6', marginBottom: '18px' }}>{selectedEvent.description}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                {[['Participants', `👥 ${selectedEvent.participants}`], ['Budget', `₹${selectedEvent.budget?.toLocaleString()}`], ['Type', selectedEvent.type || '—']].map(([l, v]) => (
                  <div key={l} style={{ padding: '12px', background: '#f7f9fc', borderRadius: '12px', border: '1px solid #edf0f5' }}>
                    <p style={{ margin: '0 0 4px', fontSize: '10px', color: C.textMuted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{l}</p>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: C.dark }}>{v}</p>
                  </div>
                ))}
              </div>
              {/* Approval chain */}
              <div style={{ padding: '14px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #86efac33', marginBottom: '18px' }}>
                <p style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: '700', color: '#065f46' }}>Approval Chain</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {[['🏫 Club', true], ['👨‍🏫 Faculty', true], ['🏢 Admin', true], ['🎓 Principal', selectedEvent.liveStatus === 'Approved']].map(([l, done], idx, arr) => (
                    <React.Fragment key={l}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: done ? '#15803d' : C.textMuted }}>{l}</span>
                        <span style={{ fontSize: '12px' }}>{done ? '✅' : '⏳'}</span>
                      </div>
                      {idx < arr.length - 1 && <span style={{ color: '#c0c6cf', fontSize: '14px' }}>→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="prc-btn-primary" style={{ flex: 1, padding: '11px' }} onClick={() => { setEventStatus(selectedEvent.id, 'Approved'); setSelectedEvent(null) }}>✓ Final Approve</button>
                <button className="prc-btn-danger" style={{ flex: 1, padding: '11px' }} onClick={() => { setEventStatus(selectedEvent.id, 'Rejected'); setSelectedEvent(null) }}>✕ Reject</button>
                <button className="prc-btn-amber" style={{ flex: 1, padding: '11px' }} onClick={() => { setSelectedEvent(null); setClarifyModal(selectedEvent); setClarifyNote('') }}>💬 Clarify</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clarification Modal */}
      {clarifyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,30,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }} onClick={() => setClarifyModal(null)}>
          <div className="prc-modal-enter" style={{ background: '#fff', borderRadius: '20px', padding: '28px', maxWidth: '420px', width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '17px', fontWeight: '700', color: C.dark, margin: '0 0 6px' }}>💬 Request Clarification</h3>
            <p style={{ fontSize: '13px', color: C.textMuted, margin: '0 0 18px' }}>For: <strong style={{ color: C.dark }}>{clarifyModal.name}</strong></p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#555' }}>Your Query / Note</label>
              <textarea className="prc-input" rows={4} style={{ resize: 'vertical', minHeight: '100px' }} placeholder="Describe what clarification is needed..." value={clarifyNote} onChange={e => setClarifyNote(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="prc-btn-primary" style={{ flex: 1, padding: '11px' }} onClick={() => { if (clarifyNote.trim()) { setEventStatus(clarifyModal.id, 'Clarification'); setClarifyModal(null); setClarifyNote('') } }}>Send Request</button>
              <button className="prc-btn-ghost" style={{ flex: 1, padding: '11px' }} onClick={() => setClarifyModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// 3. MAJOR EVENTS
// ─────────────────────────────────────────────
function MajorEventsSection({ eventStatuses }) {
  const majorEvents = MOCK_EVENTS.filter(e => e.major)
  const typeColors = {
    'Technical Festival': { color: C.blue, bg: '#eef1ff' },
    'Hackathon':          { color: '#8b5cf6', bg: '#f5f3ff' },
    'Cultural Festival':  { color: C.amber, bg: '#fffbeb' },
    'Inter-College Event':{ color: C.accent, bg: '#f0fdf4' },
  }

  return (
    <div className="prc-section-enter">
      <div style={{ marginBottom: '22px' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '700', color: C.dark, margin: '0 0 3px' }}>Major Events</h2>
        <p style={{ margin: 0, fontSize: '13px', color: C.textMuted }}>High-impact events requiring Principal oversight</p>
      </div>

      {/* Type legend */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }}>
        {Object.entries(typeColors).map(([type, { color, bg }]) => (
          <span key={type} style={{ fontSize: '12px', fontWeight: '600', padding: '5px 12px', borderRadius: '20px', background: bg, color, border: `1px solid ${color}33` }}>{type}</span>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '18px' }}>
        {majorEvents.map((e, i) => {
          const status = eventStatuses[e.id] || e.principalStatus
          const cfg = statusCfg[status] || statusCfg.Draft
          const tCfg = typeColors[e.type] || { color: C.accent, bg: '#f0fdf4' }
          return (
            <div key={e.id} className="prc-card-hover" style={{ background: '#fff', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 2px 14px rgba(0,0,0,0.07)', border: '1px solid #edf0f5', animation: `fadeSlideIn 0.4s ease ${i * 0.06}s both` }}>
              {/* Gradient header */}
              <div style={{ padding: '18px 20px', background: `linear-gradient(135deg, ${tCfg.bg}, #fff)`, borderBottom: '1px solid #f0f3f8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: tCfg.color, background: tCfg.bg, padding: '3px 8px', borderRadius: '6px', border: `1px solid ${tCfg.color}33` }}>{e.type}</span>
                  </div>
                  <StatusBadge status={status} />
                </div>
                <h3 style={{ margin: '8px 0 3px', fontFamily: 'Syne, sans-serif', fontSize: '17px', fontWeight: '800', color: C.dark }}>{e.name}</h3>
                <p style={{ margin: 0, fontSize: '12px', color: C.textMuted, fontWeight: '500' }}>by {e.club}</p>
              </div>

              <div style={{ padding: '16px 20px' }}>
                <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#7a8694', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{e.description}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                  {[['📅 Date', e.date], ['📍 Venue', e.venue], ['👥 Participants', e.participants.toString()], ['💰 Budget', `₹${e.budget.toLocaleString()}`]].map(([l, v]) => (
                    <div key={l} style={{ padding: '9px 12px', background: '#f7f9fc', borderRadius: '10px', border: '1px solid #edf0f5' }}>
                      <p style={{ margin: '0 0 2px', fontSize: '10px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase' }}>{l.split(' ').slice(1).join(' ')}</p>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: C.dark }}>{l.split(' ')[0]} {v}</p>
                    </div>
                  ))}
                </div>

                {/* Scale indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#fef9c3', borderRadius: '8px', border: '1px solid #fde68a44' }}>
                  <span style={{ fontSize: '14px' }}>🌟</span>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#a16207' }}>
                    High-Impact Event · {e.participants >= 300 ? 'Large Scale' : e.participants >= 150 ? 'Medium Scale' : 'Focused'} · ₹{(e.budget / 1000).toFixed(0)}k budget
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// 4. BUDGET OVERSIGHT
// ─────────────────────────────────────────────
function BudgetOversightSection({ eventStatuses }) {
  const totalRequested = MOCK_EVENTS.reduce((s, e) => s + e.budget, 0)
  const approvedEvents = MOCK_EVENTS.filter(e => (eventStatuses[e.id] || e.principalStatus) === 'Approved')
  const totalApproved = approvedEvents.reduce((s, e) => s + e.budget, 0)
  const pendingBudget = MOCK_EVENTS.filter(e => (eventStatuses[e.id] || e.principalStatus) === 'Pending').reduce((s, e) => s + e.budget, 0)
  const utilisationPct = Math.round((totalApproved / totalRequested) * 100)

  const monthlyBudget = [
    { month: 'Aug', amount: 45000 }, { month: 'Sep', amount: 72000 },
    { month: 'Oct', amount: 110000 }, { month: 'Nov', amount: 95000 },
    { month: 'Dec', amount: 60000 }, { month: 'Jan', amount: 88000 },
    { month: 'Feb', amount: 130000 }, { month: 'Mar', amount: 74000 },
  ]
  const maxMonthly = Math.max(...monthlyBudget.map(d => d.amount))

  const clubBudgets = [
    { club: 'Tech Club', budget: 45000, color: C.blue },
    { club: 'Cultural Club', budget: 60000, color: C.amber },
    { club: 'CS Club', budget: 75000, color: '#8b5cf6' },
    { club: 'Sports Club', budget: 35000, color: C.accent },
    { club: 'Arts Club', budget: 18000, color: '#ec4899' },
    { club: 'Photo Club', budget: 8000, color: '#f59e0b' },
  ]
  const maxClub = Math.max(...clubBudgets.map(d => d.budget))

  return (
    <div className="prc-section-enter">
      <div style={{ marginBottom: '22px' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '700', color: C.dark, margin: '0 0 3px' }}>Budget Oversight</h2>
        <p style={{ margin: 0, fontSize: '13px', color: C.textMuted }}>Financial overview of all event budget requests this semester</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Total Requested', value: `₹${(totalRequested / 1000).toFixed(0)}k`, icon: '📋', bg: '#eef1ff', color: C.blue },
          { label: 'Total Approved', value: `₹${(totalApproved / 1000).toFixed(0)}k`, icon: '✅', bg: '#f0fdf4', color: C.accent },
          { label: 'Pending Approval', value: `₹${(pendingBudget / 1000).toFixed(0)}k`, icon: '⏳', bg: '#fffbeb', color: C.amber },
          { label: 'Utilisation Rate', value: `${utilisationPct}%`, icon: '📊', bg: '#f5f3ff', color: '#8b5cf6' },
        ].map((s, i) => (
          <div key={s.label} style={{ background: '#fff', borderRadius: '16px', padding: '18px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.055)', border: '1px solid #edf0f5', animation: `fadeSlideIn 0.4s ease ${i * 0.06}s both` }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '12px' }}>{s.icon}</div>
            <p style={{ margin: '0 0 3px', fontSize: '24px', fontWeight: '800', color: C.dark, fontFamily: 'Syne, sans-serif' }}>{s.value}</p>
            <p style={{ margin: 0, fontSize: '12px', color: C.textMuted, fontWeight: '500' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Utilisation bar */}
      <div style={{ background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: '700', color: C.dark, margin: 0 }}>Budget Utilisation Overview</h3>
          <span style={{ fontSize: '13px', fontWeight: '700', color: C.accent }}>{utilisationPct}% approved</span>
        </div>
        <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' }}>
          <div style={{ height: '100%', width: `${utilisationPct}%`, background: `linear-gradient(90deg, ${C.accent}, ${C.accentDark})`, borderRadius: '10px', transition: 'width 1s cubic-bezier(0.22,1,0.36,1)' }} />
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          {[['✅ Approved', `₹${(totalApproved/1000).toFixed(0)}k`, C.accent], ['⏳ Pending', `₹${(pendingBudget/1000).toFixed(0)}k`, C.amber], ['❌ Rejected', `₹${((totalRequested - totalApproved - pendingBudget)/1000).toFixed(0)}k`, C.red]].map(([l, v, color]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: C.textMuted }}>{l}:</span>
              <span style={{ fontSize: '13px', fontWeight: '700', color }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Monthly budget bar chart */}
        <div style={{ background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: '700', color: C.dark, margin: '0 0 18px' }}>Monthly Budget Spending</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '130px' }}>
            {monthlyBudget.map(d => (
              <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: C.dark }}>{(d.amount/1000).toFixed(0)}k</span>
                <div style={{ width: '100%', background: `linear-gradient(180deg, ${C.accent}, ${C.accentDark})`, borderRadius: '5px 5px 0 0', height: `${(d.amount / maxMonthly) * 100}%`, minHeight: '4px' }} />
                <span style={{ fontSize: '9px', color: C.textMuted, fontWeight: '500' }}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget by event (top events) */}
        <div style={{ background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: '700', color: C.dark, margin: '0 0 18px' }}>Budget by Event</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {MOCK_EVENTS.sort((a, b) => b.budget - a.budget).slice(0, 5).map(e => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: C.dark, minWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</span>
                <div style={{ flex: 1, height: '8px', background: '#f1f5f9', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(e.budget / 75000) * 100}%`, background: `linear-gradient(90deg, ${C.blue}, ${C.purple})`, borderRadius: '8px' }} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: C.dark, minWidth: '40px', textAlign: 'right' }}>₹{(e.budget/1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Budget by club */}
      <div style={{ background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5' }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: '700', color: C.dark, margin: '0 0 18px' }}>Budget Allocation per Club</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {clubBudgets.map(c => (
            <div key={c.club} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: C.dark, minWidth: '120px' }}>{c.club}</span>
              <div style={{ flex: 1, height: '10px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(c.budget / maxClub) * 100}%`, background: `linear-gradient(90deg, ${c.color}, ${c.color}bb)`, borderRadius: '10px', transition: 'width 0.8s cubic-bezier(0.22,1,0.36,1)' }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: C.dark, minWidth: '50px', textAlign: 'right' }}>₹{(c.budget/1000).toFixed(0)}k</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// 5. ACADEMIC CALENDAR (view-only)
// ─────────────────────────────────────────────
function PrincipalCalendarSection({ eventStatuses }) {
  const [year, setYear] = useState(2026)
  const [month, setMonth] = useState(2)

  const blockedDates  = ['2026-03-14','2026-03-15','2026-03-28','2026-03-29']
  const examDates     = ['2026-03-20','2026-03-21','2026-03-22','2026-03-23','2026-03-24']
  const specialDates  = ['2026-03-08','2026-03-17']

  const approvedEventDates = MOCK_EVENTS
    .filter(e => (eventStatuses[e.id] || e.principalStatus) === 'Approved')
    .map(e => e.date)

  const fullMonthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const fmt = d => `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`

  const [selectedDay, setSelectedDay] = useState(null)

  return (
    <div className="prc-section-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '700', color: C.dark, margin: '0 0 3px' }}>Academic Calendar</h2>
          <p style={{ margin: 0, fontSize: '13px', color: C.textMuted }}>View-only · Managed by Admin</p>
        </div>
        {/* Read-only badge */}
        <span style={{ fontSize: '12px', fontWeight: '600', background: '#f1f5f9', color: '#475569', padding: '5px 12px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>👁 View Only</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
        {/* Calendar */}
        <div style={{ background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button onClick={() => { if (month === 0) { setMonth(11); setYear(y => y-1) } else setMonth(m => m-1) }} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px' }}>←</button>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: '700', color: C.dark }}>{fullMonthNames[month]} {year}</h3>
            <button onClick={() => { if (month === 11) { setMonth(0); setYear(y => y+1) } else setMonth(m => m+1) }} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px' }}>→</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px', marginBottom: '8px' }}>
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: '700', color: C.textMuted, padding: '6px 0', textTransform: 'uppercase' }}>{d}</div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px' }}>
            {Array.from({ length: firstDay }).map((_,i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_,i) => {
              const d = i + 1
              const dateStr = fmt(d)
              const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year
              const blocked = blockedDates.includes(dateStr)
              const exam = examDates.includes(dateStr)
              const special = specialDates.includes(dateStr)
              const hasEvent = approvedEventDates.includes(dateStr)
              const isSel = selectedDay === d

              return (
                <div key={d} onClick={() => setSelectedDay(isSel ? null : d)} style={{
                  aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                  position: 'relative', transition: 'all 0.18s ease',
                  background: isSel ? C.dark : blocked ? '#fee2e2' : exam ? '#fef9c3' : special ? '#f0f3ff' : hasEvent ? '#f0fdf4' : 'transparent',
                  color: isSel ? '#fff' : blocked ? C.red : exam ? '#a16207' : special ? C.blue : hasEvent ? C.accent : isToday ? C.blue : C.dark,
                  outline: isToday && !isSel ? `2px solid ${C.blue}` : 'none',
                  outlineOffset: '-2px',
                }}
                  onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = '#f1f5f9' }}
                  onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = blocked ? '#fee2e2' : exam ? '#fef9c3' : special ? '#f0f3ff' : hasEvent ? '#f0fdf4' : 'transparent' }}>
                  {d}
                  {(blocked || exam || special || hasEvent) && (
                    <span style={{ position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', borderRadius: '50%', background: blocked ? C.red : exam ? C.amber : special ? C.blue : C.accent }} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '14px', marginTop: '18px', flexWrap: 'wrap' }}>
            {[['#fee2e2', C.red, 'Blocked'], ['#fef9c3', C.amber, 'Exam Period'], ['#f0f3ff', C.blue, 'Special Event'], ['#f0fdf4', C.accent, 'Approved Event']].map(([bg, color, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: bg, border: `1px solid ${color}33` }} />
                <span style={{ fontSize: '11px', color: C.textMuted, fontWeight: '500' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { title: '🚫 Blocked Dates', dates: blockedDates, color: C.red, bg: '#fee2e2' },
            { title: '📝 Exam Periods', dates: examDates, color: C.amber, bg: '#fef9c3' },
            { title: '✅ Approved Events', dates: approvedEventDates, color: C.accent, bg: '#f0fdf4' },
          ].map(({ title, dates, color, bg }) => (
            <div key={title} style={{ background: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.055)', border: '1px solid #edf0f5' }}>
              <h4 style={{ fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: '700', color: C.dark, margin: '0 0 10px' }}>{title}</h4>
              {dates.length === 0 ? <p style={{ fontSize: '12px', color: C.textMuted, margin: 0 }}>None</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '120px', overflowY: 'auto' }}>
                  {dates.slice(0, 6).map(date => (
                    <div key={date} style={{ padding: '5px 9px', borderRadius: '7px', background: bg, border: `1px solid ${color}33` }}>
                      <span style={{ fontSize: '11px', fontWeight: '600', color }}>{date}</span>
                    </div>
                  ))}
                  {dates.length > 6 && <p style={{ fontSize: '11px', color: C.textMuted, margin: '4px 0 0' }}>+{dates.length - 6} more</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// 6. ANALYTICS
// ─────────────────────────────────────────────
function PrincipalAnalyticsSection({ eventStatuses }) {
  const monthlyData = [
    { month: 'Aug', events: 3 }, { month: 'Sep', events: 5 },
    { month: 'Oct', events: 8 }, { month: 'Nov', events: 7 },
    { month: 'Dec', events: 4 }, { month: 'Jan', events: 6 },
    { month: 'Feb', events: 9 }, { month: 'Mar', events: 5 },
  ]
  const maxEvents = Math.max(...monthlyData.map(d => d.events))

  const venueData = [
    { name: 'Hall A', usage: 85, color: C.blue },
    { name: 'Hall B', usage: 72, color: '#8b5cf6' },
    { name: 'Outdoor', usage: 60, color: C.accent },
    { name: 'Conference', usage: 45, color: C.amber },
    { name: 'Sports', usage: 78, color: C.red },
    { name: 'Gallery', usage: 30, color: '#ec4899' },
  ]

  const approved = MOCK_EVENTS.filter(e => (eventStatuses[e.id] || e.principalStatus) === 'Approved').length
  const total = MOCK_EVENTS.length
  const approvalRate = Math.round((approved / total) * 100)

  const kpis = [
    { label: 'Total Events Conducted', value: '47', icon: '🎪', color: C.blue, change: '+12%' },
    { label: 'Avg Approval Time', value: '3.8 days', icon: '⏱️', color: C.accent, change: '-1 day' },
    { label: 'Final Approval Rate', value: `${approvalRate}%`, icon: '✅', color: '#8b5cf6', change: `${approved}/${total}` },
    { label: 'Venue Utilisation', value: '67%', icon: '🏛', color: C.amber, change: '+12%' },
  ]

  return (
    <div className="prc-section-enter">
      <div style={{ marginBottom: '22px' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '700', color: C.dark, margin: '0 0 3px' }}>Analytics</h2>
        <p style={{ margin: 0, fontSize: '13px', color: C.textMuted }}>High-level insights · Academic Year 2025–26</p>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '14px', marginBottom: '24px' }}>
        {kpis.map((k, i) => (
          <div key={k.label} style={{ background: '#fff', borderRadius: '16px', padding: '18px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.055)', border: '1px solid #edf0f5', animation: `fadeSlideIn 0.4s ease ${i * 0.06}s both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: k.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{k.icon}</div>
              <span style={{ fontSize: '11px', fontWeight: '600', color: C.accent, background: '#f0fdf4', padding: '2px 7px', borderRadius: '7px' }}>{k.change}</span>
            </div>
            <p style={{ margin: '0 0 3px', fontSize: '26px', fontWeight: '800', color: C.dark, fontFamily: 'Syne, sans-serif' }}>{k.value}</p>
            <p style={{ margin: 0, fontSize: '12px', color: C.textMuted, fontWeight: '500' }}>{k.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Events per month */}
        <div style={{ background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: '700', color: C.dark, margin: '0 0 18px' }}>Events Per Month</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '130px' }}>
            {monthlyData.map(d => (
              <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: C.dark }}>{d.events}</span>
                <div style={{ width: '100%', background: `linear-gradient(180deg, ${C.accent}, ${C.accentDark})`, borderRadius: '5px 5px 0 0', height: `${(d.events / maxEvents) * 100}%`, minHeight: '4px' }} />
                <span style={{ fontSize: '9px', color: C.textMuted, fontWeight: '500' }}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Approval funnel */}
        <div style={{ background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: '700', color: C.dark, margin: '0 0 18px' }}>Event Status Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Approved', 'Pending', 'Rejected', 'Clarification'].map(s => {
              const count = MOCK_EVENTS.filter(e => (eventStatuses[e.id] || e.principalStatus) === s).length
              const pct = Math.round((count / MOCK_EVENTS.length) * 100)
              const cfg = statusCfg[s]
              return (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: C.dark, minWidth: '100px' }}>{s}</span>
                  <div style={{ flex: 1, height: '10px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: cfg.dot, borderRadius: '10px', transition: 'width 0.8s ease' }} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: cfg.color, minWidth: '30px', textAlign: 'right' }}>{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Venue utilisation */}
      <div style={{ background: '#fff', borderRadius: '18px', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #edf0f5' }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: '700', color: C.dark, margin: '0 0 18px' }}>Venue Utilisation Rate</h3>
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
// 7. NOTIFICATIONS
// ─────────────────────────────────────────────
function PrincipalNotificationsSection() {
  const [filter, setFilter] = useState('All')
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'approval', title: 'Event Awaiting Final Approval', body: 'Annual Tech Fest has been fully approved by Admin and is awaiting your final sign-off.', time: '1 hour ago', read: false, from: 'Admin Office' },
    { id: 2, type: 'major', title: 'Major Event Scheduled', body: 'National Hackathon (₹75,000 budget) is scheduled for May 1. Review required.', time: '3 hours ago', read: false, from: 'CS Club' },
    { id: 3, type: 'escalation', title: 'Admin Escalation', body: 'Cultural Fest budget of ₹60,000 has been escalated for Principal review.', time: '5 hours ago', read: true, from: 'Admin Office' },
    { id: 4, type: 'approval', title: 'Startup Summit Awaiting Approval', body: 'Startup Summit cleared by Admin and is pending your approval.', time: '6 hours ago', read: false, from: 'Entrepreneurship Club' },
    { id: 5, type: 'budget', title: 'Budget Clarification Requested', body: 'Inter-College Cricket budget requires Principal clarification before proceeding.', time: '1 day ago', read: true, from: 'Sports Club' },
    { id: 6, type: 'major', title: 'Inter-College Event Registered', body: 'Sports Club has registered an inter-college cricket tournament with 8 institutions.', time: '1 day ago', read: true, from: 'Sports Club' },
  ])

  const typeCfg = {
    approval:   { icon: '🎓', color: C.accent,   bg: '#f0fdf4', label: 'APPROVAL' },
    major:      { icon: '🌟', color: C.amber,     bg: '#fffbeb', label: 'MAJOR EVENT' },
    escalation: { icon: '⬆️', color: C.red,       bg: '#fee2e2', label: 'ESCALATION' },
    budget:     { icon: '💰', color: '#8b5cf6',   bg: '#f5f3ff', label: 'BUDGET' },
  }

  const filterTabs = ['All', 'Unread', 'Approvals', 'Major', 'Budget']
  const filtered = notifications.filter(n => {
    if (filter === 'All') return true
    if (filter === 'Unread') return !n.read
    if (filter === 'Approvals') return n.type === 'approval' || n.type === 'escalation'
    if (filter === 'Major') return n.type === 'major'
    if (filter === 'Budget') return n.type === 'budget'
    return true
  })

  const markRead = id => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n))
  const markAllRead = () => setNotifications(p => p.map(n => ({ ...n, read: true })))
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="prc-section-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '700', color: C.dark, margin: '0 0 3px' }}>Notifications</h2>
          <p style={{ margin: 0, fontSize: '13px', color: C.textMuted }}>{unreadCount} unread · {notifications.length} total</p>
        </div>
        {unreadCount > 0 && <button className="prc-btn-ghost" style={{ padding: '8px 14px', fontSize: '12px' }} onClick={markAllRead}>✓ Mark all read</button>}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', background: '#f1f4f9', borderRadius: '12px', padding: '5px 6px', width: 'fit-content' }}>
        {filterTabs.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', fontFamily: 'DM Sans, sans-serif', background: filter === f ? C.dark : 'transparent', color: filter === f ? '#fff' : '#5a6473', transition: 'all 0.2s' }}>
            {f}
            {f === 'Unread' && unreadCount > 0 && <span style={{ marginLeft: '5px', background: C.red, color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '700' }}>{unreadCount}</span>}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map((n, i) => {
          const cfg = typeCfg[n.type] || typeCfg.approval
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: C.dark }}>{n.title}</span>
                    <span style={{ fontSize: '9px', fontWeight: '800', padding: '2px 7px', borderRadius: '6px', background: cfg.bg, color: cfg.color, letterSpacing: '0.5px' }}>{cfg.label}</span>
                    {!n.read && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: cfg.color, boxShadow: `0 0 0 3px ${cfg.color}33`, flexShrink: 0 }} />}
                  </div>
                  <span style={{ fontSize: '11px', color: C.textMuted, whiteSpace: 'nowrap', marginLeft: '8px' }}>{n.time}</span>
                </div>
                <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#5a6473', lineHeight: '1.5' }}>{n.body}</p>
                <span style={{ fontSize: '11px', color: C.textMuted, fontWeight: '500' }}>From: {n.from}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// 8. SETTINGS
// ─────────────────────────────────────────────
function PrincipalSettingsSection() {
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState({ name: 'Dr. K. Rajasekar', email: 'principal@clubos.edu', phone: '+91 94000 12345', designation: 'Principal' })
  const [notifPrefs, setNotifPrefs] = useState({ finalApprovals: true, majorEvents: true, budgetAlerts: true, escalations: true, weeklyDigest: false })
  const [appearance, setAppearance] = useState({ fontSize: 'medium', compactMode: false })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'help', label: 'Help & Support', icon: '❓' },
  ]

  const Toggle = ({ on, toggle }) => (
    <button onClick={toggle} style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer', position: 'relative', background: on ? C.accent : '#d1d9e0', transition: 'background 0.28s ease', flexShrink: 0 }}>
      <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: on ? '23px' : '3px', transition: 'left 0.28s cubic-bezier(0.22,1,0.36,1)', boxShadow: '0 1px 4px rgba(0,0,0,0.18)' }} />
    </button>
  )

  return (
    <div className="prc-section-enter" style={{ maxWidth: '780px' }}>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '700', color: C.dark, margin: '0 0 22px' }}>Settings</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Tab nav */}
        <div style={{ width: '180px', flexShrink: 0 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.055)', border: '1px solid #edf0f5' }}>
            {tabs.map(tab => (
              <div key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === tab.id ? '700' : '500', color: activeTab === tab.id ? C.accent : C.dark, background: activeTab === tab.id ? '#f0fdf4' : 'transparent', transition: 'all 0.18s' }}>
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
              {[['name', 'Full Name'], ['email', 'Email Address'], ['phone', 'Phone Number'], ['designation', 'Designation']].map(([k, l]) => (
                <div key={k} style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#555' }}>{l}</label>
                  <input className="prc-input" value={profile[k]} onChange={e => setProfile(p => ({ ...p, [k]: e.target.value }))} />
                </div>
              ))}
              <button className="prc-btn-primary" style={{ marginTop: '4px', padding: '10px 22px' }} onClick={() => alert('Profile saved!')}>Save Changes</button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '700', color: C.dark, margin: '0 0 18px' }}>Notification Preferences</h3>
              {[
                ['finalApprovals', '🎓 Final Approval Requests', 'Notify when events need your final approval'],
                ['majorEvents', '🌟 Major Events', 'Notify when high-impact events are submitted'],
                ['budgetAlerts', '💰 Budget Alerts', 'Notify when large budgets require sign-off'],
                ['escalations', '⬆️ Admin Escalations', 'Notify when Admin escalates a request'],
                ['weeklyDigest', '📋 Weekly Digest', 'Receive a weekly summary of all events'],
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
                    <button key={s} onClick={() => setAppearance(p => ({ ...p, fontSize: s }))} style={{ padding: '7px 16px', borderRadius: '10px', border: `1.5px solid ${appearance.fontSize === s ? C.accent : '#e2e8f0'}`, background: appearance.fontSize === s ? '#f0fdf4' : '#f8f9fc', color: appearance.fontSize === s ? C.accent : C.dark, fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', textTransform: 'capitalize' }}>{s}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0' }}>
                <div><p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '600', color: C.dark }}>⊟ Compact Mode</p><p style={{ margin: 0, fontSize: '12px', color: C.textMuted }}>Reduce spacing for denser information display</p></div>
                <Toggle on={appearance.compactMode} toggle={() => setAppearance(p => ({ ...p, compactMode: !p.compactMode }))} />
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '700', color: C.dark, margin: '0 0 18px' }}>Help & Support</h3>
              {[['📖 Principal User Guide', 'How to use the Principal dashboard effectively'], ['🐛 Report an Issue', 'Flag a problem to the ClubOS technical team'], ['📞 Contact Admin', 'Reach the Admin office for system queries']].map(([l, h]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f0f3f8' }}>
                  <div><p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '600', color: C.dark }}>{l}</p><p style={{ margin: 0, fontSize: '12px', color: C.textMuted }}>{h}</p></div>
                  <button className="prc-btn-ghost" style={{ padding: '7px 14px', fontSize: '12px' }} onClick={() => alert(`${l} — coming soon`)}>Open</button>
                </div>
              ))}
              <div style={{ marginTop: '20px', padding: '16px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #86efac33' }}>
                <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '700', color: C.accent }}>ℹ️ ClubOS Principal Portal</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#065f46', lineHeight: '1.55' }}>Version 2.0 · For support contact support@clubos.edu</p>
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
function PrincipalLogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="prc-section-enter" style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,30,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
      <div className="prc-modal-enter" style={{ background: '#fff', borderRadius: '20px', padding: '32px', maxWidth: '360px', width: '90%', textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
        <span style={{ fontSize: '44px', display: 'block', marginBottom: '14px' }}>👋</span>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '800', color: C.dark, margin: '0 0 10px' }}>Leaving so soon?</h2>
        <p style={{ color: C.textMuted, fontSize: '14px', marginBottom: '24px' }}>Are you sure you want to logout from the Principal portal?</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="prc-btn-ghost" style={{ flex: 1, padding: '12px' }} onClick={onCancel}>Cancel</button>
          <button style={{ flex: 1, padding: '12px', background: C.red, color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontFamily: 'DM Sans, sans-serif' }} onClick={onConfirm}>Logout</button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN PRINCIPAL DASHBOARD
// ─────────────────────────────────────────────
function PrincipalDashboard({ principal, onLogout }) {
  const navigate = useNavigate()
  const [active, setActive] = useState('dashboard')
  const [showLogout, setShowLogout] = useState(false)

  // Shared event status state lifted to root so sections stay in sync
  const [eventStatuses, setEventStatuses] = useState({})
  const setEventStatus = (id, status) => setEventStatuses(prev => ({ ...prev, [id]: status }))

  const unreadCount = 3

  const handleSection = sec => {
    if (sec === 'logout') { setShowLogout(true); return }
    setActive(sec)
  }

  const sectionMap = {
    dashboard:     <PrincipalDashboardSection onNavigate={handleSection} eventStatuses={eventStatuses} />,
    approvals:     <FinalApprovalsSection eventStatuses={eventStatuses} setEventStatus={setEventStatus} />,
    'major-events':<MajorEventsSection eventStatuses={eventStatuses} />,
    budget:        <BudgetOversightSection eventStatuses={eventStatuses} />,
    calendar:      <PrincipalCalendarSection eventStatuses={eventStatuses} />,
    analytics:     <PrincipalAnalyticsSection eventStatuses={eventStatuses} />,
    notifications: <PrincipalNotificationsSection />,
    settings:      <PrincipalSettingsSection />,
  }

  return (
    <>
      <PrincipalStyleInjector />
      <div style={{ display: 'flex', height: '100vh', fontFamily: 'DM Sans, sans-serif', background: C.bg }}>
        <PrincipalSidebar selected={active} onSelect={handleSection} unreadCount={unreadCount} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <PrincipalNavbar principal={principal} onSectionChange={handleSection} />
          <div key={active} className="prc-section-enter" style={{ flex: 1, overflowY: 'auto', padding: '26px 28px' }}>
            {sectionMap[active] || sectionMap.dashboard}
          </div>
        </div>
        {showLogout && <PrincipalLogoutModal onConfirm={() => { setShowLogout(false); onLogout?.(); navigate('/') }} onCancel={() => setShowLogout(false)} />}
      </div>
    </>
  )
}

export default PrincipalDashboard