import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';

export default function PastEvents() {
  const [activeTab, setActiveTab] = useState('Case Study');
  const [events, setEvents] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/testimonials').then((res) => setTestimonials(res.data)).catch(() => setTestimonials([]));
  }, []);

  useEffect(() => {
    if (activeTab === 'Testimonials') return;
    setLoading(true);
    axiosInstance
      .get('/past-events', { params: { type: activeTab } })
      .then((res) => setEvents(res.data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Past Events</h1>
      </div>

      <div className="tabs" style={{ justifyContent: 'center' }}>
        <button className={`tab ${activeTab === 'Case Study' ? 'active' : ''}`} onClick={() => setActiveTab('Case Study')}>
          Case Studies
        </button>
        <button className={`tab ${activeTab === 'Media' ? 'active' : ''}`} onClick={() => setActiveTab('Media')}>
          Media Gallery
        </button>
        <button className={`tab ${activeTab === 'Testimonials' ? 'active' : ''}`} onClick={() => setActiveTab('Testimonials')}>
          Testimonials
        </button>
      </div>

      {activeTab === 'Testimonials' ? (
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
          {testimonials.length === 0 && <p>No testimonials yet.</p>}
        </div>
      ) : loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="card-grid">
          {events.map((event) => (
            <div key={event._id} className="content-card">
              <div
                className="content-card-image"
                style={event.coverImage ? { backgroundImage: `url(${event.coverImage})` } : undefined}
              />
              <div className="content-card-body">
                <h3>{event.title}</h3>
                <p>{event.summary}</p>
              </div>
            </div>
          ))}
          {events.length === 0 && <p>Nothing here yet.</p>}
        </div>
      )}
    </div>
  );
}
