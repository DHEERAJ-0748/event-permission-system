import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/Auth.css'

function Register({ onRegister }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Club'
  })
  const [error, setError] = useState('')

  const roles = ['Club', 'Faculty', 'Principal', 'Admin']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    // Mock registration
    const userData = {
      name: formData.name,
      email: formData.email,
      role: formData.role
    }

    onRegister(userData)

    // Redirect based on role
    const dashboardMap = {
      Club: '/dashboard/club',
      Faculty: '/dashboard/faculty',
      Principal: '/dashboard/principal',
      Admin: '/dashboard/admin'
    }

    navigate(dashboardMap[formData.role])
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Event Permission System</h1>
        <p className="auth-subtitle">Create a new account</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              {roles.map(role => (
                <option key={role} value={role}>
                  {role === 'Faculty' ? 'Faculty In-charge' : role}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="auth-button">
            Register
          </button>
        </form>

        <p className="auth-link">
          Already registered? <Link to="/">Go to Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
