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
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => onSectionChange('notifications')}>
          <span style={{ fontSize: '20px' }}>🔔</span>
          <div style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: '#ef4444',
            color: '#fff',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: '700',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
          }}>
            5
          </div>
        </div>
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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // Mock venue data
  const venues = [
    {
      id: 1,
      name: 'Hall A',
      type: 'Main Auditorium',
      icon: '🎭',
      capacity: 500,
      slotsToday: 2,
      events: {
        '2026-03-09': { status: 'booked', eventName: 'TechFest Finals', date: 'Mar 9' },
        '2026-03-15': { status: 'booked', eventName: 'TechFest', date: 'Mar 15' },
        '2026-03-20': { status: 'pending', eventName: 'Science Symposium', date: 'Mar 20' }
      }
    },
    {
      id: 2,
      name: 'Hall B',
      type: 'Seminar Room',
      icon: '📚',
      capacity: 200,
      slotsToday: 3,
      events: {
        '2026-03-12': { status: 'booked', eventName: 'Workshop', date: 'Mar 12' },
        '2026-03-25': { status: 'pending', eventName: 'Orientation', date: 'Mar 25' }
      }
    },
    {
      id: 3,
      name: 'Conference Room',
      type: 'Meeting Space',
      icon: '💼',
      capacity: 50,
      slotsToday: 4,
      events: {
        '2026-03-10': { status: 'available', eventName: '', date: '' },
        '2026-03-18': { status: 'booked', eventName: 'Board Meeting', date: 'Mar 18' }
      }
    },
    {
      id: 4,
      name: 'Outdoor Grounds',
      type: 'Open Field',
      icon: '🌳',
      capacity: 1000,
      slotsToday: 1,
      events: {
        '2026-03-22': { status: 'pending', eventName: 'Sports Day', date: 'Mar 22' }
      }
    }
  ]

  // Get venue status and next event for selected date
  const getVenueStatus = (venue, dateStr) => {
    const events = venue.events || {}
    if (events[dateStr]) {
      return events[dateStr].status
    }
    // Find next upcoming event
    const upcomingDates = Object.keys(events).filter(d => d >= dateStr)
    if (upcomingDates.length > 0) {
      return events[upcomingDates[0]].status
    }
    return 'available'
  }

  const getNextEvent = (venue, dateStr) => {
    const events = venue.events || {}
    const upcomingDates = Object.keys(events).filter(d => d >= dateStr).sort()
    if (upcomingDates.length > 0) {
      return events[upcomingDates[0]]
    }
    return null
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'booked':
        return { badge: '🔴 Booked', color: '#ef4444', bgColor: '#fee2e2' }
      case 'pending':
        return { badge: '🟡 Pending', color: '#f59e0b', bgColor: '#fef3c7' }
      case 'available':
      default:
        return { badge: '🟢 Available', color: '#10b981', bgColor: '#d1fae5' }
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: 0, color: '#333', fontSize: '28px', fontWeight: '600' }}>Venues</h2>
      </div>

      {/* Date Selector */}
      <div style={{
        marginBottom: '30px',
        padding: '20px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <label style={{ fontWeight: '600', color: '#333', fontSize: '15px', minWidth: '100px' }}>
          📅 Select Date:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '2px solid #e0e0e0',
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'inherit',
            cursor: 'pointer',
            transition: 'border-color 0.3s ease',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
        />
        <span style={{ color: '#666', fontSize: '13px', marginLeft: 'auto' }}>
          Showing availability for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Venues Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {venues.map((venue) => {
          const status = getVenueStatus(venue, selectedDate)
          const nextEvent = getNextEvent(venue, selectedDate)
          const statusInfo = getStatusInfo(status)

          return (
            <div
              key={venue.id}
              style={{
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '1px solid #f0f0f0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Card Header with Icon and Status */}
              <div style={{
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', flex: 1 }}>
                  <span style={{
                    fontSize: '32px',
                    minWidth: '40px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {venue.icon}
                  </span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      margin: '0 0 4px 0',
                      color: '#333',
                      fontSize: '18px',
                      fontWeight: '700'
                    }}>
                      {venue.name}
                    </h3>
                    <p style={{
                      margin: 0,
                      color: '#888',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}>
                      {venue.type}
                    </p>
                  </div>
                </div>
                {/* Status Badge */}
                <div style={{
                  background: statusInfo.bgColor,
                  color: statusInfo.color,
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  marginLeft: '10px'
                }}>
                  {statusInfo.badge}
                </div>
              </div>

              {/* Card Body - Capacity and Slots */}
              <div style={{
                padding: '16px 20px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>👥</span>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#888', fontWeight: '500' }}>Capacity</p>
                    <p style={{ margin: 0, fontSize: '16px', color: '#333', fontWeight: '700' }}>{venue.capacity}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>🕐</span>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#888', fontWeight: '500' }}>Slots Today</p>
                    <p style={{ margin: 0, fontSize: '16px', color: '#333', fontWeight: '700' }}>{venue.slotsToday}</p>
                  </div>
                </div>
              </div>

              {/* Next Event Info */}
              <div style={{
                padding: '16px 20px',
                background: '#f9fafb'
              }}>
                {nextEvent ? (
                  <p style={{
                    margin: 0,
                    fontSize: '13px',
                    color: '#666',
                    fontWeight: '500'
                  }}>
                    <span style={{ fontWeight: '600', color: '#333' }}>Next:</span> {nextEvent.date} - {nextEvent.eventName}
                  </p>
                ) : (
                  <p style={{
                    margin: 0,
                    fontSize: '13px',
                    color: '#10b981',
                    fontWeight: '500'
                  }}>
                    ✓ No upcoming events
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CalendarSection() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 9)) // March 9, 2026
  const [selectedDay, setSelectedDay] = useState(null)

  // Mock event data
  const mockEvents = {
    5: [
      { name: 'Spring Fest', status: 'approved', venue: 'Hall A', club: 'Cultural Club' },
      { name: 'Guest Lecture', status: 'pending', venue: 'Conference Room', club: 'Tech Club' }
    ],
    9: [
      { name: 'Tech Talk', status: 'approved', venue: 'Hall B', club: 'Tech Club' }
    ],
    12: [
      { name: 'Workshop', status: 'draft', venue: 'Hall A', club: 'Coding Club' }
    ],
    15: [
      { name: 'Cultural Fest', status: 'approved', venue: 'Outdoor Grounds', club: 'Cultural Club' }
    ],
    18: [
      { name: 'Sports Meet', status: 'rejected', venue: 'Field', club: 'Sports Club' }
    ],
    22: [
      { name: 'Debate Competition', status: 'pending', venue: 'Hall B', club: 'Debate Club' }
    ]
  }

  // Exam blocked dates
  const examDates = [3, 4, 10, 11, 25, 26, 27]

  const month = currentDate.getMonth()
  const year = currentDate.getFullYear()
  const monthName = currentDate.toLocaleString('default', { month: 'long' })
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()

  // Get status color and legend info
  const getStatusInfo = (status) => {
    const statusMap = {
      approved: { color: '#10b981', bgColor: '#d1fae5', emoji: '🟢' },
      pending: { color: '#f59e0b', bgColor: '#fef3c7', emoji: '🟡' },
      rejected: { color: '#ef4444', bgColor: '#fee2e2', emoji: '🔴' },
      draft: { color: '#8b8b8b', bgColor: '#f3f4f6', emoji: '⚫' }
    }
    return statusMap[status] || statusMap.draft
  }

  // Create day items with proper week layout
  const calendarDays = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null) // Empty cells for days before month starts
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d)
  }

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDay(null)
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDay(null)
  }

  // Legend data
  const legendItems = [
    { emoji: '🟢', label: 'Approved', color: '#10b981' },
    { emoji: '🟡', label: 'Pending', color: '#f59e0b' },
    { emoji: '🔴', label: 'Rejected', color: '#ef4444' },
    { emoji: '⚫', label: 'Draft', color: '#8b8b8b' },
    { emoji: '🔵', label: 'Exam Block', color: '#3b82f6' }
  ]

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  return (
    <div style={{ padding: '30px' }}>
      {/* Legend */}
      <div style={{
        marginBottom: '30px',
        padding: '16px 20px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        {legendItems.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>{item.emoji}</span>
            <span style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar Card */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        {/* Calendar Header */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={handlePrevMonth}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#fff',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '6px',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            ← Prev
          </button>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '700' }}>
              {monthName} {year}
            </h2>
          </div>
          <button
            onClick={handleNextMonth}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#fff',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '6px',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            Next →
          </button>
        </div>

        {/* Calendar Grid */}
        <div style={{ padding: '20px' }}>
          {/* Week Day Headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '10px',
            marginBottom: '10px'
          }}>
            {weekDays.map(day => (
              <div key={day} style={{
                textAlign: 'center',
                fontWeight: '700',
                color: '#667eea',
                fontSize: '12px',
                padding: '10px 0',
                borderBottom: '2px solid #e0e0e0'
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '10px'
          }}>
            {calendarDays.map((day, idx) => {
              const isExamDate = day && examDates.includes(day)
              const dayEvents = day ? mockEvents[day] || [] : []
              const isSelected = day === selectedDay

              return (
                <div
                  key={idx}
                  onClick={() => day && setSelectedDay(isSelected ? null : day)}
                  style={{
                    aspectRatio: '1',
                    border: isSelected ? '2px solid #667eea' : '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '8px',
                    cursor: day ? 'pointer' : 'default',
                    background: isExamDate ? '#fee2e2' : day ? '#fafafa' : '#f5f5f5',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (day) {
                      e.currentTarget.style.background = isExamDate ? '#fecaca' : '#f0f0f0'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isExamDate ? '#fee2e2' : (day ? '#fafafa' : '#f5f5f5')
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {day ? (
                    <>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#333',
                        marginBottom: '4px'
                      }}>
                        {day}
                      </div>
                      {isExamDate && (
                        <div style={{
                          fontSize: '10px',
                          fontWeight: '600',
                          color: '#ef4444',
                          background: 'rgba(239, 68, 68, 0.1)',
                          padding: '2px 4px',
                          borderRadius: '3px',
                          textAlign: 'center',
                          marginBottom: '4px'
                        }}>
                          🔵 Exams
                        </div>
                      )}
                      {dayEvents.length > 0 && (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '3px',
                          flex: 1
                        }}>
                          {dayEvents.slice(0, 2).map((event, eIdx) => {
                            const statusInfo = getStatusInfo(event.status)
                            return (
                              <div
                                key={eIdx}
                                style={{
                                  fontSize: '10px',
                                  fontWeight: '600',
                                  color: statusInfo.color,
                                  background: statusInfo.bgColor,
                                  padding: '2px 6px',
                                  borderRadius: '10px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {event.name}
                              </div>
                            )
                          })}
                          {dayEvents.length > 2 && (
                            <div style={{
                              fontSize: '9px',
                              color: '#888',
                              fontWeight: '500'
                            }}>
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Event Details Panel */}
      {selectedDay && (
        <div style={{
          marginTop: '30px',
          padding: '24px',
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          borderLeft: '4px solid #667eea'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{
              margin: 0,
              color: '#333',
              fontSize: '20px',
              fontWeight: '700'
            }}>
              Events on {monthName} {selectedDay}, {year}
            </h3>
            <button
              onClick={() => setSelectedDay(null)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                opacity: 0.6,
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0.6'}
            >
              ✕
            </button>
          </div>

          {examDates.includes(selectedDay) && (
            <div style={{
              marginBottom: '16px',
              padding: '12px',
              background: '#fee2e2',
              borderRadius: '6px',
              borderLeft: '4px solid #ef4444',
              color: '#dc2626',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              🔵 Exam Block - No events can be scheduled on this date
            </div>
          )}

          {(mockEvents[selectedDay] || []).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mockEvents[selectedDay].map((event, idx) => {
                const statusInfo = getStatusInfo(event.status)
                return (
                  <div
                    key={idx}
                    style={{
                      padding: '16px',
                      background: '#fafafa',
                      borderRadius: '8px',
                      border: `1px solid ${statusInfo.bgColor}`
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px'
                    }}>
                      <h4 style={{
                        margin: 0,
                        color: '#333',
                        fontSize: '16px',
                        fontWeight: '700'
                      }}>
                        {event.name}
                      </h4>
                      <span style={{
                        background: statusInfo.bgColor,
                        color: statusInfo.color,
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {statusInfo.emoji} {event.status}
                      </span>
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      fontSize: '14px',
                      color: '#666'
                    }}>
                      <div>
                        <span style={{ fontWeight: '600', color: '#333' }}>🏢 Venue:</span> {event.venue}
                      </div>
                      <div>
                        <span style={{ fontWeight: '600', color: '#333' }}>🎯 Club:</span> {event.club}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p style={{
              color: '#888',
              fontSize: '14px',
              textAlign: 'center',
              padding: '20px'
            }}>
              No events scheduled for this date
            </p>
          )}
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
  // Mock analytics data
  const metrics = [
    {
      id: 1,
      title: 'Events This Semester',
      value: '24',
      change: '+12%',
      icon: '📊',
      color: '#667eea',
      bgcolor: '#ede9fe'
    },
    {
      id: 2,
      title: 'Avg. Approval Time',
      value: '3.2 days',
      change: '-18%',
      icon: '⏱️',
      color: '#10b981',
      bgcolor: '#d1fae5'
    },
    {
      id: 3,
      title: 'Venue Utilization',
      value: '72%',
      change: '+5%',
      icon: '🏢',
      color: '#f59e0b',
      bgcolor: '#fef3c7'
    },
    {
      id: 4,
      title: 'Budget Efficiency',
      value: '91%',
      change: '+3%',
      icon: '💰',
      color: '#ef4444',
      bgcolor: '#fee2e2'
    }
  ]

  // Monthly budget data
  const budgetData = [
    { month: 'Jan', amount: 35 },
    { month: 'Feb', amount: 85 },
    { month: 'Mar', amount: 120 },
    { month: 'Apr', amount: 95 },
    { month: 'May', amount: 45 }
  ]

  const maxBudget = Math.max(...budgetData.map(d => d.amount))

  return (
    <div style={{ padding: '30px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{
          margin: '0 0 8px 0',
          color: '#333',
          fontSize: '32px',
          fontWeight: '700'
        }}>
          Analytics
        </h1>
        <p style={{
          margin: 0,
          color: '#888',
          fontSize: '16px',
          fontWeight: '400'
        }}>
          Insights and performance metrics
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {metrics.map(metric => (
          <div
            key={metric.id}
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: '1px solid #f0f0f0',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)'
              e.currentTarget.style.transform = 'translateY(-4px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px'
            }}>
              <div
                style={{
                  fontSize: '32px',
                  background: metric.bgcolor,
                  width: '56px',
                  height: '56px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {metric.icon}
              </div>
              <span style={{
                color: metric.change.startsWith('+') ? '#10b981' : '#ef4444',
                fontSize: '14px',
                fontWeight: '700',
                background: metric.change.startsWith('+') ? '#d1fae5' : '#fee2e2',
                padding: '4px 8px',
                borderRadius: '4px'
              }}>
                {metric.change}
              </span>
            </div>
            <h3 style={{
              margin: '0 0 8px 0',
              color: '#888',
              fontSize: '13px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {metric.title}
            </h3>
            <p style={{
              margin: 0,
              color: '#333',
              fontSize: '28px',
              fontWeight: '700'
            }}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      {/* Monthly Budget Spending Chart */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0'
      }}>
        <h2 style={{
          margin: '0 0 24px 0',
          color: '#333',
          fontSize: '20px',
          fontWeight: '700'
        }}>
          Monthly Budget Spending
        </h2>

        {/* Chart */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          height: '300px',
          paddingBottom: '20px',
          borderBottom: '1px solid #f0f0f0',
          marginBottom: '20px',
          gap: '20px'
        }}>
          {budgetData.map((data, idx) => {
            const percentage = (data.amount / maxBudget) * 100
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  flex: 1
                }}
              >
                {/* Tooltip Value */}
                <div
                  style={{
                    opacity: 0,
                    background: '#667eea',
                    color: '#fff',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    transition: 'opacity 0.3s ease',
                    position: 'relative',
                    top: '-8px'
                  }}
                  className="tooltip"
                >
                  ₹{data.amount}K
                </div>

                {/* Bar */}
                <div
                  style={{
                    width: '60px',
                    height: `${percentage * 2}px`,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.8'
                    const tooltipDiv = e.currentTarget.parentElement.querySelector('.tooltip')
                    if (tooltipDiv) tooltipDiv.style.opacity = '1'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1'
                    const tooltipDiv = e.currentTarget.parentElement.querySelector('.tooltip')
                    if (tooltipDiv) tooltipDiv.style.opacity = '0'
                  }}
                />

                {/* Month Label */}
                <span style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#666'
                }}>
                  {data.month}
                </span>
              </div>
            )
          })}
        </div>

        {/* Chart Legend / Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '20px'
        }}>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#888', fontSize: '12px', fontWeight: '600' }}>Total Budget</p>
            <p style={{ margin: 0, color: '#333', fontSize: '20px', fontWeight: '700' }}>₹380K</p>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#888', fontSize: '12px', fontWeight: '600' }}>Average Monthly</p>
            <p style={{ margin: 0, color: '#333', fontSize: '20px', fontWeight: '700' }}>₹76K</p>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#888', fontSize: '12px', fontWeight: '600' }}>Peak Month</p>
            <p style={{ margin: 0, color: '#333', fontSize: '20px', fontWeight: '700' }}>₹120K</p>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#888', fontSize: '12px', fontWeight: '600' }}>Growth</p>
            <p style={{ margin: 0, color: '#10b981', fontSize: '20px', fontWeight: '700' }}>+18%</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotificationsSection({ notifications, onMarkAsRead, onSectionChange, onResubmitEvent, onReportIssue }) {
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [filterType, setFilterType] = useState('all') // all, approvals, alerts

  // Mock notifications data structure
  const mockNotifications = [
    {
      id: 1,
      type: 'approved',
      title: 'Event Approved',
      message: 'Your event TechFest 2026 has been approved.',
      eventName: 'TechFest 2026',
      venue: 'Hall A',
      date: 'Mar 15, 2026',
      budget: '₹50,000',
      status: 'Approved',
      read: false,
      timestamp: '5 min ago'
    },
    {
      id: 2,
      type: 'rejected',
      title: 'Event Rejected',
      message: 'Your event Hackathon 3.0 has been rejected.',
      eventName: 'Hackathon 3.0',
      rejectedBy: 'Dr. Sharma (Faculty)',
      rejectionReason: 'Budget exceeds approved limit. Please reduce budget by 20% and resubmit.',
      read: false,
      timestamp: '2 hours ago'
    },
    {
      id: 3,
      type: 'pending',
      title: 'Approval Pending',
      message: 'Your event Cultural Night is awaiting approval.',
      eventName: 'Cultural Night',
      venue: 'Outdoor Grounds',
      date: 'Mar 22, 2026',
      budget: '₹35,000',
      stoppedAt: 'Faculty Review',
      contactEmail: 'faculty.chair@college.edu',
      contactPhone: '+91 9876543210',
      read: false,
      timestamp: '1 day ago'
    },
    {
      id: 4,
      type: 'alert',
      title: 'Budget Clarification Required',
      message: '⚠ Budget clarification required for TechFest.',
      alertDetails: 'Please provide itemized breakdown of budget allocation. Admin requires detailed documentation before final approval.',
      read: true,
      timestamp: '3 days ago'
    },
    {
      id: 5,
      type: 'alert',
      title: 'Upload Photos Reminder',
      message: '⚠ Please upload event photos for Spring Fest.',
      alertDetails: 'Event photos are required for record keeping. Please upload before Mar 15, 2026.',
      read: true,
      timestamp: '4 days ago'
    }
  ]

  // Filter notifications
  const filteredNotifications = filterType === 'all' 
    ? mockNotifications 
    : filterType === 'approvals'
    ? mockNotifications.filter(n => ['approved', 'rejected', 'pending'].includes(n.type))
    : mockNotifications.filter(n => n.type === 'alert')

  const unreadCount = mockNotifications.filter(n => !n.read).length

  const getNotificationStyle = (type) => {
    switch(type) {
      case 'approved':
        return { borderColor: '#10b981', backgroundColor: '#d1fae5', icon: '🟢', color: '#10b981' }
      case 'rejected':
        return { borderColor: '#ef4444', backgroundColor: '#fee2e2', icon: '🔴', color: '#ef4444' }
      case 'pending':
        return { borderColor: '#f59e0b', backgroundColor: '#fef3c7', icon: '🟡', color: '#f59e0b' }
      case 'alert':
      default:
        return { borderColor: '#9ca3af', backgroundColor: '#f3f4f6', icon: '⚠️', color: '#666' }
    }
  }

  const handleMarkAllAsRead = () => {
    mockNotifications.forEach(n => n.read = true)
  }

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header with Filter Tabs */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#333', fontSize: '28px', fontWeight: '700' }}>Notifications</h2>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              style={{
                background: '#667eea',
                color: '#fff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#5568d3'}
              onMouseLeave={(e) => e.target.style.background = '#667eea'}
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e0e0e0', paddingBottom: '12px' }}>
          {[
            { type: 'all', label: 'All' },
            { type: 'approvals', label: 'Approvals' },
            { type: 'alerts', label: 'Alerts' }
          ].map(tab => (
            <button
              key={tab.type}
              onClick={() => {
                setFilterType(tab.type)
                setSelectedNotification(null)
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '600',
                color: filterType === tab.type ? '#667eea' : '#888',
                cursor: 'pointer',
                borderBottom: filterType === tab.type ? '3px solid #667eea' : 'none',
                transition: 'all 0.3s ease',
                marginBottom: '-14px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredNotifications.length === 0 ? (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: '#888',
            fontSize: '16px',
            background: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #e0e0e0'
          }}>
            No notifications found
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const style = getNotificationStyle(notif.type)
            return (
              <div
                key={notif.id}
                onClick={() => setSelectedNotification(notif)}
                style={{
                  padding: '20px',
                  borderLeft: `5px solid ${style.borderColor}`,
                  background: notif.read ? '#fff' : '#f9fafb',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: notif.read ? '1px solid #f0f0f0' : `5px solid ${style.borderColor}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* Status Indicator */}
                <div style={{ flexShrink: 0, fontSize: '24px' }}>
                  {style.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    margin: '0 0 6px 0',
                    color: '#333',
                    fontSize: '16px',
                    fontWeight: notif.read ? '600' : '700'
                  }}>
                    {notif.title}
                  </h3>
                  <p style={{
                    margin: '0 0 8px 0',
                    color: '#666',
                    fontSize: '14px',
                    fontWeight: notif.read ? '400' : '500',
                    lineHeight: '1.4'
                  }}>
                    {notif.message}
                  </p>
                  <span style={{
                    fontSize: '12px',
                    color: '#999',
                    fontWeight: '500'
                  }}>
                    {notif.timestamp}
                  </span>
                </div>

                {/* Unread Indicator */}
                {!notif.read && (
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#667eea',
                    flexShrink: 0,
                    marginTop: '6px'
                  }} />
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Modal Overlay */}
      {selectedNotification && (
        <div
          onClick={() => setSelectedNotification(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          {/* Modal */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              width: '100%',
              maxWidth: '500px',
              padding: '32px',
              position: 'relative',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedNotification(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                opacity: 0.6,
                transition: 'opacity 0.3s ease',
                padding: '8px'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0.6'}
            >
              ✕
            </button>

            {/* Approved Notification */}
            {selectedNotification.type === 'approved' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '32px' }}>🟢</span>
                  <h2 style={{ margin: 0, color: '#333', fontSize: '22px', fontWeight: '700' }}>
                    {selectedNotification.title}
                  </h2>
                </div>

                <div style={{ background: '#d1fae5', padding: '16px', borderRadius: '8px', marginBottom: '24px', color: '#065f46', fontSize: '14px', fontWeight: '600', borderLeft: '4px solid #10b981' }}>
                  {selectedNotification.message}
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ margin: '0 0 16px 0', color: '#333', fontSize: '16px', fontWeight: '700' }}>Event Details</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <p style={{ margin: '0 0 6px 0', color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>📅 Date</p>
                      <p style={{ margin: 0, color: '#333', fontSize: '15px', fontWeight: '700' }}>{selectedNotification.date}</p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 6px 0', color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>🏢 Venue</p>
                      <p style={{ margin: 0, color: '#333', fontSize: '15px', fontWeight: '700' }}>{selectedNotification.venue}</p>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <p style={{ margin: '0 0 6px 0', color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>💰 Budget</p>
                  <p style={{ margin: 0, color: '#333', fontSize: '15px', fontWeight: '700' }}>{selectedNotification.budget}</p>
                </div>

                <div style={{ padding: '16px', background: '#f0f9ff', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                  <p style={{ margin: 0, color: '#0369a1', fontSize: '14px', fontWeight: '700' }}>✓ Status: {selectedNotification.status}</p>
                </div>
              </div>
            )}

            {/* Rejected Notification */}
            {selectedNotification.type === 'rejected' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '32px' }}>🔴</span>
                  <h2 style={{ margin: 0, color: '#333', fontSize: '22px', fontWeight: '700' }}>
                    {selectedNotification.title}
                  </h2>
                </div>

                <div style={{ background: '#fee2e2', padding: '16px', borderRadius: '8px', marginBottom: '24px', color: '#991b1b', fontSize: '14px', fontWeight: '600', borderLeft: '4px solid #ef4444' }}>
                  {selectedNotification.message}
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Event</p>
                  <p style={{ margin: 0, color: '#333', fontSize: '16px', fontWeight: '700' }}>
                    {selectedNotification.eventName}
                  </p>
                </div>

                <div style={{ padding: '16px', background: '#fef2f2', borderRadius: '8px', marginBottom: '24px', borderLeft: '4px solid #fecaca' }}>
                  <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Rejected by</p>
                  <p style={{ margin: '0 0 16px 0', color: '#333', fontSize: '15px', fontWeight: '700' }}>{selectedNotification.rejectedBy}</p>
                  
                  <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Reason for Rejection</p>
                  <p style={{ margin: 0, color: '#dc2626', fontSize: '14px', fontWeight: '700', lineHeight: '1.5' }}>
                    {selectedNotification.rejectionReason}
                  </p>
                </div>

                <button 
                onClick={() => {
                  if (onResubmitEvent) {
                    onResubmitEvent('')
                    setSelectedNotification(null)
                  }
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#667eea',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#5568d3'}
                onMouseLeave={(e) => e.target.style.background = '#667eea'}
                >
                  Resubmit Event
                </button>
              </div>
            )}

            {/* Pending Notification */}
            {selectedNotification.type === 'pending' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '32px' }}>🟡</span>
                  <h2 style={{ margin: 0, color: '#333', fontSize: '22px', fontWeight: '700' }}>
                    {selectedNotification.title}
                  </h2>
                </div>

                <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '8px', marginBottom: '24px', color: '#92400e', fontSize: '14px', fontWeight: '600', borderLeft: '4px solid #f59e0b' }}>
                  {selectedNotification.message}
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Event</p>
                  <p style={{ margin: '0 0 16px 0', color: '#333', fontSize: '16px', fontWeight: '700' }}>{selectedNotification.eventName}</p>

                  <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Approval Stopped at</p>
                  <p style={{ margin: 0, color: '#f59e0b', fontSize: '15px', fontWeight: '700' }}>{selectedNotification.stoppedAt}</p>
                </div>

                <div style={{ padding: '16px', background: '#f5f3ff', borderRadius: '8px', marginBottom: '24px', borderLeft: '4px solid #d8b4fe' }}>
                  <p style={{ margin: '0 0 16px 0', color: '#333', fontSize: '14px', fontWeight: '700' }}>📞 Contact Details:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <p style={{ margin: '0 0 4px 0', color: '#666', fontSize: '12px', fontWeight: '600' }}>Email</p>
                      <p style={{ margin: 0, color: '#667eea', fontSize: '13px', fontWeight: '600', wordBreak: 'break-all' }}>
                        {selectedNotification.contactEmail}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 4px 0', color: '#666', fontSize: '12px', fontWeight: '600' }}>Phone</p>
                      <p style={{ margin: 0, color: '#333', fontSize: '13px', fontWeight: '600' }}>
                        {selectedNotification.contactPhone}
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                onClick={() => {
                  if (onReportIssue) {
                    onReportIssue(selectedNotification)
                    setSelectedNotification(null)
                  }
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                onMouseLeave={(e) => e.target.style.background = '#ef4444'}
                >
                  Report Issue
                </button>
              </div>
            )}

            {/* Alert Notification */}
            {selectedNotification.type === 'alert' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '32px' }}>⚠️</span>
                  <h2 style={{ margin: 0, color: '#333', fontSize: '22px', fontWeight: '700' }}>
                    {selectedNotification.title}
                  </h2>
                </div>

                <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '8px', marginBottom: '24px', color: '#374151', fontSize: '14px', fontWeight: '600', borderLeft: '4px solid #9ca3af' }}>
                  {selectedNotification.message}
                </div>

                <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', borderLeft: '4px solid #d1d5db' }}>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                    {selectedNotification.alertDetails}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ReportIssueSection({ pendingNotification, onCancel, onSectionChange }) {
  const [selectedRecipient, setSelectedRecipient] = useState('admin')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) {
      alert('Please fill in all fields')
      return
    }
    // Simulate sending the issue
    setShowSuccess(true)
  }

  return (
    <div style={{ padding: '30px', maxWidth: '700px', margin: '0 auto' }}>
      {/* Back Button */}
      <button
        onClick={onCancel}
        style={{
          background: 'none',
          border: 'none',
          color: '#667eea',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '20px',
          padding: '0'
        }}
      >
        ← Back to Notifications
      </button>

      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '28px', fontWeight: '700' }}>
          Report Issue
        </h2>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Regarding: <span style={{ fontWeight: '600' }}>{pendingNotification?.eventName}</span>
        </p>
      </div>

      {/* Form Card */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        padding: '30px'
      }}>
        {/* Send To Field */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            margin: '0 0 8px 0',
            color: '#333',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            Send To
          </label>
          <select
            value={selectedRecipient}
            onChange={(e) => setSelectedRecipient(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'border-color 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          >
            <option value="admin">Admin</option>
            <option value="principal">Principal</option>
          </select>
        </div>

        {/* Subject Field */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            margin: '0 0 8px 0',
            color: '#333',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            Subject
          </label>
          <input
            type="text"
            placeholder="Subject of your issue..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              transition: 'border-color 0.3s ease',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>

        {/* Message Body */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            margin: '0 0 8px 0',
            color: '#333',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            Message
          </label>
          <textarea
            placeholder="Describe the issue regarding your event request..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              transition: 'border-color 0.3s ease',
              outline: 'none',
              resize: 'vertical',
              minHeight: '200px',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleSend}
            style={{
              flex: 1,
              padding: '12px',
              background: '#667eea',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#5568d3'}
            onMouseLeave={(e) => e.target.style.background = '#667eea'}
          >
            Send
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px',
              background: '#f3f4f6',
              color: '#666',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#e0e0e0'
              e.target.style.color = '#333'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#f3f4f6'
              e.target.style.color = '#666'
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div
          onClick={() => {
            setShowSuccess(false)
            onCancel()
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              padding: '40px',
              textAlign: 'center',
              maxWidth: '400px',
              width: '100%'
            }}
          >
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
              color: '#10b981'
            }}>
              ✔
            </div>
            <h2 style={{
              margin: '0 0 12px 0',
              color: '#333',
              fontSize: '20px',
              fontWeight: '700'
            }}>
              Issue Reported Successfully
            </h2>
            <p style={{
              margin: '0 0 24px 0',
              color: '#666',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              Your issue has been submitted to the {selectedRecipient === 'admin' ? 'Admin' : 'Principal'}. We'll review it shortly.
            </p>
            <button
              onClick={() => {
                setShowSuccess(false)
                onCancel()
              }}
              style={{
                padding: '12px 24px',
                background: '#667eea',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#5568d3'}
              onMouseLeave={(e) => e.target.style.background = '#667eea'}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SettingsSection() {
  const navigate = useNavigate();
  
  // Profile Settings
  const [profileData, setProfileData] = useState({
    clubName: 'Tech Innovation Club',
    email: 'techclub@university.edu',
    phone: '+1-234-567-8900',
    facultyInCharge: 'Dr. Sarah Johnson'
  });
  
  // Account Settings
  const [accountSettings, setAccountSettings] = useState({
    twoFactorEnabled: false
  });
  
  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    inAppNotifications: true,
    approvalUpdates: true,
    budgetNotifications: true,
    deadlineReminders: true
  });
  
  // Appearance Settings - Load from localStorage or use defaults
  const [appearanceSettings, setAppearanceSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('appearanceSettings');
      return saved ? JSON.parse(saved) : {
        darkMode: false,
        fontSize: 'medium',
        compactMode: false
      };
    } catch (error) {
      console.error('Error parsing appearance settings:', error);
      return {
        darkMode: false,
        fontSize: 'medium',
        compactMode: false
      };
    }
  });
  
  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    loginAlerts: true,
    recentLogins: [
      { device: 'Chrome on Windows', date: 'Today at 10:30 AM', location: 'University Campus' },
      { device: 'Safari on iPhone', date: 'Yesterday at 3:15 PM', location: 'Off-campus' }
    ]
  });
  
  // Modal states
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showContactAdminModal, setShowContactAdminModal] = useState(false);
  const [showClearDataModal, setShowClearDataModal] = useState(false);

  // Form states
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileForm, setProfileForm] = useState(profileData);

  const toggleNotification = (key) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAppearance = (key) => {
    const updated = { ...appearanceSettings, [key]: !appearanceSettings[key] };
    setAppearanceSettings(updated);
    localStorage.setItem('appearanceSettings', JSON.stringify(updated));
    // Reload to apply theme changes
    window.location.reload();
  };

  const updateFontSize = (size) => {
    const updated = { ...appearanceSettings, fontSize: size };
    setAppearanceSettings(updated);
    localStorage.setItem('appearanceSettings', JSON.stringify(updated));
    window.location.reload();
  };

  const handleSaveProfile = () => {
    setProfileData(profileForm);
    setProfileEditing(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setShowLogoutModal(false);
    navigate('/login');
  };

  const handleLogoutAllDevices = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Reusable Toggle Component
  const ToggleSwitch = ({ checked, onChange, label }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
      <label style={{ fontSize: '14px', color: '#555', fontWeight: '500' }}>{label}</label>
      <button
        onClick={onChange}
        style={{
          width: '50px',
          height: '24px',
          background: checked ? '#667eea' : '#ddd',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.3s ease'
        }}
      >
        <div
          style={{
            width: '20px',
            height: '20px',
            background: '#fff',
            borderRadius: '50%',
            position: 'absolute',
            top: '2px',
            left: checked ? '28px' : '2px',
            transition: 'left 0.3s ease'
          }}
        />
      </button>
    </div>
  );

  // Reusable Card Component
  const SettingsCard = ({ icon, title, children }) => (
    <div
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        marginBottom: '20px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <span style={{ fontSize: '28px' }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#2c3e50' }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px', color: '#2c3e50', fontSize: '32px', fontWeight: '700' }}>
        Settings
      </h1>

      {/* 1️⃣ Profile Settings */}
      <SettingsCard icon="👤" title="Profile Settings">
        {!profileEditing ? (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '4px' }}>CLUB NAME</div>
              <div style={{ fontSize: '14px', color: '#333' }}>{profileData.clubName}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '4px' }}>EMAIL ADDRESS</div>
              <div style={{ fontSize: '14px', color: '#333' }}>{profileData.email}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '4px' }}>PHONE NUMBER</div>
              <div style={{ fontSize: '14px', color: '#333' }}>{profileData.phone}</div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '4px' }}>FACULTY IN-CHARGE</div>
              <div style={{ fontSize: '14px', color: '#333' }}>{profileData.facultyInCharge}</div>
            </div>
            <button
              onClick={() => setProfileEditing(true)}
              style={{
                padding: '10px 20px',
                background: '#667eea',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#5568d3'}
              onMouseLeave={(e) => e.target.style.background = '#667eea'}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Club Name"
              value={profileForm.clubName}
              onChange={(e) => setProfileForm({ ...profileForm, clubName: e.target.value })}
              style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <input
              type="text"
              placeholder="Faculty in-charge Name"
              value={profileForm.facultyInCharge}
              onChange={(e) => setProfileForm({ ...profileForm, facultyInCharge: e.target.value })}
              style={{ width: '100%', padding: '10px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleSaveProfile}
                style={{
                  flex: 1,
                  padding: '10px 20px',
                  background: '#667eea',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#5568d3'}
                onMouseLeave={(e) => e.target.style.background = '#667eea'}
              >
                Save Changes
              </button>
              <button
                onClick={() => { setProfileEditing(false); setProfileForm(profileData); }}
                style={{
                  flex: 1,
                  padding: '10px 20px',
                  background: '#e0e0e0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#d0d0d0'}
                onMouseLeave={(e) => e.target.style.background = '#e0e0e0'}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </SettingsCard>

      {/* 2️⃣ Account Settings */}
      <SettingsCard icon="🔐" title="Account Settings">
        <div style={{ marginBottom: '20px' }}>
          <ToggleSwitch
            checked={accountSettings.twoFactorEnabled}
            onChange={() => setAccountSettings(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}
            label="Two-Factor Authentication"
          />
          <div style={{ fontSize: '12px', color: '#999', marginTop: '-8px', marginBottom: '16px' }}>
            {accountSettings.twoFactorEnabled ? '2FA is enabled for your account' : 'Enhance your account security with 2FA'}
          </div>
        </div>
        <button
          onClick={() => setShowPasswordModal(true)}
          style={{
            padding: '10px 20px',
            background: '#667eea',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            marginRight: '8px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = '#5568d3'}
          onMouseLeave={(e) => e.target.style.background = '#667eea'}
        >
          Change Password
        </button>
        <button
          onClick={handleLogoutAllDevices}
          style={{
            padding: '10px 20px',
            background: '#e0e0e0',
            color: '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = '#d0d0d0'}
          onMouseLeave={(e) => e.target.style.background = '#e0e0e0'}
        >
          Logout All Devices
        </button>
      </SettingsCard>

      {/* 3️⃣ Notification Settings */}
      <SettingsCard icon="🔔" title="Notification Preferences">
        <ToggleSwitch
          checked={notificationSettings.emailNotifications}
          onChange={() => toggleNotification('emailNotifications')}
          label="Email Notifications"
        />
        <ToggleSwitch
          checked={notificationSettings.inAppNotifications}
          onChange={() => toggleNotification('inAppNotifications')}
          label="In-App Notifications"
        />
        <ToggleSwitch
          checked={notificationSettings.approvalUpdates}
          onChange={() => toggleNotification('approvalUpdates')}
          label="Event Approval Updates"
        />
        <ToggleSwitch
          checked={notificationSettings.budgetNotifications}
          onChange={() => toggleNotification('budgetNotifications')}
          label="Budget Notifications"
        />
        <ToggleSwitch
          checked={notificationSettings.deadlineReminders}
          onChange={() => toggleNotification('deadlineReminders')}
          label="Deadline Reminders"
        />
      </SettingsCard>

      {/* 4️⃣ Theme & Appearance */}
      <SettingsCard icon="🎨" title="Appearance Settings">
        <ToggleSwitch
          checked={appearanceSettings.darkMode}
          onChange={() => toggleAppearance('darkMode')}
          label="Dark Mode"
        />
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '14px', color: '#555', fontWeight: '500', display: 'block', marginBottom: '8px' }}>Font Size</label>
          <select
            value={appearanceSettings.fontSize}
            onChange={(e) => setAppearanceSettings(prev => ({ ...prev, fontSize: e.target.value }))}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <ToggleSwitch
          checked={appearanceSettings.compactMode}
          onChange={() => toggleAppearance('compactMode')}
          label="Compact Mode"
        />
      </SettingsCard>

      {/* 5️⃣ Security Settings */}
      <SettingsCard icon="🔒" title="Security Settings">
        <button
          onClick={() => setShowPasswordModal(true)}
          style={{
            padding: '10px 20px',
            background: '#667eea',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '20px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = '#5568d3'}
          onMouseLeave={(e) => e.target.style.background = '#667eea'}
        >
          Change Password
        </button>
        <div>
          <ToggleSwitch
            checked={securitySettings.loginAlerts}
            onChange={() => setSecuritySettings(prev => ({ ...prev, loginAlerts: !prev.loginAlerts }))}
            label="Enable Login Alerts"
          />
        </div>
        <h4 style={{ margin: '16px 0 12px 0', color: '#333', fontSize: '14px', fontWeight: '600' }}>Recent Login Activity</h4>
        {securitySettings.recentLogins.map((login, idx) => (
          <div key={idx} style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px', marginBottom: '8px', fontSize: '13px' }}>
            <div style={{ color: '#333', fontWeight: '600' }}>{login.device}</div>
            <div style={{ color: '#999', fontSize: '12px' }}>{login.date} • {login.location}</div>
          </div>
        ))}
      </SettingsCard>

      {/* 8️⃣ Data Management */}
      <SettingsCard icon="💾" title="Data & Storage">
        <div style={{ marginBottom: '20px' }}>
          <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#666' }}>
            Download all your event data or clear sensitive information from this account.
          </p>
          <button
            onClick={() => setShowExportModal(true)}
            style={{
              padding: '10px 20px',
              background: '#667eea',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              marginRight: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#5568d3'}
            onMouseLeave={(e) => e.target.style.background = '#667eea'}
          >
            Export Data
          </button>
          <button
            onClick={() => setShowClearDataModal(true)}
            style={{
              padding: '10px 20px',
              background: '#ff6b6b',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#e85555'}
            onMouseLeave={(e) => e.target.style.background = '#ff6b6b'}
          >
            Clear Data
          </button>
        </div>
      </SettingsCard>

      {/* 9️⃣ Help & Support */}
      <SettingsCard icon="❓" title="Help & Support">
        <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#666' }}>
          Need help? Contact our support team or check the FAQ section for common questions.
        </p>
        <button
          onClick={() => setShowContactModal(true)}
          style={{
            padding: '10px 20px',
            background: '#667eea',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            marginRight: '8px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = '#5568d3'}
          onMouseLeave={(e) => e.target.style.background = '#667eea'}
        >
          Report Issue
        </button>
        <button
          onClick={() => setShowContactAdminModal(true)}
          style={{
            padding: '10px 20px',
            background: '#e0e0e0',
            color: '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = '#d0d0d0'}
          onMouseLeave={(e) => e.target.style.background = '#e0e0e0'}
        >
          Contact Admin
        </button>
      </SettingsCard>

      {/* 🔟 Logout Section */}
      <div style={{ marginTop: '40px' }}>
        <button
          onClick={() => setShowLogoutModal(true)}
          style={{
            width: '100%',
            padding: '14px',
            background: '#ff6b6b',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '700',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = '#e85555'}
          onMouseLeave={(e) => e.target.style.background = '#ff6b6b'}
        >
          Logout
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          style={{
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
          }}
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '20px', fontWeight: '700' }}>
              Logout Confirmation
            </h2>
            <p style={{ margin: '0 0 24px 0', color: '#666', fontSize: '14px' }}>
              Are you sure you want to logout?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#e0e0e0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#d0d0d0'}
                onMouseLeave={(e) => e.target.style.background = '#e0e0e0'}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#ff6b6b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#e85555'}
                onMouseLeave={(e) => e.target.style.background = '#ff6b6b'}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div
          style={{
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
          }}
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 24px 0', color: '#2c3e50', fontSize: '20px', fontWeight: '700' }}>
              Change Password
            </h2>
            <input
              type="password"
              placeholder="Current Password"
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            <input
              type="password"
              placeholder="New Password"
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '24px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowPasswordModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#e0e0e0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#d0d0d0'}
                onMouseLeave={(e) => e.target.style.background = '#e0e0e0'}
              >
                Cancel
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#667eea',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#5568d3'}
                onMouseLeave={(e) => e.target.style.background = '#667eea'}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Data Modal */}
      {showExportModal && (
        <div
          style={{
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
          }}
          onClick={() => setShowExportModal(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>✅</span>
            <h2 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '20px', fontWeight: '700' }}>
              Data Export Started
            </h2>
            <p style={{ margin: '0 0 24px 0', color: '#666', fontSize: '14px' }}>
              Your event data will be downloaded shortly as a CSV file.
            </p>
            <button
              onClick={() => setShowExportModal(false)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#667eea',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#5568d3'}
              onMouseLeave={(e) => e.target.style.background = '#667eea'}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Contact Admin Modal */}
      {showContactAdminModal && (
        <div
          style={{
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
          }}
          onClick={() => setShowContactAdminModal(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '420px',
              width: '90%',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 24px 0', color: '#2c3e50', fontSize: '20px', fontWeight: '700' }}>
              Admin Contact Information
            </h2>
            
            <div style={{ marginBottom: '20px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '4px' }}>ADMIN NAME</div>
                <div style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>Dr. Michael Chen</div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '4px' }}>EMAIL ADDRESS</div>
                <div style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>admin@university.edu</div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '4px' }}>PHONE NUMBER</div>
                <div style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>+1-555-0123</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '4px' }}>OFFICE LOCATION</div>
                <div style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>Administration Building, Room 201</div>
              </div>
            </div>

            <button
              onClick={() => setShowContactAdminModal(false)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#667eea',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#5568d3'}
              onMouseLeave={(e) => e.target.style.background = '#667eea'}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Clear Data Warning Modal */}
      {showClearDataModal && (
        <div
          style={{
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
          }}
          onClick={() => setShowClearDataModal(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>⚠️</span>
            <h2 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '20px', fontWeight: '700' }}>
              Clear Data Warning
            </h2>
            <p style={{ margin: '0 0 24px 0', color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
              This action will clear all saved preferences and notifications. Event records will not be deleted.
            </p>
            <p style={{ margin: '0 0 24px 0', color: '#999', fontSize: '13px' }}>
              Are you sure you want to continue?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowClearDataModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#e0e0e0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#d0d0d0'}
                onMouseLeave={(e) => e.target.style.background = '#e0e0e0'}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('notificationSettings');
                  localStorage.removeItem('appearanceSettings');
                  localStorage.removeItem('privacySettings');
                  setShowClearDataModal(false);
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#ff6b6b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#e85555'}
                onMouseLeave={(e) => e.target.style.background = '#ff6b6b'}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// create event page shown independently
function CreateEventPage({ onSectionChange, switchToDashboard, prefilledEventName }) {
  const [showSidebar, setShowSidebar] = useState(false)
  const [formData, setFormData] = useState({
    name: prefilledEventName || '',
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
  const [prefilledEventName, setPrefilledEventName] = useState('')
  const [reportingNotification, setReportingNotification] = useState(null)

  const handleSectionChange = (section) => {
    if (section === 'logout') {
      setShowLogoutModal(true)
    } else {
      setActiveSection(section)
    }
  }

  const handleResubmitEvent = (eventName) => {
    setPrefilledEventName(eventName)
    setActiveSection('create')
  }

  const handleReportIssue = (notification) => {
    setReportingNotification(notification)
    setActiveSection('report-issue')
  }

  const handleCancelReportIssue = () => {
    setReportingNotification(null)
    setActiveSection('notifications')
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
    case 'create': content = <CreateEventPage onSectionChange={handleSectionChange} switchToDashboard={() => setActiveSection('dashboard')} prefilledEventName={prefilledEventName} />; break
    case 'venues': content = <VenuesSection />; break
    case 'calendar': content = <CalendarSection />; break
    case 'approvals': content = <ApprovalsSection user={user} />; break
    case 'statistics': content = <StatisticsSection />; break
    case 'settings': content = <SettingsSection />; break
    case 'notifications': content = <NotificationsSection onSectionChange={handleSectionChange} onResubmitEvent={handleResubmitEvent} onReportIssue={handleReportIssue} />; break
    case 'report-issue': content = <ReportIssueSection pendingNotification={reportingNotification} onCancel={handleCancelReportIssue} onSectionChange={handleSectionChange} />; break
    case 'profile': content = <div><h2>Profile</h2><p>Profile details...</p></div>; break
    default: content = <DashboardSection />
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar selected={activeSection} onSelect={handleSectionChange} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeSection !== 'create' && activeSection !== 'report-issue' && <Navbar user={user} onLogout={onLogout} onSectionChange={handleSectionChange} />}
        <div style={{ flex: 1, overflow: 'auto', padding: activeSection === 'create' ? 0 : '20px' }}>
          {content}
        </div>
      </div>
      {showLogoutModal && <LogoutModal onConfirm={confirmLogout} onCancel={cancelLogout} />}
    </div>
  )
}

export default ClubDashboard
