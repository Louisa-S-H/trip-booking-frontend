import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosConfig';
import '../styles/Dashboard.css';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [travelDate, setTravelDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('services');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, bookingsRes] = await Promise.all([
        axiosInstance.get('/services'),
        axiosInstance.get('/bookings/my-bookings'),
      ]);
      setServices(servicesRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedServices((prev) => [...prev, service]);
  };

  const handleServiceRemove = (serviceId) => {
    setSelectedServices((prev) => prev.filter((s) => s._id !== serviceId));
  };

  const calculateTotal = () => {
    return selectedServices.reduce((sum, s) => sum + s.price, 0);
  };

  const handleCreateBooking = async () => {
    if (selectedServices.length === 0 || !travelDate) {
      alert('Please select services and travel date');
      return;
    }

    try {
      const bookingData = {
        services: selectedServices.map((s) => ({
          service: s._id,
          quantity: 1,
          price: s.price,
        })),
        totalPrice: calculateTotal(),
        travelDate,
      };

      const response = await axiosInstance.post('/bookings', bookingData);
      setBookings((prev) => [response.data, ...prev]);
      setSelectedServices([]);
      setTravelDate('');
      setActiveTab('bookings');
      alert('Booking created successfully!');
    } catch (err) {
      alert('Error creating booking: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h1>Trip Booking System - Student Portal</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            Browse Services
          </button>
          <button
            className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings ({bookings.length})
          </button>
        </div>

        {activeTab === 'services' ? (
          <div className="services-section">
            <div className="services-list">
              <h2>Available Services</h2>
              <div className="services-grid">
                {services.map((service) => (
                  <div key={service._id} className="service-card">
                    <h3>{service.name}</h3>
                    <p className="category">{service.category}</p>
                    <p className="description">{service.description}</p>
                    <p className="price">${service.price}</p>
                    <button
                      onClick={() => handleServiceSelect(service)}
                      className="btn-select"
                    >
                      Add to Booking
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="booking-cart">
              <h2>Booking Summary</h2>
              <div className="selected-services">
                {selectedServices.length === 0 ? (
                  <p>No services selected</p>
                ) : (
                  <>
                    {selectedServices.map((service) => (
                      <div key={service._id} className="selected-item">
                        <div>
                          <strong>{service.name}</strong>
                          <p>${service.price}</p>
                        </div>
                        <button
                          onClick={() => handleServiceRemove(service._id)}
                          className="btn-remove"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div className="booking-form">
                <label>Travel Date:</label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                />
              </div>

              <div className="total">
                <strong>Total: ${calculateTotal().toFixed(2)}</strong>
              </div>

              <button
                onClick={handleCreateBooking}
                className="btn-checkout"
                disabled={selectedServices.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        ) : (
          <div className="bookings-section">
            <h2>My Bookings</h2>
            {bookings.length === 0 ? (
              <p>No bookings yet. Start browsing services!</p>
            ) : (
              <div className="bookings-list">
                {bookings.map((booking) => (
                  <div key={booking._id} className="booking-card">
                    <div className="booking-header">
                      <h3>Booking #{booking.bookingNumber}</h3>
                      <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-details">
                      <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                      <p><strong>Travel Date:</strong> {new Date(booking.travelDate).toLocaleDateString()}</p>
                      <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
                      {booking.assignedAgent && (
                        <div className="agent-info">
                          <h4>Assigned Agent</h4>
                          <p><strong>Name:</strong> {booking.assignedAgent.name}</p>
                          <p><strong>Email:</strong> {booking.assignedAgent.email}</p>
                          <p><strong>Phone:</strong> {booking.assignedAgent.phone}</p>
                        </div>
                      )}
                      {booking.notes && (
                        <p><strong>Notes:</strong> {booking.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
