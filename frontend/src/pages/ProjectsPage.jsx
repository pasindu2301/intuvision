import { projects } from '../data/content'

function ProjectsPage() {
  return (
    <section className="section page-section">
      <div className="container">
        <p className="eyebrow">Projects</p>
        <h1 className="page-title">Real results from complex environments</h1>
        <p className="section-subtitle">
          We deliver modernisation and automation programs that unlock value
          from legacy environments without unnecessary disruption.
        </p>
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
  )
}

export default ProjectsPage
