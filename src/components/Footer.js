import React from 'react';
import { Link } from 'react-router-dom';

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'WhatsApp', href: 'https://wa.me' },
  { label: 'WeChat', href: '#' },
  { label: 'Telegram', href: 'https://t.me' },
  { label: 'Line', href: 'https://line.me' },
  { label: 'KakaoTalk', href: '#' },
];

export default function Footer() {
  return (
    <footer className="public-footer">
      <div className="public-footer-inner">
        <div className="footer-links">
          <Link to="/about">About Us</Link>
          <Link to="/destinations">Destinations</Link>
          <Link to="/trip-styles">Trip Styles</Link>
          <Link to="/services">Services</Link>
          <Link to="/past-events">Past Events</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        <div className="footer-socials">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
            >
              {social.label}
            </a>
          ))}
        </div>

        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} Student Services Consultancy Tours &amp; Travel. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
