import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';

const CONTENT_BLOCKS = [
  { key: 'company_profile', label: 'Company Profile' },
  { key: 'vision_mission', label: 'Vision & Mission' },
  { key: 'contact_info', label: 'Contact Info' },
];

export default function SiteContentManager() {
  const [blocks, setBlocks] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);

  useEffect(() => {
    Promise.all(
      CONTENT_BLOCKS.map((b) =>
        axiosInstance
          .get(`/content/${b.key}`)
          .then((res) => [b.key, { title: res.data.title || '', body: res.data.body || '' }])
          .catch(() => [b.key, { title: b.label, body: '' }])
      )
    ).then((results) => {
      setBlocks(Object.fromEntries(results));
      setLoading(false);
    });
  }, []);

  const handleChange = (key, field, value) => {
    setBlocks((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const handleSave = async (key) => {
    setSavingKey(key);
    try {
      await axiosInstance.put(`/content/${key}`, blocks[key]);
      alert('Saved!');
    } catch (err) {
      alert('Error saving: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2>Site Content</h2>
      {CONTENT_BLOCKS.map((b) => (
        <div key={b.key} className="create-service" style={{ marginBottom: '20px' }}>
          <h3>{b.label}</h3>
          <div className="form-grid">
            <label className="admin-field admin-field-full">
              <span>Title</span>
              <input
                type="text"
                value={blocks[b.key]?.title || ''}
                onChange={(e) => handleChange(b.key, 'title', e.target.value)}
              />
            </label>
            <label className="admin-field admin-field-full">
              <span>Body</span>
              <textarea
                rows={4}
                value={blocks[b.key]?.body || ''}
                onChange={(e) => handleChange(b.key, 'body', e.target.value)}
              />
            </label>
          </div>
          <button className="btn-save" onClick={() => handleSave(b.key)} disabled={savingKey === b.key}>
            {savingKey === b.key ? 'Saving...' : 'Save'}
          </button>
        </div>
      ))}
    </div>
  );
}
