import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';

export default function ContactMessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = () => {
    setLoading(true);
    axiosInstance
      .get('/contact')
      .then((res) => setMessages(res.data))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await axiosInstance.put(`/contact/${id}/status`, { status });
      setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, status } : m)));
    } catch (err) {
      alert('Error updating status: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2>Contact Messages ({messages.length})</h2>
      <div className="services-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((m) => (
              <tr key={m._id}>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td>{m.subject}</td>
                <td>{m.message}</td>
                <td>
                  <select value={m.status} onChange={(e) => handleStatusChange(m._id, e.target.value)}>
                    <option value="New">New</option>
                    <option value="Read">Read</option>
                    <option value="Responded">Responded</option>
                  </select>
                </td>
              </tr>
            ))}
            {messages.length === 0 && (
              <tr><td colSpan={5}>No messages yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
