import { Link } from 'react-router-dom'
import { projects, services } from '../data/content'

function HomePage() {
  return (
    <>
      <section className="hero-section" id="home">
        <div className="container hero-grid">
          <div className="hero-copy reveal">
            <p className="eyebrow">Data Strategy and Analytics Experts</p>
            <h1>Transform Systems into Intelligence</h1>
            <p className="lead">
              IntuVision modernises legacy systems and empowers smarter
              decisions through expert analytics, intelligent automation, and
              actionable insights.
            </p>
            <div className="hero-actions">
              <Link className="btn" to="/contact">
                Join Waitlist
              </Link>
              <Link className="btn btn-ghost" to="/services">
                Explore Services
              </Link>
            </div>
          </div>
          <div className="hero-visual reveal" aria-label="Company highlight">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80"
              alt="Team reviewing digital analytics dashboards"
              loading="eager"
            />
            <aside className="highlight-card">
              <h2>Intuitive vision. Real results.</h2>
              <p>
                We help Australian organisations across defence, finance,
                manufacturing, SMEs, and more bridge outdated technology with
                modern capabilities.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="insights">
        <div className="container insights-grid">
          <img
            src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1400&q=80"
            alt="Data insights dashboard on large screen"
            loading="lazy"
          />
          <div>
            <p className="eyebrow">Data Insights</p>
            <h2 className="section-title">From complex data to clear action</h2>
            <p className="section-subtitle">
              At IntuVision, we transform fragmented and legacy data into
              trusted insights that support faster, more confident decisions.
              Through modern analytics and tailored reporting, we help teams
              improve operations and stay ahead of change.
            </p>
            <Link className="btn btn-small" to="/projects">
              View Project Outcomes
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="services-preview">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="cards-grid">
            {services.slice(0, 3).map((service) => (
              <article className="card" key={service.title}>
                <img src={service.image} alt={service.title} loading="lazy" />
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="projects-preview">
        <div className="container">
          <h2 className="section-title">Featured Projects</h2>
          <div className="project-stack">
            {projects.map((project) => (
              <article className="project-card" key={project.title}>
                <img src={project.image} alt={project.title} loading="lazy" />
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="home-contact">
        <div className="container">
          <div className="home-contact">
            <div>
              <p className="eyebrow">Get in touch</p>
              <h2 className="section-title">Let’s talk data, automation, and AI</h2>
              <p className="section-subtitle">
                Reach us directly or use the contact form for enquiries and the
                LegacyX waitlist.
              </p>
              <div className="hero-actions">
                <Link className="btn" to="/contact">
                  Open Contact Form
                </Link>
                <a className="btn btn-ghost" href="mailto:info@intuvision.pro">
                  Email Us
                </a>
              </div>
            </div>
            <div className="contact-card" aria-label="Contact details">
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
        </div>
      </section>
    </>
  )
}

export default HomePage
