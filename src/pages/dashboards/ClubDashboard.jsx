import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/Dashboard.css'

// ---------- reusable components ----------
function Sidebar({ selected, onSelect }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'venues', label: 'Venues' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'approvals', label: 'Approvals' },
    { id: 'statistics', label: 'Statistics' },
    { id: 'notifications', label: 'Notifications' }
  ]
  const bottomItem = { id: 'settings', label: 'Settings' }

  const baseStyle = {
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background 0.3s ease',
    margin: '4px 10px'
  }

  return (
    <div style={{
      width: '200px',
      background: '#2c3e50',
      color: '#ecf0f1',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px 0'
    }}>
      <div>
        <h2 style={{ textAlign: 'center', fontSize: '1.2rem' }}>Menu</h2>
        {menuItems.map(item => (
          <div
            key={item.id}
            onClick={() => onSelect(item.id)}
            style={{
              ...baseStyle,
              background: selected === item.id ? '#34495e' : 'transparent'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#34495e'}
            onMouseLeave={e => e.currentTarget.style.background = selected === item.id ? '#34495e' : 'transparent'}
          >
            {item.label}
          </div>
        ))}
      </div>
      <div
        onClick={() => onSelect(bottomItem.id)}
        style={{ ...baseStyle, marginBottom: '10px' }}>
        {bottomItem.label}
      </div>
    </div>
  )
}

function Navbar({ user, onLogout, onSectionChange, hideCreateButton }) {
  const navigate = useNavigate()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [placeholder, setPlaceholder] = useState("What's on your mind?")
  const [phOpacity, setPhOpacity] = useState(1)

  const placeholders = [
    "What's on your mind?",
    "Go back to past event",
    "Wanna know the status of the event?"
  ]

  React.useEffect(() => {
    let idx = 0
    const cycle = () => {
      setPhOpacity(0)
      setTimeout(() => {
        idx = (idx + 1) % placeholders.length
        setPlaceholder(placeholders[idx])
        setPhOpacity(1)
      }, 500)
    }
    const interval = setInterval(cycle, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleLogoutClick = () => {
    onSectionChange('logout')
  }

  const initials = user?.email ? user.email.slice(0,2).toUpperCase() : 'US'

  return (
    <div style={{
      height: '60px',
      background: '#ecf0f1',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      justifyContent: 'space-between',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ position: 'relative', flex: 1, maxWidth: '600px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#666' }}>🔍</span>
        <input
          type="text"
          placeholder={placeholder}
          style={{
            padding: '6px 10px 6px 30px',
            flex: 1,
            borderRadius: '20px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            transition: 'box-shadow 0.3s ease, opacity 0.5s ease',
            opacity: phOpacity
          }}
          onFocus={e => e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)'}
          onBlur={e => e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)'}
        />
        <button
          onClick={() => onSectionChange('create')}
          style={{
            padding: '6px 12px',
            borderRadius: '20px',
            border: 'none',
            background: '#2c3e50',
            color: '#ecf0f1',
            cursor: 'pointer',
            transition: 'background 0.3s ease'
          }}
          onMouseEnter={e => e.target.style.background = '#34495e'}
          onMouseLeave={e => e.target.style.background = '#2c3e50'}
        >➕ Create Event</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => onSectionChange('notifications')}
        >🔔</span>
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowProfileMenu(prev => !prev)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#2c3e50',
              color: '#ecf0f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}
          >{initials}</div>
          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '40px',
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <div
                onClick={() => { onSectionChange('profile'); setShowProfileMenu(false) }}
                style={{ padding: '10px 20px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                View Profile
              </div>
              <div
                onClick={() => { handleLogoutClick(); setShowProfileMenu(false) }}
                style={{ padding: '10px 20px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------- section components ----------
function DashboardSection() {
  const [showAll, setShowAll] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const mockEvents = [
    {
      id: 1,
      name: 'Spring Fest',
      date: '2026-02-15',
      status: 'Approved',
      participants: 250,
      recognition: 'Excellent',
      profit: 5000,
      budgetSpent: 12000,
      bestParticipant: 'John Doe',
      bestContender: 'Jane Smith',
      bestMoments: ['Dance Performance', 'Fashion Show', 'DJ Night']
    },
    {
      id: 2,
      name: 'Tech Talk',
      date: '2026-01-20',
      status: 'Approved',
      participants: 180,
      recognition: 'Good',
      profit: 3000,
      budgetSpent: 8000,
      bestParticipant: 'Alex Kumar',
      bestContender: 'Sarah Johnson',
      bestMoments: ['Keynote Speech', 'Q&A Session', 'Networking']
    },
    {
      id: 3,
      name: 'Art Exhibition',
      date: '2025-12-05',
      status: 'Approved',
      participants: 320,
      recognition: 'Outstanding',
      profit: 7500,
      budgetSpent: 10000,
      bestParticipant: 'Emma Wilson',
      bestContender: 'Michael Chen',
      bestMoments: ['Art Display', 'Live Painting', 'Gallery Walk']
    },
    {
      id: 4,
      name: 'Sports Fest',
      date: '2025-11-10',
      status: 'Approved',
      participants: 400,
      recognition: 'Excellent',
      profit: 6000,
      budgetSpent: 15000,
      bestParticipant: 'David Lee',
      bestContender: 'Lisa Anderson',
      bestMoments: ['Cricket Match', 'Volleyball', 'Relay Race']
    },
    {
      id: 5,
      name: 'Cultural Night',
      date: '2025-10-22',
      status: 'Approved',
      participants: 290,
      recognition: 'Very Good',
      profit: 4500,
      budgetSpent: 9000,
      bestParticipant: 'Priya Sharma',
      bestContender: 'Rohan Patel',
      bestMoments: ['Music Performance', 'Dance Battle', 'Comedy Show']
    },
    {
      id: 6,
      name: 'Film Festival',
      date: '2025-09-18',
      status: 'Rejected',
      participants: 150,
      recognition: 'Good',
      profit: 2000,
      budgetSpent: 7000,
      bestParticipant: 'Olivia Brown',
      bestContender: 'Tom Harris',
      bestMoments: ['Documentary Screening', 'Short Films', 'Awards']
    }
  ]

  const bestEvent = {
    name: 'Art Exhibition',
    participants: 320,
    recognition: 'Outstanding',
    profit: 7500
  }

  const displayedEvents = showAll ? mockEvents : mockEvents.slice(0, 5)

  return (
    <div>
      {/* Best Event Highlight Card */}
      <div style={{
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '30px',
        color: '#ecf0f1',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '1.3rem' }}>🏆 Best Event Conducted So Far</h3>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', margin: '0 0 5px 0', opacity: 0.9 }}>Event Name</p>
            <p style={{ fontSize: '1.1rem', margin: 0, fontWeight: 'bold' }}>{bestEvent.name}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', margin: '0 0 5px 0', opacity: 0.9 }}>Participants</p>
            <p style={{ fontSize: '1.1rem', margin: 0, fontWeight: 'bold' }}>{bestEvent.participants}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', margin: '0 0 5px 0', opacity: 0.9 }}>Recognition</p>
            <p style={{ fontSize: '1.1rem', margin: 0, fontWeight: 'bold' }}>{bestEvent.recognition}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', margin: '0 0 5px 0', opacity: 0.9 }}>Profit Generated</p>
            <p style={{ fontSize: '1.1rem', margin: 0, fontWeight: 'bold' }}>₹{bestEvent.profit}</p>
          </div>
        </div>
      </div>

      {/* Event List Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Previously Conducted Events</h2>
        {!showAll && (
          <button
            onClick={() => setShowAll(true)}
            style={{
              background: '#2c3e50',
              color: '#ecf0f1',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#34495e'}
            onMouseLeave={(e) => e.target.style.background = '#2c3e50'}
          >
            Show All
          </button>
        )}
      </div>

      {/* Event Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {displayedEvents.map((e) => (
          <div
            key={e.id}
            onClick={() => setSelectedEvent(e)}
            style={{
              background: '#fff',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: selectedEvent?.id === e.id ? '2px solid #2c3e50' : '1px solid #eee'
            }}
            onMouseEnter={(el) => {
              el.currentTarget.style.background = '#2c3e50'
              el.currentTarget.style.color = '#ecf0f1'
              el.currentTarget.style.boxShadow = '0 4px 16px rgba(44, 62, 80, 0.3)'
            }}
            onMouseLeave={(el) => {
              el.currentTarget.style.background = selectedEvent?.id === e.id ? '#f9f9f9' : '#fff'
              el.currentTarget.style.color = '#333'
              el.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem' }}>{e.name}</h3>
              <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', opacity: 0.8 }}>📅 {e.date}</p>
            </div>
            <div style={{ marginRight: '24px', textAlign: 'right' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', opacity: 0.8 }}>👥 {e.participants} participants</p>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>Status: {e.status}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setSelectedEvent(null)}>
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '600px',
              width: '90%',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>{selectedEvent.name}</h2>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '6px' }}>
                <p style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: '#666' }}>Total Participants</p>
                <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', color: '#2c3e50' }}>{selectedEvent.participants}</p>
              </div>
              <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '6px' }}>
                <p style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: '#666' }}>Budget Spent</p>
                <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', color: '#2c3e50' }}>₹{selectedEvent.budgetSpent}</p>
              </div>
              <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '6px' }}>
                <p style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: '#666' }}>Best Participant</p>
                <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', color: '#2c3e50' }}>{selectedEvent.bestParticipant}</p>
              </div>
              <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '6px' }}>
                <p style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: '#666' }}>Best Contender</p>
                <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', color: '#2c3e50' }}>{selectedEvent.bestContender}</p>
              </div>
            </div>

            <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '6px', marginBottom: '20px' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 'bold', color: '#666' }}>Best Moments</p>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {selectedEvent.bestMoments.map((moment, idx) => (
                  <li key={idx} style={{ margin: '4px 0', color: '#333' }}>{moment}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setSelectedEvent(null)}
              style={{
                width: '100%',
                padding: '10px',
                background: '#2c3e50',
                color: '#ecf0f1',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#34495e'}
              onMouseLeave={(e) => e.target.style.background = '#2c3e50'}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}



function VenuesSection() {
  const [selectedDate, setSelectedDate] = useState('')
  const venues = [
    { name: 'Hall A', status: 'available' },
    { name: 'Hall B', status: 'booked' },
    { name: 'Conference Room', status: 'waiting' }
  ]
  const statusColor = s => ({ available: 'green', booked: 'red', waiting: 'yellow' }[s])
  return (
    <div>
      <h2>Venues</h2>
      <label>
        Date and time:
        <input type="datetime-local" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ margin: '4px', padding: '4px' }} />
      </label>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {venues.map((v, i) => (
          <li key={i} style={{ margin: '8px 0', display: 'flex', alignItems: 'center' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', background: statusColor(v.status), marginRight: '8px' }}></span>
            {v.name} ({v.status})
          </li>
        ))}
      </ul>
    </div>
  )
}

function CalendarSection() {
  const [date] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)
  const month = date.getMonth()
  const year = date.getFullYear()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const booked = { 5: ['Spring Fest'], 15: ['Tech Talk'] } // mock
  const dayItems = []
  for (let d = 1; d <= daysInMonth; d++) dayItems.push(d)
  return (
    <div>
      <h2>Calendar</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px' }}>
        {dayItems.map(d => (
          <div key={d}
            onClick={() => setSelectedDay(d)}
            style={{
              padding: '8px',
              textAlign: 'center',
              background: booked[d] ? '#ccc' : 'white',
              cursor: 'pointer'
            }}>
            {d}
          </div>
        ))}
      </div>
      {selectedDay && (
        <div style={{ marginTop: '12px' }}>
          <strong>Events on {selectedDay}:</strong>
          <ul>
            {(booked[selectedDay] || []).map((e, i) => <li key={i}>{e}</li>)}
            {!(booked[selectedDay] || []).length && <li>No events</li>}
          </ul>
        </div>
      )}
    </div>
  )
}

function ApprovalsSection({ user }) {
  // mock data for this club
  const clubName = user?.email ? user.email.split('@')[0] : '';
  const approvals = [
    { id: 1, eventName: 'Spring Fest', budget: '₹40,000', submittedDate: 'Mar 1', status: 'Under Review', currentStage: 'faculty', rejectionReason: '' },
    { id: 2, eventName: 'Tech Talk', budget: '₹25,000', submittedDate: 'Feb 20', status: 'Approved', currentStage: 'principal', rejectionReason: '' },
    { id: 3, eventName: 'Art Exhibition', budget: '₹30,000', submittedDate: 'Feb 10', status: 'Rejected', currentStage: 'admin', rejectionReason: 'Insufficient budget details.' }
  ];

  const stageOrder = ['submitted', 'faculty', 'admin', 'principal'];
  const getStageState = (stage, current) => {
    const idx = stageOrder.indexOf(stage);
    const curIdx = stageOrder.indexOf(current);
    if (idx < curIdx) return 'completed';
    if (idx === curIdx) return 'current';
    return 'pending';
  };
  const stageColor = state =>
    state === 'completed' ? '#2ecc71' : state === 'current' ? '#e67e22' : '#bdc3c7';

  if (approvals.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#777' }}>
        No approvals yet.
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2>Approvals{clubName ? ` - ${clubName}` : ''}</h2>
      {approvals.map(app => (
        <div
          key={app.id}
          style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          {/* header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3
              style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#2c3e50'
              }}
            >
              {app.eventName}
            </h3>
            <span style={{ fontWeight: '600', color: '#e67e22' }}>{app.budget}</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#555', margin: '4px 0 12px 0' }}>
            Submitted {app.submittedDate}
          </div>
          {/* workflow progress */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            {stageOrder.map((stage, idx) => {
              const state = getStageState(stage, app.currentStage);
              return (
                <React.Fragment key={stage}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: stageColor(state)
                      }}
                    />
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: '#333',
                        marginTop: '4px',
                        textTransform: 'capitalize'
                      }}
                    >
                      {stage}
                    </div>
                  </div>
                  {idx < stageOrder.length - 1 && (
                    <div style={{ flex: 1, height: '2px', background: '#ddd' }}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          {app.status === 'Rejected' && app.rejectionReason && (
            <div style={{ color: 'red', fontSize: '0.85rem', marginBottom: '8px' }}>
              Reason: {app.rejectionReason}
            </div>
          )}
          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#fff',
                background:
                  app.status === 'Approved'
                    ? '#2ecc71'
                    : app.status === 'Rejected'
                    ? '#e74c3c'
                    : app.status === 'Under Review'
                    ? '#e67e22'
                    : '#bdc3c7'
              }}
            >
              {app.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
function StatisticsSection() {
  return (
    <div>
      <h2>Statistics</h2>
      <p>Total events: 10</p>
      <p>Total approved: 7</p>
      <p>Total rejected: 3</p>
    </div>
  )
}

function NotificationsSection() {
  const notifications = [
    { id: 1, text: 'Event "Spring Fest" approved', type: 'approved' },
    { id: 2, text: 'Event "Tech Talk" rejected', type: 'rejected' },
    { id: 3, text: 'Budget updated for "Art Exhibition"', type: 'update' }
  ]
  return (
    <div>
      <h2>Notifications</h2>
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {notifications.map(n => (
          <li key={n.id} style={{
            padding: '10px',
            borderBottom: '1px solid #eee'
          }}>
            {n.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

function SettingsSection() {
  return <div><h2>Settings</h2><p>Placeholder for settings.</p></div>
}

// create event page shown independently
function CreateEventPage({ onSectionChange, switchToDashboard }) {
  const [showSidebar, setShowSidebar] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    venue: '',
    startDate: '',
    endDate: '',
    timeStart: '',
    timeEnd: '',
    budget: '',
    description: ''
  })
  const [errors, setErrors] = useState({})
  const [conflictMsg, setConflictMsg] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [showSummary, setShowSummary] = useState(false)

  const venues = ['Hall A', 'Hall B', 'Conference Room']
  const booked = [
    { venue: 'Hall A', date: '2026-03-10' },
    { venue: 'Hall B', date: '2026-03-12' }
  ]

  const validate = () => {
    const errs = {}
    if (!formData.name) errs.name = 'Event name required'
    if (!formData.venue) errs.venue = 'Venue required'
    if (!formData.startDate) errs.startDate = 'Start date required'
    if (!formData.endDate) errs.endDate = 'End date required'
    if (formData.startDate === formData.endDate) {
      if (!formData.timeStart) errs.timeStart = 'Start time required'
      if (!formData.timeEnd) errs.timeEnd = 'End time required'
    }
    if (!formData.budget) errs.budget = 'Budget required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const checkConflict = () => {
    const conflict = booked.find(b => b.venue === formData.venue && (b.date === formData.startDate || b.date === formData.endDate))
    if (conflict) {
      setConflictMsg('This venue/date is already booked. Please check the Venues or Calendar section for available dates.')
      return true
    }
    setConflictMsg('')
    return false
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!validate()) return
    if (checkConflict()) return
    setShowConfirm(true)
  }

  const continueSubmit = () => {
    setShowConfirm(false)
    setShowSummary(true)
  }

  const goHome = () => {
    switchToDashboard()
  }

  // form layout helpers
  const floatingInput = (label, name, type='text', extra=null) => {
    return (
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          color: '#2c3e50',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>{label}</label>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder=""
          style={{
            width: '100%',
            padding: '10px 12px',
            border: errors[name] ? '2px solid red' : '1px solid #ccc',
            borderRadius: '4px',
            outline: 'none',
            fontSize: '14px',
            transition: 'border 0.3s',
            boxSizing: 'border-box'
          }}
          onFocus={e => e.target.style.borderColor = '#2c3e50'}
          onBlur={e => e.target.style.borderColor = errors[name] ? 'red' : '#ccc'}
        />
        {errors[name] && <div style={{ color: 'red', fontSize: '12px', marginTop: '6px' }}>{errors[name]}</div>}
      </div>
    )
  }

  if (showSummary) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Review Event Details</h2>
        <ul style={{ lineHeight: '1.6' }}>
          <li><strong>Name:</strong> {formData.name}</li>
          <li><strong>Venue:</strong> {formData.venue}</li>
          <li><strong>Start Date:</strong> {formData.startDate}</li>
          <li><strong>End Date:</strong> {formData.endDate}</li>
          {formData.startDate === formData.endDate && (
            <li><strong>Time:</strong> {formData.timeStart} - {formData.timeEnd}</li>
          )}
          <li><strong>Budget:</strong> {formData.budget}</li>
          <li><strong>Description:</strong> {formData.description}</li>
        </ul>
        <button
          onClick={goHome}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#2c3e50',
            color: '#ecf0f1',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >Go Home</button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {showSidebar && <Sidebar selected="dashboard" onSelect={onSectionChange} />}
      <div style={{ flex: 1 }}>
        <div style={{ padding: '10px 20px', background: '#ecf0f1' }}>
          <h2 style={{ margin: 0 }}>Create Event</h2>
        </div>
        <div style={{ padding: '20px' }}>
          <form onSubmit={handleSubmit}>
            {floatingInput('Event Name', 'name')}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#2c3e50', fontWeight: 'bold', fontSize: '14px' }}>Venue</label>
              <select
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: errors.venue ? '2px solid red' : '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px',
                  transition: 'border 0.3s',
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select venue</option>
                {venues.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              {errors.venue && <div style={{ color: 'red', fontSize: '12px', marginTop: '6px' }}>{errors.venue}</div>}
            </div>
            {floatingInput('Start Date', 'startDate', 'date')}
            {floatingInput('End Date', 'endDate', 'date')}
            {formData.startDate === formData.endDate && (
              <div style={{ display: 'flex', gap: '16px' }}>
                {floatingInput('Start Time', 'timeStart', 'time')}
                {floatingInput('End Time', 'timeEnd', 'time')}
              </div>
            )}
            {floatingInput('Budget Required', 'budget', 'number')}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#2c3e50', fontWeight: 'bold', fontSize: '14px' }}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder=""
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: errors.description ? '2px solid red' : '1px solid #ccc',
                  borderRadius: '4px',
                  outline: 'none',
                  fontSize: '14px',
                  transition: 'border 0.3s',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
                onFocus={e => e.target.style.borderColor = '#2c3e50'}
                onBlur={e => e.target.style.borderColor = errors.description ? 'red' : '#ccc'}
              />
              {errors.description && <div style={{ color: 'red', fontSize: '12px', marginTop: '6px' }}>{errors.description}</div>}
            </div>
            {conflictMsg && <div style={{ color: 'red', marginBottom: '16px', padding: '10px', background: '#ffe6e6', borderRadius: '4px', fontWeight: '500' }}>{conflictMsg}</div>}
            <button
              type="submit"
              style={{
                marginTop: '10px',
                padding: '12px 28px',
                background: '#2c3e50',
                color: '#ecf0f1',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'background 0.3s ease'
              }}
              onMouseEnter={e => e.target.style.background = '#34495e'}
              onMouseLeave={e => e.target.style.background = '#2c3e50'}
            >Submit</button>
          </form>
        </div>
      </div>
      {showConfirm && (
        <div style={{
          position: 'fixed', top:0,left:0,right:0,bottom:0,
          background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center'
        }}>
          <div style={{background:'#fff',padding:'20px',borderRadius:'8px',width:'90%',maxWidth:'400px',textAlign:'center'}}>
            <p>Please review your event details before submitting.</p>
            <div style={{display:'flex',justifyContent:'space-around',marginTop:'20px'}}>
              <button onClick={()=>setShowConfirm(false)} style={{padding:'6px 12px',border:'1px solid #2c3e50',borderRadius:'4px',background:'#fff',cursor:'pointer'}}>Cancel</button>
              <button onClick={continueSubmit} style={{padding:'6px 12px',border:'none',borderRadius:'4px',background:'#2c3e50',color:'#ecf0f1',cursor:'pointer'}}>Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// modal for logout confirmation
function LogoutModal({ onConfirm, onCancel }) {
  const [visible, setVisible] = useState(false)
  React.useEffect(() => {
    // trigger fade-in after mount
    setVisible(true)
  }, [])
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s ease'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '8px',
        padding: '30px',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
      }}>
        <p style={{ marginBottom: '20px', fontSize: '1.1rem' }}>
          Are you sure you want to logout?
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid #2c3e50',
              background: '#fff',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
            onMouseEnter={e => e.target.style.background = '#f0f0f0'}
            onMouseLeave={e => e.target.style.background = '#fff'}
          >Cancel</button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              background: '#2c3e50',
              color: '#ecf0f1',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
            onMouseEnter={e => e.target.style.background = '#34495e'}
            onMouseLeave={e => e.target.style.background = '#2c3e50'}
          >Confirm Logout</button>
        </div>
      </div>
    </div>
  )
}
// ---------- main dashboard component ----------
function ClubDashboard({ user, onLogout }) {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleSectionChange = (section) => {
    if (section === 'logout') {
      setShowLogoutModal(true)
    } else {
      setActiveSection(section)
    }
  }

  const confirmLogout = () => {
    setShowLogoutModal(false)
    onLogout()
    navigate('/')
  }

  const cancelLogout = () => {
    setShowLogoutModal(false)
  }

  let content = null
  switch (activeSection) {
    case 'dashboard': content = <DashboardSection />; break
    case 'create': content = <CreateEventPage onSectionChange={handleSectionChange} switchToDashboard={() => setActiveSection('dashboard')} />; break
    case 'venues': content = <VenuesSection />; break
    case 'calendar': content = <CalendarSection />; break
    case 'approvals': content = <ApprovalsSection user={user} />; break
    case 'statistics': content = <StatisticsSection />; break
    case 'settings': content = <SettingsSection />; break
    case 'notifications': content = <NotificationsSection />; break
    case 'profile': content = <div><h2>Profile</h2><p>Profile details...</p></div>; break
    default: content = <DashboardSection />
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar selected={activeSection} onSelect={handleSectionChange} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeSection !== 'create' && <Navbar user={user} onLogout={onLogout} onSectionChange={handleSectionChange} />}
        <div style={{ flex: 1, overflow: 'auto', padding: activeSection === 'create' ? 0 : '20px' }}>
          {content}
        </div>
      </div>
      {showLogoutModal && <LogoutModal onConfirm={confirmLogout} onCancel={cancelLogout} />}
    </div>
  )
}

export default ClubDashboard
