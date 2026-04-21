import { useMemo, useState } from 'react'

function ContactPage() {
  const [status, setStatus] = useState('idle') // idle | submitting | success
  const [values, setValues] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
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

    const subject = encodeURIComponent('IntuVision enquiry')
    const body = encodeURIComponent(
      [
        `Name: ${values.name}`,
        `Email: ${values.email}`,
        values.company ? `Company: ${values.company}` : null,
        values.phone ? `Phone: ${values.phone}` : null,
        '',
        values.message,
      ]
        .filter(Boolean)
        .join('\n'),
    )

    window.location.href = `mailto:info@intuvision.pro?subject=${subject}&body=${body}`
    setStatus('success')
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
              <span> Phone</span>
              <a href="tel:+61430050480">+61 430 050 480</a>
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
              <h2>Thanks — we’ve got your message.</h2>
              <p>
                If your email client didn’t open, you can send us an email at{' '}
                <a href="mailto:info@intuvision.pro">info@intuvision.pro</a>.
              </p>
              <button
                className="btn btn-small"
                type="button"
                onClick={() => setStatus('idle')}
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

                <label className="field">
                  <span>Phone</span>
                  <input
                    name="phone"
                    value={values.phone}
                    onChange={onChange}
                    placeholder="+61 ..."
                    autoComplete="tel"
                    inputMode="tel"
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
                  This will open your email app to send the message to{' '}
                  <a href="mailto:info@intuvision.pro">info@intuvision.pro</a>.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default ContactPage
