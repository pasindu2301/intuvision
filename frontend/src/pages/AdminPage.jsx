import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import { clearAdminSession, getAdminPassword } from '../lib/adminAuth'

function toCsv(rows) {
  const header = ['created_at', 'name', 'email', 'company', 'message', 'source']
  const escapeValue = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
  const lines = [
    header.join(','),
    ...rows.map((row) => header.map((key) => escapeValue(row[key])).join(',')),
  ]
  return lines.join('\n')
}

function AdminPage() {
  const [password] = useState(() => getAdminPassword())
  const [rows, setRows] = useState([])
  const [selectedRow, setSelectedRow] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      setError('')
      const payload = await apiRequest('/api/admin/waitlist', {
        headers: {
          'x-admin-password': password,
        },
      })
      setRows(payload.data || [])
    } catch (err) {
      if (err.message === 'Unauthorized') {
        clearAdminSession()
        navigate('/admin', { replace: true })
        return
      }
      setError(err.message || 'Failed to load waitlist data.')
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(entryId, entryEmail) {
    const confirmed = window.confirm('Delete this waitlist entry? This cannot be undone.')
    if (!confirmed) return

    try {
      setDeletingId(entryId)
      setError('')
      const deletePath = entryId
        ? `/api/admin/waitlist/${entryId}`
        : `/api/admin/waitlist/by-email/${encodeURIComponent(entryEmail || '')}`
      await apiRequest(deletePath, {
        method: 'DELETE',
        headers: {
          'x-admin-password': password,
        },
      })
      setRows((prev) =>
        prev.filter((row) => (entryId ? row.id !== entryId : row.email !== entryEmail)),
      )
      setSelectedRow((prev) => {
        if (!prev) return null
        if (entryId && prev.id === entryId) return null
        if (!entryId && prev.email === entryEmail) return null
        return prev
      })
    } catch (err) {
      if (err.message === 'Unauthorized') {
        clearAdminSession()
        navigate('/admin', { replace: true })
        return
      }
      setError(err.message || 'Failed to delete waitlist entry.')
    } finally {
      setDeletingId('')
    }
  }

  function handleLogout() {
    clearAdminSession()
    navigate('/admin', { replace: true })
  }

  function downloadCsv() {
    const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'waitlist_customers.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <section className="section page-section">
      <div className="container admin-page">
        <p className="eyebrow">Admin</p>
        <h1 className="page-title">Waitlist Dashboard</h1>
        <p className="section-subtitle">
          View, export, and manage all customer waitlist entries.
        </p>

        <div className="admin-controls">
          <button
            className="btn btn-small"
            type="button"
            onClick={loadData}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load waitlist'}
          </button>
          <button
            className="btn btn-small btn-ghost"
            type="button"
            onClick={downloadCsv}
            disabled={rows.length === 0}
          >
            Export CSV
          </button>
          <button className="btn btn-small btn-ghost" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {error ? <p className="form-error">{error}</p> : null}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Source</th>
                <th>Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((entry) => (
                <tr key={entry.id}>
                  <td>{new Date(entry.created_at).toLocaleString()}</td>
                  <td>{entry.name}</td>
                  <td>{entry.email}</td>
                  <td>{entry.company || '-'}</td>
                  <td>{entry.source || '-'}</td>
                  <td>{entry.message}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        className="btn btn-small btn-ghost"
                        type="button"
                        onClick={() => setSelectedRow(entry)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-small btn-ghost"
                        type="button"
                        onClick={() => handleDelete(entry.id, entry.email)}
                        disabled={deletingId === entry.id}
                      >
                        {deletingId === entry.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7}>No waitlist records found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {selectedRow ? (
          <div className="admin-detail-card">
            <div className="admin-detail-header">
              <h2>Entry details</h2>
              <button
                className="btn btn-small btn-ghost"
                type="button"
                onClick={() => setSelectedRow(null)}
              >
                Close
              </button>
            </div>
            <p><strong>Date:</strong> {new Date(selectedRow.created_at).toLocaleString()}</p>
            <p><strong>Name:</strong> {selectedRow.name}</p>
            <p><strong>Email:</strong> {selectedRow.email}</p>
            <p><strong>Company:</strong> {selectedRow.company || '-'}</p>
            <p><strong>Source:</strong> {selectedRow.source || '-'}</p>
            <p><strong>Message:</strong> {selectedRow.message}</p>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default AdminPage
