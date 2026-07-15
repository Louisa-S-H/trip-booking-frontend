import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get('/destinations')
      .then((res) => setDestinations(res.data))
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Destinations</h1>
        <p>Pick a destination to see what we offer there.</p>
      </div>

      <div className="card-grid">
        {destinations.map((d) => (
          <Link key={d._id} to={`/destinations/${d.slug}`} className="content-card">
            <div
              className="content-card-image"
              style={d.heroImage ? { backgroundImage: `url(${d.heroImage})` } : undefined}
            />
            <div className="content-card-body">
              <h3>{d.name}</h3>
              <p>{d.summary}</p>
            </div>
          </Link>
        ))}
        {destinations.length === 0 && <p>No destinations available yet.</p>}
      </div>
    </div>
  );
}
