import { useMemo, useState } from 'react'
import { apiRequest } from '../lib/api'

function ContactPage() {
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [submitError, setSubmitError] = useState('')
  const [values, setValues] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })

  const errors = useMemo(() => {
    const next = {}
    if (!values.name.trim()) next.name = 'Please enter your name.'
    if (!values.email.trim()) next.email = 'Please enter your email.'
    if (values.email.trim() && !/^\S+@\S+\.\S+$/.test(values.email.trim())) {
      next.email = 'Please enter a valid email address.'
    }
    if (!values.message.trim()) next.message = 'Please enter a message.'
    return next
  }, [values.email, values.message, values.name])

  const canSubmit = status !== 'submitting' && Object.keys(errors).length === 0

  function onChange(e) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function onSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('submitting')
    setSubmitError('')

    apiRequest('/api/waitlist', {
      method: 'POST',
      body: JSON.stringify(values),
    })
      .then(() => {
        setStatus('success')
      })
      .catch((err) => {
        setStatus('error')
        setSubmitError(err.message || 'Something went wrong. Please try again.')
      })
  }

  return (
    <section className="section page-section">
      <div className="container contact-grid">
        <div className="contact-info">
          <p className="eyebrow">Contact</p>
          <h1 className="page-title">Let’s build your modern data advantage</h1>
          <p className="section-subtitle">
            Share a little about your goals and we’ll get back to you. You can
            also join the LegacyX waitlist via this form.
          </p>

          <div className="contact-card contact-card-solid">
            <div className="contact-row">
              <span> Email</span>
              <a href="mailto:info@intuvision.pro">info@intuvision.pro</a>
            </div>
            <div className="contact-row">
              <span> Address</span>
              <p>Technology Park, Mawson Lakes SA 5095</p>
            </div>
          </div>
        </div>

        <div className="form-card" aria-label="Contact form">
          {status === 'success' ? (
            <div className="form-success">
              <h2>Thanks - your waitlist entry is saved.</h2>
              <p>
                We will contact you soon about next steps and onboarding.
              </p>
              <button
                className="btn btn-small"
                type="button"
                onClick={() => {
                  setStatus('idle')
                  setValues({
                    name: '',
                    email: '',
                    company: '',
                    message: '',
                  })
                }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <div className="form-grid">
                <label className="field">
                  <span>Name *</span>
                  <input
                    name="name"
                    value={values.name}
                    onChange={onChange}
                    placeholder="Your name"
                    autoComplete="name"
                    required
                  />
                  {errors.name ? <em>{errors.name}</em> : null}
                </label>

                <label className="field">
                  <span>Email *</span>
                  <input
                    name="email"
                    value={values.email}
                    onChange={onChange}
                    placeholder="you@company.com"
                    autoComplete="email"
                    required
                    inputMode="email"
                  />
                  {errors.email ? <em>{errors.email}</em> : null}
                </label>

                <label className="field">
                  <span>Company</span>
                  <input
                    name="company"
                    value={values.company}
                    onChange={onChange}
                    placeholder="Company name"
                    autoComplete="organization"
                  />
                </label>

                <label className="field field-full">
                  <span>Message *</span>
                  <textarea
                    name="message"
                    value={values.message}
                    onChange={onChange}
                    placeholder="Tell us what you want to achieve..."
                    rows={6}
                    required
                  />
                  {errors.message ? <em>{errors.message}</em> : null}
                </label>
              </div>

              <div className="form-actions">
                <button
                  className="btn"
                  type="submit"
                  disabled={!canSubmit}
                  aria-disabled={!canSubmit}
                >
                  {status === 'submitting' ? 'Sending…' : 'Send Message'}
                </button>
                <p className="form-note">
                  This form securely stores your waitlist details for our team.
                </p>
              </div>
              {status === 'error' ? <p className="form-error">{submitError}</p> : null}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default ContactPage
