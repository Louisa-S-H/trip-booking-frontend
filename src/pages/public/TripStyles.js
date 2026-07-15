import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';

export default function TripStyles() {
  const [tripStyles, setTripStyles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get('/trip-styles')
      .then((res) => setTripStyles(res.data))
      .catch(() => setTripStyles([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Trip Styles</h1>
        <p>All our programmes, at a glance.</p>
      </div>

      <div className="card-grid">
        {tripStyles.map((t) => (
          <Link key={t._id} to={`/trip-styles/${t.slug}`} className="content-card">
            <div
              className="content-card-image"
              style={t.heroImage ? { backgroundImage: `url(${t.heroImage})` } : undefined}
            />
            <div className="content-card-body">
              <h3>{t.name}</h3>
              <p>{t.summary}</p>
            </div>
          </Link>
        ))}
        {tripStyles.length === 0 && <p>No trip styles available yet.</p>}
      </div>
    </div>
  );
}
