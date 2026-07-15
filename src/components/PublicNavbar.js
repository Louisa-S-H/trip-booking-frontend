import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import logo from '../assets/ssc-logo.png';

const dashboardPathByRole = {
  student: '/student/dashboard',
  agent: '/agent/dashboard',
  admin: '/admin/dashboard',
};

export default function PublicNavbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/about', label: 'About Us' },
    { to: '/destinations', label: 'Destinations' },
    { to: '/trip-styles', label: 'Trip Styles' },
    { to: '/services', label: 'Services' },
    { to: '/past-events', label: 'Past Events' },
    { to: '/contact', label: 'Contact Us' },
  ];

  return (
    <header className="public-navbar">
      <div className="public-navbar-inner">
        <Link to="/" className="public-navbar-logo">
          <img src={logo} alt="Student Services Consultancy" className="public-navbar-logo-img" />
          <span>Student Services Consultancy</span>
        </Link>

        <button
          className="public-navbar-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        <nav className={`public-navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `public-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          <Link to="/cart" className="public-nav-link cart-link" onClick={() => setMenuOpen(false)}>
            Cart{itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>

          {user ? (
            <div className="public-navbar-user">
              <Link to={dashboardPathByRole[user.role] || '/'} className="public-nav-link">
                My Account
              </Link>
              <button onClick={logout} className="btn-nav-logout">Logout</button>
            </div>
          ) : (
            <div className="public-navbar-user">
              <Link to="/login" className="public-nav-link">Login</Link>
              <Link to="/signup" className="btn-nav-signup">Sign Up</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
