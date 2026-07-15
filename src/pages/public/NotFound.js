import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-container" style={{ textAlign: 'center' }}>
      <h1>404</h1>
      <p style={{ marginBottom: '20px' }}>The page you're looking for doesn't exist.</p>
      <Link to="/" className="hotline-cta">Back to Home</Link>
    </div>
  );
}
