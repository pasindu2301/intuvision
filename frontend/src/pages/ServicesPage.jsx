import { services } from '../data/content'

function ServicesPage() {
  return (
    <section className="section page-section">
      <div className="container">
        <p className="eyebrow">Services</p>
        <h1 className="page-title">Solutions built for measurable outcomes</h1>
        <p className="section-subtitle">
          We combine strategy, automation, and delivery capability to modernise
          systems and improve day-to-day business performance.
        </p>
        <div className="cards-grid">
          {services.map((service) => (
            <article className="card" key={service.title}>
              <img src={service.image} alt={service.title} loading="lazy" />
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesPage
