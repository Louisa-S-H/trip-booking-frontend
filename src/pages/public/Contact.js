import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';

export default function Contact() {
  const [contactInfo, setContactInfo] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axiosInstance.get('/content/contact_info').then((res) => setContactInfo(res.data)).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await axiosInstance.post('/contact', formData);
      setStatus({ type: 'success', message: 'Thanks! We received your message and will get back to you soon.' });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Contact Us</h1>
      </div>

      <div className="contact-grid">
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: '16px' }}>Send us a message</h2>
          {status && (
            <p style={{ color: status.type === 'success' ? '#0f5132' : '#842029', marginBottom: '16px' }}>
              {status.message}
            </p>
          )}
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input type="text" name="subject" value={formData.subject} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea name="message" rows="5" value={formData.message} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-select" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        <div>
          <div className="contact-info-card">
            <h3>{contactInfo?.title || 'Contact Info'}</h3>
            <p>{contactInfo?.body || 'Loading...'}</p>
          </div>

          <div className="contact-info-card">
            <h3>Hotline</h3>
            <p>Prefer to talk to someone directly? Reach our hotline below.</p>
            <a href="tel:+85212345678" className="hotline-cta">Call Hotline</a>
          </div>
        </div>
      </div>
    </div>
  );
}
