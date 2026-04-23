import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import logo from './assets/intu_logo.png'
import './App.css'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <div className="page">
      <header className="site-header">
        <div className="container nav-wrap">
          <NavLink className="brand" to="/" onClick={closeMenu}>
            <img className="brand-logo" src={logo} alt="IntuVision logo" />
            IntuVision
          </NavLink>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            Menu
          </button>
          <nav
            id="main-navigation"
            className={`nav-links ${menuOpen ? 'open' : ''}`}
            aria-label="Main navigation"
          >
            <NavLink to="/services" onClick={closeMenu}>
              Services
            </NavLink>
            <NavLink to="/projects" onClick={closeMenu}>
              Projects
            </NavLink>
            <NavLink to="/about" onClick={closeMenu}>
              About
            </NavLink>
            <NavLink to="/contact" onClick={closeMenu}>
              Contact
            </NavLink>
          </nav>
          <NavLink className="btn btn-small nav-cta" to="/contact" onClick={closeMenu}>
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
          <div className="footer-links">
            <NavLink to="/">Back to home</NavLink>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
