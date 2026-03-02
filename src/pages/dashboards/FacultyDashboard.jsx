import { useNavigate } from 'react-router-dom'
import '../../styles/Dashboard.css'

function FacultyDashboard({ user, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Faculty In-charge Dashboard</h1>
        <div className="user-info">
          <span>{user?.email}</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>
      <main className="dashboard-content">
        <h2>Welcome to the Faculty In-charge Dashboard</h2>
        <p>You are logged in as: <strong>{user?.role}</strong></p>
      </main>
    </div>
  )
}

export default FacultyDashboard
