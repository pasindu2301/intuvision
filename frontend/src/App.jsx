import { NavLink, Outlet } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div className="page">
      <header className="site-header">
        <div className="container nav-wrap">
          <NavLink className="brand" to="/">
            IntuVision
          </NavLink>
          <nav className="nav-links" aria-label="Main navigation">
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>
          <NavLink className="btn btn-small" to="/contact">
            Join Waitlist
          </NavLink>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-wrap">
          <p>© {new Date().getFullYear()} IntuVision. All rights reserved.</p>
          <NavLink to="/">Back to home</NavLink>
        </div>
      </footer>
    </div>
  )
}

export default App
