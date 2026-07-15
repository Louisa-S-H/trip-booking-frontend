import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';

export default function Home() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    axiosInstance
      .get('/testimonials')
      .then((res) => setTestimonials(res.data.slice(0, 3)))
      .catch(() => setTestimonials([]));
  }, []);

  return (
    <div>
      <section className="hero">
        <h1>Trips Made Simple</h1>
        <p>
          Browse destinations, pick a trip style, and book flights, hotels, and activities
          all in one place.
        </p>
        <div className="hero-actions">
          <Link to="/destinations">Explore Destinations</Link>
          <Link to="/services" className="secondary">Browse Services</Link>
        </div>
      </section>

      <section className="home-section">
        <h2>Popular Trip Styles</h2>
        <div className="card-grid">
          <Link to="/trip-styles" className="content-card">
            <div className="content-card-image" />
            <div className="content-card-body">
              <h3>All Programmes</h3>
              <p>See every trip style we offer, from education travel to custom packages.</p>
            </div>
          </Link>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="home-section">
          <h2>What Students Say</h2>
          <div className="card-grid">
            {testimonials.map((t) => (
              <div key={t._id} className="content-card">
                <div className="content-card-body">
                  <p>&ldquo;{t.quote}&rdquo;</p>
                  <h3 style={{ marginTop: '12px' }}>{t.authorName}</h3>
                  {t.programme && <p>{t.programme}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
