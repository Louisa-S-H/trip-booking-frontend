import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';

export default function DestinationDetail() {
  const { slug } = useParams();
  const [destination, setDestination] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`/destinations/${slug}`)
      .then((res) => setDestination(res.data))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="page-container">
        <p>Destination not found. <Link to="/destinations">Back to Destinations</Link></p>
      </div>
    );
  }

  if (!destination) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{destination.name}</h1>
        <p>{destination.country}</p>
      </div>

      {destination.heroImage && (
        <img
          src={destination.heroImage}
          alt={destination.name}
          style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', borderRadius: '10px', marginBottom: '30px' }}
        />
      )}

      <p style={{ marginBottom: '20px', color: '#666', lineHeight: 1.6 }}>{destination.description}</p>

      {destination.gallery?.length > 0 && (
        <div className="card-grid">
          {destination.gallery.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${destination.name} ${i + 1}`}
              style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' }}
            />
          ))}
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <Link to="/services" className="hotline-cta">Browse Services for this Trip</Link>
      </div>
    </div>
  );
}
