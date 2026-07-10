import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosConfig';
import '../styles/Dashboard.css';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [agents, setAgents] = useState([]);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    category: 'Flight',
    price: '',
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, servicesRes, agentsRes] = await Promise.all([
        axiosInstance.get('/bookings'),
        axiosInstance.get('/services'),
        axiosInstance.get('/users/agents/list'),
      ]);
      setBookings(bookingsRes.data);
      setServices(servicesRes.data);
      setAgents(agentsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async () => {
    if (!newService.name || !newService.category || !newService.price) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const response = await axiosInstance.post('/services', {
        ...newService,
        price: parseFloat(newService.price),
      });
      setServices((prev) => [response.data, ...prev]);
      setNewService({ name: '', description: '', category: 'Flight', price: '' });
      alert('Service created successfully!');
    } catch (err) {
      alert('Error creating service: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAssignAgent = async (bookingId, agentId) => {
    try {
      const response = await axiosInstance.put(`/bookings/${bookingId}/assign-agent`, {
        agentId,
      });
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? response.data : b))
      );
      setSelectedBooking(null);
      alert('Agent assigned successfully!');
    } catch (err) {
      alert('Error assigning agent: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h1>Trip Booking System - Admin Portal</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            className={`tab ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            Manage Services ({services.length})
          </button>
        </div>

        {activeTab === 'bookings' ? (
          <div className="admin-bookings">
            <h2>All Bookings</h2>
            <div className="bookings-table">
              <table>
                <thead>
                  <tr>
                    <th>Booking #</th>
                    <th>Student</th>
                    <th>Agent</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.bookingNumber}</td>
                      <td>{booking.student.name}</td>
                      <td>{booking.assignedAgent?.name || 'Unassigned'}</td>
                      <td>${booking.totalPrice}</td>
                      <td>
                        <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>{booking.paymentStatus}</td>
                      <td>{new Date(booking.travelDate).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="btn-view"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedBooking && (
              <div className="admin-detail-panel">
                <h2>Manage Booking</h2>
                <div className="detail-section">
                  <h3>Student & Services</h3>
                  <p><strong>Student:</strong> {selectedBooking.student.name}</p>
                  <p><strong>Email:</strong> {selectedBooking.student.email}</p>
                  <div className="services-list">
                    {selectedBooking.services.map((item) => (
                      <p key={item._id}>{item.service.name} - ${item.price}</p>
                    ))}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Assign Agent</h3>
                  {selectedBooking.assignedAgent ? (
                    <p><strong>Current Agent:</strong> {selectedBooking.assignedAgent.name}</p>
                  ) : (
                    <p>No agent assigned</p>
                  )}
                  <select
                    onChange={(e) =>
                      handleAssignAgent(selectedBooking._id, e.target.value)
                    }
                    defaultValue=""
                  >
                    <option value="">Select an agent...</option>
                    {agents.map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name} - {agent.agentInfo?.specialization || 'General'}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setSelectedBooking(null)}
                  className="btn-cancel"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="admin-services">
            <div className="create-service">
              <h2>Add New Service</h2>
              <div className="form-grid">
                <input
                  type="text"
                  placeholder="Service Name"
                  value={newService.name}
                  onChange={(e) =>
                    setNewService({ ...newService, name: e.target.value })
                  }
                />
                <select
                  value={newService.category}
                  onChange={(e) =>
                    setNewService({ ...newService, category: e.target.value })
                  }
                >
                  <option value="Flight">Flight</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Activities">Activities</option>
                  <option value="Bundles">Bundles</option>
                  <option value="Meet & Greet">Meet & Greet</option>
                  <option value="Visa Application">Visa Application</option>
                </select>
                <input
                  type="number"
                  placeholder="Price"
                  value={newService.price}
                  onChange={(e) =>
                    setNewService({ ...newService, price: e.target.value })
                  }
                />
                <textarea
                  placeholder="Description"
                  value={newService.description}
                  onChange={(e) =>
                    setNewService({ ...newService, description: e.target.value })
                  }
                />
              </div>
              <button onClick={handleCreateService} className="btn-create">
                Create Service
              </button>
            </div>

            <div className="services-list">
              <h2>All Services</h2>
              <div className="services-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service._id}>
                        <td>{service.name}</td>
                        <td>{service.category}</td>
                        <td>${service.price}</td>
                        <td>{service.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
