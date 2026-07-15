import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosConfig';

const emptyFormData = (fields) => {
  const data = {};
  fields.forEach((f) => {
    if (f.type === 'checkbox') data[f.name] = f.default ?? true;
    else if (f.type === 'array') data[f.name] = '';
    else data[f.name] = f.default ?? '';
  });
  return data;
};

const toFormData = (item, fields) => {
  const data = {};
  fields.forEach((f) => {
    const value = item[f.name];
    if (f.type === 'array') data[f.name] = Array.isArray(value) ? value.join('\n') : '';
    else if (f.type === 'checkbox') data[f.name] = value ?? true;
    else data[f.name] = value ?? '';
  });
  return data;
};

const toPayload = (formData, fields) => {
  const payload = {};
  fields.forEach((f) => {
    const value = formData[f.name];
    if (f.type === 'array') {
      payload[f.name] = value.split('\n').map((s) => s.trim()).filter(Boolean);
    } else if (f.type === 'number') {
      payload[f.name] = value === '' ? undefined : Number(value);
    } else {
      payload[f.name] = value;
    }
  });
  return payload;
};

// Config-driven CRUD manager for the simple ordered content resources
// (Destinations, TripStyles, PastEvents, Testimonials, TeamMembers) -
// these are all structurally identical list+form screens.
export default function AdminResourceManager({ title, endpoint, fields, primaryField }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyFormData(fields));
  const [showForm, setShowForm] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`${endpoint}/admin`);
      setItems(res.data);
    } catch (err) {
      console.error(`Error fetching ${title}:`, err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, title]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const startCreate = () => {
    setEditingId(null);
    setFormData(emptyFormData(fields));
    setShowForm(true);
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setFormData(toFormData(item, fields));
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    const payload = toPayload(formData, fields);
    try {
      if (editingId) {
        await axiosInstance.put(`${endpoint}/${editingId}`, payload);
      } else {
        await axiosInstance.post(endpoint, payload);
      }
      setShowForm(false);
      setEditingId(null);
      fetchItems();
    } catch (err) {
      alert('Error saving: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;
    try {
      await axiosInstance.delete(`${endpoint}/${id}`);
      fetchItems();
    } catch (err) {
      alert('Error deleting: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-resource-manager">
      <div className="admin-resource-header">
        <h2>{title}</h2>
        {!showForm && (
          <button className="btn-create" onClick={startCreate}>+ Add {title.replace(/s$/, '')}</button>
        )}
      </div>

      {showForm && (
        <div className="create-service">
          <h3>{editingId ? `Edit ${title.replace(/s$/, '')}` : `New ${title.replace(/s$/, '')}`}</h3>
          <div className="form-grid">
            {fields.map((f) => {
              const isFullWidth = f.type === 'textarea' || f.type === 'array';
              return (
                <label key={f.name} className={`admin-field ${isFullWidth ? 'admin-field-full' : ''}`}>
                  <span>{f.label}</span>
                  {isFullWidth ? (
                    <textarea
                      placeholder={f.type === 'array' ? 'One URL per line' : f.label}
                      value={formData[f.name]}
                      onChange={(e) => handleFieldChange(f.name, e.target.value)}
                    />
                  ) : f.type === 'select' ? (
                    <select value={formData[f.name]} onChange={(e) => handleFieldChange(f.name, e.target.value)}>
                      {f.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : f.type === 'checkbox' ? (
                    <input
                      type="checkbox"
                      checked={formData[f.name]}
                      onChange={(e) => handleFieldChange(f.name, e.target.checked)}
                    />
                  ) : (
                    <input
                      type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                      value={formData[f.name]}
                      onChange={(e) => handleFieldChange(f.name, e.target.value)}
                    />
                  )}
                </label>
              );
            })}
          </div>
          <div className="button-group">
            <button className="btn-save" onClick={handleSave}>Save</button>
            <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

      <div className="services-table">
        <table>
          <thead>
            <tr>
              <th>{primaryField.label}</th>
              <th>Active</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item[primaryField.name]}</td>
                <td>{item.isActive ? 'Yes' : 'No'}</td>
                <td>{item.order ?? '-'}</td>
                <td>
                  <button className="btn-view" onClick={() => startEdit(item)}>Edit</button>{' '}
                  <button className="btn-view" onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={4}>No {title.toLowerCase()} yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
