import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import { setAdminSession } from '../lib/adminAuth'

function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(event) {
    event.preventDefault()
    try {
      setLoading(true)
      setError('')
      await apiRequest('/api/admin/waitlist?limit=1', {
        headers: {
          'x-admin-password': password,
        },
      })
      setAdminSession(password)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid admin password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section page-section">
      <div className="container admin-login-page">
        <p className="eyebrow">Admin Login</p>
        <h1 className="page-title">Sign in to dashboard</h1>
        <p className="section-subtitle">Enter your admin password to continue.</p>

        <form className="admin-login-form" onSubmit={handleLogin}>
          <label className="field">
            <span>Admin password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter admin password"
              autoComplete="current-password"
            />
          </label>
          <button className="btn btn-small" type="submit" disabled={!password || loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {error ? <p className="form-error">{error}</p> : null}
      </div>
    </section>
  )
}

export default AdminLoginPage
