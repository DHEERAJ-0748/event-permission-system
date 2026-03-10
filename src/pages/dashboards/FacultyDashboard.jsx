import React, { useState } from 'react'

// ─── Icons (inline SVG to avoid dependencies) ────────────────────────────────
const Icon = ({ d, size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const icons = {
  events:   "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  requests: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  venues:   "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  stats:    "M18 20V10M12 20V4M6 20v-6",
  settings: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  bell:     "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  search:   "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
  check:    "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0",
  x:        "M6 18L18 6M6 6l12 12",
  clock:    "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0",
  users:    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  alert:    "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
}

// ─── Color palette ────────────────────────────────────────────────────────────
const C = {
  bg:         '#F0F2F5',
  sidebar:    '#1A2332',
  sidebarHov: '#243044',
  accent:     '#4F8EF7',
  accentDark: '#2D6FD4',
  text:       '#1A2332',
  muted:      '#7A869A',
  white:      '#FFFFFF',
  border:     '#E4E8EF',
  green:      '#22C55E',
  yellow:     '#F59E0B',
  red:        '#EF4444',
  purple:     '#8B5CF6',
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_EVENTS = [
  { id:1, name:'TechFest 2026',      club:'Tech Club',     date:'Mar 15',  venue:'Hall A',           status:'approved',   participants:320, budget:'₹50,000' },
  { id:2, name:'Spring Cultural',    club:'Cultural Club', date:'Mar 22',  venue:'Outdoor Grounds',  status:'pending',    participants:250, budget:'₹40,000' },
  { id:3, name:'Hackathon 3.0',      club:'Coding Club',   date:'Apr 2',   venue:'Hall B',           status:'rejected',   participants:180, budget:'₹35,000' },
  { id:4, name:'Art Exhibition',     club:'Arts Club',     date:'Apr 10',  venue:'Conference Room',  status:'approved',   participants:200, budget:'₹28,000' },
  { id:5, name:'Debate Finals',      club:'Debate Club',   date:'Apr 18',  venue:'Hall A',           status:'pending',    participants:150, budget:'₹15,000' },
  { id:6, name:'Sports Day',         club:'Sports Club',   date:'Apr 25',  venue:'Outdoor Grounds',  status:'approved',   participants:500, budget:'₹60,000' },
]

const MOCK_REQUESTS = [
  { id:1, eventName:'Spring Cultural',  club:'Cultural Club', budget:'₹40,000', submitted:'Mar 1', stage:'faculty',   status:'Under Review',  reason:'' },
  { id:2, eventName:'Hackathon 3.0',    club:'Coding Club',   budget:'₹35,000', submitted:'Feb 25',stage:'admin',    status:'Pending Admin', reason:'' },
  { id:3, eventName:'Photography Expo', club:'Arts Club',     budget:'₹20,000', submitted:'Feb 18',stage:'principal',status:'Approved',      reason:'' },
  { id:4, eventName:'Music Night',      club:'Cultural Club', budget:'₹30,000', submitted:'Feb 10',stage:'faculty',  status:'Rejected',      reason:'Insufficient safety plan provided.' },
  { id:5, eventName:'Debate Finals',    club:'Debate Club',   budget:'₹15,000', submitted:'Mar 5', stage:'faculty',  status:'Under Review',  reason:'' },
]

const MOCK_NOTIFICATIONS = [
  { id:1, type:'request',  title:'New Event Request',        message:'Cultural Club submitted "Spring Cultural" for approval.',   time:'5 min ago',  read:false },
  { id:2, type:'approved', title:'Event Approved by Admin',  message:'TechFest 2026 has been approved by Admin.',                time:'2 hrs ago',  read:false },
  { id:3, type:'alert',    title:'Budget Clarification',     message:'Coding Club needs to clarify budget for Hackathon 3.0.',   time:'1 day ago',  read:false },
  { id:4, type:'request',  title:'New Event Request',        message:'Debate Club submitted "Debate Finals" for review.',        time:'2 days ago', read:true  },
  { id:5, type:'alert',    title:'Deadline Reminder',        message:'3 events pending your review — deadline is tomorrow.',     time:'3 days ago', read:true  },
]

const MOCK_VENUES = [
  { id:1, name:'Hall A',           type:'Main Auditorium',  icon:'🎭', capacity:500,  status:'booked',    nextEvent:'TechFest 2026 – Mar 15'    },
  { id:2, name:'Hall B',           type:'Seminar Room',     icon:'📚', capacity:200,  status:'available', nextEvent:'Hackathon 3.0 – Apr 2'     },
  { id:3, name:'Conference Room',  type:'Meeting Space',    icon:'💼', capacity:50,   status:'pending',   nextEvent:'Art Exhibition – Apr 10'   },
  { id:4, name:'Outdoor Grounds',  type:'Open Field',       icon:'🌳', capacity:1000, status:'booked',    nextEvent:'Sports Day – Apr 25'       },
]

const STAGE_ORDER = ['submitted','faculty','admin','principal']

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusColors = {
  approved:      { bg:'#DCFCE7', text:'#16A34A', dot:'#22C55E' },
  pending:       { bg:'#FEF3C7', text:'#B45309', dot:'#F59E0B' },
  rejected:      { bg:'#FEE2E2', text:'#B91C1C', dot:'#EF4444' },
  'Under Review':{ bg:'#FEF3C7', text:'#B45309', dot:'#F59E0B' },
  'Approved':    { bg:'#DCFCE7', text:'#16A34A', dot:'#22C55E' },
  'Rejected':    { bg:'#FEE2E2', text:'#B91C1C', dot:'#EF4444' },
  'Pending Admin':{ bg:'#EDE9FE', text:'#6D28D9', dot:'#8B5CF6' },
  booked:        { bg:'#FEE2E2', text:'#B91C1C', dot:'#EF4444' },
  available:     { bg:'#DCFCE7', text:'#16A34A', dot:'#22C55E' },
  request:       { bg:'#EFF6FF', text:'#1D4ED8', dot:'#4F8EF7' },
  alert:         { bg:'#FFF7ED', text:'#C2410C', dot:'#F97316' },
}

function Badge({ status }) {
  const s = statusColors[status] || { bg:'#F3F4F6', text:'#374151', dot:'#9CA3AF' }
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:600,
      background:s.bg, color:s.text
    }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:s.dot, flexShrink:0 }} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ active, onSelect }) {
  const items = [
    { id:'events',    label:'Events',    icon:icons.events   },
    { id:'requests',  label:'Requests',  icon:icons.requests },
    { id:'calendar',  label:'Calendar',  icon:icons.calendar },
    { id:'venues',    label:'Venues',    icon:icons.venues   },
    { id:'statistics',label:'Statistics',icon:icons.stats    },
  ]

  const Item = ({ id, label, icon, bottom }) => {
    const isActive = active === id
    return (
      <div
        onClick={() => onSelect(id)}
        style={{
          display:'flex', alignItems:'center', gap:12,
          padding:'11px 20px', margin:'2px 10px', borderRadius:8,
          cursor:'pointer', transition:'all .2s',
          background: isActive ? C.accent : 'transparent',
          color: isActive ? C.white : '#9BAECC',
          fontWeight: isActive ? 600 : 400,
          fontSize:14,
        }}
        onMouseEnter={e => { if(!isActive) e.currentTarget.style.background = C.sidebarHov; e.currentTarget.style.color = C.white }}
        onMouseLeave={e => { if(!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9BAECC' } }}
      >
        <Icon d={icon} size={16} color={isActive ? C.white : '#9BAECC'} />
        {label}
      </div>
    )
  }

  return (
    <div style={{
      width:220, minHeight:'100vh', background:C.sidebar,
      display:'flex', flexDirection:'column', justifyContent:'space-between',
      padding:'0 0 20px 0', flexShrink:0,
    }}>
      {/* Logo */}
      <div>
        <div style={{ padding:'24px 20px 20px', borderBottom:`1px solid #243044` }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{
              width:34, height:34, borderRadius:9, background:C.accent,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:16, fontWeight:800, color:'#fff'
            }}>F</div>
            <div>
              <div style={{ color:'#fff', fontWeight:700, fontSize:14, lineHeight:1.2 }}>Faculty</div>
              <div style={{ color:'#9BAECC', fontSize:11 }}>Dashboard</div>
            </div>
          </div>
        </div>
        <div style={{ paddingTop:10 }}>
          {items.map(i => <Item key={i.id} {...i} />)}
        </div>
      </div>
      <Item id="settings" label="Settings" icon={icons.settings} />
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ user, unreadCount, onNotificationClick }) {
  const [showMenu, setShowMenu] = useState(false)
  const initials = user?.email ? user.email.slice(0,2).toUpperCase() : 'FA'

  return (
    <div style={{
      height:60, background:C.white, display:'flex', alignItems:'center',
      padding:'0 24px', justifyContent:'space-between',
      borderBottom:`1px solid ${C.border}`, flexShrink:0,
    }}>
      {/* Search */}
      <div style={{ position:'relative', maxWidth:360, flex:1 }}>
        <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:C.muted, pointerEvents:'none' }}>
          <Icon d={icons.search} size={15} />
        </span>
        <input placeholder="Search events, clubs, requests…" style={{
          width:'100%', padding:'8px 12px 8px 34px', borderRadius:8,
          border:`1.5px solid ${C.border}`, outline:'none', fontSize:13,
          color:C.text, background:'#F8FAFC', boxSizing:'border-box',
          transition:'border-color .2s',
        }}
          onFocus={e => e.target.style.borderColor = C.accent}
          onBlur={e => e.target.style.borderColor = C.border}
        />
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        {/* Bell */}
        <div style={{ position:'relative', cursor:'pointer' }} onClick={onNotificationClick}>
          <div style={{
            width:36, height:36, borderRadius:8, border:`1.5px solid ${C.border}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            transition:'background .2s', color:C.muted,
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#F0F2F5'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Icon d={icons.bell} size={17} />
          </div>
          {unreadCount > 0 && (
            <div style={{
              position:'absolute', top:-4, right:-4,
              background:C.red, color:'#fff', borderRadius:'50%',
              width:18, height:18, display:'flex', alignItems:'center',
              justifyContent:'center', fontSize:10, fontWeight:700,
              border:'2px solid #fff',
            }}>{unreadCount}</div>
          )}
        </div>

        {/* Avatar */}
        <div style={{ position:'relative' }}>
          <div
            onClick={() => setShowMenu(p => !p)}
            style={{
              width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg, ${C.accent}, ${C.purple})`,
              color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:700, fontSize:13, cursor:'pointer', userSelect:'none',
              boxShadow:'0 2px 8px rgba(79,142,247,.35)',
            }}
          >{initials}</div>
          {showMenu && (
            <div style={{
              position:'absolute', right:0, top:44, background:C.white,
              boxShadow:'0 8px 24px rgba(0,0,0,.12)', borderRadius:10,
              overflow:'hidden', zIndex:100, minWidth:160,
              border:`1px solid ${C.border}`,
            }}>
              {['View Profile','Settings','Logout'].map(opt => (
                <div key={opt} onClick={() => setShowMenu(false)} style={{
                  padding:'10px 16px', fontSize:13, cursor:'pointer',
                  color:opt==='Logout'?C.red:C.text, fontWeight:opt==='Logout'?600:400,
                  transition:'background .15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >{opt}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, icon }) {
  return (
    <div style={{
      background:C.white, borderRadius:12, padding:'20px 22px',
      boxShadow:'0 1px 4px rgba(0,0,0,.06)', border:`1px solid ${C.border}`,
      display:'flex', alignItems:'center', gap:16,
    }}>
      <div style={{
        width:46, height:46, borderRadius:12, background:color+'1A',
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize:22, fontWeight:700, color:C.text, lineHeight:1 }}>{value}</div>
        <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>{label}</div>
        {sub && <div style={{ fontSize:11, color:color, fontWeight:600, marginTop:2 }}>{sub}</div>}
      </div>
    </div>
  )
}

// ─── EVENTS PAGE ──────────────────────────────────────────────────────────────
function EventsPage() {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = filter === 'all' ? MOCK_EVENTS : MOCK_EVENTS.filter(e => e.status === filter)

  return (
    <div>
      <h1 style={{ fontSize:24, fontWeight:700, color:C.text, margin:'0 0 6px' }}>Events</h1>
      <p style={{ color:C.muted, fontSize:13, margin:'0 0 24px' }}>All club events this semester</p>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:16, marginBottom:28 }}>
        <StatCard label="Total Events" value={MOCK_EVENTS.length} icon="📋" color={C.accent} sub="+3 this month" />
        <StatCard label="Approved"     value={MOCK_EVENTS.filter(e=>e.status==='approved').length} icon="✅" color={C.green} />
        <StatCard label="Pending"      value={MOCK_EVENTS.filter(e=>e.status==='pending').length}  icon="⏳" color={C.yellow} sub="Awaiting review" />
        <StatCard label="Rejected"     value={MOCK_EVENTS.filter(e=>e.status==='rejected').length} icon="❌" color={C.red} />
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:18 }}>
        {['all','approved','pending','rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:'6px 16px', borderRadius:20, border:'none', cursor:'pointer',
            fontSize:12, fontWeight:600, transition:'all .2s',
            background: filter===f ? C.accent : C.white,
            color: filter===f ? '#fff' : C.muted,
            boxShadow: filter===f ? `0 2px 8px ${C.accent}55` : 'none',
            border: filter===f ? 'none' : `1px solid ${C.border}`,
          }}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background:C.white, borderRadius:12, border:`1px solid ${C.border}`, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ background:'#F8FAFC', borderBottom:`1px solid ${C.border}` }}>
              {['Event Name','Club','Date','Venue','Participants','Budget','Status'].map(h => (
                <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontWeight:600, color:C.muted, fontSize:11, textTransform:'uppercase', letterSpacing:.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((ev, i) => (
              <tr key={ev.id}
                onClick={() => setSelected(ev)}
                style={{
                  borderBottom: i < filtered.length-1 ? `1px solid ${C.border}` : 'none',
                  cursor:'pointer', transition:'background .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding:'13px 16px', fontWeight:600, color:C.text }}>{ev.name}</td>
                <td style={{ padding:'13px 16px', color:C.muted }}>{ev.club}</td>
                <td style={{ padding:'13px 16px', color:C.muted }}>{ev.date}</td>
                <td style={{ padding:'13px 16px', color:C.muted }}>{ev.venue}</td>
                <td style={{ padding:'13px 16px', color:C.muted }}>{ev.participants}</td>
                <td style={{ padding:'13px 16px', color:C.muted }}>{ev.budget}</td>
                <td style={{ padding:'13px 16px' }}><Badge status={ev.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,.45)',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex:200,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background:C.white, borderRadius:16, padding:32, width:'90%', maxWidth:480,
            boxShadow:'0 20px 60px rgba(0,0,0,.2)',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h2 style={{ margin:0, fontSize:20, fontWeight:700, color:C.text }}>{selected.name}</h2>
              <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted }}>
                <Icon d={icons.x} size={20} />
              </button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
              {[
                ['Club',         selected.club],
                ['Date',         selected.date],
                ['Venue',        selected.venue],
                ['Participants', selected.participants],
                ['Budget',       selected.budget],
              ].map(([label, val]) => (
                <div key={label} style={{ background:'#F8FAFC', borderRadius:8, padding:'12px 14px' }}>
                  <div style={{ fontSize:11, color:C.muted, fontWeight:600, marginBottom:4, textTransform:'uppercase' }}>{label}</div>
                  <div style={{ fontSize:15, fontWeight:600, color:C.text }}>{val}</div>
                </div>
              ))}
              <div style={{ background:'#F8FAFC', borderRadius:8, padding:'12px 14px' }}>
                <div style={{ fontSize:11, color:C.muted, fontWeight:600, marginBottom:6, textTransform:'uppercase' }}>Status</div>
                <Badge status={selected.status} />
              </div>
            </div>
            <button onClick={() => setSelected(null)} style={{
              width:'100%', padding:12, background:C.accent, color:'#fff',
              border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontSize:14,
            }}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── REQUESTS PAGE ────────────────────────────────────────────────────────────
function RequestsPage() {
  const [requests, setRequests] = useState(MOCK_REQUESTS)
  const [modal, setModal] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const handleAction = (id, action) => {
    setRequests(prev => prev.map(r => {
      if (r.id !== id) return r
      
      if (action === 'approve') {
        const currentIdx = STAGE_ORDER.indexOf(r.stage)
        const nextIdx = currentIdx + 1
        
        // If this is the last stage, mark as fully Approved; otherwise move to next stage
        if (nextIdx >= STAGE_ORDER.length) {
          return { ...r, status: 'Approved' }
        } else {
          const nextStage = STAGE_ORDER[nextIdx]
          const nextStatus = nextStage === 'principal' ? 'Approved' : nextStage === 'admin' ? 'Pending Admin' : 'Under Review'
          return { ...r, stage: nextStage, status: nextStatus }
        }
      } else {
        // Reject
        return { ...r, status: 'Rejected', reason: rejectReason }
      }
    }))
    setRejectReason('')
    setModal(null)
  }

  const getStageState = (stage, current, status) => {
    const idx = STAGE_ORDER.indexOf(stage), curIdx = STAGE_ORDER.indexOf(current)
    if (idx < curIdx) return 'completed'
    if (idx === curIdx) return 'current'
    return 'pending'
  }

  return (
    <div>
      <h1 style={{ fontSize:24, fontWeight:700, color:C.text, margin:'0 0 6px' }}>Requests</h1>
      <p style={{ color:C.muted, fontSize:13, margin:'0 0 24px' }}>Review and approve event requests from clubs</p>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {requests.map(req => (
          <div key={req.id} style={{
            background:C.white, borderRadius:12, padding:'20px 22px',
            boxShadow:'0 1px 4px rgba(0,0,0,.06)', border:`1px solid ${C.border}`,
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:15, color:C.text }}>{req.eventName}</div>
                <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>{req.club} · Submitted {req.submitted}</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontWeight:700, color:C.accent, fontSize:14 }}>{req.budget}</span>
                <Badge status={req.status} />
              </div>
            </div>

            {/* Stage progress */}
            <div style={{ display:'flex', alignItems:'center', marginBottom:16, gap:0 }}>
              {STAGE_ORDER.map((stage, idx) => {
                const state = getStageState(stage, req.stage, req.status)
                const col = state === 'completed' ? C.green : C.accent
                return (
                  <React.Fragment key={stage}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                      <div style={{
                        width:22, height:22, borderRadius:'50%', background:col,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        boxShadow: state==='current' ? `0 0 0 3px ${C.accent}33` : 'none',
                        transition:'all .3s',
                      }}>
                        {state === 'completed' && <Icon d={icons.check} size={11} color="#fff" />}
                      </div>
                      <div style={{ fontSize:10, color: state === 'pending' ? C.accent : state === 'completed' ? C.green : C.text, fontWeight: state==='current'?700:400, textTransform:'capitalize' }}>{stage}</div>
                    </div>
                    {idx < STAGE_ORDER.length-1 && (
                      <div style={{ flex:1, height:2, background: getStageState(STAGE_ORDER[idx+1], req.stage, req.status)==='pending' ? C.accent : C.green, margin:'0 4px', marginBottom:18, transition:'background .3s' }} />
                    )}
                  </React.Fragment>
                )
              })}
            </div>

            {req.status === 'Rejected' && req.reason && (
              <div style={{ background:'#FEF2F2', borderLeft:`3px solid ${C.red}`, borderRadius:6, padding:'8px 12px', fontSize:12, color:'#B91C1C', marginBottom:12 }}>
                Rejection reason: {req.reason}
              </div>
            )}

            {req.stage === 'faculty' && req.status === 'Under Review' ? (
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => handleAction(req.id, 'approve')} style={{
                  padding:'7px 18px', background:C.green, color:'#fff', border:'none',
                  borderRadius:7, fontWeight:600, fontSize:13, cursor:'pointer', transition:'opacity .2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity='.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity='1'}
                >✓ Approve</button>
                <button onClick={() => setModal(req)} style={{
                  padding:'7px 18px', background:C.red, color:'#fff', border:'none',
                  borderRadius:7, fontWeight:600, fontSize:13, cursor:'pointer', transition:'opacity .2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity='.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity='1'}
                >✕ Reject</button>
              </div>
            ) : (
              req.stage !== 'submitted' && (
                <div style={{ 
                  padding:'10px 14px', background:'#F0F9FF', borderLeft:`3px solid ${C.accent}`, 
                  borderRadius:6, fontSize:13, color:C.accent, fontWeight:600 
                }}>
                  Pending {req.stage.charAt(0).toUpperCase() + req.stage.slice(1)} Review
                </div>
              )
            )}
          </div>
        ))}
      </div>

      {/* Reject modal */}
      {modal && (
        <div onClick={() => setModal(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }}>
          <div onClick={e => e.stopPropagation()} style={{ background:C.white, borderRadius:16, padding:32, width:'90%', maxWidth:420 }}>
            <h3 style={{ margin:'0 0 8px', color:C.text }}>Reject "{modal.eventName}"</h3>
            <p style={{ margin:'0 0 16px', fontSize:13, color:C.muted }}>Provide a reason for rejection (visible to the club).</p>
            <textarea
              rows={4} value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g. Budget exceeds limit, safety plan incomplete…"
              style={{ width:'100%', padding:12, borderRadius:8, border:`1.5px solid ${C.border}`, fontSize:13, fontFamily:'inherit', resize:'vertical', outline:'none', boxSizing:'border-box' }}
            />
            <div style={{ display:'flex', gap:10, marginTop:16 }}>
              <button onClick={() => setModal(null)} style={{ flex:1, padding:11, background:'#F3F4F6', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontSize:13 }}>Cancel</button>
              <button onClick={() => handleAction(modal.id, 'reject')} style={{ flex:1, padding:11, background:C.red, color:'#fff', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontSize:13 }}>Confirm Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── CALENDAR PAGE ────────────────────────────────────────────────────────────
function CalendarPage() {
  const [current, setCurrent] = useState(new Date(2026, 2, 1))
  const [selected, setSelected] = useState(null)

  const eventDays = {
    5:  [{ name:'TechFest Prep',   status:'approved' }],
    9:  [{ name:'Cultural Night',  status:'pending'  }],
    15: [{ name:'TechFest 2026',   status:'approved' }],
    18: [{ name:'Sports Day Prep', status:'pending'  }],
    22: [{ name:'Spring Cultural', status:'approved' }],
    25: [{ name:'Art Exhibition',  status:'rejected' }],
  }
  const examDays = [3, 4, 11, 26, 27]

  const y = current.getFullYear(), m = current.getMonth()
  const monthName = current.toLocaleString('default', { month:'long' })
  const daysInMonth = new Date(y, m+1, 0).getDate()
  const firstDay = new Date(y, m, 1).getDay()

  const cells = [...Array(firstDay).fill(null), ...Array.from({length:daysInMonth},(_,i)=>i+1)]

  return (
    <div>
      <h1 style={{ fontSize:24, fontWeight:700, color:C.text, margin:'0 0 6px' }}>Calendar</h1>
      <p style={{ color:C.muted, fontSize:13, margin:'0 0 24px' }}>Event schedule overview</p>

      {/* Legend */}
      <div style={{ display:'flex', gap:16, marginBottom:20, flexWrap:'wrap' }}>
        {[['Approved','#22C55E'],['Pending','#F59E0B'],['Rejected','#EF4444'],['Exam Block','#3B82F6']].map(([l,c]) => (
          <div key={l} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:C.muted }}>
            <div style={{ width:10, height:10, borderRadius:2, background:c }} />{l}
          </div>
        ))}
      </div>

      <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.border}`, overflow:'hidden' }}>
        {/* Header */}
        <div style={{
          background:`linear-gradient(135deg, ${C.accent}, ${C.purple})`,
          padding:'18px 24px', display:'flex', justifyContent:'space-between', alignItems:'center',
        }}>
          <button onClick={() => setCurrent(new Date(y, m-1, 1))} style={{ background:'rgba(255,255,255,.2)', border:'none', color:'#fff', borderRadius:7, padding:'6px 14px', cursor:'pointer', fontSize:13, fontWeight:600 }}>← Prev</button>
          <h2 style={{ margin:0, color:'#fff', fontWeight:700, fontSize:18 }}>{monthName} {y}</h2>
          <button onClick={() => setCurrent(new Date(y, m+1, 1))} style={{ background:'rgba(255,255,255,.2)', border:'none', color:'#fff', borderRadius:7, padding:'6px 14px', cursor:'pointer', fontSize:13, fontWeight:600 }}>Next →</button>
        </div>

        <div style={{ padding:20 }}>
          {/* Week headers */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:8, marginBottom:8 }}>
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} style={{ textAlign:'center', fontSize:11, fontWeight:700, color:C.muted, padding:'6px 0', borderBottom:`1px solid ${C.border}` }}>{d}</div>
            ))}
          </div>

          {/* Days */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:8 }}>
            {cells.map((day, i) => {
              if (!day) return <div key={i} />
              const isExam = examDays.includes(day)
              const dayEvs = eventDays[day]
              const isSel = selected === day
              return (
                <div key={i} onClick={() => setSelected(isSel ? null : day)} style={{
                  minHeight:72, border: isSel ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
                  borderRadius:8, padding:'6px 8px',
                  background: isExam ? '#EFF6FF' : '#FAFAFA',
                  cursor:'pointer', transition:'all .2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,.08)'; e.currentTarget.style.background = isExam?'#DBEAFE':'#F0F2F5' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.background = isExam?'#EFF6FF':'#FAFAFA' }}
                >
                  <div style={{ fontWeight:700, fontSize:13, color:C.text, marginBottom:3 }}>{day}</div>
                  {isExam && <div style={{ fontSize:9, background:'#DBEAFE', color:'#1D4ED8', borderRadius:4, padding:'1px 4px', fontWeight:600, marginBottom:2 }}>EXAM</div>}
                  {dayEvs?.slice(0,2).map((ev,ei) => (
                    <div key={ei} style={{
                      fontSize:9, borderRadius:4, padding:'2px 5px', marginBottom:2, fontWeight:600,
                      background: statusColors[ev.status]?.bg, color: statusColors[ev.status]?.text,
                      overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                    }}>{ev.name}</div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {selected && (
        <div style={{
          marginTop:20, background:C.white, borderRadius:12,
          border:`1px solid ${C.border}`, padding:'20px 22px',
          borderLeft:`4px solid ${C.accent}`,
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
            <h3 style={{ margin:0, color:C.text }}>Events on {monthName} {selected}</h3>
            <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted }}>
              <Icon d={icons.x} size={18} />
            </button>
          </div>
          {examDays.includes(selected) && (
            <div style={{ background:'#EFF6FF', border:`1px solid #BFDBFE`, borderRadius:7, padding:'8px 12px', fontSize:12, color:'#1D4ED8', fontWeight:600, marginBottom:10 }}>
              🔵 Exam Block — No events may be scheduled on this date.
            </div>
          )}
          {eventDays[selected] ? eventDays[selected].map((ev, i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 12px', background:'#F8FAFC', borderRadius:8, marginBottom:6 }}>
              <span style={{ fontWeight:600, fontSize:13, color:C.text }}>{ev.name}</span>
              <Badge status={ev.status} />
            </div>
          )) : (
            <p style={{ color:C.muted, fontSize:13 }}>No events on this day.</p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── VENUES PAGE ──────────────────────────────────────────────────────────────
function VenuesPage() {
  return (
    <div>
      <h1 style={{ fontSize:24, fontWeight:700, color:C.text, margin:'0 0 6px' }}>Venues</h1>
      <p style={{ color:C.muted, fontSize:13, margin:'0 0 24px' }}>Campus venue availability at a glance</p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:18 }}>
        {MOCK_VENUES.map(v => (
          <div key={v.id} style={{
            background:C.white, borderRadius:14, border:`1px solid ${C.border}`,
            overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,.05)', transition:'all .25s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 20px rgba(0,0,0,.1)' }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,.05)' }}
          >
            <div style={{ padding:'18px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                <div style={{ fontSize:28 }}>{v.icon}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:15, color:C.text }}>{v.name}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{v.type}</div>
                </div>
              </div>
              <Badge status={v.status} />
            </div>
            <div style={{ padding:'14px 20px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, borderBottom:`1px solid ${C.border}` }}>
              <div>
                <div style={{ fontSize:11, color:C.muted, fontWeight:600, textTransform:'uppercase' }}>Capacity</div>
                <div style={{ fontSize:16, fontWeight:700, color:C.text }}>{v.capacity}</div>
              </div>
            </div>
            <div style={{ padding:'12px 20px', background:'#F8FAFC', fontSize:12, color:C.muted }}>
              <span style={{ fontWeight:600, color:C.text }}>Next: </span>{v.nextEvent}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── STATISTICS PAGE ─────────────────────────────────────────────────────────
function StatisticsPage() {
  const barData = [
    { month:'Oct', val:45 }, { month:'Nov', val:70 }, { month:'Dec', val:38 },
    { month:'Jan', val:85 }, { month:'Feb', val:60 }, { month:'Mar', val:95 },
  ]
  const maxVal = Math.max(...barData.map(d => d.val))

  const donut = [
    { label:'Approved', val:50, color:C.green },
    { label:'Pending',  val:30, color:C.yellow },
    { label:'Rejected', val:20, color:C.red },
  ]

  return (
    <div>
      <h1 style={{ fontSize:24, fontWeight:700, color:C.text, margin:'0 0 6px' }}>Statistics</h1>
      <p style={{ color:C.muted, fontSize:13, margin:'0 0 24px' }}>Performance metrics for this semester</p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:16, marginBottom:28 }}>
        <StatCard label="Events This Semester" value="24" icon="📊" color={C.accent} sub="+12% vs last" />
        <StatCard label="Avg Approval Time"     value="3.2d" icon="⏱️" color={C.green} sub="-18% faster" />
        <StatCard label="Venue Utilization"     value="72%" icon="🏢" color={C.yellow} sub="+5% up" />
        <StatCard label="Budget Efficiency"     value="91%" icon="💰" color={C.purple} sub="+3% up" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:18, flexWrap:'wrap' }}>
        {/* Bar chart */}
        <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.border}`, padding:'22px 24px' }}>
          <h3 style={{ margin:'0 0 20px', fontSize:15, fontWeight:700, color:C.text }}>Monthly Event Approvals</h3>
          <div style={{ display:'flex', alignItems:'flex-end', gap:14, height:200 }}>
            {barData.map((d, i) => (
              <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                <div style={{ fontSize:11, fontWeight:600, color:C.accent }}>{d.val}</div>
                <div style={{
                  width:'100%', background:`linear-gradient(180deg,${C.accent},${C.purple})`,
                  borderRadius:'6px 6px 0 0', height: `${(d.val/maxVal)*160}px`,
                  transition:'height .5s ease', cursor:'pointer',
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity='.8'}
                  onMouseLeave={e => e.currentTarget.style.opacity='1'}
                />
                <div style={{ fontSize:11, color:C.muted, fontWeight:600 }}>{d.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Donut-like breakdown */}
        <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.border}`, padding:'22px 24px' }}>
          <h3 style={{ margin:'0 0 20px', fontSize:15, fontWeight:700, color:C.text }}>Approval Breakdown</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {donut.map((d, i) => (
              <div key={i}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:13, color:C.text, fontWeight:500 }}>{d.label}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:d.color }}>{d.val}%</span>
                </div>
                <div style={{ height:8, background:'#F0F2F5', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${d.val}%`, background:d.color, borderRadius:4, transition:'width .6s ease' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop:24, paddingTop:18, borderTop:`1px solid ${C.border}` }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[['Total Budget','₹380K'],['Avg Monthly','₹76K'],['Peak Month','₹120K'],['Growth','+18%']].map(([l,v]) => (
                <div key={l}>
                  <div style={{ fontSize:11, color:C.muted, fontWeight:600, textTransform:'uppercase' }}>{l}</div>
                  <div style={{ fontSize:16, fontWeight:700, color: l==='Growth'?C.green:C.text }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────
function NotificationsPage() {
  const [notifs, setNotifs] = useState(MOCK_NOTIFICATIONS)
  const [filter, setFilter] = useState('all')

  const markAll = () => setNotifs(prev => prev.map(n => ({...n, read:true})))

  const filtered = filter === 'all' ? notifs
    : filter === 'unread' ? notifs.filter(n => !n.read)
    : notifs.filter(n => n.type === filter)

  const typeIcon = { request:'📋', approved:'✅', alert:'⚠️' }

  return (
    <div style={{ maxWidth:700 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
        <h1 style={{ fontSize:24, fontWeight:700, color:C.text, margin:0 }}>Notifications</h1>
        {notifs.some(n => !n.read) && (
          <button onClick={markAll} style={{
            padding:'7px 16px', background:C.accent, color:'#fff', border:'none',
            borderRadius:7, fontWeight:600, fontSize:12, cursor:'pointer',
          }}>Mark all read</button>
        )}
      </div>
      <p style={{ color:C.muted, fontSize:13, margin:'0 0 24px' }}>{notifs.filter(n=>!n.read).length} unread</p>

      {/* Tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:20, borderBottom:`1px solid ${C.border}`, paddingBottom:12 }}>
        {['all','unread','request','approved','alert'].map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding:'5px 14px', border:'none', borderRadius:6, cursor:'pointer', fontSize:12, fontWeight:600,
            background: filter===t ? C.accent : 'transparent',
            color: filter===t ? '#fff' : C.muted,
            transition:'all .2s',
          }}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {filtered.map(n => (
          <div key={n.id}
            onClick={() => setNotifs(prev => prev.map(x => x.id===n.id ? {...x, read:true} : x))}
            style={{
              background: n.read ? C.white : '#EFF6FF',
              borderRadius:12, padding:'16px 18px',
              border: n.read ? `1px solid ${C.border}` : `1px solid ${C.accent}55`,
              display:'flex', gap:14, cursor:'pointer', transition:'all .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,.07)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow='none'}
          >
            <div style={{ fontSize:22, flexShrink:0 }}>{typeIcon[n.type]||'📌'}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight: n.read ? 600 : 700, fontSize:14, color:C.text, marginBottom:3 }}>{n.title}</div>
              <div style={{ fontSize:12, color:C.muted, lineHeight:1.5 }}>{n.message}</div>
              <div style={{ fontSize:11, color:C.muted, marginTop:6 }}>{n.time}</div>
            </div>
            {!n.read && <div style={{ width:8, height:8, borderRadius:'50%', background:C.accent, marginTop:4, flexShrink:0 }} />}
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'40px 0', color:C.muted, fontSize:14 }}>No notifications here</div>
        )}
      </div>
    </div>
  )
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
function SettingsPage({ onLogout }) {
  const [profile, setProfile] = useState({ name:'Dr. Sarah Johnson', email:'faculty@university.edu', dept:'Computer Science', phone:'+91-9876543210' })
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(profile)
  const [notifications, setNotifications] = useState({ email:true, inApp:true, approvals:true, reminders:true })
  const [twoFA, setTwoFA] = useState(false)

  const Toggle = ({ on, toggle, label }) => (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:`1px solid ${C.border}` }}>
      <span style={{ fontSize:13, color:C.text }}>{label}</span>
      <div onClick={toggle} style={{
        width:44, height:24, borderRadius:12, background: on ? C.accent : '#D1D5DB',
        cursor:'pointer', position:'relative', transition:'background .2s',
      }}>
        <div style={{
          width:20, height:20, borderRadius:'50%', background:'#fff',
          position:'absolute', top:2, left: on ? 22 : 2, transition:'left .2s',
          boxShadow:'0 1px 3px rgba(0,0,0,.2)',
        }} />
      </div>
    </div>
  )

  const Card = ({ icon, title, children }) => (
    <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.border}`, padding:'22px 24px', marginBottom:18 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
        <span style={{ fontSize:22 }}>{icon}</span>
        <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:C.text }}>{title}</h3>
      </div>
      {children}
    </div>
  )

  return (
    <div style={{ maxWidth:680 }}>
      <h1 style={{ fontSize:24, fontWeight:700, color:C.text, margin:'0 0 6px' }}>Settings</h1>
      <p style={{ color:C.muted, fontSize:13, margin:'0 0 24px' }}>Manage your account preferences</p>

      <Card icon="👤" title="Profile Settings">
        {editing ? (
          <>
            {[['Name','name'],['Email','email'],['Department','dept'],['Phone','phone']].map(([l,k]) => (
              <div key={k} style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:11, color:C.muted, fontWeight:600, marginBottom:5, textTransform:'uppercase' }}>{l}</label>
                <input value={draft[k]} onChange={e => setDraft({...draft,[k]:e.target.value})} style={{
                  width:'100%', padding:'9px 12px', borderRadius:8, border:`1.5px solid ${C.border}`,
                  fontSize:13, outline:'none', boxSizing:'border-box',
                }} />
              </div>
            ))}
            <div style={{ display:'flex', gap:10, marginTop:4 }}>
              <button onClick={() => { setProfile(draft); setEditing(false) }} style={{ padding:'9px 20px', background:C.accent, color:'#fff', border:'none', borderRadius:8, fontWeight:600, fontSize:13, cursor:'pointer' }}>Save</button>
              <button onClick={() => { setDraft(profile); setEditing(false) }} style={{ padding:'9px 20px', background:'#F3F4F6', border:'none', borderRadius:8, fontWeight:600, fontSize:13, cursor:'pointer' }}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
              {[['Name',profile.name],['Email',profile.email],['Department',profile.dept],['Phone',profile.phone]].map(([l,v]) => (
                <div key={l}>
                  <div style={{ fontSize:11, color:C.muted, fontWeight:600, textTransform:'uppercase', marginBottom:3 }}>{l}</div>
                  <div style={{ fontSize:13, color:C.text, fontWeight:500 }}>{v}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setEditing(true)} style={{ padding:'9px 20px', background:C.accent, color:'#fff', border:'none', borderRadius:8, fontWeight:600, fontSize:13, cursor:'pointer' }}>Edit Profile</button>
          </>
        )}
      </Card>

      <Card icon="🔔" title="Notification Preferences">
        <Toggle on={notifications.email}     toggle={() => setNotifications(p=>({...p,email:!p.email}))}     label="Email Notifications" />
        <Toggle on={notifications.inApp}     toggle={() => setNotifications(p=>({...p,inApp:!p.inApp}))}     label="In-App Notifications" />
        <Toggle on={notifications.approvals} toggle={() => setNotifications(p=>({...p,approvals:!p.approvals}))} label="Approval Request Alerts" />
        <Toggle on={notifications.reminders} toggle={() => setNotifications(p=>({...p,reminders:!p.reminders}))} label="Deadline Reminders" />
      </Card>

      <Card icon="🔐" title="Security">
        <Toggle on={twoFA} toggle={() => setTwoFA(p=>!p)} label="Two-Factor Authentication" />
        <div style={{ marginTop:16, display:'flex', gap:10 }}>
          <button style={{ padding:'9px 18px', background:C.accent, color:'#fff', border:'none', borderRadius:8, fontWeight:600, fontSize:13, cursor:'pointer' }}>Change Password</button>
          <button style={{ padding:'9px 18px', background:'#F3F4F6', border:'none', borderRadius:8, fontWeight:600, fontSize:13, cursor:'pointer', color:C.red }}>Logout All Devices</button>
        </div>
      </Card>

      <button onClick={onLogout} style={{
        width:'100%', padding:14, background:C.red, color:'#fff', border:'none',
        borderRadius:12, fontWeight:700, fontSize:15, cursor:'pointer', marginTop:6,
      }}>Logout</button>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function FacultyDashboard({ user = { email: 'faculty@university.edu' }, onLogout }) {
  const [active, setActive] = useState('events')
  const unread = MOCK_NOTIFICATIONS.filter(n => !n.read).length

  const pages = {
    events:      <EventsPage />,
    requests:    <RequestsPage />,
    calendar:    <CalendarPage />,
    venues:      <VenuesPage />,
    statistics:  <StatisticsPage />,
    notifications:<NotificationsPage />,
    settings:    <SettingsPage onLogout={onLogout} />,
  }

  return (
    <div style={{ display:'flex', height:'100vh', fontFamily:"'Segoe UI', system-ui, sans-serif", background:C.bg, overflow:'hidden' }}>
      <Sidebar active={active} onSelect={setActive} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <Navbar user={user} unreadCount={unread} onNotificationClick={() => setActive('notifications')} />
        <main style={{ flex:1, overflowY:'auto', padding:'28px 32px' }}>
          {pages[active] || <EventsPage />}
        </main>
      </div>
    </div>
  )
}