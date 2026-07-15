import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';

export default function TripStyleDetail() {
  const { slug } = useParams();
  const [tripStyle, setTripStyle] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`/trip-styles/${slug}`)
      .then((res) => setTripStyle(res.data))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="page-container">
        <p>Trip style not found. <Link to="/trip-styles">Back to Trip Styles</Link></p>
      </div>
    );
  }

  if (!tripStyle) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{tripStyle.name}</h1>
      </div>

      {tripStyle.heroImage && (
        <img
          src={tripStyle.heroImage}
          alt={tripStyle.name}
          style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', borderRadius: '10px', marginBottom: '30px' }}
        />
      )}

      <p style={{ marginBottom: '20px', color: '#666', lineHeight: 1.6 }}>{tripStyle.description}</p>

      <Link to="/services" className="hotline-cta">Browse Services for this Programme</Link>
    </div>
  );
}
