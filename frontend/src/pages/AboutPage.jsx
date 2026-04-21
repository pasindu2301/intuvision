function AboutPage() {
  return (
    <section className="section page-section">
      <div className="container about-grid">
        <div className="about-box">
          <p className="eyebrow">About</p>
          <h1 className="page-title">Modernising legacy systems with clarity</h1>
          <p>
            IntuVision helps Australian organisations bridge outdated technology
            and modern data capability through practical strategy, expert
            implementation, and measurable outcomes.
          </p>
          <p>
            We work across defence, finance, manufacturing, and SMEs to unify
            siloed data, automate workflows, and enable trusted insights at
            scale.
          </p>
        </div>
        <img
          className="about-image"
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80"
          alt="Consultants discussing digital transformation strategy"
          loading="lazy"
        />
      </div>
    </section>
  )
}

export default AboutPage
